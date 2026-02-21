export interface PredictionResult {
  action: "IRRIGATE" | "WAIT";
  predicted_sm: number;
  duration: number;
}

export function simulatePrediction(currentMoisture: number): PredictionResult {
  if (currentMoisture < 35) {
    return {
      action: "IRRIGATE",
      predicted_sm: currentMoisture + 8,
      duration: 120
    };
  }

  return {
    action: "WAIT",
    predicted_sm: currentMoisture - 1,
    duration: 0
  };
}
