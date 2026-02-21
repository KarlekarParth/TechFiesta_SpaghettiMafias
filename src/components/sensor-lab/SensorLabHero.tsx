import { motion } from "framer-motion";
import { Leaf, Radio } from "lucide-react";

interface Props {
  mode: "live" | "simulation";
  onModeChange: (mode: "live" | "simulation") => void;
}

const SensorLabHero = ({ mode, onModeChange }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl gradient-hero p-8 sm:p-10 shadow-elevated"
    >
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="fieldGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#fieldGrid)" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-foreground/20 backdrop-blur-sm">
              <Leaf className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xs font-semibold text-primary-foreground/70 uppercase tracking-wider">Research Module</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-primary-foreground">
            Sensor Optimization Lab
          </h1>
          <p className="text-primary-foreground/80 text-sm sm:text-base max-w-lg">
            Optimize soil sensor placement using spatial variance and statistical analysis.
          </p>
        </div>

        <div className="flex gap-2">
          {(["live", "simulation"] as const).map((m) => (
            <button
              key={m}
              onClick={() => onModeChange(m)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                mode === m
                  ? "bg-primary-foreground text-primary shadow-card"
                  : "bg-primary-foreground/15 text-primary-foreground hover:bg-primary-foreground/25 backdrop-blur-sm"
              }`}
            >
              <Radio className={`h-3.5 w-3.5 ${mode === m ? "animate-pulse-soft" : ""}`} />
              {m === "live" ? "Live Data" : "Simulation"} Mode
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default SensorLabHero;
