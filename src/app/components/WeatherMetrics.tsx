"use client";

import React, { useEffect, useState } from "react";
import "@/app/styles/WeatherMetrics.css";
import { getWeatherData, getWeatherIcon } from "@/utils/weather";
import { searchCity } from "@/utils/weather";

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
      weather_code?: number;
      time?: string;
    };
  };

  // State for weather data
  const [weatherData, setWeatherData] = useState<WeatherApiResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testGeocoding = async () => {
      try {
        console.log('Testing geocoding...');
        const results = await searchCity('Paris');
        console.log('Geocoding results:', results);
      } catch (error) {
        console.error('Geocoding error:', error);
      }
    };
    
    testGeocoding();
  }, []);

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
        unit: "in",
      },
    ];
  };

  const defaultMetrics: Metric[] = [
    { id: "feelsLike", label: "Feels like", value: "_", unit: "" },
    { id: "humidity", label: "Humidity", value: "_", unit: "" },
    { id: "wind", label: "Wind", value: "_", unit: "" },
    { id: "precipitation", label: "Precipitation", value: "_", unit: "" },
  ];

  //   deciding what metrics to show
  let metricsToRender;
  if (metrics) {
    metricsToRender = metrics;
  } else if (weatherData && !loading) {
    metricsToRender = createMetricsFromAPI(weatherData);
  } else {
    metricsToRender = defaultMetrics;
  }

  return (
    <>
      <div className="general-report">
        <div className="report-details">
          <h3>Berlin, Germany</h3>
          <p>
            {weatherData?.current?.time
              ? new Date(weatherData.current.time).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "_"}
          </p>
          {/* {loading && (
            <p style={{ fontSize: "0.8rem", marginTop: "0.5rem" }}>
              Loading...
            </p>
          )}
          {error && (
            <p
              style={{ fontSize: "0.8rem", marginTop: "0.5rem", color: "red" }}
            >
              {error}
            </p>
          )} */}
        </div>
        <div className="weather-degree">
          <img
            src={`/images/${
              weatherData?.current?.weather_code
                ? getWeatherIcon(weatherData.current.weather_code)
                : "icon-sunny.webp"
            }`}
            alt="current weather"
          />
          <h1>
            {loading
              ? "..."
              : weatherData?.current?.temperature_2m
              ? `${Math.round(weatherData.current.temperature_2m)}°`
              : "_"}
          </h1>
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
