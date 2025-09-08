import React from "react";
import "@/app/styles/DailyForecasts.css";

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
}

export const DailyForecasts: React.FC<DailyForecastsProps> = ({ 
  title = "Daily forecast",
  forecasts 
}) => {
  const defaultForecasts: DailyForecastItem[] = [
    { id: "1", day: "Tue", iconSrc: "/images/icon-rain.webp", highTemp: "68°", lowTemp: "57°" },
    { id: "2", day: "Wed", iconSrc: "/images/icon-drizzle.webp", highTemp: "68°", lowTemp: "57°" },
    { id: "3", day: "Thu", iconSrc: "/images/icon-sunny.webp", highTemp: "68°", lowTemp: "57°" },
    { id: "4", day: "Fri", iconSrc: "/images/icon-partly-cloudy.webp", highTemp: "68°", lowTemp: "57°" },
    { id: "5", day: "Sat", iconSrc: "/images/icon-storm.webp", highTemp: "68°", lowTemp: "57°" },
    { id: "6", day: "Sun", iconSrc: "/images/icon-snow.webp", highTemp: "68°", lowTemp: "57°" },
    { id: "7", day: "Mon", iconSrc: "/images/icon-fog.webp", highTemp: "68°", lowTemp: "57°" },
  ];

  const forecastsToRender = forecasts ?? defaultForecasts;

  return (
    <div className="daily-forecast-container">
      <h5>{title}</h5>
      <div className="daily-forecast">
        {forecastsToRender.map((forecast) => (
          <div key={forecast.id}>
            <p>{forecast.day}</p>
            <img src={forecast.iconSrc} alt="" />
            <span>{forecast.highTemp}</span> <span>{forecast.lowTemp}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
