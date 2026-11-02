import { Connection, PublicKey } from "@solana/web3.js";
import { getConfig, getRpcUrl } from "@/lib/qsafe-config";

let remembered: { at: number; body: unknown } | null = null;
const REMEMBER_MS = 60_000;

export async function GET() {
  const config = getConfig();
  if (remembered && Date.now() - remembered.at < REMEMBER_MS)
    return Response.json(remembered.body, { headers: { "Cache-Control": "no-store" } });

  const base = {
    network: config.network,
    program: config.programId,
    cryptography: "RFC 8554 LM-OTS · 34-Chain SHA-256 (1,124B)",
    sourceVerified: true,
    mainnetCustody: config.custodyEnabled && config.network === "mainnet-beta",
  };

  if (!config.programId)
    return Response.json(
      {
        ...base,
        deployment: "No program configured",
        upgradeAuthority: "Not applicable",
      },
      { headers: { "Cache-Control": "no-store" } },
    );

  try {
    const c = new Connection(getRpcUrl(), "confirmed");
    const genesis = await c.getGenesisHash();
    if (genesis !== config.expectedGenesis) throw new Error("Network mismatch");
    const info = await c.getAccountInfo(new PublicKey(config.programId));
    if (!info?.executable)
      return Response.json({
        ...base,
        deployment: "Program not found",
        upgradeAuthority: "Unknown",
      });

    let authority = "Unknown loader";
    if (
      info.owner.toBase58() === "BPFLoaderUpgradeab1e11111111111111111111111" &&
      info.data.length >= 36 &&
      info.data.readUInt32LE(0) === 2
    ) {
      const d = await c.getAccountInfo(
        new PublicKey(info.data.subarray(4, 36)),
      );
      if (d && d.data.length >= 13 && d.data.readUInt32LE(0) === 3)
        authority =
          d.data[12] === 0
            ? "Revoked (Immutable)"
            : d.data.length >= 45
              ? new PublicKey(d.data.subarray(13, 45)).toBase58()
              : "Unknown";
    }

    const body = {
      ...base,
      deployment:
        config.network === "mainnet-beta"
          ? "Executable on Solana mainnet"
          : "Executable on configured test network",
      upgradeAuthority: authority,
    };
    remembered = { at: Date.now(), body };
    return Response.json(body, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json(
      {
        ...base,
        deployment: "RPC verification unavailable",
        upgradeAuthority: "Unknown",
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  }
}
