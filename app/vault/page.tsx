import { Header, Footer } from "@/components/qsafe/shell";
import VaultApp from "@/components/qsafe/v3/vault-app";
export const metadata = { title: "Your Quantum Safe" };
export default function Page() {
  return (
    <>
      <Header />
      {/* Plays once per load, never intercepts input, and is hidden under reduced motion. */}
      <div className="qsafe-door" aria-hidden="true">
        <span />
        <i />
        <span />
        <b>ENTERING QUANTUM SAFE</b>
      </div>
      <div className="vault-room" aria-hidden="true" />
      <VaultApp />
      <Footer />
    </>
  );
}
