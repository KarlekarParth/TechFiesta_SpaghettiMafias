import Navbar from "@/components/dashboard/Navbar";
import SensorLabHero from "@/components/sensor-lab/SensorLabHero";
import FieldVisualization from "@/components/sensor-lab/FieldVisualization";
import VariabilityAnalytics from "@/components/sensor-lab/VariabilityAnalytics";
import SimulationControls from "@/components/sensor-lab/SimulationControls";
import PlacementComparison from "@/components/sensor-lab/PlacementComparison";
import AIRecommendation from "@/components/sensor-lab/AIRecommendation";
import { useState } from "react";

export interface SimulationState {
  fieldSize: number;
  desiredAccuracy: number;
  acceptableError: number;
  spatialRange: number;
  mode: "live" | "simulation";
}

const SensorLab = () => {
  const [sim, setSim] = useState<SimulationState>({
    fieldSize: 5000,
    desiredAccuracy: 90,
    acceptableError: 5,
    spatialRange: 25,
    mode: "simulation",
  });

  const recommendedSensors = Math.max(
    3,
    Math.round((sim.fieldSize / 1000) * (sim.desiredAccuracy / 100) * (10 / sim.acceptableError) * (30 / sim.spatialRange))
  );

  const cv = Math.max(5, Math.round(35 - sim.desiredAccuracy * 0.2 - sim.spatialRange * 0.15 + sim.acceptableError * 0.8));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-6 space-y-6">
        <SensorLabHero mode={sim.mode} onModeChange={(mode) => setSim((s) => ({ ...s, mode }))} />
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
          <FieldVisualization sim={sim} />
          <VariabilityAnalytics cv={cv} recommendedSensors={recommendedSensors} />
        </div>
        <SimulationControls sim={sim} onChange={setSim} cv={cv} recommendedSensors={recommendedSensors} />
        <PlacementComparison cv={cv} />
        <AIRecommendation recommendedSensors={recommendedSensors} />
      </main>
    </div>
  );
};

export default SensorLab;
