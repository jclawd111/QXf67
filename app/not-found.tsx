import Link from "next/link";
import { Header, Footer } from "@/components/qsafe/shell";
export const metadata = { title: "Not found" };
export default function NotFound() {
  return (
    <>
      <Header />
      <main className="page-container not-found corridor">
        <div className="eyebrow">404 / NOTHING BEHIND THIS DOOR</div>
        <h1>This page isn’t here.</h1>
        <p>
          The address may be mistyped, or the page may have moved. Quantum Safe only
          lives at qsafemode.io; if a link sent you somewhere asking for your
          recovery kit, close it.
        </p>
        <div className="actions">
          <Link href="/" className="button light">
            Back to the start
          </Link>
          <Link href="/check" className="button ghost">
            Check a wallet
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
