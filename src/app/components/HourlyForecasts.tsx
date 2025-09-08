"use client"

import React, { useState } from "react";
import "@/app/styles/HourlyForecasts.css";

interface HourlyForecastItem {
  id: string;
  time: string;
  iconSrc: string;
  temperature: string | number;
}

interface HourlyForecastsProps {
  title?: string;
  selectedDay?: string;
  forecasts?: HourlyForecastItem[];
}

export const HourlyForecasts: React.FC<HourlyForecastsProps> = ({
  title = "Hourly forecast",
  selectedDay = "Tuesday",
  forecasts
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentSelectedDay, setCurrentSelectedDay] = useState(selectedDay);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const toggleDropdown = () => {
    if (isDropdownOpen) {
      // Start closing animation
      setIsAnimating(true);
      setTimeout(() => {
        setIsDropdownOpen(false);
        setIsAnimating(false);
      }, 300); // Match CSS transition duration
    } else {
      setIsDropdownOpen(true);
    }
  };

  const handleDaySelection = (day: string) => {
    setCurrentSelectedDay(day);
    setIsAnimating(true);
    setTimeout(() => {
      setIsDropdownOpen(false);
      setIsAnimating(false);
    }, 300);
  };
  const defaultForecasts: HourlyForecastItem[] = [
    { id: "1", time: "3 PM", iconSrc: "/images/icon-overcast.webp", temperature: "20°" },
    { id: "2", time: "4 PM", iconSrc: "/images/icon-overcast.webp", temperature: "21°" },
    { id: "3", time: "5 PM", iconSrc: "/images/icon-overcast.webp", temperature: "19°" },
    { id: "4", time: "6 PM", iconSrc: "/images/icon-overcast.webp", temperature: "18°" },
    { id: "5", time: "7 PM", iconSrc: "/images/icon-overcast.webp", temperature: "17°" },
    { id: "6", time: "8 PM", iconSrc: "/images/icon-overcast.webp", temperature: "16°" },
    { id: "7", time: "9 PM", iconSrc: "/images/icon-overcast.webp", temperature: "15°" },
    { id: "8", time: "10 PM", iconSrc: "/images/icon-overcast.webp", temperature: "14°" },
  ];

  const forecastsToRender = forecasts ?? defaultForecasts;

  return (
    <div className="hourly-forecasts">
      <div className="hourly-forecasts-header">
        <p>{title}</p>
        <div className="days-dropdown">
          <div className={`forecasts-dropdown-button ${isDropdownOpen ? 'open' : ''}`} onClick={toggleDropdown}>
            <span>{currentSelectedDay}</span>
            <img src="/images/icon-dropdown.svg" alt="" />
          </div>
          {isDropdownOpen && (
            <div className={`days-dropdown-contents ${isAnimating ? 'closing' : ''}`}>
              {days.map((day) => (
                <button 
                  key={day} 
                  type="button" 
                  onClick={() => handleDaySelection(day)}
                >
                  {day}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      {forecastsToRender.map((forecast) => (
        <div key={forecast.id} className="forecasts-day">
          <div>
            <img src={forecast.iconSrc} alt="" />
            <span>{forecast.time}</span>
          </div>
          <p>{forecast.temperature}</p>
        </div>
      ))}
    </div>
  );
};
