/** Keep native deployment/smoke traffic within the free public RPC limits. */
export function pacedDevnetFetch(upstream: typeof fetch = fetch): typeof fetch {
  let queue: Promise<unknown> = Promise.resolve();
  let lastStart: number | undefined;
  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  return ((...args: Parameters<typeof fetch>) => {
    const run = queue.then(async () => {
      for (let attempt = 0; ; attempt++) {
        const delay = lastStart === undefined ? 0 : Math.max(0, lastStart + 600 - Date.now());
        if (delay) await wait(delay);
        lastStart = Date.now();
        let response: Response;
        try {
          const callerSignal = args[1]?.signal;
          const signal = callerSignal ? AbortSignal.any([callerSignal, AbortSignal.timeout(30_000)]) : AbortSignal.timeout(30_000);
          response = await upstream(args[0], { ...args[1], signal });
        } catch (error) {
          if (attempt === 2 || args[1]?.signal?.aborted) throw error;
          // Reuse the same serialized RPC body (including any signed transaction).
          await wait(2_000);
          continue;
        }
        if (response.status !== 429 || attempt === 2) return response;
        const retryAfter = response.headers.get("retry-after");
        const seconds = retryAfter === null ? NaN : Number(retryAfter);
        const requestedDelay = Number.isFinite(seconds) ? seconds * 1000 : Date.parse(retryAfter ?? "") - Date.now();
        await response.body?.cancel();
        await wait(Math.max(10_000, Number.isFinite(requestedDelay) ? requestedDelay : 0));
      }
    });
    queue = run.catch(() => undefined);
    return run;
  }) as typeof fetch;
}
