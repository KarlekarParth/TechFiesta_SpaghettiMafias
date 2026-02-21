import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Timer, Loader2 } from "lucide-react";
import { getHistory } from "../../services/api";

type Status = "Completed" | "Running" | "Scheduled";

interface ScheduleItem {
  node: string;
  field: string;
  startTime: string;
  duration: string;
  status: Status;
}

const statusStyles: Record<Status, string> = {
  Completed: "bg-accent text-accent-foreground",
  Running: "bg-secondary/15 text-secondary",
  Scheduled: "bg-aqua-orange/15 text-aqua-orange",
};

const IrrigationSchedule = () => {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getHistory();
        
        // Mapping API history data to the UI structure
        const mappedHistory = data.map((item: any) => ({
          node: item.node_name || `Node ${item.node_id || 1}`,
          field: item.zone_name || "Field",
          startTime: item.timestamp || "Recently",
          duration: `${item.duration_seconds || 0}s`,
          status: (item.status as Status) || "Completed",
        }));
        
        setSchedule(mappedHistory);
      } catch (error) {
        console.error("Failed to fetch irrigation history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-2xl bg-card p-6 shadow-card"
    >
      <h2 className="font-display text-lg font-bold text-card-foreground mb-4">
        Irrigation History & Schedule
      </h2>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-3">
          {schedule.length > 0 ? (
            schedule.map((item, i) => (
              <motion.div
                key={`${item.node}-${i}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center justify-between rounded-xl bg-muted/50 p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
                    <span className="text-xs font-bold text-primary-foreground">
                      {item.node.includes(" ") ? item.node.split(" ")[1] : i + 1}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-card-foreground">{item.node} – {item.field}</p>
                    <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{item.startTime}</span>
                      <span className="flex items-center gap-1"><Timer className="h-3 w-3" />{item.duration}</span>
                    </div>
                  </div>
                </div>

                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[item.status] || statusStyles.Completed}`}>
                  {item.status}
                </span>
              </motion.div>
            ))
          ) : (
            <p className="text-center text-sm text-muted-foreground py-4">No recent activity found.</p>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default IrrigationSchedule;