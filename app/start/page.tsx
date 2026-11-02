import type { Metadata } from "next";
import { DocumentLayout } from "@/components/qsafe/document-layout";
import SetupGuide from "@/components/qsafe/setup-guide";

export const metadata: Metadata = {
  title: "Set up a Quantum Safe",
  description: "Six steps from nothing to a Quantum Safe that is built, funded with a small amount, watched and rehearsed. Public beta.",
};
export default function Start() {
  return (
    <DocumentLayout
      eyebrow="SETUP GUIDE · PUBLIC BETA"
      title="Set up a Quantum Safe."
      description="Six steps, in order. Your keys are made offline and never touch this website."
    >
      <div className="document-callout">
        <h2>Before you start</h2>
        <p>
          You need a computer or an Android phone, any Solana wallet with a little SOL for fees, and somewhere safe
          that is not this device for two files. Quantum Safe never asks for your recovery kit or its password, here or
          anywhere else.
        </p>
      </div>
      <SetupGuide />
    </DocumentLayout>
  );
}
