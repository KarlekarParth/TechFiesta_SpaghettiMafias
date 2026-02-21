import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BarChart3, Sigma, TrendingDown, Percent } from "lucide-react";

interface Props {
  cv: number;
  recommendedSensors: number;
}

const AnimatedNumber = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = display;
    const step = (value - start) / 20;
    let frame = 0;
    const id = setInterval(() => {
      frame++;
      if (frame >= 20) {
        setDisplay(value);
        clearInterval(id);
      } else {
        setDisplay(Math.round(start + step * frame));
      }
    }, 30);
    return () => clearInterval(id);
  }, [value]);

  return <span>{display}{suffix}</span>;
};

const stats = [
  { label: "Mean Soil Moisture", key: "mean", value: 58, suffix: "%", icon: BarChart3 },
  { label: "Variance", key: "variance", value: 142, suffix: "", icon: Sigma },
  { label: "Standard Deviation", key: "stddev", value: 12, suffix: "%", icon: TrendingDown },
  { label: "Coefficient of Variation", key: "cv", value: 0, suffix: "%", icon: Percent },
];

const VariabilityAnalytics = ({ cv, recommendedSensors }: Props) => {
  const computedStats = stats.map((s) =>
    s.key === "cv" ? { ...s, value: cv } : s
  );

  return (
    <div className="space-y-4">
      {computedStats.map((stat, i) => (
        <motion.div
          key={stat.key}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 + i * 0.08 }}
          className="rounded-2xl card-glass p-4 shadow-card"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
              <stat.icon className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="text-xl font-bold text-card-foreground">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} />
              </p>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Recommendation box */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.55 }}
        className="rounded-2xl bg-secondary/10 border border-secondary/20 p-4 space-y-2"
      >
        <p className="text-sm text-secondary font-bold">
          Recommended Sensors: <span className="text-xl"><AnimatedNumber value={recommendedSensors} /></span>
        </p>
        <p className="text-xs text-muted-foreground">
          Confidence Level: <span className="font-bold text-card-foreground">95%</span>
        </p>
      </motion.div>
    </div>
  );
};

export default VariabilityAnalytics;
