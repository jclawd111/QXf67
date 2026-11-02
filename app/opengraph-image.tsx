import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "linear-gradient(135deg, #06090c 0%, #0d141b 55%, #070b0f 100%)",
          color: "#f4f8fb",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid rgba(200, 216, 228, 0.18)",
            paddingBottom: "24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "#0d151d",
                border: "2px solid #a9deff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#a9deff",
                fontSize: "24px",
                fontWeight: 800,
              }}
            >
              Q
            </div>
            <div style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "0.14em" }}>
              QUANTUM SAFE
            </div>
          </div>
          <div
            style={{
              fontSize: "14px",
              letterSpacing: "0.2em",
              color: "#a9deff",
              padding: "8px 16px",
              borderRadius: "999px",
              border: "1px solid rgba(169, 222, 255, 0.35)",
              background: "rgba(169, 222, 255, 0.08)",
            }}
          >
            RFC 8554 LM-OTS · SOLANA MAINNET
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div
            style={{
              fontSize: "66px",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              color: "#ffffff",
            }}
          >
            Post-Quantum SHA-256 Custody on Solana.
          </div>
          <div
            style={{
              fontSize: "26px",
              color: "#9cb0c0",
              maxWidth: "920px",
              lineHeight: 1.4,
            }}
          >
            Hot wallet deposits in. Only a 1,124-byte 34-chain SHA-256 one-time signature withdraws out.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(200, 216, 228, 0.16)",
            paddingTop: "24px",
            fontSize: "16px",
            letterSpacing: "0.14em",
            color: "#c8d8e4",
          }}
        >
          <div>34 PARALLEL SHA-256 HASH CHAINS</div>
          <div style={{ color: "#a9deff" }}>ZERO ECDSA / ED25519 WITHDRAWAL EXPOSURE</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
