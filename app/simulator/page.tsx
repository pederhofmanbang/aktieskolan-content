import type { Metadata } from "next";

import { SimulatorView } from "@/components/simulator/SimulatorView";
import { listInstruments } from "@/lib/prices";

export const metadata: Metadata = {
  title: "Simulator – Aktieskolan",
  description: "Övningsportfölj med 100 000 kr i låtsaspengar.",
};

export default function SimulatorPage() {
  const instruments = listInstruments();
  return <SimulatorView instruments={instruments} />;
}
