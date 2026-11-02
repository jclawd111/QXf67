/** Two public addresses the site shows. Nothing that holds or moves funds
 * reads them. They are set in the environment, and can be set ahead of time:
 * neither is shown, or sent to a browser, until QSAFE_LAUNCH_LIVE is "true".
 * Until then the site says they are not published. A value that is not a
 * Solana address is treated as absent. */
const ADDRESS = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
const address = (value: string | undefined) => (value && ADDRESS.test(value) ? value : null);

/** Paste the live J7 $QSAFE mint address here at launch for instant global display: */
export const LIVE_TOKEN_CA: string | undefined = "EL12ZQ4DSg6b4iMRppNxrVoDxTXXCS8cZU1dPDBGpump";

export type Launch = {
  /** The Quantum Safe Mode coin's mint address. */
  coinAddress: string | null;
  /** The wallet that bug bounties are paid from. */
  bountyWallet: string | null;
};
export function launchFromEnv(env: Record<string, string | undefined>): Launch {
  const live = env.QSAFE_LAUNCH_LIVE === "true";
  const publicTokenCa = address(env.NEXT_PUBLIC_QSAFE_TOKEN_CA);
  return {
    coinAddress: publicTokenCa ?? (live ? address(env.QSAFE_COIN_ADDRESS) : null),
    bountyWallet: live ? address(env.BOUNTY_WALLET_ADDRESS) : null,
  };
}
export const getLaunch = (): Launch => {
  const fromEnv = launchFromEnv(process.env);
  return {
    ...fromEnv,
    coinAddress: address(LIVE_TOKEN_CA) ?? fromEnv.coinAddress,
  };
};
