import { describe, expect, it } from "vitest";
import { Keypair, PublicKey } from "@solana/web3.js";
import { configFromEnv, DEVNET_GENESIS, MAINNET_GENESIS } from "../lib/qsafe-config";
import { requireDevnet, bufferWrite, deployProgram } from "../scripts/devnet/loader";
import { assertProgramFailure } from "../scripts/devnet/evidence";

describe("Devnet-only build", () => {
  it("counts a rejection only for the intended program instruction and error code", () => {
    expect(() => assertProgramFailure({ InstructionError: [1, { Custom: 123 }] }, 1, 123)).not.toThrow();
    for (const error of [null, "BlockhashNotFound", { InstructionError: [1, "ComputationalBudgetExceeded"] }, { InstructionError: [0, { Custom: 123 }] }, { InstructionError: [1, { Custom: 121 }] }]) {
      expect(() => assertProgramFailure(error, 1, 123)).toThrow("Expected program rejection");
    }
  });
  it("has no mainnet fallback when settings are absent or malformed", () => {
    for (const env of [{}, { QSAFE_TEST_NETWORK: "mainnet-beta" }, { QSAFE_TEST_PROGRAM_ID: "bad" }]) {
      expect(configFromEnv(env)).toMatchObject({ network: "devnet", custodyEnabled: false, programId: null, expectedGenesis: DEVNET_GENESIS });
    }
  });
  it("rejects every genesis other than devnet before deployment", () => {
    expect(() => requireDevnet(DEVNET_GENESIS)).not.toThrow();
    for (const genesis of [MAINNET_GENESIS, "", "localnet"]) expect(() => requireDevnet(genesis)).toThrow("devnet only");
  });
  it("encodes a buffer write with exact offset, byte count and signer", () => {
    const buffer = Keypair.generate().publicKey, payer = Keypair.generate().publicKey;
    const ix = bufferWrite(buffer, payer, 900, Buffer.from([4, 5, 6]));
    expect(ix.data.readUInt32LE(0)).toBe(1);
    expect(ix.data.readUInt32LE(4)).toBe(900);
    expect(ix.data.readBigUInt64LE(8)).toBe(3n);
    expect([...ix.data.subarray(16)]).toEqual([4, 5, 6]);
    expect(ix.keys[1]).toEqual({ pubkey: payer, isSigner: true, isWritable: false });
    expect(() => bufferWrite(buffer, payer, -1, Buffer.from([1]))).toThrow();
  });
  it("deploys only the provided program with its derived program-data account", () => {
    const payer = Keypair.generate().publicKey, program = Keypair.generate().publicKey, buffer = Keypair.generate().publicKey;
    const ix = deployProgram(payer, program, buffer, 128960);
    expect(ix.data.readUInt32LE(0)).toBe(2);
    expect(ix.data.readBigUInt64LE(4)).toBe(128960n);
    expect(ix.keys[1].pubkey.equals(PublicKey.findProgramAddressSync([program.toBuffer()], ix.programId)[0])).toBe(true);
    expect(ix.keys[2].pubkey.equals(program)).toBe(true);
    expect(ix.keys[3].pubkey.equals(buffer)).toBe(true);
  });
});
