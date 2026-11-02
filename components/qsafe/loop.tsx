"use client";
// Replaces all old looping video clips (<Clip /> and <Card />) with interactive
// Quantum Safe code/crypto visualizers — zero video files needed.
import { QuantumVisualizer } from "./quantum-hero";

export default function Loop({
  className = "",
}: {
  src?: string[];
  poster?: string;
  className?: string;
  onScreenOnly?: boolean;
}) {
  return <QuantumVisualizer name="backdrop" className={className} />;
}

export function Clip({ name, className }: { name: string; className?: string }) {
  return <QuantumVisualizer name={name} className={className} />;
}

export function Card({ name, className }: { name: string; className?: string }) {
  return <QuantumVisualizer name={name} className={className} />;
}
