"use client";

import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { SearchButton } from "./components/SearchButton";
import { WeatherReport } from "./components/WeatherReport";
import { useGeolocation } from "@/hooks/useGeolocation";
import { reverseGeocode } from "@/utils/weather";

type Cityy = {
  latitude?: number;
  longitude?: number;
  name: string;
  country: string;
} | null;

type UnitSelection = {
  temperature: string;
  windSpeed: string;
  precipitation: string;
};

export default function Home() {
  const {
    location: userLocation,
    loading: locationLoading,
    error: locationError,
  } = useGeolocation();


  const [currentCity, setCurrentCity] = useState<Cityy>(null);

  const [initialLocationSet, setInitialLocationSet] = useState(false);

  const [selectedUnits, setSelectedUnits] = useState<UnitSelection>({
    temperature: "celsius",
    windSpeed: "km/h",
    precipitation: "mm",
  });

  useEffect(() => {
    const setUserLocation = async () => {
    
      if (userLocation && !initialLocationSet && !locationError) {
        try {
          const cityName = await reverseGeocode(
            userLocation.latitude,
            userLocation.longitude
          );
          setCurrentCity({
            name: cityName,
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            country: "",
          });
        } catch (err) {
          
          setCurrentCity({
            name: `${userLocation.latitude.toFixed(
              2
            )}, ${userLocation.longitude.toFixed(2)}`,
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            country: "",
          });
        } finally {
          setInitialLocationSet(true);
        }
      }

 
      if (locationError && !initialLocationSet) {
        setInitialLocationSet(true);
      
      }
    };

    setUserLocation();
  }, [userLocation, locationError, initialLocationSet]);

  const handleCitySelect = (city: NonNullable<Cityy>) => {
  
    setCurrentCity({
      name: `${city.name}, ${city.country}`,
      latitude: city.latitude,
      longitude: city.longitude,
      country: city.country,
    });
  };

  const handleUnitsChange = (newUnits: UnitSelection) => {
    setSelectedUnits(newUnits);
  };

  return (
    <div className="general-container">
      <div className="container">
        <Header selectedUnits={selectedUnits} onUnitsChange={handleUnitsChange} />

        <SearchButton onCitySelect={handleCitySelect} currentCity={currentCity?.name ?? ""} />

        {locationLoading && (
          <div className="loading-location">
            <img src="/images/icon-loading.svg" alt="icon-loading" />
            <p> Getting your location...</p>
          </div>
        )}

        
        {!locationLoading &&
          currentCity &&
          currentCity.latitude != null &&
          currentCity.longitude != null && (
            <WeatherReport
              latitude={currentCity.latitude}
              longitude={currentCity.longitude}
              cityName={currentCity.name}
              units={selectedUnits}
            />
          )}
      </div>
    </div>
  );
}
