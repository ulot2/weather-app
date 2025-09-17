"use client"

import { useState, useEffect } from 'react';

type GeoLocation = {
  latitude: number;
  longitude: number;
} | null;

type GeoError = string | null;

export function useGeolocation() {
  const [location, setLocation] = useState<GeoLocation>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<GeoError>(null);

  useEffect(() => {
    const getCurrentLocation = () => {
      if (!navigator.geolocation) {
        setError('Geolocation is not supported by this browser');
        setLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLoading(false);
        },
        
        (error) => {
          console.log('Geolocation error:', error);
          setError(error.message);
          setLoading(false);
        },
        
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, 
        }
      );
    };

    getCurrentLocation();
  }, []);

  return { location, loading, error };
}