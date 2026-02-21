import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { SlidersHorizontal } from "lucide-react";
import type { SimulationState } from "@/pages/SensorLab";

interface Props {
  sim: SimulationState;
  onChange: React.Dispatch<React.SetStateAction<SimulationState>>;
  cv: number;
  recommendedSensors: number;
}

const sliders = [
  { key: "fieldSize" as const, label: "Field Size", unit: "m²", min: 1000, max: 20000, step: 500 },
  { key: "desiredAccuracy" as const, label: "Desired Accuracy", unit: "%", min: 70, max: 99, step: 1 },
  { key: "acceptableError" as const, label: "Acceptable Error", unit: "%", min: 1, max: 15, step: 1 },
  { key: "spatialRange" as const, label: "Spatial Correlation Range", unit: "m", min: 5, max: 100, step: 5 },
];

const SimulationControls = ({ sim, onChange, cv, recommendedSensors }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="rounded-2xl bg-card p-6 shadow-card"
    >
      <div className="flex items-center gap-2 mb-6">
        <SlidersHorizontal className="h-5 w-5 text-primary" />
        <h2 className="font-display text-lg font-bold text-card-foreground">Simulation Controls</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {sliders.map((s) => (
          <div key={s.key} className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-muted-foreground">{s.label}</label>
              <span className="text-sm font-bold text-card-foreground">
                {sim[s.key].toLocaleString()} {s.unit}
              </span>
            </div>
            <Slider
              value={[sim[s.key]]}
              min={s.min}
              max={s.max}
              step={s.step}
              onValueChange={([v]) => onChange((prev) => ({ ...prev, [s.key]: v }))}
            />
          </div>
        ))}
      </div>

      {/* Dynamic results */}
      <div className="mt-6 flex flex-wrap gap-4">
        <div className="rounded-xl bg-accent px-4 py-2.5">
          <p className="text-[10px] text-muted-foreground">Recommended Sensors</p>
          <p className="text-lg font-bold text-accent-foreground">{recommendedSensors}</p>
        </div>
        <div className="rounded-xl bg-accent px-4 py-2.5">
          <p className="text-[10px] text-muted-foreground">Coefficient of Variation</p>
          <p className="text-lg font-bold text-accent-foreground">{cv}%</p>
        </div>
        <div className="rounded-xl bg-accent px-4 py-2.5">
          <p className="text-[10px] text-muted-foreground">Confidence Level</p>
          <p className="text-lg font-bold text-accent-foreground">95%</p>
        </div>
      </div>
    </motion.div>
  );
};

export default SimulationControls;
