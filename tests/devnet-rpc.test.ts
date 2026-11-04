import { afterEach, expect, it, vi } from "vitest";
import { pacedDevnetFetch } from "../scripts/devnet/rpc";

afterEach(() => vi.useRealTimers());

it("paces concurrent RPC requests and honors a rate-limit cooldown", async () => {
  vi.useFakeTimers();
  vi.setSystemTime(0);
  const calls: number[] = [];
  const upstream = vi.fn(async () => {
    calls.push(Date.now());
    return calls.length === 1
      ? new Response("limited", { status: 429, headers: { "Retry-After": "15" } })
      : new Response("ok");
  });
  const request = pacedDevnetFetch(upstream as typeof fetch);
  const result = Promise.all([request("https://api.devnet.solana.com"), request("https://api.devnet.solana.com")]);
  await vi.runAllTimersAsync();
  expect((await result).map(r => r.status)).toEqual([200, 200]);
  expect(calls).toEqual([0, 15000, 15600]);
});

it("bounds rate-limit retries and does not retry other HTTP failures", async () => {
  vi.useFakeTimers();
  const upstream = vi.fn(async () => new Response("limited", { status: 429 }));
  const result = pacedDevnetFetch(upstream as typeof fetch)("https://api.devnet.solana.com");
  await vi.runAllTimersAsync();
  expect((await result).status).toBe(429);
  expect(upstream).toHaveBeenCalledTimes(3);
  const failed = vi.fn(async () => new Response("failed", { status: 500 }));
  expect((await pacedDevnetFetch(failed as typeof fetch)("https://api.devnet.solana.com")).status).toBe(500);
  expect(failed).toHaveBeenCalledTimes(1);
});

it("retries an interrupted request with identical bytes and a bounded timeout", async () => {
  vi.useFakeTimers();
  const upstream = vi.fn()
    .mockRejectedValueOnce(new TypeError("fetch failed"))
    .mockResolvedValueOnce(new Response("ok"));
  const result = pacedDevnetFetch(upstream as typeof fetch)("https://api.devnet.solana.com", { method: "POST", body: "same-signed-transaction" });
  await vi.runAllTimersAsync();
  expect((await result).status).toBe(200);
  expect(upstream).toHaveBeenCalledTimes(2);
  for (const [, init] of upstream.mock.calls) {
    expect(init.body).toBe("same-signed-transaction");
    expect(init.signal).toBeInstanceOf(AbortSignal);
  }
});
