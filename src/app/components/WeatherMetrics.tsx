import React from "react";
import "@/app/styles/WeatherMetrics.css";

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
  const defaultMetrics: Metric[] = [
    { id: "feelsLike", label: "Feels like", value: 64, unit: "°" },
    { id: "humidity", label: "Humidity", value: 46, unit: "%" },
    { id: "wind", label: "Wind", value: 9, unit: "mph" },
    { id: "precipitation", label: "Precipitation", value: 0, unit: "in" },
  ];

  const metricsToRender = metrics ?? defaultMetrics;

  return (
    <>
      <div className="general-report">
        <div className="report-details">
          <h3>Berlin, Germany</h3>
          <p>Tuesday, Aug. 5, 2025</p>
        </div>
        <div className="weather-degree">
          <img src="/images/icon-sunny.webp" alt="icon-sunny" />
          <h1>68°</h1>
        </div>
      </div>
      <div className="metrics">
        {metricsToRender.map((metric) => (
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
