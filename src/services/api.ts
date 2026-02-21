import axios from "axios";

const API = axios.create({
    baseURL: "https://smart-irrigation-api-cvo6.onrender.com",
});

export interface WeatherData {
  temperature: number;
  humidity: number;
  wind_speed: number;
  rain_mm: number;
  et_15min: number;
}

export interface PredictionResponse {
  action: "WAIT" | "IRRIGATE";
  predicted_moisture: number;
  recommended_valve_seconds?: number;
}

export async function predictZone(data: any): Promise<PredictionResponse> {
  const response = await API.post("/predict", data);
  return response.data;
}

export const getZones = async () => {
  const res = await API.get("/zones");
  return res.data;
};

export const getHistory = async () => {
  const res = await API.get("/history");
  return res.data;
};

// NEW: Function to fetch live weather from your backend
export const getWeatherData = async (): Promise<WeatherData> => {
  const res = await API.get("/weather");
  return res.data;
};