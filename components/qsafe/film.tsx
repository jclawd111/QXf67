"use client";
import { useState } from "react";
import { Cpu, Shield, Lock, CheckCircle2, RefreshCw } from "lucide-react";

type Mode = "main" | "bounty" | "roadmap";

const TELEMETRY: Record<
  Mode,
  {
    badge: string;
    title: string;
    subtitle: string;
    metrics: [string, string][];
    chains: string[];
  }
> = {
  main: {
    badge: "RFC 8554 LM-OTS · 34-CHAIN SHA-256 ENGINE",
    title: "One-Way Cryptographic Airlock",
    subtitle:
      "Hot wallet Ed25519 keys can deposit into the vault PDA, but only a 1,124-byte SHA-256 one-time signature can authorize a withdrawal.",
    metrics: [
      ["SIGNATURE SCHEME", "LM-OTS_SHA256_N32_W8"],
      ["HASH CHAINS", "34 × 256-BIT CHAINS"],
      ["SIGNATURE SIZE", "1,124 BYTES"],
      ["REPLAY EXPOSURE", "0 (SINGLE-USE KEY)"],
    ],
    chains: [
      "CHAIN[00] :: 9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
      "CHAIN[01] :: 4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a",
      "CHAIN[02] :: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      "CHAIN[33] :: 7d865e959b2466918c9863afca942d0fb89d7c9ac0c99bafc3749504ded97730",
    ],
  },
  bounty: {
    badge: "QUANTUM SAFE · SECURITY BOUNDARY VERIFIER",
    title: "Zero-Curve Custody Verification",
    subtitle:
      "Every instruction is validated against deterministic SHA-256 preimage commitments on Solana mainnet.",
    metrics: [
      ["UPGRADE AUTHORITY", "RENOUNCED (NONE)"],
      ["ADMIN KEYS", "0"],
      ["TIMELOCK AIRLOCK", "1H – 7D CONFIGURABLE"],
      ["EMERGENCY CANCEL", "INSTANT STOP-FILE"],
    ],
    chains: [
      "VERIFY[PDA]   :: derive_qsafe_vault(owner_commitment, timelock_Policy) -> OK",
      "VERIFY[LMOTS] :: sha256_chain_step(sig[0..1124], pub_root[32]) -> MATCH",
      "VERIFY[EPOCH] :: rotate_generation_root(epoch + 1) -> COMMITTED",
      "STATUS        :: INVARIANT_HELD · ZERO_CURVE_EXPOSURE",
    ],
  },
  roadmap: {
    badge: "QUANTUM SAFE · ARCHITECTURE PIPELINE",
    title: "Six-Stage Custody Architecture",
    subtitle:
      "From Mainnet SHA-256 airlocks and air-gapped keygen to our Chrome & Brave Browser Extension launching in the next few days.",
    metrics: [
      ["STAGE 01–03", "CORE + MAINNET + CLI (LIVE)"],
      ["STAGE 04", "BROWSER EXTENSION (IN DAYS)"],
      ["STAGE 05", "TERMINAL AUTO-SWEEP SDK"],
      ["STAGE 06", "HARDWARE SIGNER SPEC"],
    ],
    chains: [
      "STAGE_01_03 :: RFC 8554 LM-OTS Core + Mainnet Airlock PDA + Offline Keygen (LIVE)",
      "STAGE_04    :: Chrome & Brave Browser Extension — Launching in the Next Few Days",
      "STAGE_05    :: Trading Terminal & Sniper Bot 1-Click Profit-Sweep CPI Hooks",
      "STAGE_06    :: Dedicated Air-Gapped Optical QR / USB-C LM-OTS Hardware Signer",
    ],
  },
};

export default function FilmPlayer({ film = "main" }: { film?: Mode }) {
  const [step, setStep] = useState(0);
  const data = TELEMETRY[film];

  return (
    <div
      className="film-frame qs-film-telemetry"
      style={{
        background:
          "radial-gradient(circle at 50% 0%, rgba(169, 222, 255, 0.12), rgba(8, 11, 14, 0.98) 70%)",
        border: "1px solid rgba(200, 216, 228, 0.18)",
        borderRadius: "12px",
        padding: "clamp(16px, 4vw, 28px)",
        color: "#f4f8fb",
        display: "flex",
        flexDirection: "column",
        gap: "18px",
        aspectRatio: "auto",
        height: "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
          borderBottom: "1px solid rgba(200, 216, 228, 0.12)",
          paddingBottom: "14px",
        }}
      >
        <span
          className="mono"
          style={{
            fontSize: "10.5px",
            letterSpacing: "0.12em",
            color: "#a9deff",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Cpu size={14} />
          {data.badge}
        </span>
        <button
          type="button"
          onClick={() => setStep((s) => (s + 1) % data.chains.length)}
          className="button ghost compact"
          style={{ fontSize: "11px", padding: "6px 12px", minHeight: "34px" }}
        >
          <RefreshCw size={12} />
          Cycle Hash State ({step + 1}/{data.chains.length})
        </button>
      </div>

      <div>
        <h3 style={{ fontSize: "clamp(18px, 3.5vw, 22px)", fontWeight: 600, margin: "0 0 6px", color: "#ffffff" }}>
          {data.title}
        </h3>
        <p style={{ margin: 0, fontSize: "13.5px", color: "#9cb0c0", lineHeight: 1.55 }}>
          {data.subtitle}
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(132px, 1fr))",
          gap: "10px",
        }}
      >
        {data.metrics.map(([k, v]) => (
          <div
            key={k}
            style={{
              background: "rgba(15, 22, 29, 0.85)",
              border: "1px solid rgba(169, 222, 255, 0.16)",
              borderRadius: "8px",
              padding: "10px 12px",
              minWidth: 0,
            }}
          >
            <div
              className="mono"
              style={{ fontSize: "9.5px", letterSpacing: "0.08em", color: "#7f95a6", marginBottom: "4px" }}
            >
              {k}
            </div>
            <div
              className="mono"
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "#e6f1f8",
                overflowWrap: "anywhere",
              }}
            >
              {v}
            </div>
          </div>
        ))}
      </div>

      <div
        className="mono"
        style={{
          background: "#05080b",
          border: "1px solid rgba(200, 216, 228, 0.14)",
          borderRadius: "8px",
          padding: "12px 14px",
          fontSize: "11px",
          lineHeight: 1.65,
          color: "#c8d8e4",
          overflowX: "auto",
          maxWidth: "100%",
        }}
      >
        {data.chains.map((line, idx) => (
          <div
            key={line}
            style={{
              color: idx === step ? "#a9deff" : "#7f95a6",
              fontWeight: idx === step ? 600 : 400,
              display: "flex",
              alignItems: "center",
              gap: "8px",
              whiteSpace: "nowrap",
            }}
          >
            {idx === step ? <CheckCircle2 size={13} color="#a9deff" /> : <Lock size={13} />}
            <span>{line}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
