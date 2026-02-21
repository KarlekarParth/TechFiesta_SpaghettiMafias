import { motion } from "framer-motion";
import { Shuffle, Target, TrendingDown } from "lucide-react";

interface Props {
  cv: number;
}

const MiniGrid = ({ optimized }: { optimized: boolean }) => {
  const rows = 6;
  const cols = 8;

  return (
    <div className="rounded-xl overflow-hidden border border-border bg-muted/30 p-1">
      <div className="grid gap-[2px]" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: rows * cols }).map((_, i) => {
          const r = Math.floor(i / cols);
          const c = i % cols;
          const moisture = optimized
            ? 50 + Math.sin(r * 0.9 + c * 0.7) * 15
            : 30 + Math.random() * 50;

          const isSensor = optimized
            ? (r === 1 && c === 2) || (r === 1 && c === 5) || (r === 4 && c === 2) || (r === 4 && c === 5) || (r === 3 && c === 4)
            : (r === 0 && c === 0) || (r === 2 && c === 7) || (r === 5 && c === 3) || (r === 1 && c === 4) || (r === 4 && c === 1);

          const color = moisture < 35 ? "bg-destructive/60" : moisture < 55 ? "bg-aqua-orange/50" : moisture < 70 ? "bg-aqua-yellow/40" : "bg-primary/45";

          return (
            <div key={i} className={`aspect-square rounded-sm ${color} relative`}>
              {isSensor && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`h-2 w-2 rounded-full border-2 ${optimized ? "border-secondary bg-secondary/30" : "border-muted-foreground bg-muted-foreground/30"}`} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const PlacementComparison = ({ cv }: Props) => {
  const randomCV = cv + 18;
  const improvement = Math.round(((randomCV - cv) / randomCV) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="rounded-2xl bg-card p-6 shadow-card"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-lg font-bold text-card-foreground">
          Random vs Optimized Placement
        </h2>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6, type: "spring", bounce: 0.4 }}
          className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary"
        >
          <TrendingDown className="h-3.5 w-3.5" />
          Prediction Error Reduced by {improvement}%
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Random */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <Shuffle className="h-4 w-4" /> Random Placement
          </div>
          <MiniGrid optimized={false} />
          <div className="rounded-xl bg-destructive/10 px-3 py-2 text-center">
            <p className="text-xs text-muted-foreground">CV</p>
            <p className="text-lg font-bold text-destructive">{randomCV}%</p>
          </div>
        </div>

        {/* Optimized */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <Target className="h-4 w-4" /> Optimized Placement
          </div>
          <MiniGrid optimized={true} />
          <div className="rounded-xl bg-primary/10 px-3 py-2 text-center">
            <p className="text-xs text-muted-foreground">CV</p>
            <p className="text-lg font-bold text-primary">{cv}%</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PlacementComparison;
