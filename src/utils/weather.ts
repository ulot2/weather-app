"use client"

export type Units = {
  temperature: string,
  windSpeed: string,
  precipitation: string
}

export type City = {
  id: string | number;
  name: string;
  country: string;
  admin1?: string;
  latitude?: number;
  longitude?: number;
};

export async function getWeatherData(
  latitude: number,
  longitude: number,
  units: Units
) {
  try {
    const temperatureUnit = units.temperature === "fahrenheit" ? "fahrenheit" : "celsius";
    const windSpeedUnit = units.windSpeed === "mph" ? "mph" : "kmh";
    const precipitationUnit = units.precipitation === "in" ? "inch" : "mm";

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,precipitation,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&hourly=temperature_2m,weather_code&timezone=auto&temperature_unit=${temperatureUnit}&wind_speed_unit=${windSpeedUnit}&precipitation_unit=${precipitationUnit}`;

    const response = await fetch(url);
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching weather:", error);
    throw error;
  }
}

export function getTemperatureUnit(units:Units) {
  return units.temperature === 'fahrenheit' ? '°F' : '°C';
}

export function getWindSpeedUnit(units:Units) {
  return units.windSpeed === 'mph' ? 'mph' : 'km/h';
}

export function getPrecipitationUnit(units:Units) {
  return units.precipitation === 'in' ? 'in' : 'mm';
}

export function formatTemperature(temp:number, units:Units) {
  const unit = units.temperature === 'fahrenheit' ? '°F' : '°C';
  return `${Math.round(temp)}${unit}`;
}

export const weatherCodeToIcon: Record<number, string> = {
  0: "icon-sunny.webp",
  1: "icon-partly-cloudy.webp",
  2: "icon-partly-cloudy.webp",
  3: "icon-overcast.webp", 
  45: "icon-fog.webp",
  48: "icon-fog.webp", 
  51: "icon-drizzle.webp", 
  53: "icon-drizzle.webp", 
  55: "icon-drizzle.webp", 
  61: "icon-rain.webp", 
  63: "icon-rain.webp",
  65: "icon-rain.webp", 
  71: "icon-snow.webp", 
  73: "icon-snow.webp", 
  75: "icon-snow.webp", 
  80: "icon-rain.webp", 
  81: "icon-rain.webp", 
  82: "icon-rain.webp", 
  95: "icon-storm.webp", 
  96: "icon-storm.webp", 
  99: "icon-storm.webp", 
};

export function getWeatherIcon(weatherCode: number) {
  return weatherCodeToIcon[weatherCode] || "icon-sunny.webp";
}

interface DailyData {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
}

export function transformDailyData(dailyData: DailyData) {
  if (!dailyData || !dailyData.time) return [];

  return dailyData.time.map((date, index) => {
    const dayName = new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
    });

    return {
      id: (index + 1).toString(),
      day: dayName,
      iconSrc: `/images/${getWeatherIcon(dailyData.weather_code[index])}`,
      highTemp: `${Math.round(dailyData.temperature_2m_max[index])}°`,
      lowTemp: `${Math.round(dailyData.temperature_2m_min[index])}°`,
    };
  });
}

interface HourlyData {
  time: string[];
  weather_code: number[];
  temperature_2m: number[];
}

export function transformHourlyData(
  hourlyData: HourlyData,
  selectedDate: string | null = null
) {
  if (!hourlyData || !hourlyData.time) return [];

  let startIndex = 0;
  if (selectedDate) {
    startIndex = hourlyData.time.findIndex((time) =>
      time.startsWith(selectedDate)
    );
    if (startIndex === -1) startIndex = 0;
  }

  return hourlyData.time
    .slice(startIndex, startIndex + 8)
    .map((time, index) => {
      const actualIndex = startIndex + index;
      const hour = new Date(time).toLocaleTimeString("en-US", {
        hour: "numeric",
        hour12: true,
      });

      return {
        id: (index + 1).toString(),
        time: hour,
        iconSrc: `/images/${getWeatherIcon(
          hourlyData.weather_code[actualIndex]
        )}`,
        temperature: `${Math.round(hourlyData.temperature_2m[actualIndex])}°`,
      };
    });
}

export async function searchCity(cityName: string) {
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      cityName
    )}&count=5&language=en&format=json`;

    const response = await fetch(url);
    const data: { results?: City[] } = await response.json();

    console.log("Geocoding response", data);

    return data.results || [];
  } catch (error) {
    console.error("Error searching:", error);
    throw error;
  }
}

export async function reverseGeocode(latitude: number, longitude: number): Promise<string> {
  try {

    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Reverse geocoding failed');
    }
    
    const data = await response.json();
    
    if (data) {
      const city = data.city || data.locality || data.principalSubdivision || 'Unknown City';
      const country = data.countryName || 'Unknown Country';
      
      return `${city}, ${country}`;
    } else {
      return `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
    }
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
  }
}