/** Free, resumable devnet deployment. Reads no existing user wallet. */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { Connection, Keypair, SystemProgram, Transaction, TransactionInstruction, sendAndConfirmTransaction } from "@solana/web3.js";
import { LOADER, bufferWrite, deployProgram, requireDevnet, deploymentFundingRequired } from "./loader";
import { checkDeployment, trimmed } from "../check-deployment";
import { pacedDevnetFetch } from "./rpc";

const endpoint = "https://api.devnet.solana.com";
const c = new Connection(endpoint, { commitment: "confirmed", disableRetryOnRateLimit: true, fetch: pacedDevnetFetch() });
requireDevnet(await c.getGenesisHash());
mkdirSync("work/devnet", { recursive: true });
mkdirSync("docs/evidence", { recursive: true });
const signer = (name: string) => {
  const path = `work/devnet/${name}-keypair.json`;
  if (!existsSync(path)) writeFileSync(path, JSON.stringify([...Keypair.generate().secretKey]), { mode: 0o600, flag: "wx" });
  return Keypair.fromSecretKey(Uint8Array.from(JSON.parse(readFileSync(path, "utf8"))));
};
const payer = signer("payer"), program = signer("program"), buffer = signer("buffer");
const binary = readFileSync("target/deploy/qsafe3.so");
const expectedHash = "161e6b4caac746dc35115910c2b4d50fe319b97d5a3a4ec39f9b6350adf14518";
if (createHash("sha256").update(trimmed(binary)).digest("hex") !== expectedHash) throw new Error("Unexpected source binary hash");
if (binary.readUInt32LE(0) !== 0x464c457f) throw new Error("Not an ELF executable");
const reportPath = "docs/evidence/devnet-deployment.json";
const receipt: { endpoint: string; program: string; payer: string; buffer: string; source: string; sourceHash: string; transactions: { label: string; signature: string }[]; status: string; updatedAt: string; verification?: unknown } = existsSync(reportPath)
  ? JSON.parse(readFileSync(reportPath, "utf8"))
  : { endpoint, program: program.publicKey.toBase58(), payer: payer.publicKey.toBase58(), buffer: buffer.publicKey.toBase58(), source: "Read-only copy of documented mainnet executable; not independently compiled", sourceHash: expectedHash, transactions: [], status: "prepared", updatedAt: new Date().toISOString() };
if (receipt.program !== program.publicKey.toBase58() || receipt.payer !== payer.publicKey.toBase58() || receipt.buffer !== buffer.publicKey.toBase58()) throw new Error("Deployment signer identities differ from receipt");
const save = (status: string) => { receipt.status = status; receipt.updatedAt = new Date().toISOString(); writeFileSync(reportPath, JSON.stringify(receipt, null, 2) + "\n"); };
const send = async (label: string, ixs: TransactionInstruction[], signers: Keypair[] = []) => {
  requireDevnet(await c.getGenesisHash());
  const signature = await sendAndConfirmTransaction(c, new Transaction().add(...ixs), [payer, ...signers], { commitment: "confirmed", maxRetries: 3 });
  receipt.transactions.push({ label, signature }); save(label);
  return signature;
};
save("checking-funds");
if (!(await c.getAccountInfo(program.publicKey))?.executable) {
  const bufferRent = await c.getMinimumBalanceForRentExemption(37 + binary.length);
  const dataRent = await c.getMinimumBalanceForRentExemption(45 + binary.length);
  const programRent = await c.getMinimumBalanceForRentExemption(36);
  let balance = await c.getBalance(payer.publicKey);
  const existingBuffer = await c.getAccountInfo(buffer.publicKey);
  const needed = deploymentFundingRequired(bufferRent, dataRent, programRent, existingBuffer?.lamports ?? null);
  if (balance < needed) {
    console.log(JSON.stringify({ action: "free-devnet-airdrop", payer: payer.publicKey.toBase58(), balance, needed }));
    const signature = await c.requestAirdrop(payer.publicKey, 2_000_000_000);
    await c.confirmTransaction(signature, "confirmed");
    receipt.transactions.push({ label: "free-devnet-airdrop", signature }); save("funded");
    balance = await c.getBalance(payer.publicKey);
    if (balance < needed) throw new Error(`Insufficient faucet funds: ${balance} < ${needed}`);
  }
  if (!existingBuffer) {
    await send("create-buffer", [
      SystemProgram.createAccount({ fromPubkey: payer.publicKey, newAccountPubkey: buffer.publicKey, lamports: bufferRent, space: 37 + binary.length, programId: LOADER }),
      new TransactionInstruction({ programId: LOADER, data: Buffer.alloc(4), keys: [{ pubkey: buffer.publicKey, isSigner: false, isWritable: true }, { pubkey: payer.publicKey, isSigner: false, isWritable: false }] }),
    ], [buffer]);
  } else if (!existingBuffer.owner.equals(LOADER) || existingBuffer.data.length !== 37 + binary.length || !existingBuffer.data.subarray(5, 37).equals(payer.publicKey.toBuffer())) {
    throw new Error("Existing upload buffer has unexpected owner, size or authority");
  }
  const staged = (await c.getAccountInfo(buffer.publicKey))!.data.subarray(37);
  for (let offset = 0; offset < binary.length; offset += 900) {
    const chunk = binary.subarray(offset, offset + 900);
    if (!staged.subarray(offset, offset + chunk.length).equals(chunk)) await send(`write-${offset}`, [bufferWrite(buffer.publicKey, payer.publicKey, offset, chunk)]);
    if (offset % 18000 === 0) console.log(JSON.stringify({ action: "upload", bytes: offset, total: binary.length }));
  }
  const uploaded = (await c.getAccountInfo(buffer.publicKey))!.data.subarray(37);
  if (!uploaded.equals(binary)) throw new Error("Uploaded buffer differs from binary");
  await send("deploy", [
    SystemProgram.createAccount({ fromPubkey: payer.publicKey, newAccountPubkey: program.publicKey, lamports: programRent, space: 36, programId: LOADER }),
    deployProgram(payer.publicKey, program.publicKey, buffer.publicKey, binary.length),
  ], [program]);
}
const verification = await checkDeployment(c, program.publicKey, binary, "confirmed");
if (!verification.codeMatches) throw new Error("Devnet executable verification failed");
receipt.verification = verification;
writeFileSync(".env.local", `QSAFE_ENABLE_TEST_CUSTODY=true\nQSAFE_TEST_NETWORK=devnet\nQSAFE_TEST_PROGRAM_ID=${program.publicKey.toBase58()}\nSOLANA_RPC_URL=${endpoint}\n`, { mode: 0o600 });
save("deployed-and-verified");
console.log(JSON.stringify({ status: receipt.status, program: receipt.program, codeMatches: verification.codeMatches }));
