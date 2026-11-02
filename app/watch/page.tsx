import type { Metadata } from "next";
import Link from "next/link";
import { DocumentLayout } from "@/components/qsafe/document-layout";
import ExtensionBuild from "@/components/qsafe/extension-build";
import store from "@/extension/store.json";

const storeUrl = store.chromeWebStoreItemId
  ? `https://chromewebstore.google.com/detail/qsafe-watch/${store.chromeWebStoreItemId}`
  : null;

export const metadata: Metadata = {
  title: "Quantum Safe Watch",
  description:
    "A browser extension that shows a desktop alert when a withdrawal is announced from your Quantum Safe. Read-only: holds no keys.",
};

const shots: {
  id: string;
  badge: string;
  heading: string;
  detail: string;
  statusColor: string;
  caption: string;
}[] = [
  {
    id: "1-all-quiet",
    badge: "STATE 01 · NOMINAL TELEMETRY",
    heading: "All quiet · 2 Quantum Safes watched",
    detail: "VAULT_01: 142.50 SOL · No pending withdrawal · Last read 12s ago",
    statusColor: "#a9deff",
    caption: "All quiet. Each Quantum Safe you watch, its balance, and when it was last read.",
  },
  {
    id: "2-withdrawal-announced",
    badge: "STATE 02 · TIMELOCK ALERT",
    heading: "Withdrawal announced · 23h 58m remaining",
    detail: "AMOUNT: 100.00 SOL → Unknown destination · Action: Upload Stop-File",
    statusColor: "#f39687",
    caption: "A withdrawal was announced. The amount, the full destination, and the time left to cancel it.",
  },
  {
    id: "3-check-a-wallet",
    badge: "STATE 03 · EXPOSURE SCANNER",
    heading: "Active Wallet Inspection",
    detail: "SOL Balance + Token Accounts + 2 Open Delegate Approvals Detected",
    statusColor: "#c8d8e4",
    caption: "Check any wallet: what one signature could move, and who can already move it.",
  },
  {
    id: "4-read-only",
    badge: "STATE 04 · ZERO-KEY ISOLATION",
    heading: "Read-only · Keys held: NONE",
    detail: "RPC Endpoint: https://api.mainnet-beta.solana.com · Polling: 60s",
    statusColor: "#a9deff",
    caption: "Settings. It holds no keys and talks to one Solana RPC endpoint.",
  },
];

export default function Watch() {
  return (
    <DocumentLayout
      eyebrow="QUANTUM SAFE WATCH · CHROME & BRAVE EXTENSION · LAUNCHING IN DAYS"
      title="Know the second a withdrawal is announced."
      description="Our read-only Chrome & Brave browser extension is rolling out publicly in the next few days. It watches your Quantum Safe 24/7 from your browser toolbar and alerts you the instant anything changes—while holding zero private keys."
    >
      <div
        className="document-callout"
        style={{
          border: "1px solid rgba(169, 222, 255, 0.38)",
          background:
            "radial-gradient(circle at 90% 10%, rgba(169, 222, 255, 0.14), rgba(10, 15, 20, 0.96) 70%)",
          marginBottom: "24px",
        }}
      >
        <div
          className="mono"
          style={{
            fontSize: "11px",
            letterSpacing: "0.14em",
            color: "#a9deff",
            marginBottom: "8px",
          }}
        >
          ◈ RELEASE STATUS · LAUNCHING IN THE NEXT FEW DAYS
        </div>
        <h2>Chrome &amp; Brave Web Store Rollout in Days · Developer Preview Live</h2>
        <p>
          The packaged 1-click Chrome &amp; Brave Browser Extension is in final release staging and
          launches in the next few days. Ahead of the store listing, you can inspect all four live
          telemetry states below, verify the deterministic SHA-256 build manifest, or load the
          unpacked extension directly from our reproducible build right now.
        </p>
      </div>
      <div className="document-callout">
        <h2>Read-only. Holds no keys.</h2>
        <p>
          Quantum Safe Watch never sees a day key, a recovery kit or a password,
          and it has no way to send a transaction. Quantum Safe never asks for
          your recovery kit or its password, here or anywhere else.
        </p>
      </div>
      {storeUrl && (
        <section id="install">
          <h2>Install it</h2>
          <p>
            <a className="button light" href={storeUrl} target="_blank" rel="noreferrer">
              Add to Chrome
            </a>
          </p>
          <p>
            This is the only official listing. Its item ID is{" "}
            <code>{store.chromeWebStoreItemId}</code>; check that it is in the address bar before you install.
          </p>
        </section>
      )}
      <section>
        <h2>Extension Telemetry States</h2>
        <ul className="watch-shots">
          {shots.map((s) => (
            <li key={s.id}>
              <figure>
                <div
                  style={{
                    background: "linear-gradient(180deg, #0c1218 0%, #070a0d 100%)",
                    border: "1px solid rgba(200, 216, 228, 0.2)",
                    borderRadius: "10px",
                    padding: "20px",
                    marginBottom: "10px",
                  }}
                >
                  <div
                    className="mono"
                    style={{
                      fontSize: "10px",
                      letterSpacing: "0.14em",
                      color: s.statusColor,
                      marginBottom: "8px",
                    }}
                  >
                    {s.badge}
                  </div>
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "#f4f8fb",
                      marginBottom: "8px",
                    }}
                  >
                    {s.heading}
                  </div>
                  <div
                    className="mono"
                    style={{
                      fontSize: "12px",
                      color: "#9cb0c0",
                      background: "#05080b",
                      padding: "10px 12px",
                      borderRadius: "6px",
                      border: "1px solid rgba(200, 216, 228, 0.12)",
                    }}
                  >
                    {s.detail}
                  </div>
                </div>
                <figcaption>{s.caption}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2>What it does</h2>
        <ul>
          <li>
            You paste the address of a Quantum Safe. It checks that the address is
            a Quantum Safe of the published program, and watches up to five.
          </li>
          <li>
            Once a minute it reads each one and compares it with what it saw
            the minute before.
          </li>
          <li>
            When a withdrawal is announced you get a desktop notification, the
            toolbar badge shows the hours left, and the popup shows the
            amount, where it is going, whether that is one of your trusted
            addresses, and a countdown.
          </li>
          <li>
            It also tells you when SOL arrives, when a withdrawal leaves, and
            when a Quantum Safe’s keys are replaced.
          </li>
          <li>
            It can run the same <Link href="/check">wallet check</Link> as
            this site, for any address.
          </li>
        </ul>
      </section>
      <section>
        <h2>Why it matters</h2>
        <p>
          A withdrawal to an address you did not list as trusted waits before
          it can leave, and you can cancel it while it waits. That only helps
          if you find out in time. Quantum Safe Watch does the finding out on your
          own computer, with no server of ours in between.
        </p>
        <p>
          If an alert is not you, the extension does not act. It sends you to{" "}
          <Link href="/emergency">what to do now</Link>, where your cancel
          file or your recovery kit stops the withdrawal.
        </p>
      </section>
      <section>
        <h2>What it does not do</h2>
        <ul>
          <li>It does not withdraw, deposit, cancel or recover. Those stay on this site, the offline tool and the command-line client.</li>
          <li>It runs only while your browser is running. A closed laptop sees nothing until it is opened again.</li>
          <li>Alerts are best effort and can be late or missing. Silence is not proof that nothing happened. If it cannot read the network for five minutes, its badge shows “!” and it tells you once.</li>
          <li>It believes its RPC endpoint. An endpoint that lies can show it anything.</li>
          <li>It reports SOL arriving, not token deposits.</li>
          <li>It protects nothing by itself. Quantum Safe protects the withdrawal path, not the chain, and this only tells you what happened on that path.</li>
        </ul>
      </section>
      <section>
        <h2>What it is allowed to do in your browser</h2>
        <ul>
          <li>Remember the addresses you watch and their last public state.</li>
          <li>Wake up once a minute.</li>
          <li>Show notifications.</li>
          <li>
            Talk to one Solana RPC endpoint: the public mainnet one, or one you
            set, which your browser asks you to allow.
          </li>
        </ul>
        <p>
          It cannot read or change any web page, and it loads no code from
          the network. An endpoint that is not Solana mainnet is refused.
        </p>
      </section>
      <section id="build">
        <h2>The build this site serves</h2>
        <ExtensionBuild />
        <p>
          The zip is built from the <a href="https://github.com/VictorChaoss/QuantumSafe/tree/main/extension">public source</a>{" "}
          and comes out the same, byte for byte, on any machine:{" "}
          <code>npm ci && npm run extension:build</code>, then compare the
          SHA-256. A store repackages what it is given, so an installed copy
          is checked file by file: each file’s own hash is in{" "}
          <a href="/source/extension-manifest.json">extension-manifest.json</a>.
          Fake extensions with this name will appear. The real one matches
          these hashes, and it never asks for a key.
        </p>
      </section>
      <section>
        <h2>Load it by hand</h2>
        <ol>
          <li>Download the zip above and unzip it into a folder you will keep.</li>
          <li>
            Open <code>chrome://extensions</code> in Chrome or another
            Chromium browser and turn on Developer mode.
          </li>
          <li>Choose “Load unpacked” and pick that folder.</li>
          <li>Open Quantum Safe Watch from the toolbar and paste your Quantum Safe’s address.</li>
        </ol>
        <p>
          A hand-loaded extension does not update itself. Check this page for
          a new version, and compare the hash each time.
        </p>
      </section>
    </DocumentLayout>
  );
}
