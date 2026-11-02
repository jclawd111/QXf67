import { Header, Footer } from "@/components/qsafe/shell";
import ExposureCheck from "@/components/qsafe/exposure-check";
import { WalletProvider } from "@/components/qsafe/wallet";
export const metadata = {
  title: "Check a wallet",
  description:
    "See what one signature could move out of any Solana wallet, and which token approvals are already open. Read-only.",
};
export default function Page() {
  return (
    <>
      <Header />
      <main className="page-container">
        <WalletProvider>
          <ExposureCheck />
        </WalletProvider>
      </main>
      <Footer />
    </>
  );
}
