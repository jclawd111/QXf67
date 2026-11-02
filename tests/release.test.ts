import { describe, it, expect, vi } from "vitest";
import { Keypair } from "@solana/web3.js";
import { configFromEnv, getRpcUrl, MAINNET_GENESIS, MAINNET_PROGRAM_ID, DEVNET_GENESIS } from "../lib/qsafe-config";
import { sessionFor } from "../tools/cli/lib";
import { fileName } from "../sdk/v3/kit";
import { transition } from "../sdk/demo";
import { assertNetwork, WALLET_CHAIN } from "../sdk/client";
import type { Connection } from "@solana/web3.js";
const mainnetConfig = { network: "mainnet-beta" as const, custodyEnabled: true, programId: MAINNET_PROGRAM_ID, expectedGenesis: MAINNET_GENESIS, releaseStatus: "Upstream SDK compatibility test only", alertsBot: null };
describe("Release gate", () => {
  it("pins full RPC genesis hashes and accepts a mainnet read", async () => {
    expect(MAINNET_GENESIS).toBe("5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d");
    expect(DEVNET_GENESIS).toBe("EtWTRABZaYq6iMfeYKouRu166VU2xqa1wcaWoxPkrZBG");
    await expect(assertNetwork({ getGenesisHash: async () => MAINNET_GENESIS } as Connection, mainnetConfig)).resolves.toBeUndefined();
    await expect(assertNetwork({ getGenesisHash: async () => MAINNET_GENESIS.slice(0, 32) } as Connection, mainnetConfig)).rejects.toThrow("pinned network");
  });
  const published = {
    network: "devnet",
    custodyEnabled: false,
    programId: null,
    expectedGenesis: DEVNET_GENESIS,
  };
  it("defaults to disabled devnet custody in this development fork", () => {
    expect(MAINNET_PROGRAM_ID).toBe("DGXACBwbUqRKRVR1TQojZBoRuV2TZJ8wVnQSuLKm2nJJ");
    expect(configFromEnv({})).toMatchObject(published);
  });
  const off = { network: "devnet", custodyEnabled: false, programId: null };
  it.each(["mainnet", "mainnet-beta", "production", "Devnet", ""])(
    "a test setup that names no test network sends nothing, and is not mainnet (mode %s)",
    (mode) => {
      expect(
        configFromEnv({
          QSAFE_ENABLE_TEST_CUSTODY: "true",
          QSAFE_TEST_NETWORK: mode,
          QSAFE_TEST_PROGRAM_ID: "k7FaK87WHGVXzkaoHb7CdVPgkKDQhZ29VLDeBVbDfYn",
        }),
      ).toMatchObject(off);
    },
  );
  it("a test setup with a malformed program id sends nothing", () => {
    for (const id of ["test", "", "https://evil.example/x", "k7FaK87W HGVXzkaoHb7CdVPgkKDQhZ29VLDeBVbDfYn"])
      expect(
        configFromEnv({ QSAFE_ENABLE_TEST_CUSTODY: "true", QSAFE_TEST_NETWORK: "devnet", QSAFE_TEST_PROGRAM_ID: id }),
        id,
      ).toMatchObject(off);
  });
  it("half a test setup and absent settings both send nothing", () => {
    expect(configFromEnv({ QSAFE_TEST_NETWORK: "devnet" })).toMatchObject(off);
    expect(configFromEnv({ QSAFE_TEST_PROGRAM_ID: "k7FaK87WHGVXzkaoHb7CdVPgkKDQhZ29VLDeBVbDfYn" })).toMatchObject(off);
    for (const unset of [{}, { QSAFE_ENABLE_TEST_CUSTODY: "false" }, { QSAFE_ENABLE_TEST_CUSTODY: "", QSAFE_TEST_NETWORK: "" }])
      expect(configFromEnv(unset)).toMatchObject(published);
  });
  it("treats an empty RPC setting as unset", () => {
    vi.stubEnv("SOLANA_RPC_URL", "");
    expect(getRpcUrl()).toBe("https://api.devnet.solana.com");
    vi.stubEnv("SOLANA_RPC_URL", "https://rpc.example/key");
    expect(getRpcUrl()).toBe("https://rpc.example/key");
    vi.unstubAllEnvs();
  });
  it("the command-line client refuses a mainnet file for another program before signing anything", () => {
    const payer = Keypair.generate();
    const other = "k7FaK87WHGVXzkaoHb7CdVPgkKDQhZ29VLDeBVbDfYn";
    const rpc = "https://rpc.example";
    expect(() => sessionFor({ network: "mainnet-beta", genesis: MAINNET_GENESIS, program: other }, rpc, payer)).toThrow("only the published Quantum Safe program");
    expect(() => sessionFor({ network: "devnet", genesis: MAINNET_GENESIS, program: MAINNET_PROGRAM_ID }, rpc, payer)).toThrow("only the published Quantum Safe program");
    expect(() => sessionFor({ network: "mainnet-beta", genesis: DEVNET_GENESIS, program: MAINNET_PROGRAM_ID }, rpc, payer)).toThrow("only the published Quantum Safe program");
    expect(sessionFor({ network: "mainnet-beta", genesis: MAINNET_GENESIS, program: MAINNET_PROGRAM_ID }, rpc, payer).program.toBase58()).toBe(MAINNET_PROGRAM_ID);
    expect(sessionFor({ network: "devnet", genesis: DEVNET_GENESIS, program: other }, rpc, payer).program.toBase58()).toBe(other);
  });
  it("names mainnet key files without the word test", () => {
    const file = { kind: "archival", vault: "7ayn5V2rABCDEFGH" } as const;
    expect(fileName({ ...file, network: "mainnet-beta" } as never)).toBe("qsafe-RECOVERY-KIT-7ayn5V2r.json");
    expect(fileName({ ...file, network: "localnet" } as never)).toBe("qsafe-test-RECOVERY-KIT-7ayn5V2r.json");
  });
  it("asks a wallet to sign for the network it is on", () => {
    expect(WALLET_CHAIN).toEqual({
      "mainnet-beta": "solana:mainnet",
      devnet: "solana:devnet",
      localnet: "solana:localnet",
    });
  });
  it("on mainnet, writes go to the published program and no other", async () => {
    const calls: string[] = [];
    const c = {
      getGenesisHash: async () => MAINNET_GENESIS,
      getAccountInfo: async (key: { toBase58(): string }) => {
        calls.push(key.toBase58());
        return { executable: true };
      },
    } as unknown as Connection;
    await expect(assertNetwork(c, mainnetConfig, true)).resolves.toBeUndefined();
    expect(calls).toEqual([MAINNET_PROGRAM_ID]);
    // A forged test configuration that turns out to be talking to mainnet.
    const forged = { ...mainnetConfig, network: "devnet" as const, programId: "test" };
    await expect(assertNetwork(c, forged, true)).rejects.toThrow("only the published Quantum Safe program");
    // A mainnet configuration, or a key file, that names some other program.
    const other = { ...mainnetConfig, programId: "k7FaK87WHGVXzkaoHb7CdVPgkKDQhZ29VLDeBVbDfYn" };
    await expect(assertNetwork(c, other, true)).rejects.toThrow("only the published Quantum Safe program");
    // A configuration labelled mainnet whose pinned genesis is something else.
    const mislabelled = { ...mainnetConfig, expectedGenesis: DEVNET_GENESIS };
    await expect(
      assertNetwork({ ...c, getGenesisHash: async () => DEVNET_GENESIS } as unknown as Connection, mislabelled, true),
    ).rejects.toThrow("only the published Quantum Safe program");
    expect(calls).toEqual([MAINNET_PROGRAM_ID]);
  });
});
describe("Simulation states", () => {
  it("runs the full educational sequence", () => {
    let s = transition("wallet", "deposit");
    s = transition(s, "compromise");
    s = transition(s, "attack");
    expect(s).toBe("rejected");
    expect(transition(s, "withdraw")).toBe("withdrawn");
  });
  it("rejects skipped steps and resets", () => {
    expect(() => transition("wallet", "withdraw")).toThrow();
    expect(transition("withdrawn", "reset")).toBe("wallet");
  });
});
