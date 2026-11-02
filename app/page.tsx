import Link from "next/link";
import {
  Play,
  MoveUpRight,
  Check,
  X,
  LockKeyhole,
  Shield,
  Cpu,
} from "lucide-react";
import { Header, Footer } from "@/components/qsafe/shell";
import Story from "@/components/qsafe/story";
import { Card, Clip } from "@/components/qsafe/loop";
import { BIcon } from "@/components/qsafe/icon";
import { getLaunch } from "@/lib/launch-config";
import {
  ChampionsStarballCanvas,
  QuantumLaunchIntro,
  StackPaperSimulator,
} from "@/components/qsafe/quantum-hero";

function Plate({
  clip,
  level,
  line,
  tall = false,
}: {
  clip: string;
  level: string;
  line: string;
  tall?: boolean;
}) {
  return (
    <section className={`world-plate ${tall ? "tall" : ""}`}>
      <Clip name={clip} />
      <span className="halftone" />
      <div>
        <span className="mono">{level}</span>
        <p>{line}</p>
      </div>
    </section>
  );
}

const REPO = "https://github.com/VictorChaoss/QuantumSafe";
const X_URL = "https://x.com/TheQuantumSafe";

const stops: [string, string][] = [
  ["A bad click while trading.", "Tricking your hot wallet does not open your Quantum Safe."],
  ["A stolen seed phrase.", "Your wallet seed phrase does not generate the Quantum Safe LM-OTS key."],
  ["Using a key twice.", "Every SHA-256 hash key works once. Each withdrawal rolls to a fresh one."],
  [
    "A stolen day key, while the wait is on.",
    "It can pay only the cold wallets you listed as yours. Anything else waits 24h, and you press stop.",
  ],
];

const limits: [string, string][] = [
  ["A virus on your device.", "It can copy your key file and watch you type the password."],
  ["A stolen day key, if you turn the wait off.", "Then a thief can send everything anywhere, at once."],
  [
    "A trusted wallet that is not safe.",
    "A thief with your day key can pay it right away. Make it a hardware wallet they cannot reach.",
  ],
  ["A lost recovery kit.", "Nobody can reset it. Not even us."],
];

const ticker = [
  "QUANTUM SAFE · POST-QUANTUM CUSTODY",
  "CHROME & BRAVE EXTENSION · LAUNCHING IN DAYS",
  "OFFICIAL 𝕏 · @TheQuantumSafe",
  "ZERO ECDSA / ED25519 EXPOSURE",
  "34 SHA-256 HASH CHAINS (RFC 8554 LM-OTS)",
  "1,124-BYTE SHA-256 SIGNATURE VERIFIER",
  "HOT WALLET DEPOSITS IN · SHA-256 SIGNATURES WITHDRAW OUT",
  "WALLET KEY: PAYS FEES, CAN’T WITHDRAW",
  "ONE KEY, ONE MESSAGE, ZERO REPLAY",
  "CONFIGURABLE TIMELOCK AIRLOCK",
  "LIVE ON SOLANA MAINNET",
];

const works: { label: string; media: React.ReactNode; title: string; body: string; cream?: boolean }[] = [
  {
    label: "ONE-TIME KEY",
    media: <Clip name="key-turns-to-ash" />,
    title: "Every key works once.",
    body: "Use it to authorize a payout and it burns on-chain. The next generation key is already committed.",
  },
  {
    label: "SIGNED WITHDRAWAL",
    media: <Card name="signed-withdrawal-form" />,
    title: "The key signs the whole withdrawal.",
    body: "Which coin, how much, where to. Change one digit and the 1,124-byte SHA-256 signature fails.",
    cream: true,
  },
  {
    label: "34 HASH CHAINS",
    media: <Card name="34-chain-ring" />,
    title: "A key is 34 chains of hashes.",
    body: "One-time signatures specified in RFC 8554 (LM-OTS). Security rests on SHA-256 preimage resistance alone.",
  },
  {
    label: "TRUSTED ADDRESSES",
    media: <Card name="trusted-addresses" />,
    title: "Up to four cold wallets of your own.",
    body: "Pick your hardware wallets when you deploy the Quantum Safe. Withdrawals to them arrive instantly.",
  },
  {
    label: "WAITING PERIOD",
    media: <Card name="waiting-period-timer" />,
    title: "Everything else waits.",
    body: "Choose up to seven days (24h default). While the clock runs, your Stop File cancels any unauthorized pull.",
  },
];

const gates: [string, string, string, string?][] = [
  [
    "Public source and tests",
    "Everything that holds or moves your capital is open source, with full LM-OTS test vectors.",
    "Open",
  ],
  [
    "Deployment you can verify",
    "The program on Solana mainnet matches the published source byte for byte, with upgrade authority renounced.",
    "Done",
  ],
  [
    "Mainnet Custody",
    "Real Quantum Safe vaults holding real SOL & SPL tokens on Solana mainnet.",
    "Live",
  ],
  [
    "Browser Extension (Quantum Watch)",
    "Read-only Chrome & Brave extension for 24/7 vault telemetry and instant timelock breach alerts. Launching in the next few days.",
    "In Days",
    "/watch",
  ],
  [
    "RFC 8554 Test Vectors",
    "Deterministic 34-chain LM-OTS SHA-256 verification suite with zero curve dependencies.",
    "Verified",
    "/docs",
  ],
];

const faq: [string, React.ReactNode][] = [
  [
    "Is Quantum Safe a wallet?",
    <>
      No. You keep the everyday hot wallet you already use to trade and interact with dApps. Quantum Safe
      is a separate post-quantum vault on Solana where you sweep your capital. Your hot wallet pays network
      fees; its Ed25519 signature cannot authorize a withdrawal from your Quantum Safe.
    </>,
  ],
  [
    "Why SHA-256 hash chains instead of standard wallet keys?",
    <>
      Standard Solana and Ethereum wallets rely on elliptic-curve signatures (Ed25519 / ECDSA), which
      expose a static public key and are vulnerable both to phishing drainers today and Shor’s quantum
      algorithm tomorrow. Quantum Safe uses RFC 8554 Leighton-Micali One-Time Signatures (LM-OTS) built
      purely from 34 parallel SHA-256 hash chains.
    </>,
  ],
  [
    "I already use a hardware wallet. Why would I need this?",
    <>
      A hardware wallet keeps your private key off your computer, but it still signs whatever transaction
      you approve—including a disguised drainer payload. Quantum Safe separates deposits from withdrawals
      using one-time SHA-256 hash chains, and your hardware wallet acts as the ideal instant-payout
      trusted destination.
    </>,
  ],
  [
    "What if someone steals my Day Key?",
    <>
      When you initialize a Quantum Safe you list up to four trusted addresses and a waiting period (24 hours
      by default) for everything else. A thief with your Day Key can only send instantly to your own
      trusted addresses. Any withdrawal to an unknown address enters the 24-hour public countdown—giving
      you time to upload your Stop File and cancel it immediately.
    </>,
  ],
  [
    "What happens if I lose my recovery kit or its password?",
    <>
      Your Day Key keeps working, so nothing is lost that day. However, the offline Recovery Kit is the
      only thing that can rotate a lost or stolen Day Key. Nobody can reset it for you—store the recovery
      kit offline.
    </>,
  ],
  [
    "What if this website goes away?",
    <>
      Your vault lives on the Solana blockchain with renounced upgrade authority and zero admin keys.
      Both the offline recovery tool and the single-file Node.js CLI (<code>qsafe-cli.mjs</code>) run
      locally against any Solana RPC without needing this website.
    </>,
  ],
];

export default function Home() {
  const { coinAddress } = getLaunch();
  return (
    <>
      <QuantumLaunchIntro ca={coinAddress ?? undefined} />
      <Header />
      <main className="descent">
        <section className="hero qs-champions-hero">
          <ChampionsStarballCanvas />
          <span className="halftone" />
          <div className="hero-shade qs-hero-shade" />
          <div className="hero-content qs-hero-content">
            <div className="qs-hero-crest-row">
              <div className="hero-chips">
                <span className="bm-chip qs-chip-gold">
                  <Cpu size={13} style={{ display: "inline", marginRight: 6, verticalAlign: "-2px" }} />
                  POST-QUANTUM SHA-256 PROTOCOL
                </span>
                <span className="bm-chip qs-chip-yolo">
                  <Shield size={13} style={{ display: "inline", marginRight: 5, verticalAlign: "-2px" }} />
                  RFC 8554 LM-OTS
                </span>
                <Link
                  href="/watch"
                  className="bm-chip qs-chip-gold"
                  style={{
                    textDecoration: "none",
                    borderColor: "rgba(169, 222, 255, 0.48)",
                    color: "#e8f6ff",
                  }}
                >
                  ◈ BROWSER EXTENSION · COMING IN DAYS →
                </Link>
              </div>
            </div>
            <h1 className="qs-hero-title">
              Trade at full speed.{" "}
              <br />
              Lock your capital in{" "}
              <br />
              <em>Quantum Safe.</em>
            </h1>
            <p className="qs-hero-sub">
              <strong>Quantum Safe</strong> is a post-quantum one-way custody vault on Solana.
              Sweep your assets in from any hot wallet. Your wallet key can’t open it—only a
              34-chain SHA-256 one-time signature can. One bad click never compromises your vault.
            </p>
            <div className="actions">
              <Link href="/vault" className="button light qs-gold-cta">
                <Shield size={15} />
                Initialize Vault
              </Link>
              <Link href="#arena" className="button ghost">
                <Play size={15} fill="currentColor" />
                Breach Stress-Test
              </Link>
              <a
                href={X_URL}
                target="_blank"
                rel="noreferrer"
                className="button ghost"
              >
                𝕏 @TheQuantumSafe ↗
              </a>
            </div>
            <div className="hero-more">
              <div className="hero-note qs-hero-note">
                <BIcon name="qsafe-key" size={15} />
                Hot wallet deposits in. 34-Chain SHA-256 LM-OTS key withdraws out.
              </div>
            </div>
            {coinAddress ? (
              <div className="ca-line qs-ca-line">
                <span className="ca-label">OFFICIAL CA</span>
                <span className="ca-address">{coinAddress}</span>
              </div>
            ) : (
              <div className="ca-line qs-ca-line" aria-label="Contract address">
                <span className="ca-label">QUANTUM SAFE</span>
                <span className="ca-typed" aria-hidden="true">
                  PROGRAM: DGXACBwbUqRKRVR1TQojZBoRuV2TZJ8wVnQSuLKm2nJJ
                </span>
              </div>
            )}
          </div>
        </section>

        <div className="bm-ticker qs-ticker" aria-hidden="true">
          <span className="bm-ticker__track">
            {[0, 1].map((half) => (
              <span key={half}>
                {ticker.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </span>
            ))}
          </span>
        </div>

        <section className="principles qs-principles">
          <span>
            <BIcon name="everyday-wallet" />A bad click can’t empty your vault
          </span>
          <span>
            <BIcon name="recovery-kit" />
            Stolen seed phrase = 0 vault access
          </span>
          <span>
            <BIcon name="lock-changed" />
            Every SHA-256 key works only once
          </span>
          <Link href="#limits">
            Where the protection stops
            <MoveUpRight size={16} />
          </Link>
        </section>

        <section className="section film-section" id="arena">
          <div className="eyebrow">
            <b>00 / CYBERNETIC STRESS TEST</b>LIVE BREACH & DRAINER SIMULATION
          </div>
          <div className="split-title">
            <h2>
              Move fast on-chain.
              <br />
              Seal profits in SHA-256.
            </h2>
            <p>
              Test the Quantum Safe architecture live: realize profit in your active hot wallet, sweep
              capital into the Quantum Safe airlock, and trigger a simulated wallet drainer.
            </p>
          </div>
          <StackPaperSimulator />
        </section>

        <section className="intro section" id="how">
          <div className="eyebrow">
            <b>01 / SURFACE</b>SAME MISTAKE. TWO ENDINGS.
          </div>
          <div className="split-title">
            <h2>
              One bad signature.
              <br />
              Who keeps their capital?
            </h2>
            <p>
              Everyone clicks the wrong link eventually. Watch what happens to your assets with Quantum
              Safe versus an ordinary hot wallet.
            </p>
          </div>
          <Story />
          <div className="way-in">
            <h3>Three steps to Post-Quantum Custody.</h3>
            <ol>
              <li>
                <Link href="/check">
                  <span className="way-num">1</span>
                  <BIcon name="everyday-wallet" size={34} />
                  <b>Scan Exposure</b>
                  <span>See how much SOL & tokens one bad click could drain from your wallet right now.</span>
                  <em>Check my wallet</em>
                </Link>
              </li>
              <li>
                <Link href="/demo">
                  <span className="way-num">2</span>
                  <BIcon name="simulation" size={34} />
                  <b>Sign the Fake Airdrop</b>
                  <span>Get drained on purpose with play money. Watch the drainer bounce off Quantum Safe.</span>
                  <em>Run the drainer demo</em>
                </Link>
              </li>
              <li>
                <Link href="/recovery">
                  <span className="way-num">3</span>
                  <BIcon name="vault" size={34} />
                  <b>Initialize Your Vault</b>
                  <span>Generate your offline 34-chain SHA-256 keys and deploy your Quantum Safe.</span>
                  <em>Build my Quantum Safe</em>
                </Link>
              </li>
            </ol>
          </div>
        </section>

        <section className="check-teaser section surface" data-level="01">
          <Clip name="porch-lights-walkway" className="backdrop" />
          <span className="halftone" />
          <div>
            <div className="eyebrow">
              <b>01 / SURFACE</b>WALLET EXPOSURE SCANNER
            </div>
            <h2>
              How exposed is your
              <br />
              active wallet?
            </h2>
            <p>
              Paste any Solana address. Instantly inspect every token balance and open delegate approval
              that a single malicious signature could sweep.
            </p>
          </div>
          <form className="check-form" action="/check" method="get">
            <label className="field">
              <span>Solana wallet address</span>
              <input
                name="a"
                required
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                placeholder="Paste a Solana wallet address"
              />
            </label>
            <button className="button light qs-gold-cta">Scan wallet</button>
            <span className="micro">
              Read-only. Public chain data. Zero wallet connection required.
            </span>
          </form>
        </section>

        <Plate
          tall
          clip="wallet-at-vault-door"
          level="02 / THRESHOLD"
          line="Your hot wallet key stops at the vault airlock."
        />

        <section className="demo-teaser section" data-level="02">
          <div>
            <div className="eyebrow">
              <b>02 / THRESHOLD</b>60-SECOND SIMULATION
            </div>
            <h2>
              Sign the fake claim.
              <br />
              Keep 100% of your vault.
            </h2>
            <p>
              Sweep your balance into Quantum Safe, approve a ruthless wallet drainer, and watch why
              Ed25519 wallet signatures have zero power over your vaulted assets.
            </p>
            <Link className="button light qs-gold-cta" href="/demo">
              <Play size={15} />
              Launch Interactive Demo
            </Link>
            <span className="micro">
              No wallet connection. Instant simulation.
            </span>
          </div>
          <div className="flow-preview">
            <div className="flow-top">
              <span className="mono">SIMULATION / AFTER THE DRAIN</span>
              <LockKeyhole size={18} />
            </div>
            <div className="flow-row drained-row">
              <span className="asset-logo">≋</span>
              <div>
                <strong>Active Hot Wallet</strong>
                <span>Signed a drainer’s transaction</span>
              </div>
              <span className="mono">EMPTIED</span>
            </div>
            <div className="flow-line">
              <span />
              <span className="mono">WALLET KEY STOPS HERE</span>
              <span />
            </div>
            <div className="flow-row qsafe-row">
              <BIcon name="vault" size={26} />
              <div>
                <strong>Your Quantum Safe</strong>
                <span>Requires 1,124-byte SHA-256 LM-OTS signature</span>
              </div>
              <Check size={20} />
            </div>
            <div className="flow-bottom">
              Cryptographic separation enforced by the immutable on-chain SHA-256 verifier.
            </div>
          </div>
        </section>

        <section className="section valve">
          <div>
            <div className="eyebrow">
              <b>02 / THRESHOLD</b>ONE-WAY CRYPTOGRAPHIC VALVE
            </div>
            <h2>
              Trade from a hot wallet.
              <br />
              Custody in Quantum Safe.
            </h2>
            <p>
              An active trading wallet has to be fast, which makes it exposed. Sweep every win into your
              Quantum Safe address. Anything goes in from any terminal or exchange; nothing comes out
              with that wallet’s key.
            </p>
            <Link className="button ghost" href="/integrate">
              Quantum Safe beside a trading terminal
              <MoveUpRight size={15} />
            </Link>
          </div>
          <div className="valve-diagram" aria-hidden="true">
            <div className="valve-node hot">
              <span className="mono">ACTIVE TRADING WALLET</span>
              <strong>Fast Ed25519 key. Exposed.</strong>
            </div>
            <div className="valve-pipe">
              <span className="pipe in">
                <i />
                IN · SWEEP CAPITAL ANYTIME
              </span>
              <span className="pipe out">
                <X size={12} />
                OUT · BLOCKED FOR WALLET KEY
              </span>
            </div>
            <div className="valve-node cold">
              <span className="mono">QUANTUM SAFE</span>
              <strong>34-Chain SHA-256 Lock.</strong>
            </div>
          </div>
        </section>

        <Plate
          clip="key-being-cut"
          level="03 / INSIDE"
          line="Past this point, the hash chains are yours."
        />

        <section className="section role" data-level="03">
          <div className="eyebrow">
            <b>03 / INSIDE</b>WHAT YOU HOLD
          </div>
          <div className="split-title">
            <h2>
              Four pieces.
              <br />
              100% self-custodied.
            </h2>
            <p>
              Nobody at Quantum Safe holds a copy, and there is no admin backdoor.
            </p>
          </div>
          <ol className="hold-grid">
            <li>
              <div className="hold-pic wallet" aria-hidden="true">
                <span className="p-wallet" />
                <span className="p-coin a" />
                <span className="p-coin b" />
                <span className="p-reach" />
              </div>
              <h3>Your hot wallet</h3>
              <strong>For trading & gas.</strong>
              <p>Keep your active trading size here. Sweep the rest.</p>
            </li>
            <li>
              <div className="hold-pic key" aria-hidden="true">
                <span className="p-door" />
                <span className="p-key" />
                <span className="p-coin out" />
              </div>
              <h3>Your day key</h3>
              <strong>Opens the vault.</strong>
              <p>Instant to your 4 cold wallets. 24-hour timelock to anywhere else.</p>
            </li>
            <li>
              <div className="hold-pic stop" aria-hidden="true">
                <span className="p-ring" />
                <span className="p-stop">STOP</span>
              </div>
              <h3>Your stop button</h3>
              <strong>Kills unauthorized pulls.</strong>
              <p>One lightweight file. Cancels any pending withdrawal and burns the compromised key.</p>
            </li>
            <li>
              <div className="hold-pic kit" aria-hidden="true">
                <span className="p-drawer" />
                <span className="p-box" />
              </div>
              <h3>Your recovery kit</h3>
              <strong>Mints fresh keys offline.</strong>
              <p>Keep it air-gapped. Never uploaded to any website.</p>
            </li>
          </ol>
        </section>

        <section className="section works" id="works">
          <div className="eyebrow">
            <b>03 / INSIDE</b>HOW THE CRYPTOGRAPHY WORKS
          </div>
          <div className="split-title">
            <h2>
              Five battle-tested primitives.
              <br />
              Pure SHA-256 security.
            </h2>
            <p>
              No experimental curves. Interactive live breakdown of the on-chain verification engine:
            </p>
          </div>
          <ol className="works-grid">
            {works.map((w) => (
              <li key={w.label} className={`bm-panel ${w.cream ? "cream" : ""}`}>
                <div className="bm-panel__head">{w.label}</div>
                <div className="works-media">{w.media}</div>
                <h3>{w.title}</h3>
                <p>{w.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="section limits weather" id="limits">
          <Clip name="padlocks-falling" className="backdrop" />
          <span className="halftone" />
          <div className="eyebrow">
            <b>03 / INSIDE</b>HONEST ABOUT THE EDGES
          </div>
          <h2>
            What it stops.
            <br />
            What it can’t.
          </h2>
          <div className="limits-grid">
            <div>
              <h3>Built to stop</h3>
              <ul>
                {stops.map(([lead, rest]) => (
                  <li key={lead}>
                    <Check size={16} className="ice" />
                    <span>
                      <b>{lead}</b> {rest}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3>Does not stop</h3>
              <ul>
                {limits.map(([lead, rest]) => (
                  <li key={lead}>
                    <X size={16} />
                    <span>
                      <b>{lead}</b> {rest}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="limits-note">
            Every boundary of the on-chain SHA-256 verifier is documented in the open specification.{" "}
            <Link href="/security">Read every security boundary.</Link>
          </p>
        </section>

        <section className="section qs-home-vision" id="vision" data-level="04">
          <div className="eyebrow">
            <b>04 / VISION &amp; ROADMAP</b>THE POST-ELLIPTIC ERA · 6 STAGES OF BUILDING
          </div>
          <div className="split-title">
            <h2>
              Built for today’s drainers.
              <br />
              Engineered for the quantum future.
            </h2>
            <p>
              Standard wallets rely on elliptic curves (Ed25519 / ECDSA) that expose public keys
              on-chain and collapse on a single phished signature. Our vision is to decouple
              high-speed trading from sovereign settlement through six verifiable stages of
              engineering.
            </p>
          </div>

          <div className="qs-vision-grid">
            <article className="qs-vision-card">
              <div className="qs-vision-card-top">
                <span className="mono">THESIS I · TODAY’S REALITY</span>
                <Shield size={18} className="ice" />
              </div>
              <h3>The One-Way Cryptographic Airlock</h3>
              <p>
                Trading requires speed; custody requires finality. By separating your active
                Ed25519 hot wallet from your 34-chain SHA-256 vault, you can trade aggressively on
                any terminal and sweep profits into an airlock your wallet key can never open.
              </p>
            </article>
            <article className="qs-vision-card">
              <div className="qs-vision-card-top">
                <span className="mono">THESIS II · QUANTUM HORIZON</span>
                <Cpu size={18} className="ice" />
              </div>
              <h3>Shor’s Algorithm vs. Pure SHA-256</h3>
              <p>
                Fault-tolerant quantum computers will derive private keys from exposed elliptic-curve
                public keys. Quantum Safe eliminates curves from vault authority—anchoring security
                strictly in RFC 8554 Leighton-Micali One-Time Signatures (LM-OTS) with 256-bit
                SHA-256 preimage resistance.
              </p>
            </article>
            <article className="qs-vision-card">
              <div className="qs-vision-card-top">
                <span className="mono">THESIS III · THE FUTURE</span>
                <LockKeyhole size={18} className="ice" />
              </div>
              <h3>Autonomous Terminal &amp; Hardware Rails</h3>
              <p>
                From automated post-trade profit sweeping in Solana trading terminals and AI agent
                treasuries to stateless optical-QR SHA-256 hardware signers, Quantum Safe is
                building the permanent settlement standard for Solana.
              </p>
            </article>
          </div>

          <div className="qs-home-stages-head">
            <div>
              <span className="qs-badge-gold">ARCHITECTURE PIPELINE</span>
              <h3>Six Stages of Building — Gates, Not Dates</h3>
            </div>
            <Link className="button ghost compact" href="/roadmap">
              Explore Full Vision &amp; Roadmap
              <MoveUpRight size={14} />
            </Link>
          </div>

          <ol className="qs-home-stages-grid">
            <li className="qs-home-stage-card done">
              <div className="qs-home-stage-top">
                <span className="mono">STAGE 01</span>
                <span className="qs-badge-live">COMPLETE · VERIFIED</span>
              </div>
              <h4>RFC 8554 LM-OTS SHA-256 Core</h4>
              <p>
                Pure Rust &amp; TypeScript 34-chain SHA-256 signing engine (`LM-OTS_SHA256_N32_W8`),
                1,124-byte verifier, and deterministic test vectors with zero curve dependencies.
              </p>
              <Link href="/docs" className="qs-stage-link">
                Inspect RFC 8554 Spec →
              </Link>
            </li>

            <li className="qs-home-stage-card done">
              <div className="qs-home-stage-top">
                <span className="mono">STAGE 02</span>
                <span className="qs-badge-live">MAINNET LIVE</span>
              </div>
              <h4>Immutable Solana Airlock PDA</h4>
              <p>
                Mainnet program deployed with upgrade authority renounced. One-way deposit valve, 4
                instant cold-wallet pockets, 24h timelock airlock, and 1-click Stop File cancel.
              </p>
              <Link href="/verify" className="qs-stage-link">
                Verify Mainnet Bytecode →
              </Link>
            </li>

            <li className="qs-home-stage-card done">
              <div className="qs-home-stage-top">
                <span className="mono">STAGE 03</span>
                <span className="qs-badge-live">COMPLETE · LIVE</span>
              </div>
              <h4>Air-Gapped Recovery Kit &amp; CLI</h4>
              <p>
                Browser-offline `scrypt` + `AES-256-GCM` Recovery Kit generator, standalone Node.js
                CLI (`qsafe-cli.mjs`), and read-only Wallet Exposure Scanner.
              </p>
              <Link href="/recovery" className="qs-stage-link">
                Open Offline Keygen →
              </Link>
            </li>

            <li className="qs-home-stage-card active">
              <div className="qs-home-stage-top">
                <span className="mono">STAGE 04</span>
                <span className="qs-badge-live">LAUNCHING IN DAYS</span>
              </div>
              <h4>Quantum Watch Browser Extension</h4>
              <p>
                Chrome &amp; Brave browser extension rolling out in the next few days. Watches vault
                PDAs 24/7 with zero private keys and fires instant desktop alerts the second a
                24-hour withdrawal countdown begins.
              </p>
              <Link href="/watch" className="qs-stage-link">
                Preview Extension &amp; Telemetry →
              </Link>
            </li>

            <li className="qs-home-stage-card active">
              <div className="qs-home-stage-top">
                <span className="mono">STAGE 05</span>
                <span className="qs-badge-gold">IN DEVELOPMENT</span>
              </div>
              <h4>Terminal &amp; Bot Auto-Sweep SDK</h4>
              <p>
                Direct CPI hooks and 1-click profit-sweep adapters for Solana trading terminals, DEX
                aggregators, sniper bots, and autonomous AI agent treasuries.
              </p>
              <Link href="/integrate" className="qs-stage-link">
                Explore Terminal Hooks →
              </Link>
            </li>

            <li className="qs-home-stage-card future">
              <div className="qs-home-stage-top">
                <span className="mono">STAGE 06</span>
                <span className="qs-badge-gold">FUTURE HORIZON</span>
              </div>
              <h4>Dedicated SHA-256 Hardware Signer</h4>
              <p>
                Open-hardware specification and standalone Rust firmware for an air-gapped optical
                QR / USB-C LM-OTS keycard + RFC 8554 HSS multi-tree institutional vaults.
              </p>
              <Link href="/roadmap#future" className="qs-stage-link">
                View Hardware Horizon →
              </Link>
            </li>
          </ol>

          <div
            className="qs-extension-spotlight"
            style={{
              marginTop: "28px",
              padding: "clamp(20px, 3.5vw, 32px)",
              borderRadius: "16px",
              border: "1px solid rgba(169, 222, 255, 0.32)",
              background:
                "radial-gradient(circle at 90% 10%, rgba(169, 222, 255, 0.14), rgba(11, 16, 22, 0.96) 65%)",
              boxShadow: "0 20px 48px rgba(0, 0, 0, 0.48), inset 0 1px 0 rgba(255, 255, 255, 0.12)",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "24px",
            }}
          >
            <div style={{ flex: "1 1 480px", maxWidth: "740px" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "5px 12px",
                  borderRadius: "999px",
                  background: "rgba(169, 222, 255, 0.12)",
                  border: "1px solid rgba(169, 222, 255, 0.36)",
                  color: "#d8f0ff",
                  fontSize: "10.5px",
                  fontFamily: "var(--font-mono), monospace",
                  letterSpacing: "0.14em",
                  marginBottom: "14px",
                }}
              >
                <span
                  style={{
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    background: "#a9deff",
                    boxShadow: "0 0 10px #a9deff",
                  }}
                />
                NEXT RELEASE · DROPPING IN THE NEXT FEW DAYS
              </div>
              <h3
                style={{
                  fontSize: "clamp(22px, 3.2vw, 30px)",
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  color: "#ffffff",
                  margin: "0 0 10px",
                }}
              >
                Quantum Safe Watch — Chrome &amp; Brave Browser Extension
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: "14.5px",
                  lineHeight: 1.65,
                  color: "#b4c5d4",
                }}
              >
                Launching publicly in the next few days: a zero-key, read-only browser extension that
                pins your Quantum Safe vaults directly to your browser toolbar. Get instant desktop
                alerts the second a 24-hour withdrawal countdown begins, inspect any hot wallet’s
                live drainer exposure in one click, and trigger emergency Stop File protection—all
                without ever exposing a private key.
              </p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
              <Link href="/watch" className="button light qs-gold-cta">
                Preview Extension &amp; States
                <MoveUpRight size={15} />
              </Link>
              <Link href="/roadmap" className="button ghost">
                Full Release Roadmap
              </Link>
            </div>
          </div>
        </section>

        <section className="truth section" id="road" data-level="05">
          <div className="eyebrow">
            <b>05 / FOUNDATIONS</b>VERIFIED &amp; IMMUTABLE
          </div>
          <h2>
            Code you can verify.
            <br />
            Upgrade authority renounced.
          </h2>
          <div className="truth-grid">
            <div>
              <p>
                Quantum Safe runs against the deterministic, immutable on-chain SHA-256 custody
                program on Solana mainnet. Zero admin keys, zero protocol fees, and full CLI independence.
              </p>
              <div className="actions road-actions">
                <a
                  className="button light qs-gold-cta"
                  href={X_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  Follow @TheQuantumSafe on 𝕏
                </a>
                <a
                  className="button ghost"
                  href={REPO}
                  target="_blank"
                  rel="noreferrer"
                >
                  View GitHub Repository
                </a>
                <Link className="button ghost" href="/verify">
                  Inspect Mainnet Program
                </Link>
              </div>
            </div>
            <ol className="road-list">
              {gates.map(([title, body, state, href], i) => (
                <li key={title}>
                  <span className="mono">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <strong>{href ? <Link href={href}>{title}</Link> : title}</strong>
                    <span>{body}</span>
                  </div>
                  <b>{state}</b>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section faq">
          <div className="eyebrow">
            <b>04 / FOUNDATIONS</b>QUESTIONS
          </div>
          <h2>Before you deploy.</h2>
          <div className="faq-list">
            {faq.map(([q, a]) => (
              <details key={q}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="closing section room">
          <Clip name="city-going-under" className="backdrop" />
          <span className="halftone" />
          <span className="eyebrow">POST-QUANTUM CUSTODY · RFC 8554 LM-OTS</span>
          <h2>Seal your vault.</h2>
          <div className="actions">
            <Link href="/vault" className="button light qs-gold-cta">
              Launch Quantum Safe
            </Link>
            <a
              href={X_URL}
              target="_blank"
              rel="noreferrer"
              className="button ghost"
            >
              𝕏 @TheQuantumSafe ↗
            </a>
            <Link href="/demo" className="button ghost">
              Run the Drainer Demo
            </Link>
          </div>
        </section>
      </main>
      <nav className="mobile-dock" aria-label="Quick actions">
        <Link href="/check">Scan Wallet</Link>
        <Link href="/vault">Launch Vault</Link>
      </nav>
      <Footer />
    </>
  );
}
