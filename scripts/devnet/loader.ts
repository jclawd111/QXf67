import { PublicKey, SystemProgram, SYSVAR_CLOCK_PUBKEY, SYSVAR_RENT_PUBKEY, TransactionInstruction } from "@solana/web3.js";
import { DEVNET_GENESIS } from "../../lib/qsafe-config";
export const LOADER = new PublicKey("BPFLoaderUpgradeab1e11111111111111111111111");
/** The upgradeable loader drains the upload buffer into the payer before funding ProgramData. */
export function deploymentFundingRequired(bufferRent: number, dataRent: number, programRent: number, existingBufferBalance: number | null, feeReserve = 10_000_000): number {
  const uploadFunding = existingBufferBalance === null ? bufferRent : 0;
  const bufferCredit = existingBufferBalance ?? bufferRent;
  return uploadFunding + Math.max(0, dataRent - bufferCredit) + programRent + feeReserve;
}
export function requireDevnet(genesis: string): void {
  if (genesis !== DEVNET_GENESIS) throw new Error("This operation is devnet only");
}
export function bufferWrite(buffer: PublicKey, authority: PublicKey, offset: number, bytes: Buffer): TransactionInstruction {
  if (!Number.isSafeInteger(offset) || offset < 0) throw new Error("Invalid buffer offset");
  const data = Buffer.alloc(16 + bytes.length);
  data.writeUInt32LE(1, 0); data.writeUInt32LE(offset, 4); data.writeBigUInt64LE(BigInt(bytes.length), 8); bytes.copy(data, 16);
  return new TransactionInstruction({ programId: LOADER, data, keys: [
    { pubkey: buffer, isSigner: false, isWritable: true }, { pubkey: authority, isSigner: true, isWritable: false },
  ] });
}
export function deployProgram(payer: PublicKey, program: PublicKey, buffer: PublicKey, length: number): TransactionInstruction {
  if (!Number.isSafeInteger(length) || length <= 0) throw new Error("Invalid executable length");
  const data = Buffer.alloc(12); data.writeUInt32LE(2, 0); data.writeBigUInt64LE(BigInt(length), 4);
  return new TransactionInstruction({ programId: LOADER, data, keys: [
    { pubkey: payer, isSigner: true, isWritable: true },
    { pubkey: PublicKey.findProgramAddressSync([program.toBuffer()], LOADER)[0], isSigner: false, isWritable: true },
    { pubkey: program, isSigner: false, isWritable: true },
    { pubkey: buffer, isSigner: false, isWritable: true },
    { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
    { pubkey: SYSVAR_CLOCK_PUBKEY, isSigner: false, isWritable: false },
    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    { pubkey: payer, isSigner: true, isWritable: false },
  ] });
}
