"use client"
import React, { useEffect, useRef, useState } from "react";
import "@/app/styles/HourlyForecasts.css";
import { getWeatherData, transformHourlyData } from "@/utils/weather";

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
  latitude:number;
  longitude:number;
  units: {
    temperature: string,
    windSpeed: string,
    precipitation: string
  }
}

export const HourlyForecasts: React.FC<HourlyForecastsProps> = ({
  title = "Hourly forecast",
  selectedDay = "Tuesday",
  forecasts,
  latitude, longitude, units
}) => {
  type WeatherApiResponse = {
    hourly?: {
      time?: string[];
      weather_code?: number[];
      temperature_2m?: number[];
    };
  };

  const [hourlyForecastData, setHourlyForecastData] = useState<WeatherApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentSelectedDay, setCurrentSelectedDay] = useState(selectedDay);
  const dropdownRef = useRef<HTMLDivElement>(null)

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const toggleDropdown = () => {
    if (isDropdownOpen) {
      setIsAnimating(true);
      setTimeout(() => {
        setIsDropdownOpen(false);
        setIsAnimating(false);
      }, 300);
    } else {
      setIsDropdownOpen(true);
    }
  };

  useEffect(() => {
    function handleClickOutside (event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsAnimating(true);
        setTimeout(() => {
          setIsDropdownOpen(false);
          setIsAnimating(false);
        }, 300);
      } 
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleDaySelection = (day: string) => {
    setCurrentSelectedDay(day);
    setIsAnimating(true);
    setTimeout(() => {
      setIsDropdownOpen(false);
      setIsAnimating(false);
    }, 300);
  };

  useEffect(() => {
    const getHourlyForecastData = async () => {
      
      try {
        setLoading(true)
        const data = await getWeatherData(latitude, longitude, units);
        setHourlyForecastData(data)
        setError(null)
      } catch (error) {
        setError('Failed to fetch data');
        console.error("Weather fetch error", error);
      } finally {
        setLoading(false);
      }
    };
    getHourlyForecastData()
  }, [latitude, longitude, units]);

  const getDateForDay = (dayName: string) => {
    if (!hourlyForecastData?.hourly?.time) return null;

    const dayIndex = days.indexOf(dayName);
    return hourlyForecastData.hourly.time[dayIndex];
  }

  const getHourlyForecasts = () => {
    if (!hourlyForecastData?.hourly || loading) return null;
    
    const selectedDate = getDateForDay(currentSelectedDay);
    const hourly = hourlyForecastData.hourly;
    const safeHourly = {
      time: hourly.time ?? [],
      weather_code: hourly.weather_code ?? [],
      temperature_2m: hourly.temperature_2m ?? []
    };
    return transformHourlyData(safeHourly, selectedDate);
  };

  const defaultForecasts: HourlyForecastItem[] = [
    { id: "1", time: "", iconSrc: "#", temperature: "" },
    { id: "2", time: "", iconSrc: "#", temperature: "" },
    { id: "3", time: "", iconSrc: "#", temperature: "" },
    { id: "4", time: "", iconSrc: "#", temperature: "" },
    { id: "5", time: "", iconSrc: "#", temperature: "" },
    { id: "6", time: "", iconSrc: "#", temperature: "" },
    { id: "7", time: "", iconSrc: "#", temperature: "" },
    { id: "8", time: "", iconSrc: "#", temperature: "" },
  ];

   let forecastsToRender;
  if (forecasts) {
    forecastsToRender = forecasts;
  } else if (hourlyForecastData && !loading) {
    forecastsToRender = getHourlyForecasts();
  } else {
    forecastsToRender = defaultForecasts;
  }

  return (
    <div className="hourly-forecasts">
      <div className="hourly-forecasts-header">
        <p>{title}</p>
        <div className="days-dropdown" ref={dropdownRef}>
          <div className={`forecasts-dropdown-button ${isDropdownOpen ? 'open' : ''}`} onClick={toggleDropdown} >
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
      {forecastsToRender && forecastsToRender.map((forecast) => (
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