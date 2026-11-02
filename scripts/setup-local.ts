import { Connection, PublicKey } from "@solana/web3.js";
import { writeFile } from "node:fs/promises";
const c = new Connection("http://127.0.0.1:19099");
// Fixed TEST-ONLY address; the same one fixtures/qsafe-v3.json uses.
const program = "k7FaK87WHGVXzkaoHb7CdVPgkKDQhZ29VLDeBVbDfYn";
const genesis = await c.getGenesisHash();
if (
  [
    "5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d",
    "EtWTRABZaYq6iMfeYKouRu166VU2xqa1wcaWoxPkrZBG",
  ].includes(genesis)
)
  throw new Error("Expected an isolated local validator");
if (!(await c.getAccountInfo(new PublicKey(program)))?.executable)
  throw new Error("Local Quantum Safe program missing");
await writeFile(
  ".env.local",
  `QSAFE_ENABLE_TEST_CUSTODY=true\nQSAFE_TEST_NETWORK=localnet\nQSAFE_TEST_RPC_URL=http://127.0.0.1:19099\nQSAFE_TEST_PROGRAM_ID=${program}\nQSAFE_LOCAL_GENESIS=${genesis}\n`,
  { mode: 0o600, flag: "wx" },
);
console.log(
  "Created .env.local for isolated local testing. Restart npm run dev. Remove the file before production.",
);
