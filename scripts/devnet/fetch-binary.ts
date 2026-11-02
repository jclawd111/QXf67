/** Read-only retrieval of the documented upstream executable. No signing. */
import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { Connection, PublicKey } from "@solana/web3.js";
import { MAINNET_GENESIS, MAINNET_PROGRAM_ID } from "../../lib/qsafe-config";
import { checkDeployment, parseProgramData, programDataAddress, trimmed } from "../check-deployment";

const c = new Connection("https://api.mainnet-beta.solana.com", { commitment: "finalized", disableRetryOnRateLimit: true });
if (await c.getGenesisHash() !== MAINNET_GENESIS) throw new Error("Unexpected source network");
const program = new PublicKey(MAINNET_PROGRAM_ID);
const account = await c.getAccountInfo(program);
if (!account?.executable) throw new Error("Upstream executable missing");
const address = programDataAddress(account.owner, account.data);
const data = await c.getAccountInfo(address);
if (!data) throw new Error("Upstream program data missing");
const code = parseProgramData(data.owner, data.data).code;
const hash = createHash("sha256").update(trimmed(code)).digest("hex");
if (hash !== "161e6b4caac746dc35115910c2b4d50fe319b97d5a3a4ec39f9b6350adf14518") throw new Error("Upstream executable hash differs from the pinned reference");
const verification = await checkDeployment(c, program, code);
if (!verification.codeMatches || !verification.immutable) throw new Error("Upstream verification failed");
mkdirSync("target/deploy", { recursive: true });
mkdirSync("docs/evidence", { recursive: true });
writeFileSync("target/deploy/qsafe3.so", code);
writeFileSync("docs/evidence/source-binary-verification.json", JSON.stringify(verification, null, 2) + "\n");
console.log(JSON.stringify({ status: "verified-public-binary", bytes: code.length, sha256: hash, sourceBuild: false }));
