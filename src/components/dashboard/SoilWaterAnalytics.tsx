import { motion } from "framer-motion";
import { TrendingUp, Loader2 } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useEffect, useState } from "react";
import { getHistory } from "../../services/api";

const SoilWaterAnalytics = () => {
  const [moistureData, setMoistureData] = useState<any[]>([]);
  const [waterData, setWaterData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getHistory();
        
        // Ensure data is an array before processing
        const historyArray = Array.isArray(data) ? data : [];

        // Formatting moisture data for the line chart
        // This takes the last 10 entries to keep the chart clean
        const formattedMoisture = historyArray.slice(-10).map((point: any) => ({
          time: point.timestamp ? new Date(point.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Recently",
          current: point.moisture || point.current_moisture || 0,
          target: 65, // Fixed target for visualization
        }));

        // Formatting water usage data for the bar chart
        const formattedUsage = historyArray.slice(-10).map((point: any) => ({
          time: point.timestamp ? new Date(point.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Recently",
          usage: point.duration_seconds || 0, // Using duration as a proxy for usage if flow_rate isn't available
        }));

        setMoistureData(formattedMoisture);
        setWaterData(formattedUsage);
      } catch (err) {
        console.error("History analytics error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
    // Refresh analytics every 30 seconds
    const interval = setInterval(fetchHistory, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Soil Moisture Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl bg-card p-6 shadow-card"
      >
        <h2 className="font-display text-lg font-bold text-card-foreground mb-4">
          Soil Moisture Trend
        </h2>
        {loading ? (
          <div className="flex h-[240px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={moistureData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 18% 90%)" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: "hsl(220 15% 50%)" }} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(220 15% 50%)" }} domain={[0, 100]} unit="%" />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 4px 20px -4px rgba(0,0,0,0.1)",
                  fontSize: "12px",
                }}
              />
              <Legend iconType="circle" iconSize={8} />
              <Line
                type="monotone"
                dataKey="current"
                stroke="hsl(152 55% 42%)"
                strokeWidth={2.5}
                dot={false}
                name="Current Moisture"
              />
              <Line
                type="monotone"
                dataKey="target"
                stroke="hsl(210 60% 52%)"
                strokeWidth={2}
                strokeDasharray="6 4"
                dot={false}
                name="Target Moisture"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </motion.div>

      {/* Water Usage */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl bg-card p-6 shadow-card"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-bold text-card-foreground">
            Irrigation Duration
          </h2>
          <span className="flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
            <TrendingUp className="h-3 w-3" /> Historical
          </span>
        </div>
        {loading ? (
          <div className="flex h-[240px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={waterData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 18% 90%)" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: "hsl(220 15% 50%)" }} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(220 15% 50%)" }} unit="s" />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 4px 20px -4px rgba(0,0,0,0.1)",
                  fontSize: "12px",
                }}
              />
              <Bar
                dataKey="usage"
                fill="hsl(152 55% 42%)"
                radius={[4, 4, 0, 0]}
                name="Duration (sec)"
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </motion.div>
    </div>
  );
};

export default SoilWaterAnalytics;