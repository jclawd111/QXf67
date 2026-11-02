import Link from "next/link";
import { Cpu, Menu } from "lucide-react";
import { NavLinks } from "./nav-links";
import { getLaunch } from "@/lib/launch-config";

export function Mark({ small = false }: { small?: boolean }) {
  const size = small ? 28 : 32;
  return (
    <span className={`brand qs-brand ${small ? "small" : ""}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="qs-brand-logo-svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="qsTiBg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#111920" />
            <stop offset="100%" stopColor="#070B0E" />
          </linearGradient>
          <linearGradient id="qsSilver" x1="10" y1="8" x2="54" y2="56" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#C8D8E4" />
            <stop offset="100%" stopColor="#6E8494" />
          </linearGradient>
          <linearGradient id="qsIce" x1="14" y1="14" x2="54" y2="54" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#DDF2FF" />
            <stop offset="50%" stopColor="#A9DEFF" />
            <stop offset="100%" stopColor="#4A90E2" />
          </linearGradient>
        </defs>
        <rect
          x="2"
          y="2"
          width="60"
          height="60"
          rx="14"
          fill="url(#qsTiBg)"
          stroke="url(#qsSilver)"
          strokeWidth="2"
          strokeOpacity="0.65"
        />
        <path
          d="M32 13L47 21.5V38.5L32 47L17 38.5V21.5L32 13Z"
          stroke="url(#qsSilver)"
          strokeWidth="3.8"
          strokeLinejoin="miter"
        />
        <path
          d="M32 22L39.8 26.5V35.5L32 40L24.2 35.5V26.5L32 22Z"
          fill="#091015"
          stroke="url(#qsIce)"
          strokeWidth="2"
        />
        <path
          d="M34.5 34.5L49.5 49.5"
          stroke="url(#qsIce)"
          strokeWidth="4.2"
          strokeLinecap="square"
        />
        <circle cx="32" cy="31" r="2.4" fill="#A9DEFF" />
      </svg>
      <span className="qs-brand-text">
        QUANTUM<span>SAFE</span>
      </span>
    </span>
  );
}

export const OFFICIAL_X_URL = "https://x.com/TheQuantumSafe";

export function Header() {
  const { coinAddress } = getLaunch();
  return (
    <>
      <div className="network-bar qs-network-bar">
        <Cpu size={13} />
        <strong>POST-QUANTUM PROTOCOL · SOLANA MAINNET</strong>
        {coinAddress ? (
          <span className="mono" style={{ color: "#d8f0ff" }}>
            $QSAFE CA: <strong>{coinAddress}</strong>
          </span>
        ) : (
          <span>Protected by 34-Chain SHA-256 One-Time Signatures (RFC 8554 LM-OTS) · Immutable Custody.</span>
        )}
        <Link href="/security">Security boundaries</Link>
        <a
          href={OFFICIAL_X_URL}
          target="_blank"
          rel="noreferrer"
          style={{ marginLeft: "6px", color: "#d8f0ff", fontWeight: 600 }}
        >
          𝕏 @TheQuantumSafe ↗
        </a>
      </div>
      <header className="site-header">
        <Link href="/" aria-label="Quantum Safe home">
          <Mark />
        </Link>
        <nav aria-label="Main navigation">
          <NavLinks />
        </nav>
        <div className="header-actions">
          <a
            className="button compact ghost"
            href={OFFICIAL_X_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="Quantum Safe on X (@TheQuantumSafe)"
          >
            𝕏 @TheQuantumSafe
          </a>
          <Link className="button compact light qs-gold-cta" href="/vault">
            Initialize Vault
          </Link>
          <details className="mobile-nav">
            <summary aria-label="Menu">
              <Menu size={20} />
            </summary>
            <nav aria-label="Mobile navigation">
              <NavLinks extra={[["/verify", "Verify"]]} />
              <a href={OFFICIAL_X_URL} target="_blank" rel="noreferrer">
                𝕏 @TheQuantumSafe ↗
              </a>
            </nav>
          </details>
        </div>
      </header>
    </>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <Link href="/" aria-label="Quantum Safe home">
          <Mark small />
        </Link>
        <p>Post-quantum SHA-256 self-custody on Solana.</p>
      </div>
      <div className="footer-columns">
        <div>
          <span className="mono">PROTOCOL</span>
          <Link href="/demo">Drainer Simulation</Link>
          <Link href="/check">Wallet Exposure Scanner</Link>
          <Link href="/vault">Vault Terminal</Link>
          <Link href="/recovery">Offline Key Generator</Link>
          <Link href="/start">Deployment Guide</Link>
          <Link href="/watch">Quantum Watch Extension</Link>
          <Link href="/roadmap">Architecture Roadmap</Link>
          <Link href="/docs">RFC 8554 LM-OTS Spec</Link>
          <Link href="/integrate">Terminal Integration</Link>
          <Link href="/emergency">Emergency Incident Response</Link>
        </div>
        <div>
          <span className="mono">VERIFICATION</span>
          <Link href="/security">Security & limitations</Link>
          <Link href="/verify">Verify on-chain bytecode</Link>
          <a href="https://github.com/VictorChaoss/QuantumSafe">Source on GitHub</a>
          <Link href="/bounty">Bug bounty</Link>
          <a href="https://github.com/VictorChaoss/QuantumSafe/security/advisories/new">
            Report a vulnerability
          </a>
          <Link href="/terms">Terms & risks</Link>
          <Link href="/privacy">Privacy</Link>
        </div>
        <div>
          <span className="mono">COMMUNITY &amp; SOURCE</span>
          <a href={OFFICIAL_X_URL} target="_blank" rel="noreferrer">
            𝕏 (@TheQuantumSafe)
          </a>
          <a href="https://github.com/VictorChaoss/QuantumSafe" target="_blank" rel="noreferrer">
            GitHub Repository
          </a>
        </div>
      </div>
      <span className="mono footer-status">
        OPEN SOURCE · RFC 8554 LM-OTS ON SOLANA MAINNET · QUANTUM SAFE · @TheQuantumSafe
      </span>
      <p className="footer-fine">
        Quantum Safe is an open-source post-quantum custody protocol on Solana powered by RFC 8554
        LM-OTS SHA-256 hash chains. Non-custodial and immutable—no admin keys exist.
      </p>
    </footer>
  );
}
