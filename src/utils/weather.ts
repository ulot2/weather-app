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