import React from "react";
import "@/app/styles/WeatherReport.css";
import { WeatherMetrics } from "./WeatherMetrics";
import { DailyForecasts } from "./DailyForecasts";
import { HourlyForecasts } from "./HourlyForecasts";

type WeatherReportProps = {
  latitude: number;
  longitude: number;
  cityName: string;
  units: {
    temperature: string,
    windSpeed: string,
    precipitation: string
  }
};

export const WeatherReport: React.FC<WeatherReportProps> = ({
  latitude,
  longitude,
  cityName,
  units
}) => {
  return (
    <div className="weather-report">
      <div>
        <WeatherMetrics
          latitude={latitude}
          longitude={longitude}
          cityName={cityName}
          units={units}
        />
        <DailyForecasts latitude={latitude} longitude={longitude} units={units} />
      </div>
      <div>
        <HourlyForecasts latitude={latitude} longitude={longitude} units={units} />
      </div>
    </div>
  );
};
