import { motion } from "framer-motion";
import { useState } from "react";
import type { SimulationState } from "@/pages/SensorLab";

interface Props {
  sim: SimulationState;
}

interface CellData {
  moisture: number;
  hasSensor: boolean;
  suggestedSensor: boolean;
  sensorId?: string;
  zone: string;
}

const GRID_ROWS = 8;
const GRID_COLS = 12;

const generateGrid = (sim: SimulationState): CellData[][] => {
  const grid: CellData[][] = [];
  const zones = ["A", "B", "C", "D"];

  for (let r = 0; r < GRID_ROWS; r++) {
    const row: CellData[] = [];
    for (let c = 0; c < GRID_COLS; c++) {
      const zoneIdx = (r < 4 ? 0 : 2) + (c < 6 ? 0 : 1);
      const base = 40 + Math.sin(r * 0.8 + c * 0.5 + sim.spatialRange * 0.05) * 30;
      const noise = Math.sin(r * 3.2 + c * 2.1) * 10 + Math.cos(r * 1.5 - c * 2.8) * 8;
      const moisture = Math.max(10, Math.min(95, base + noise + (sim.fieldSize / 10000) * 5));

      const hasSensor =
        (r === 1 && c === 2) || (r === 2 && c === 8) || (r === 5 && c === 4) ||
        (r === 6 && c === 10) || (r === 3 && c === 5);
      const suggestedSensor =
        (r === 1 && c === 9) || (r === 5 && c === 1) || (r === 6 && c === 7) || (r === 3 && c === 11);

      row.push({
        moisture: Math.round(moisture),
        hasSensor,
        suggestedSensor,
        sensorId: hasSensor ? `S-${r}${c}` : suggestedSensor ? `R-${r}${c}` : undefined,
        zone: zones[zoneIdx],
      });
    }
    grid.push(row);
  }
  return grid;
};

const getMoistureColor = (m: number): string => {
  if (m < 35) return "bg-destructive/70";
  if (m < 55) return "bg-aqua-orange/60";
  if (m < 70) return "bg-aqua-yellow/50";
  return "bg-primary/50";
};

const FieldVisualization = ({ sim }: Props) => {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; cell: CellData } | null>(null);
  const grid = generateGrid(sim);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="rounded-2xl bg-card p-6 shadow-card"
    >
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-lg font-bold text-card-foreground">
          Field Moisture Heatmap
        </h2>
        {/* Legend */}
        <div className="hidden sm:flex items-center gap-3 text-[10px] font-semibold text-muted-foreground">
          <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-primary/50" /> Low stress</span>
          <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-aqua-yellow/60" /> Moderate</span>
          <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-destructive/70" /> High stress</span>
          <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-secondary" /> Recommended</span>
        </div>
      </div>

      {/* Zone labels */}
      <div className="grid grid-cols-2 gap-1 mb-2 text-[10px] font-bold text-muted-foreground px-1">
        <span>Zone A</span>
        <span className="text-right">Zone B</span>
      </div>

      <div className="relative rounded-xl overflow-hidden border border-border bg-muted/30 p-1">
        <div
          className="grid gap-[2px]"
          style={{ gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)` }}
        >
          {grid.flat().map((cell, i) => (
            <div
              key={i}
              className={`relative aspect-square rounded-sm transition-all duration-300 cursor-pointer hover:scale-110 hover:z-10 ${getMoistureColor(cell.moisture)}`}
              onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setTooltip({ x: rect.left + rect.width / 2, y: rect.top - 8, cell });
              }}
              onMouseLeave={() => setTooltip(null)}
            >
              {cell.hasSensor && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-card border-2 border-primary shadow-sm" />
                </div>
              )}
              {cell.suggestedSensor && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-secondary/30 border-2 border-secondary border-dashed animate-pulse-soft" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Tooltip */}
        {tooltip && (
          <div
            className="fixed z-50 pointer-events-none"
            style={{ left: tooltip.x, top: tooltip.y, transform: "translate(-50%, -100%)" }}
          >
            <div className="bg-card rounded-xl p-2.5 shadow-elevated border border-border text-xs space-y-0.5 whitespace-nowrap">
              {tooltip.cell.sensorId && (
                <p className="font-bold text-card-foreground">{tooltip.cell.sensorId}</p>
              )}
              <p className="text-muted-foreground">
                Moisture: <span className="font-bold text-card-foreground">{tooltip.cell.moisture}%</span>
              </p>
              <p className="text-muted-foreground">
                Zone: <span className="font-bold text-card-foreground">{tooltip.cell.zone}</span>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Zone C/D labels */}
      <div className="grid grid-cols-2 gap-1 mt-2 text-[10px] font-bold text-muted-foreground px-1">
        <span>Zone C</span>
        <span className="text-right">Zone D</span>
      </div>
    </motion.div>
  );
};

export default FieldVisualization;
