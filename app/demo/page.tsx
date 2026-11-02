import { Header, Footer } from "@/components/qsafe/shell";
import Demo from "@/components/qsafe/demo";
import Practice from "@/components/qsafe/practice";
export const metadata = { title: "Practice run" };
export default function Page() {
  return (
    <>
      <Header />
      <main className="page-container">
        <div className="demo-wrap">
          <div className="page-heading">
            <div>
              <div className="eyebrow">PRACTICE RUN · PRETEND COINS</div>
              <h1>
                Get robbed on purpose.
                <br />
                <span className="ice">See what changes.</span>
              </h1>
              <p>Three moves. Nothing here is real, and nothing connects to your wallet.</p>
            </div>
          </div>
          <Practice />
        </div>
        <details className="demo-deeper">
          <summary>For the curious: watch the real signature checks run</summary>
          <Demo nested />
        </details>
      </main>
      <Footer />
    </>
  );
}
