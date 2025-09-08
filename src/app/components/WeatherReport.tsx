import React from 'react'
import "@/app/styles/WeatherReport.css"
import { WeatherMetrics } from './WeatherMetrics'
import { DailyForecasts } from './DailyForecasts'
import { HourlyForecasts } from './HourlyForecasts'


export const WeatherReport = () => {
  return (
    <div className='weather-report'>
        <div>
            <WeatherMetrics />
            <DailyForecasts />
        </div>
        <div>
            <HourlyForecasts />
        </div>
    </div>
  )
}
