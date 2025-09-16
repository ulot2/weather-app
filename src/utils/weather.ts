export async function getWeatherData(
  latitude: number,
  longitude: number,
  units: {
    temperature: string,
    windSpeed: string,
    precipitation: string
  }
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

type Units = {
  temperature: string,
    windSpeed: string,
    precipitation: string,
};

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
  0: "icon-sunny.webp", // Clear sky
  1: "icon-partly-cloudy.webp", // Mainly clear
  2: "icon-partly-cloudy.webp", // Partly cloudy
  3: "icon-overcast.webp", // Overcast
  45: "icon-fog.webp", // Fog
  48: "icon-fog.webp", // Depositing rime fog
  51: "icon-drizzle.webp", // Light drizzle
  53: "icon-drizzle.webp", // Moderate drizzle
  55: "icon-drizzle.webp", // Dense drizzle
  61: "icon-rain.webp", // Light rain
  63: "icon-rain.webp", // Moderate rain
  65: "icon-rain.webp", // Heavy rain
  71: "icon-snow.webp", // Light snow
  73: "icon-snow.webp", // Moderate snow
  75: "icon-snow.webp", // Heavy snow
  80: "icon-rain.webp", // Light rain showers
  81: "icon-rain.webp", // Moderate rain showers
  82: "icon-rain.webp", // Violent rain showers
  95: "icon-storm.webp", // Thunderstorm
  96: "icon-storm.webp", // Thunderstorm with light hail
  99: "icon-storm.webp", // Thunderstorm with heavy hail
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
    const data = await response.json();

    console.log("Geocoding response", data);

    return data.results || [];
  } catch (error) {
    console.error("Error searching:", error);
    throw error;
  }
}
