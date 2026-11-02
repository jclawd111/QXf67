/** Live devnet custody evidence. Uses only a fresh test master and devnet payer. */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { Connection, Keypair, PublicKey, SystemProgram, Transaction, TransactionInstruction, sendAndConfirmTransaction } from "@solana/web3.js";
import { genesisVault, recoveryPacket, signAnnouncement } from "../../sdk/v3/authority";
import { chainTime, fetchVault } from "../../sdk/v3/chain";
import { announceIx, closeProofIx, computeIx, executeIx, initializeIx, recoverIx, stageIxs, vaultAddress } from "../../sdk/v3/protocol";
import { requireDevnet } from "./loader";
import { assertProgramFailure } from "./evidence";

const deployment = JSON.parse(readFileSync("docs/evidence/devnet-deployment.json", "utf8"));
if (deployment.status !== "deployed-and-verified") throw new Error("Deploy and verify the devnet program first");
const c = new Connection("https://api.devnet.solana.com", { commitment: "confirmed", disableRetryOnRateLimit: true });
const genesis = await c.getGenesisHash(); requireDevnet(genesis);
const program = new PublicKey(deployment.program);
if (!(await c.getAccountInfo(program))?.executable) throw new Error("Devnet program is not executable");
const payer = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(readFileSync("work/devnet/payer-keypair.json", "utf8"))));
const evidence: { network: string; program: string; startedAt: string; finishedAt?: string; checks: string[]; transactions: { label: string; signature: string }[]; vaults: string[]; rejections: { label: string; error: unknown; logs: string[] | null }[] } = { network: "devnet", program: program.toBase58(), startedAt: new Date().toISOString(), checks: [], transactions: [], vaults: [], rejections: [] };
mkdirSync("docs/evidence", { recursive: true });
const save = () => writeFileSync("docs/evidence/devnet-smoke.json", JSON.stringify(evidence, null, 2) + "\n");
const check = (condition: boolean, label: string) => { if (!condition) throw new Error(label); evidence.checks.push(label); save(); };
const send = async (label: string, ...ixs: TransactionInstruction[]) => {
  requireDevnet(await c.getGenesisHash());
  const signature = await sendAndConfirmTransaction(c, new Transaction().add(...ixs), [payer], { commitment: "confirmed", maxRetries: 3 });
  evidence.transactions.push({ label, signature }); save(); console.log(label);
};
const rejected = async (label: string, instruction: number, code: number, ...ixs: TransactionInstruction[]) => {
  const tx = new Transaction().add(...ixs);
  tx.feePayer = payer.publicKey; tx.recentBlockhash = (await c.getLatestBlockhash()).blockhash; tx.sign(payer);
  const sim = await c.simulateTransaction(tx);
  evidence.rejections.push({ label, error: sim.value.err, logs: sim.value.logs }); save();
  assertProgramFailure(sim.value.err, instruction, code);
  check(true, label);
};
for (const delaySecs of [0, 86400]) {
  const master = crypto.getRandomValues(new Uint8Array(32));
  const g = genesisVault(master, { chainTag: new PublicKey(genesis).toBytes(), programId: program.toBytes(), salt: crypto.getRandomValues(new Uint8Array(32)), delaySecs, trusted: [] });
  const vault = vaultAddress(program, g.d.vaultId);
  evidence.vaults.push(vault.toBase58()); save();
  await send(`create-and-deposit-${delaySecs}`, initializeIx(program, payer.publicKey, { trusted: [], salt: g.d.salt, chainTag: g.d.chainTag, opRoot: g.opRoot, recRoot: g.recRoot, delaySecs }), SystemProgram.transfer({ fromPubkey: payer.publicKey, toPubkey: vault, lamports: 50_000_000 }));
  let { state } = await fetchVault(c, program, vault);
  check(state.opIndex === 0n && state.epoch === 0n && state.delaySecs === delaySecs, `vault identity/state ${delaySecs}`);
  const before = await c.getBalance(vault);
  check(before >= 50_000_000, `deposit balance ${delaySecs}`);
  const recipient = Keypair.generate().publicKey;
  const signed = signAnnouncement(g.seed, g.d, { epoch: state.epoch, opIndex: state.opIndex, kind: 0, mint: PublicKey.default, destination: recipient, amount: 10_000_000n, announceBy: (await chainTime(c)) + 600n, decimals: 0 });
  for (const [n, ix] of stageIxs(program, payer.publicKey, signed.message, signed.signature).entries()) await send(`stage-${delaySecs}-${n}`, ix);
  const announce = announceIx(program, payer.publicKey, signed.payload, state.opRoot);
  const execute = executeIx(program, vault, { kind: 0, mint: PublicKey.default, destination: recipient });
  if (delaySecs === 0) {
    await rejected("destination substitution rejected", 2, 123, computeIx(), announce, executeIx(program, vault, { kind: 0, mint: PublicKey.default, destination: Keypair.generate().publicKey }));
    await send("instant-withdraw", computeIx(), announce, execute, closeProofIx(program, payer.publicKey, signed.message));
    check(await c.getBalance(recipient) === 10_000_000, "recipient received exact test SOL");
    check(before - await c.getBalance(vault) === 10_000_000, "vault debited exact test SOL");
    await rejected("second execution rejected", 0, 120, execute);
  } else {
    await send("announce-timelocked-withdrawal", computeIx(), announce, closeProofIx(program, payer.publicKey, signed.message));
    check(await c.getBalance(recipient) === 0, "timelock does not move funds");
    await rejected("early execution rejected", 0, 121, execute);
  }
  ({ state } = await fetchVault(c, program, vault));
  check(state.opIndex === 1n && state.epoch === 0n && (state.pending !== null) === (delaySecs > 0), `one-time key advanced ${delaySecs}`);
  if (delaySecs === 0) {
    for (const [n, ix] of stageIxs(program, payer.publicKey, signed.message, signed.signature).entries()) await send(`replay-stage-${n}`, ix);
    await rejected("spent one-time announcement rejected", 1, 110, computeIx(), announceIx(program, payer.publicKey, signed.payload, state.opRoot));
    await send("close-replayed-proof", closeProofIx(program, payer.publicKey, signed.message));
  }
  const recovery = recoveryPacket(master, g.d, 0n);
  for (const [n, ix] of stageIxs(program, payer.publicKey, recovery.message, recovery.signature).entries()) await send(`recovery-stage-${delaySecs}-${n}`, ix);
  await send(`recover-${delaySecs}`, computeIx(), recoverIx(program, payer.publicKey, recovery.payload, state), closeProofIx(program, payer.publicKey, recovery.message));
  ({ state } = await fetchVault(c, program, vault));
  check(state.epoch === 1n && state.opIndex === 0n && state.pending === null, `recovery rotates authority and clears pending ${delaySecs}`);
  check(Buffer.from(state.opRoot).equals(Buffer.from(recovery.payload).subarray(106, 138)), `recovered operational root ${delaySecs}`);
  if (delaySecs === 0) {
    const after = signAnnouncement(recovery.nextSeed, g.d, { epoch: 1n, opIndex: 0n, kind: 0, mint: PublicKey.default, destination: recipient, amount: 5_000_000n, announceBy: (await chainTime(c)) + 600n, decimals: 0 });
    for (const [n, ix] of stageIxs(program, payer.publicKey, after.message, after.signature).entries()) await send(`new-key-stage-${n}`, ix);
    await send("withdraw-with-recovered-key", computeIx(), announceIx(program, payer.publicKey, after.payload, state.opRoot), execute, closeProofIx(program, payer.publicKey, after.message));
    check(await c.getBalance(recipient) === 15_000_000, "recovered authority can withdraw exact test SOL");
  }
}
evidence.finishedAt = new Date().toISOString(); save();
console.log(JSON.stringify({ status: "pass", checks: evidence.checks.length, transactions: evidence.transactions.length, vaults: evidence.vaults }));
