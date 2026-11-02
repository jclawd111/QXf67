import { DocumentLayout } from "@/components/qsafe/document-layout";
import Verification from "@/components/qsafe/verification";
import ExtensionBuild from "@/components/qsafe/extension-build";

export const metadata = { title: "Protocol Telemetry & On-Chain Verification" };

export default function Page() {
  return (
    <DocumentLayout
      eyebrow="PROTOCOL TELEMETRY · SHA-256 VERIFIER"
      title="Verify every byte on-chain."
      description="Inspect the live Solana mainnet custody program, RFC 8554 LM-OTS cryptographic parameters, and deterministic source builds."
    >
      <Verification />
      <section>
        <h2>Deterministic source and reproducibility</h2>
        <p>
          The complete web application, Rust custody program, browser SDK, RFC 8554 LM-OTS test
          vectors, and CLI verification suite are included in the public repository. Builds use
          committed npm and Cargo lockfiles so any operator can reproduce the exact artifacts
          independently.
        </p>
        <div className="actions">
          <a
            href="https://github.com/VictorChaoss/QuantumSafe"
            className="button light"
            target="_blank"
            rel="noreferrer"
          >
            Inspect GitHub Repository
          </a>
          <a
            href="/source/source-manifest.json"
            className="button ghost"
            target="_blank"
            rel="noreferrer"
          >
            Inspect source checksums
          </a>
        </div>
      </section>
      <section>
        <h2>Quantum Safe Protocol Parameters</h2>
        <div className="review-list">
          {[
            ["01", "Custody Program ID", "DGXACBwbUqRKRVR1TQojZBoRuV2TZJ8wVnQSuLKm2nJJ"],
            [
              "02",
              "Signature Scheme",
              "RFC 8554 Leighton-Micali One-Time Signatures (LM-OTS_SHA256_N32_W8) · 34 parallel SHA-256 hash chains · 1,124-byte signature payload.",
            ],
            [
              "03",
              "Key Derivation & Storage",
              "AES-256-GCM authenticated encryption over scrypt-derived keys. Offline air-gapped recovery kit generation.",
            ],
            [
              "04",
              "Upgrade Authority",
              "Renounced (None). The on-chain custody program is permanently immutable and has zero administrative keys.",
            ],
            [
              "05",
              "Timelock & Airlock Policy",
              "Instant release to up to 4 pre-committed hardware wallet addresses; configurable timelock (default 24h) with instant Stop-File cancellation for all other destinations.",
            ],
          ].map(([number, title, text]) => (
            <div key={number}>
              <span>{number}</span>
              <div>
                <h3>{title}</h3>
                <p className="address">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2>Verify the build locally</h2>
        <p>
          Clone the repository and run the cryptographic test suite and deterministic verifier
          against the configured Solana RPC endpoint:
        </p>
        <pre>
          <code>{`git clone https://github.com/VictorChaoss/QuantumSafe
cd QuantumSafe
npm ci
npm test`}</code>
        </pre>
      </section>
      <ExtensionBuild />
    </DocumentLayout>
  );
}
