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

  // no default city — null means "no current city selected / no automatic location"
  const [currentCity, setCurrentCity] = useState<Cityy>(null);

  // ensure we only set initial location once from geolocation
  const [initialLocationSet, setInitialLocationSet] = useState(false);

  const [selectedUnits, setSelectedUnits] = useState<UnitSelection>({
    temperature: "celsius",
    windSpeed: "km/h",
    precipitation: "mm",
  });

  useEffect(() => {
    const setUserLocation = async () => {
      // only set when we actually have a userLocation and haven't set initially
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
            country: "", // optional, set if reverseGeocode returns it
          });
        } catch (err) {
          // fallback to coords-only name if reverse geocode fails
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

      // If locationError (user denied), mark initialLocationSet so we stop waiting
      if (locationError && !initialLocationSet) {
        setInitialLocationSet(true);
        // DO NOT set a default city — remain null so only Header + SearchButton show
      }
    };

    setUserLocation();
  }, [userLocation, locationError, initialLocationSet]);

  const handleCitySelect = (city: NonNullable<Cityy>) => {
    // user selecting a city should set currentCity
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

        {/* pass current city name if available, otherwise empty string */}
        <SearchButton onCitySelect={handleCitySelect} currentCity={currentCity?.name ?? ""} />

        {/* Show loading while geolocation is in progress */}
        {locationLoading && (
          <div className="loading-location">
            <img src="/images/icon-loading.svg" alt="icon-loading" />
            <p> Getting your location...</p>
          </div>
        )}

        {/* If we have valid coords, show WeatherReport.
            If user denied location (locationError), currentCity will be null
            — so nothing else renders (only Header + SearchButton remain). */}
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
