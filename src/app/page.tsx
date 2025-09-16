"use client";

import { useState } from "react";
import { Header } from "./components/Header";
import { SearchButton } from "./components/SearchButton";
import { WeatherReport } from "./components/WeatherReport";

type City = {
  latitude: number;
  longitude: number;
  name: string;
  country: string;
};

export default function Home() {
  const [currentCity, setCurrentCity] = useState({
    name: "Berlin, Germany",
    latitude: 52.52,
    longitude: 13.41
  });

  const [selectedUnits, setSelectedUnits] = useState({
    temperature: 'celsius',
    windSpeed: "km/h",
    precipitation: "mm"
  })

  const handleCitySelect = (city:City) => {
    setCurrentCity({
      name: `${city.name}, ${city.country}`,
      latitude: city.latitude,
      longitude: city.longitude
    });
  };

  const handleUnitsChange = (newUnits:any) => {
    setSelectedUnits(newUnits)
  }

  return (
    <div className="general-container">
      <div className="container">
        <Header 
          selectedUnits={selectedUnits}
          onUnitsChange={handleUnitsChange}
         />
        <SearchButton 
          onCitySelect={handleCitySelect}
          currentCity={currentCity.name}
        />
        <WeatherReport 
          latitude={currentCity.latitude}
          longitude={currentCity.longitude}
          cityName={currentCity.name}
          units={selectedUnits}
        />
      </div>
    </div>
  );
}