import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Droplets, Thermometer, Wind, Activity, Loader2 } from "lucide-react";
import { getZones } from "../../services/api";

const FarmControlPanel = () => {
  const [zones, setZones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchZoneData = async () => {
      try {
        const data = await getZones();
        setZones(data);
      } catch (error) {
        console.error("Error fetching zone data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchZoneData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center rounded-2xl bg-aqua-dark-surface/30">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {zones.map((zone, index) => (
        <motion.div
          key={zone.id || index}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className="rounded-2xl border border-aqua-dark-border bg-aqua-dark-surface/40 p-5 backdrop-blur-md"
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Droplets className="h-5 w-5 text-primary" />
            </div>
            <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${
              zone.status === "IRRIGATING" ? "bg-primary/20 text-primary" : "bg-aqua-dark-foreground/10 text-aqua-dark-foreground/60"
            }`}>
              {zone.status || "IDLE"}
            </span>
          </div>
          
          <h3 className="font-display text-sm font-bold text-aqua-dark-foreground/70">
            {zone.name || `Zone ${index + 1}`}
          </h3>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-aqua-dark-foreground">
              {zone.moisture || zone.current_moisture || 0}%
            </span>
            <span className="text-xs text-aqua-dark-foreground/40 text-aqua-dark-foreground/40">Moisture</span>
          </div>

          <div className="mt-4 flex gap-3 border-t border-aqua-dark-border/50 pt-4">
            <div className="flex items-center gap-1.5">
              <Thermometer className="h-3.5 w-3.5 text-aqua-orange" />
              <span className="text-xs font-medium text-aqua-dark-foreground/60">{zone.temp || 24}°C</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5 text-secondary" />
              <span className="text-xs font-medium text-aqua-dark-foreground/60">{zone.health || "Good"}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default FarmControlPanel;