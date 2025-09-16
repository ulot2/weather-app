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

  const handleCitySelect = (city:City) => {
    setCurrentCity({
      name: `${city.name}, ${city.country}`,
      latitude: city.latitude,
      longitude: city.longitude
    });
  };

  return (
    <div className="general-container">
      <div className="container">
        <Header />
        <SearchButton 
          onCitySelect={handleCitySelect}
          currentCity={currentCity.name}
        />
        <WeatherReport 
          latitude={currentCity.latitude}
          longitude={currentCity.longitude}
          cityName={currentCity.name}
        />
      </div>
    </div>
  );
}