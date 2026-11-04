# Quantum Safe Devnet

An independent **devnet-only development fork** of [VictorChaoss/QuantumSafe](https://github.com/VictorChaoss/QuantumSafe), published under the upstream MIT license. This is not the original operator, its mainnet deployment, or an independently audited custody product.

The source includes the Solana vault program, LM-OTS signing SDK, browser interface, offline recovery tool, CLI, tests and devnet deployment helpers. **Use valueless test assets only.** Missing configuration disables custody; this fork does not default to mainnet.

## Local development

Requires Node.js 22 and npm. Chrome is used for browser tests.

```sh
npm ci --ignore-scripts
npm test
npm run typecheck
npm run source:bundle
npm run build
npm run dev -- --hostname 127.0.0.1
```

Open http://127.0.0.1:5173/vault. The app displays a persistent DEVNET banner. Do not enter real wallet secrets or recovery kits.

## Use the verified devnet deployment

Program: [`2Jx1guanrtHTSFXqPa6wu6gjgJcFcPL577KnkBi5cSqJ`](https://explorer.solana.com/address/2Jx1guanrtHTSFXqPa6wu6gjgJcFcPL577KnkBi5cSqJ?cluster=devnet).

To run the interface against this program without deploying another copy, create a local `.env.local`:

```dotenv
QSAFE_ENABLE_TEST_CUSTODY=true
QSAFE_TEST_NETWORK=devnet
QSAFE_TEST_PROGRAM_ID=2Jx1guanrtHTSFXqPa6wu6gjgJcFcPL577KnkBi5cSqJ
SOLANA_RPC_URL=https://api.devnet.solana.com
```

Restart `npm run dev` after adding these settings. Use a separate wallet set to **Devnet**. This test program remains upgradeable. There is no paid hosting or uptime guarantee; public devnet RPC can throttle requests.

## Independent devnet deployment

```sh
node --import tsx scripts/devnet/fetch-binary.ts
node --import tsx scripts/devnet/deploy.ts
node --import tsx scripts/devnet/smoke.ts
```

`fetch-binary.ts` makes read-only mainnet RPC calls to obtain the documented public executable and verifies its pinned SHA-256. It does not sign or send a mainnet transaction. **Binary reuse is not a reproducible source build.** Rust source is included; building it separately requires a compatible Solana SBF/Rust toolchain.

The deployment helper creates fresh devnet-only signers under ignored `work/devnet/`, prints only the public funding address, and uses free devnet SOL. The public RPC faucet may be closed; request test SOL from https://faucet.solana.com if necessary, then rerun the helper. No paid RPC, server or GPU is required for development. Never commit signer files, key files, passwords or `.env.local`.

Deployment writes `.env.local` only after verifying the devnet executable. Uploads resume under the same saved program and buffer identities. The smoke test checks live creation, deposit, withdrawal, timelock and recovery; successful transaction receipts go to `docs/evidence/` locally. Do not interpret a passing unit suite as proof that a live deployment has passed.

## Validation status

On November 4, 2026, free faucet funding enabled deployment and **18 live custody assertions across 20 confirmed transactions**: creation/deposit, exact withdrawals, destination substitution and spent-key rejection, timelock behavior, recovery/cancellation, and withdrawal with recovered authority. The deployed code hash matches the pinned upstream executable. Public receipts: [deployment](docs/devnet-deployment.json), [live SDK checks](docs/devnet-smoke.json).

The current checkpoint passes unit tests, TypeScript checking, and desktop/mobile network-label and offline-recovery browser tests. Production build and dependency audit passed at the initial checkpoint; four inherited lint warnings remain. No professional audit of this fork, independently reproduced Rust build, or full user-wallet browser transaction cycle is claimed.

The upstream docs are retained for provenance; statements there about the original mainnet deployment or its audit do not apply to this fork. Extension and alert-service rollout are outside this first devnet milestone.

## License and attribution

See [LICENSE](LICENSE) and [THIRD_PARTY.md](THIRD_PARTY.md). Original source: VictorChaoss/QuantumSafe, upstream commit `10e16d89`. Development changes were initially prepared as commit `6df893d`; this public repository starts with a clean snapshot to omit private operator notes and local Git identity/history. Upstream brand assets do not imply endorsement.
