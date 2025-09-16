"use client";

import React, { useEffect, useState } from "react";
import "@/app/styles/DailyForecasts.css";
import {
 getWeatherData,
  transformDailyData,
} from "@/utils/weather";

interface DailyForecastItem {
  id: string;
  day: string;
  iconSrc: string;
  highTemp: string | number;
  lowTemp: string | number;
}

interface DailyForecastsProps {
  title?: string;
  forecasts?: DailyForecastItem[];
  latitude:number;
  longitude:number;
  units: {
    temperature: string,
    windSpeed: string,
    precipitation: string
  }
}

export const DailyForecasts: React.FC<DailyForecastsProps> = ({
  title = "Daily forecast",
  forecasts,
  latitude, longitude, units
}) => {
  type WeatherApiResponse = {
    daily?: {
      time?: string[];
      weather_code?: number[];
      temperature_2m_max?: number[];
      temperature_2m_min?: number[];
    };
  };

  const [dailyForecastData, setDailyForecastData] =
    useState<WeatherApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<String | null>(null);

  useEffect(() => {
    const fetchDailyForecastData = async () => {
      try {
        setLoading(true);
        const data = await getWeatherData(latitude, longitude, units);
        setDailyForecastData(data);
        setError(null);
      } catch (error) {
        setError("Failed to fetch data");
        console.error("Weather fetch error", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDailyForecastData();
  }, [latitude, longitude, units]);

  const defaultForecasts: DailyForecastItem[] = [
    { id: "1", day: "", iconSrc: "#", highTemp: "", lowTemp: "" },
    { id: "2", day: "", iconSrc: "#", highTemp: "", lowTemp: "" },
    { id: "3", day: "", iconSrc: "#", highTemp: "", lowTemp: "" },
    { id: "4", day: "", iconSrc: "#", highTemp: "", lowTemp: "" },
    { id: "5", day: "", iconSrc: "#", highTemp: "", lowTemp: "" },
    { id: "6", day: "", iconSrc: "#", highTemp: "", lowTemp: "" },
    { id: "7", day: "", iconSrc: "#", highTemp: "", lowTemp: "" },
  ];

  let forecastsToRender;
  if (forecasts) {
    forecastsToRender = forecasts;
  } else if (dailyForecastData?.daily && !loading) {
    const safeDailyData = {
      time: dailyForecastData.daily.time ?? [],
      weather_code: dailyForecastData.daily.weather_code ?? [],
      temperature_2m_max: dailyForecastData.daily.temperature_2m_max ?? [],
      temperature_2m_min: dailyForecastData.daily.temperature_2m_min ?? [],
    };
    forecastsToRender = transformDailyData(safeDailyData);
  } else {
    forecastsToRender = defaultForecasts;
  }

  return (
    <div className="daily-forecast-container">
      <h5>{title}</h5>
      <div className="daily-forecast">
        {forecastsToRender.map((forecast) => (
          <div key={forecast.id}>
            <p>{forecast.day}</p>
            <img src={forecast.iconSrc || ""} alt="" />
            <span>{forecast.highTemp}</span> <span>{forecast.lowTemp}</span>
          </div>
        ))}
      </div>
    </div>
  );
};