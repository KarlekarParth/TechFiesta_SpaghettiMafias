import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Brain, AlertTriangle, Eye, CheckCircle2, Loader2 } from "lucide-react";
import { getZones } from "../../services/api"; // Importing your API function

interface Decision {
  field: string;
  action: string;
  reason: string;
  timestamp: string;
  type: "recommended" | "skip" | "monitor";
  confidence: number;
}

const typeConfig = {
  recommended: { icon: CheckCircle2, color: "text-primary" },
  skip: { icon: AlertTriangle, color: "text-aqua-orange" },
  monitor: { icon: Eye, color: "text-secondary" },
};

const AIDecisionPanel = () => {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDecisions = async () => {
      try {
        const data = await getZones();
        
        // Mapping the API data to the UI structure
        // This assumes your backend returns an array of zones
        const mappedData = data.map((zone: any) => ({
          field: zone.name || `Zone ${zone.id}`,
          action: zone.status === "IRRIGATE" ? `Irrigate for ${zone.duration || 0} min` : "Skip Irrigation",
          reason: zone.reason || "AI analysis based on real-time moisture levels",
          timestamp: "Just now",
          type: zone.status === "IRRIGATE" ? "recommended" : "skip",
          confidence: zone.confidence || 95,
        }));
        
        setDecisions(mappedData);
      } catch (error) {
        console.error("Failed to fetch AI decisions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDecisions();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="rounded-2xl gradient-dark p-6 shadow-elevated"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/20">
            <Brain className="h-5 w-5 text-secondary" />
          </div>
          <h2 className="font-display text-lg font-bold text-aqua-dark-foreground">
            AI Irrigation Decisions
          </h2>
        </div>
        <div className="rounded-xl bg-primary/15 px-4 py-2">
          <p className="text-xs text-aqua-dark-foreground/70">System Efficiency</p>
          <p className="text-lg font-bold text-primary">92%</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-3">
          {decisions.map((d, i) => {
            const config = typeConfig[d.type] || typeConfig.monitor;
            const Icon = config.icon;
            return (
              <motion.div
                key={d.field}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="flex items-start gap-4 rounded-xl bg-aqua-dark-surface/60 p-4"
              >
                <div className={`mt-0.5 ${config.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm text-aqua-dark-foreground">
                      {d.field} – {d.action}
                    </p>
                    <div className="flex items-center gap-2 ml-2">
                      <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary">
                        {d.confidence}% conf
                      </span>
                      <span className="text-xs text-aqua-dark-foreground/50 whitespace-nowrap">{d.timestamp}</span>
                    </div>
                  </div>
                  <p className="text-xs text-aqua-dark-foreground/60 mt-0.5">{d.reason}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default AIDecisionPanel;