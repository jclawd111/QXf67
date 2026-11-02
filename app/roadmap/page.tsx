import type { Metadata } from "next";
import Link from "next/link";
import { Shield, Cpu, Lock, Zap, Terminal, HardDrive, CheckCircle2, ArrowUpRight } from "lucide-react";
import { Header, Footer } from "@/components/qsafe/shell";
import FilmPlayer from "@/components/qsafe/film";
import { Clip } from "@/components/qsafe/loop";

export const metadata: Metadata = {
  title: "Vision, Build Stages & Architecture Roadmap",
  description:
    "The complete engineering stages, cryptographic architecture, and long-term post-quantum vision for Quantum Safe ($QSAFE) on Solana.",
};

type StageSpec = {
  file: string;
  stage: string;
  name: string;
  chip: string;
  live?: boolean;
  line: string;
  deliverables: string[];
  href: string;
  cta: string;
};

const STAGES: StageSpec[] = [
  {
    file: "stage-01-core",
    stage: "STAGE 01 · CRYPTOGRAPHIC FOUNDATION",
    name: "RFC 8554 LM-OTS SHA-256 Engine",
    chip: "Complete · Verified",
    live: true,
    line: "Built from scratch in pure Rust and TypeScript with zero elliptic-curve dependencies. Implements Leighton-Micali One-Time Signatures (LM-OTS_SHA256_N32_W8) using 34 parallel 256-bit SHA-256 hash chains.",
    deliverables: [
      "Deterministic 34-chain Winternitz (w=8) SHA-256 signing & verification crate (qsafe-lmots)",
      "1,124-byte signature verifier binding asset, amount, destination, generation epoch, and Solana genesis hash",
      "Full RFC 8554 test vector suite with bit-flip and preimage boundary fuzzing",
      "Single-use key retirement with automatic next-generation root commitment on every spend",
    ],
    href: "/docs",
    cta: "Inspect RFC 8554 Specification →",
  },
  {
    file: "stage-02-airlock",
    stage: "STAGE 02 · ON-CHAIN SETTLEMENT",
    name: "Immutable Solana Airlock & Timelock PDA",
    chip: "Complete · Mainnet Live",
    live: true,
    line: "Deployed to Solana mainnet with upgrade authority permanently renounced. Separates hot-wallet deposits from cold SHA-256 withdrawals through an on-chain one-way cryptographic valve.",
    deliverables: [
      "Mainnet program (DGXACBwbUqRKRVR1TQojZBoRuV2TZJ8wVnQSuLKm2nJJ) with 0 admin keys",
      "One-way deposit airlock: any Solana wallet or DEX can sweep SOL & SPL tokens in",
      "Up to 4 whitelisted hardware cold pockets for 0-second instant withdrawals",
      "Configurable 1h–7d timelock countdown for unknown addresses + 1-click Stop File cancellation",
    ],
    href: "/verify",
    cta: "Verify Mainnet Bytecode →",
  },
  {
    file: "stage-03-recovery",
    stage: "STAGE 03 · SOVEREIGN SELF-CUSTODY",
    name: "Air-Gapped Recovery Kit & Standalone CLI",
    chip: "Complete · Live",
    live: true,
    line: "Client-side offline key generation and emergency rotation tools so users never rely on a centralized server or third-party custodian to access or rescue their vaulted capital.",
    deliverables: [
      "In-browser air-gapped Recovery Kit generator encrypted via scrypt (N=32768) + AES-256-GCM",
      "Pre-signed emergency Stop File generator to freeze & rotate compromised Day Keys in one click",
      "Single-file zero-dependency Node.js CLI (qsafe-cli.mjs) for direct RPC interaction",
      "Read-only Wallet Exposure Scanner (/check) & interactive Breach Simulator (/demo)",
    ],
    href: "/recovery",
    cta: "Open Offline Key Generator →",
  },
  {
    file: "door-01-watch",
    stage: "STAGE 04 · BROWSER EXTENSION & TELEMETRY",
    name: "Quantum Watch — Chrome & Brave Browser Extension",
    chip: "Launching in the Next Few Days",
    live: true,
    line: "Rolling out publicly in the next few days: a read-only Chrome & Brave browser extension that watches your Quantum Safe PDA on Solana mainnet 24/7 while holding zero private keys—alerting you the second a timelocked withdrawal is announced.",
    deliverables: [
      "Chrome & Brave Browser Extension public release in the next few days (developer preview & source live now)",
      "Instant desktop toolbar notifications when a withdrawal enters the 24-hour countdown",
      "Built-in hot-wallet drainer exposure scanner + 1-click Stop File emergency cancel shortcut",
      "Deterministic SHA-256 build manifest for byte-for-byte extension verification",
    ],
    href: "/watch",
    cta: "Preview Browser Extension →",
  },
  {
    file: "door-05-build-on-qsafe",
    stage: "STAGE 05 · ECOSYSTEM & TERMINAL HOOKS",
    name: "Trading Terminal & Bot Auto-Sweep SDK",
    chip: "In Development",
    line: "Direct Cross-Program Invocation (CPI) hooks and TypeScript SDK adapters for Solana trading terminals, DEX aggregators, and sniper bots—turning profit taking into automatic post-quantum custody.",
    deliverables: [
      "1-click 'Sweep Profit to Quantum Safe' SDK widget for web trading terminals",
      "Automated post-trade PnL sweep rules (e.g., auto-vault 75% of realized SOL wins)",
      "AI trading agent custody rails: agents trade with hot keys while profits lock in SHA-256",
      "Open developer integration docs & composable Anchor CPI helpers",
    ],
    href: "/integrate",
    cta: "Explore Terminal Integration →",
  },
  {
    file: "stage-06-hardware",
    stage: "STAGE 06 · HARDWARE & MULTI-TREE HORIZON",
    name: "Dedicated SHA-256 Hardware Signer & HSS Vaults",
    chip: "Future Horizon",
    line: "Open-hardware specification and standalone Rust firmware for a stateless air-gapped LM-OTS signing device, paired with Hierarchical Leighton-Micali Signatures (HSS) for institutional treasuries.",
    deliverables: [
      "Air-gapped optical QR & USB-C HID hardware signer specification (zero host-OS key exposure)",
      "RFC 8554 HSS multi-tree key hierarchies for high-frequency institutional & DAO treasuries",
      "Threshold m-of-n SHA-256 airlock policies for multi-founder protocol reserves",
      "Cross-SVM post-quantum custody standard powered by the $QSAFE ecosystem",
    ],
    href: "/security",
    cta: "Read Security Architecture →",
  },
];

const VISION_PILLARS = [
  {
    tag: "PILLAR I · THE PRESENT CRISIS",
    title: "Decoupling Execution Speed from Sovereign Custody",
    icon: Zap,
    body: "Active Solana traders need sub-second execution, which forces hot wallets to keep Ed25519 private keys live in memory. In that environment, a single malicious signature, fake airdrop claim, or supply-chain exploit drains 100% of a wallet in 400ms. Quantum Safe solves this structurally: your hot wallet remains light and fast for trading, while realized capital is swept through a one-way cryptographic valve that your wallet key can never open.",
  },
  {
    tag: "PILLAR II · THE QUANTUM HORIZON",
    title: "Post-Elliptic Security Anchored Purely in SHA-256",
    icon: Cpu,
    body: "Every standard wallet on Solana, Ethereum, and Bitcoin relies on elliptic-curve cryptography (Ed25519 / secp256k1). Once a wallet sends a transaction, its public key is permanently exposed on-chain—making long-term vaults vulnerable to Shor’s algorithm on future fault-tolerant quantum computers. Quantum Safe removes elliptic curves from vault authority entirely, using RFC 8554 Leighton-Micali One-Time Signatures (LM-OTS) where security depends strictly on reversing 256-bit SHA-256 hash chains.",
  },
  {
    tag: "PILLAR III · IMMUTABLE LONGEVITY",
    title: "Zero Admin Keys, Zero Custodians, Infinite Survival",
    icon: Shield,
    body: "A vault is only as strong as its governance boundary. If a protocol has an upgrade authority, a multisig council, or a centralized backend, it has a single point of failure. Quantum Safe is deployed on Solana mainnet with upgrade authority permanently renounced. Even if this website vanished tomorrow, your offline Recovery Kit and the standalone single-file CLI operate directly against Solana validators forever.",
  },
];

const FUTURE_INITIATIVES = [
  {
    phase: "HORIZON 01 · AUTONOMOUS SWEEPING",
    title: "Real-Time Terminal & Sniper Bot PnL Airlocks",
    icon: Terminal,
    desc: "Traders and automated bots shouldn't have to manually transfer profits after every winning trade. We are building native SDK hooks so trading terminals and Telegram bots can automatically route a configurable percentage of every profitable swap straight into the user's Quantum Safe PDA.",
    metrics: ["0-Click Profit Routing", "Composable Anchor CPI", "Hot-Wallet Isolation"],
  },
  {
    phase: "HORIZON 02 · SILICON ISOLATION",
    title: "Stateless Optical QR & USB-C SHA-256 Signer",
    icon: HardDrive,
    desc: "While our Day Key + 24-hour Timelock + Stop File architecture neutralizes remote key theft today, the ultimate form factor is dedicated silicon. Our open-hardware specification defines a stateless microcontroller that computes 34-chain LM-OTS signatures across an air-gapped optical QR or raw HID boundary.",
    metrics: ["Air-Gapped QR Signing", "Open Rust Firmware", "Deterministic Seed Derivation"],
  },
  {
    phase: "HORIZON 03 · INSTITUTIONAL & AI TREASURIES",
    title: "AI Agent Guardrails & Multi-Party HSS Trees",
    icon: Lock,
    desc: "As autonomous AI agents begin managing on-chain liquidity, giving an AI agent a raw Ed25519 private key is a catastrophic risk. Quantum Safe provides the cryptographic guardrail: AI agents can deposit trading revenue into the vault freely, while withdrawals require multi-party RFC 8554 HSS hash-tree authorization.",
    metrics: ["AI Agent Treasury Rails", "RFC 8554 HSS Multi-Tree", "DAO Reserve Airlocks"],
  },
];

function StageDoor({ n }: { n: number }) {
  const door = STAGES[n];
  const number = String(n + 1).padStart(2, "0");
  return (
    <li className="door qs-stage-door">
      <div className="door-panel qs-stage-panel">
        <div className="door-words qs-stage-words">
          <div className="qs-stage-meta">
            <span className="door-label">{door.stage}</span>
            <span className={`bm-chip ${door.live ? "qs-chip-yolo" : "qs-chip-gold"}`}>
              {door.chip}
            </span>
          </div>
          <span className="door-strip" aria-hidden="true">
            {STAGES.map((d, i) => (
              <i key={d.stage} className={i <= n ? "on" : ""} />
            ))}
          </span>
          <h2 className="bm-big qs-stage-heading">
            Stage {number}. <span className="bm-accent">{door.name}.</span>
          </h2>
          <p className="qs-stage-lead">{door.line}</p>
          <ul className="qs-stage-deliverables">
            {door.deliverables.map((item) => (
              <li key={item}>
                <CheckCircle2 size={15} className="ice" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <Link className="door-open qs-stage-cta" href={door.href}>
            {door.cta}
          </Link>
        </div>
        <div className="qs-stage-media-wrap">
          <Clip name={door.file} />
        </div>
      </div>
    </li>
  );
}

export default function Roadmap() {
  return (
    <>
      <Header />
      <main className="roadmap qs-roadmap-page">
        {/* HERO */}
        <section className="roadmap-hero qs-roadmap-hero">
          <div>
            <div className="eyebrow">
              <b>ARCHITECTURE & VISION</b>6 STAGES OF POST-QUANTUM ENGINEERING
            </div>
            <h1 className="bm-big" style={{ marginTop: 18 }}>
              The Vision &amp; Roadmap.
              <span className="bm-accent">Gates, not dates.</span>
            </h1>
            <p className="qs-roadmap-intro">
              Quantum Safe is engineered in six sequential cryptographic stages—building from a
              zero-curve RFC 8554 SHA-256 signing core to an immutable Solana mainnet airlock,
              offline recovery kits, real-time breach telemetry, automated terminal profit sweeping,
              and dedicated air-gapped hardware.
            </p>
            <div className="qs-roadmap-kpis">
              <div>
                <span className="mono">STAGES LIVE</span>
                <strong>04 / 06</strong>
              </div>
              <div>
                <span className="mono">HASH CHAINS</span>
                <strong>34 × SHA-256</strong>
              </div>
              <div>
                <span className="mono">ADMIN KEYS</span>
                <strong>0 (RENOUNCED)</strong>
              </div>
              <div>
                <span className="mono">STANDARD</span>
                <strong>RFC 8554 LM-OTS</strong>
              </div>
            </div>
          </div>
          <div className="bm-panel roadmap-film">
            <div className="bm-panel__head">
              <span>Quantum Safe Architecture Telemetry</span>
              <span>MAINNET LIVE</span>
            </div>
            <FilmPlayer film="roadmap" />
          </div>
        </section>

        {/* SECTION 1: THE VISION & LONG-TERM THESIS */}
        <section className="section qs-vision-section" id="vision">
          <div className="eyebrow">
            <b>01 / THE VISION</b>WHY QUANTUM SAFE EXISTS · THE POST-ELLIPTIC ERA
          </div>
          <div className="split-title">
            <h2>
              Built for today’s drainers.
              <br />
              Engineered for tomorrow’s quantum horizon.
            </h2>
            <p>
              On-chain self-custody is entering its third architectural era—moving beyond raw seed
              phrases and elliptic-curve signatures to deterministic, one-way SHA-256 settlement
              vaults.
            </p>
          </div>

          <div className="qs-vision-grid">
            {VISION_PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <article key={pillar.tag} className="qs-vision-card">
                  <div className="qs-vision-card-top">
                    <span className="mono">{pillar.tag}</span>
                    <Icon size={18} className="ice" />
                  </div>
                  <h3>{pillar.title}</h3>
                  <p>{pillar.body}</p>
                </article>
              );
            })}
          </div>
        </section>

        {/* SECTION 2: EACH STAGE OF BUILDING */}
        <section className="qs-stages-header section" id="stages">
          <div className="eyebrow">
            <b>02 / STAGES OF BUILDING</b>COMPLETE ENGINEERING PIPELINE (STAGES 01 – 06)
          </div>
          <div className="split-title">
            <h2>
              Every stage of building.
              <br />
              Verified on-chain.
            </h2>
            <p>
              We do not ship vaporware or arbitrary calendar promises. Each stage unlocks only when
              the underlying SHA-256 invariants, test vectors, and mainnet verifiers are complete.
            </p>
          </div>
        </section>

        <ol className="doors qs-doors-list">
          {STAGES.map((stage, n) => (
            <StageDoor key={stage.stage} n={n} />
          ))}
        </ol>

        {/* SECTION 3: THE FUTURE HORIZON */}
        <section className="section qs-future-section" id="future">
          <div className="eyebrow">
            <b>03 / THE FUTURE HORIZON</b>ECOSYSTEM EXPANSION &amp; LONG-TERM DIRECTION
          </div>
          <div className="split-title">
            <h2>
              The future of sovereign
              <br />
              capital on Solana.
            </h2>
            <p>
              With Stages 01 through 04 live on Solana mainnet, our engineering focus is expanding
              Quantum Safe into the default post-quantum settlement layer for traders, autonomous AI
              agents, and hardware signers.
            </p>
          </div>

          <div className="qs-future-grid">
            {FUTURE_INITIATIVES.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.phase} className="qs-future-card">
                  <div className="qs-future-head">
                    <span className="qs-badge-live">{item.phase}</span>
                    <Icon size={18} className="ice" />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                  <div className="qs-future-tags">
                    {item.metrics.map((m) => (
                      <span key={m} className="mono">
                        ◈ {m}
                      </span>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* CLOSING CTA */}
        <section className="roadmap-end qs-roadmap-end">
          <span className="mono">SOLANA MAINNET · RFC 8554 LM-OTS PROTOCOL · $QSAFE</span>
          <p>
            Engineering milestones, not arbitrary dates. Every layer builds on the immutable
            34-chain SHA-256 core.
          </p>
          <div className="actions" style={{ marginTop: 12 }}>
            <Link href="/vault" className="button light qs-gold-cta">
              <Shield size={15} />
              Initialize Your Vault
            </Link>
            <a
              href="https://x.com/TheQuantumSafe"
              target="_blank"
              rel="noreferrer"
              className="button ghost"
            >
              Follow @TheQuantumSafe on 𝕏
              <ArrowUpRight size={15} />
            </a>
            <Link href="/verify" className="button ghost">
              Verify On-Chain Bytecode
              <ArrowUpRight size={15} />
            </Link>
            <Link href="/docs" className="button ghost">
              Read RFC 8554 Spec
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
