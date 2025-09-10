"use client";

import React, { useEffect, useState } from "react";
import "@/app/styles/WeatherMetrics.css";
import { getWeatherData } from "@/utils/weather";

type Metric = {
  id: string;
  label: string;
  value: string | number;
  unit?: string;
};

type WeatherMetricsProps = {
  metrics?: Metric[];
};

export const WeatherMetrics: React.FC<WeatherMetricsProps> = ({ metrics }) => {
  // Define the expected weather data type
  type WeatherApiResponse = {
    current?: {
      temperature_2m?: number;
      apparent_temperature?: number;
      relative_humidity_2m?: number;
      wind_speed_10m?: number;
      precipitation?: number;
    };
    // Add other properties if needed
  };

  // State for weather data
  const [weatherData, setWeatherData] = useState<WeatherApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        const data = await getWeatherData(52.52, 13.41);
        setWeatherData(data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch weather data");
        console.error("Weather fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  const createMetricsFromAPI = (apiData: any) => {
    if (!apiData?.current) return null;

    const current = apiData.current;
    return [
      {
        id: "feelsLike",
        label: "Feels like",
        value: Math.round(current.apparent_temperature || 0),
        unit: "°",
      },
      {
        id: "humidity",
        label: "Humidity",
        value: current.relative_humidity_2m || 0,
        unit: "%",
      },
      {
        id: "wind",
        label: "Wind",
        value: Math.round(current.wind_speed_10m || 0),
        unit: "km/h",
      },
      {
        id: "precipitation",
        label: "Precipitation",
        value: current.precipitation || 0,
        unit: "mm",
      },
    ];
  };

  const defaultMetrics: Metric[] = [
    { id: "feelsLike", label: "Feels like", value: 64, unit: "°" },
    { id: "humidity", label: "Humidity", value: 46, unit: "%" },
    { id: "wind", label: "Wind", value: 9, unit: "mph" },
    { id: "precipitation", label: "Precipitation", value: 0, unit: "in" },
  ];

  //   deciding what metrics to show
  let metricsToRender;
  if (metrics) {
    metricsToRender = metrics;
  } else if (weatherData && !loading) {
    metricsToRender = createMetricsFromAPI(weatherData)
  } else {
    metricsToRender = defaultMetrics;
  }

  return (
    <>
      <div className="general-report">
        <div className="report-details">
          <h3>Berlin, Germany</h3>
          <p>Tuesday, Aug. 5, 2025</p>
          {loading && <p style={{fontSize: '0.8rem', marginTop: '0.5rem'}}>Loading...</p>}
          {error && <p style={{fontSize: '0.8rem', marginTop: '0.5rem', color: 'red'}}>{error}</p>}
        </div>
        <div className="weather-degree">
          <img src="/images/icon-sunny.webp" alt="icon-sunny" />
          <h1>{loading 
              ? "..." 
              : weatherData?.current?.temperature_2m 
                ? `${Math.round(weatherData.current.temperature_2m)}°`
                : "68°"
            }</h1>
        </div>
      </div>
      <div className="metrics">
        {metricsToRender?.map((metric) => (
          <div className="metrics-details" key={metric.id}>
            <p>{metric.label}</p>
            <h2>
              {metric.value}
              {metric.unit && (metric.unit === "°" ? "°" : ` ${metric.unit}`)}
            </h2>
          </div>
        ))}
      </div>
    </>
  );
};
