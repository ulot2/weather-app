export async function getWeatherData(latitude: number, longitude: number) {
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,precipitation&timezone=auto`;

        const response = await fetch(url);
        const data = await response.json();

        console.log('Raw API response:', data);

        return data;
        
    } catch (error) {
        console.error('Error fetching weather:', error);
        throw error;
    }
}

export async function getDailyHourlyForecastData(latitude: number, longitude: number) {
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min&hourly=temperature_2m,weather_code,weather_code`

        const response = await fetch(url);
        const data = await response.json();

        return data;
    } catch (error) {
        throw error;
    }
}

export const weatherCodeToIcon: Record<number, string> = {
  0: 'icon-sunny.webp',           // Clear sky
  1: 'icon-partly-cloudy.webp',   // Mainly clear
  2: 'icon-partly-cloudy.webp',   // Partly cloudy
  3: 'icon-overcast.webp',        // Overcast
  45: 'icon-fog.webp',            // Fog
  48: 'icon-fog.webp',            // Depositing rime fog
  51: 'icon-drizzle.webp',        // Light drizzle
  53: 'icon-drizzle.webp',        // Moderate drizzle
  55: 'icon-drizzle.webp',        // Dense drizzle
  61: 'icon-rain.webp',           // Light rain
  63: 'icon-rain.webp',           // Moderate rain
  65: 'icon-rain.webp',           // Heavy rain
  71: 'icon-snow.webp',           // Light snow
  73: 'icon-snow.webp',           // Moderate snow
  75: 'icon-snow.webp',           // Heavy snow
  80: 'icon-rain.webp',           // Light rain showers
  81: 'icon-rain.webp',           // Moderate rain showers
  82: 'icon-rain.webp',           // Violent rain showers
  95: 'icon-storm.webp',          // Thunderstorm
  96: 'icon-storm.webp',          // Thunderstorm with light hail
  99: 'icon-storm.webp',          // Thunderstorm with heavy hail
};

export function getWeatherIcon(weatherCode: number) {
  return weatherCodeToIcon[weatherCode] || 'icon-sunny.webp';
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
    // Convert date string to day name
    const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
    
    return {
      id: (index + 1).toString(),
      day: dayName,
      iconSrc: `/images/${getWeatherIcon(dailyData.weather_code[index])}`,
      highTemp: `${Math.round(dailyData.temperature_2m_max[index])}°`,
      lowTemp: `${Math.round(dailyData.temperature_2m_min[index])}°`
    };
  });
}