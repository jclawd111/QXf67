import Link from "next/link";
import { DocumentLayout } from "@/components/qsafe/document-layout";
export const metadata = {
  title: "Quantum Safe Mode for trading",
  description:
    "Trade from a hot wallet, keep the rest in a Quantum Safe. How a Quantum Safe sits beside a trading terminal, and what terminal and wallet developers need to support it.",
};
export default function Page() {
  return (
    <DocumentLayout
      eyebrow="QSAFE MODE"
      title="Trade from a wallet. Keep it in a Quantum Safe."
      description="A trading wallet has to be fast, so its key lives somewhere exposed. A Quantum Safe is where the money goes when it is no longer in play."
    >
      <div className="document-callout">
        <h2>Live on Solana Mainnet.</h2>
        <p>
          This page describes how Quantum Safe sits beside a trading setup. The
          program is live and immutable on Solana mainnet. Send
          assets only to a Quantum Safe you built yourself, never to an address
          someone gives you.
        </p>
      </div>
      <section>
        <h2>The idea: a one-way valve</h2>
        <p>
          Trading terminals, bots and browser wallets hold keys that sign
          quickly and often. That is what makes them useful and what makes
          them the wallets that get drained. A Quantum Safe is a second place with a
          different rule: anything can be sent <em>in</em> by any wallet, and
          nothing comes <em>out</em> without the Quantum Safe key, which the trading
          wallet never has.
        </p>
        <p>
          So the habit is simple. Trade from the hot wallet. When you take
          profit, send it to the Quantum Safe. If the trading wallet is drained
          tomorrow, what you swept yesterday is not in it.
        </p>
      </section>
      <section>
        <h2>How it fits a trading setup</h2>
        <ul>
          <li>
            <strong>Your Quantum Safe has an ordinary Solana address.</strong> Save it
            as a withdrawal or transfer destination in your terminal, exchange
            or wallet.
          </li>
          <li>
            <strong>SOL can be sent to it directly</strong> from anywhere.
          </li>
          <li>
            <strong>Tokens need the Quantum Safe’s token account.</strong> A Quantum Safe
            address is a program address, and some wallets and terminals
            refuse to send tokens to one. Until they support it, deposit
            tokens through the Quantum Safe app, which creates the right account.
            Only SOL and classic SPL tokens are supported.
          </li>
          <li>
            <strong>Getting money back out is deliberate.</strong> A
            withdrawal needs your Quantum Safe key, never the trading wallet’s. The
            protocol sends at once to addresses you listed as trusted when
            you built the Quantum Safe, and makes anything else wait so you have
            time to cancel it. A
            Quantum Safe is for what you are holding, not for what you need in the
            next trade.
          </li>
        </ul>
      </section>
      <section>
        <h2>What it does not do</h2>
        <ul>
          <li>
            It does not protect the trading wallet. Whatever is still there
            can still be drained.
          </li>
          <li>
            It does not trade, swap, stake or lend. The program can only hold
            and release.
          </li>
          <li>
            It does not help if the recovery kit is kept on the same machine
            as the trading setup. Keep the kit off that device.
          </li>
        </ul>
      </section>
      <section>
        <h2>For terminal and wallet developers</h2>
        <p>
          Supporting a user’s Quantum Safe needs very little, because deposits are
          plain transfers and the program has no deposit instruction.
        </p>
        <ul>
          <li>
            <strong>Send to Quantum Safe.</strong> Let users save a Quantum Safe address
            and send SOL with a System transfer. For classic SPL tokens,
            create the associated token account with the Quantum Safe address as an
            off-curve owner, then transfer. Do not block the destination for
            being a program address.
          </li>
          <li>
            <strong>Show it, read-only.</strong> A vault is one program-owned
            account with a fixed layout. Its balance and whether a withdrawal
            is pending can be read with ordinary RPC calls; no key is needed
            and nothing can be moved.
          </li>
          <li>
            <strong>Never ask for the recovery kit.</strong> An integration
            that handles the kit or its password is not an integration; it is
            the attack this product exists to stop.
          </li>
        </ul>
        <p>
          The account layouts are specified in the{" "}
          <a
            href="https://github.com/VictorChaoss/QuantumSafe/blob/main/docs/PROTOCOL.md"
            target="_blank"
            rel="noreferrer"
          >
            protocol specification
          </a>
          . It is a draft and will change before mainnet; build against a
          reviewed release.
        </p>
      </section>
      <section>
        <h2>Planned, not built</h2>
        <p>
          A deposit link any wallet can open, a “Send to Quantum Safe” action that
          terminals and wallets can render as a button, and a public
          read-only status lookup for a Quantum Safe address. None of these exist
          yet. If you
          build a terminal or a wallet and want to shape them, reach out on{" "}
          <a href="https://x.com/QsafeModeIO" target="_blank" rel="noreferrer">
            X
          </a>{" "}
          or open a{" "}
          <a
            href="https://github.com/VictorChaoss/QuantumSafe/issues"
            target="_blank"
            rel="noreferrer"
          >
            GitHub issue
          </a>
          .
        </p>
        <p>
          <Link href="/security">What Quantum Safe does and does not stop.</Link>
        </p>
      </section>
    </DocumentLayout>
  );
}
