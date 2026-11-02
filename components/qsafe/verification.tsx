"use client";
import { useEffect, useState } from "react";
import { RefreshCw, ExternalLink } from "lucide-react";

type VerificationData = {
  network: string;
  program: string | null;
  cryptography: string;
  deployment: string;
  upgradeAuthority: string;
};

export default function Verification() {
  const [data, setData] = useState<VerificationData | null>(null);
  const [error, setError] = useState("");

  async function refresh() {
    setError("");
    try {
      const r = await fetch("/api/verify");
      if (!r.ok) throw new Error("Telemetry service unavailable");
      setData((await r.json()) as VerificationData);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Telemetry unavailable");
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/verify", { signal: controller.signal })
      .then(async (r) => {
        if (!r.ok) throw new Error("Telemetry service unavailable");
        setData((await r.json()) as VerificationData);
      })
      .catch((e) => {
        if (!controller.signal.aborted)
          setError(e instanceof Error ? e.message : "Telemetry unavailable");
      });
    return () => controller.abort();
  }, []);

  return (
    <div className="panel live-verification">
      <div className="panel-head">
        <h2>Live On-Chain Telemetry</h2>
        <button className="text-button" onClick={refresh}>
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>
      {error && <p role="alert">{error}</p>}
      {data ? (
        <>
          <div className="metric">
            <span>Configured network</span>
            <b>{data.network}</b>
          </div>
          <div className="metric">
            <span>Program status</span>
            <b>{data.deployment}</b>
          </div>
          <div className="metric">
            <span>Upgrade authority</span>
            <b className="address">{data.upgradeAuthority}</b>
          </div>
          <div className="metric">
            <span>Signature engine</span>
            <b>{data.cryptography}</b>
          </div>
          {data.program && (
            <div className="verification-address">
              <span>Program ID</span>
              <code>{data.program}</code>
              {data.network !== "localnet" && (
                <a
                  href={`https://explorer.solana.com/address/${data.program}${data.network === "devnet" ? "?cluster=devnet" : ""}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Inspect on Solana Explorer
                  <ExternalLink size={12} />
                </a>
              )}
            </div>
          )}
        </>
      ) : (
        <p>Querying live Solana RPC telemetry…</p>
      )}
      <p className="micro">
        Program executable status and upgrade authority are read directly from the configured Solana
        RPC node in real time.
      </p>
    </div>
  );
}
