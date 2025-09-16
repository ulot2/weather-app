import React from "react";
import "@/app/styles/WeatherReport.css";
import { WeatherMetrics } from "./WeatherMetrics";
import { DailyForecasts } from "./DailyForecasts";
import { HourlyForecasts } from "./HourlyForecasts";

type WeatherReportProps = {
  latitude: number;
  longitude: number;
  cityName: string;
};

export const WeatherReport: React.FC<WeatherReportProps> = ({
  latitude,
  longitude,
  cityName,
}) => {
  return (
    <div className="weather-report">
      <div>
        <WeatherMetrics
          latitude={latitude}
          longitude={longitude}
          cityName={cityName}
        />
        <DailyForecasts latitude={latitude} longitude={longitude} />
      </div>
      <div>
        <HourlyForecasts latitude={latitude} longitude={longitude} />
      </div>
    </div>
  );
};
