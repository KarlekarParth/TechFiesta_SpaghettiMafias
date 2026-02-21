import { motion } from "framer-motion";
import { BrainCircuit, Sparkles } from "lucide-react";

interface Props {
  recommendedSensors: number;
}

const AIRecommendation = ({ recommendedSensors }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="relative overflow-hidden rounded-2xl gradient-dark p-6 sm:p-8 shadow-elevated"
    >
      {/* Glow effect */}
      <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-secondary/15 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative z-10 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/20">
            <BrainCircuit className="h-6 w-6 text-secondary" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-primary-foreground flex items-center gap-2">
              AI Placement Recommendation
              <Sparkles className="h-4 w-4 text-aqua-yellow animate-pulse-soft" />
            </h2>
            <p className="text-xs text-primary-foreground/50">Spatial variance analysis complete</p>
          </div>
        </div>

        <div className="rounded-xl bg-primary-foreground/5 border border-primary-foreground/10 p-4 backdrop-blur-sm">
          <p className="text-sm text-primary-foreground/90 leading-relaxed">
            Based on spatial variance analysis, add{" "}
            <span className="font-bold text-secondary">{Math.max(1, Math.round(recommendedSensors * 0.4))} sensors in Zone C</span>{" "}
            and{" "}
            <span className="font-bold text-secondary">{Math.max(1, Math.round(recommendedSensors * 0.2))} sensor in Zone A</span>{" "}
            for <span className="font-bold text-primary">95% confidence</span> irrigation decisions.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 text-xs">
          <span className="rounded-full bg-primary/20 px-3 py-1 text-primary font-semibold">
            High spatial correlation detected in Zone C
          </span>
          <span className="rounded-full bg-secondary/20 px-3 py-1 text-secondary font-semibold">
            Zone A shows edge-field moisture drift
          </span>
          <span className="rounded-full bg-aqua-yellow/20 px-3 py-1 text-aqua-yellow font-semibold">
            Zone B & D adequately covered
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default AIRecommendation;
