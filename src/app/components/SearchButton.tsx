"use client";
import React, { useState } from "react";
import "@/app/styles/SearchButton.css";
import { searchCity, type City } from "@/utils/weather";

interface SearchButtonProps {
  onCitySelect: (city: City) => void;
  currentCity: string;
}

export const SearchButton: React.FC<SearchButtonProps> = ({ onCitySelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<City[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!searchTerm.trim()) {
      setError("Please enter a city name");
      return;
    }

    try {
      setIsSearching(true);
      setError(null);

      const results = await searchCity(searchTerm);

      if (results.length === 0) {
        setError("No cities found. Try a different search term.");
        setSearchResults([]);
        setShowResults(false);
      } else {
        setSearchResults(results);
        setShowResults(true);
        setError(null);
      }
    } catch (err) {
      setError("Failed to search for cities. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleCitySelection = (city: City) => {
    onCitySelect(city);
    setShowResults(false);
    setSearchTerm("");
    setSearchResults([]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (error) setError(null);
  };

  return (
    <>
      <div className="search-container">
        <h1>{"How's the sky looking today?"}</h1>

        <div className="blahh">
          <form onSubmit={handleSearch} className="search-input">
            <div className="search">
              <img src="/images/icon-search.svg" alt="icon-search" />
              <input
                type="search"
                value={searchTerm}
                onChange={handleInputChange}
                placeholder="Search for a place..."
                disabled={isSearching}
              />
            </div>
            <button type="submit" disabled={isSearching}>
              Search
            </button>
          </form>
          {isSearching && <div className='searching-state'>
            <img src="/images/icon-loading.svg" alt="icon-loading" />
            <span>Search in progress</span>
          </div> }
          {showResults && (
          <div className="search-results">
            {searchResults.map((city) => (
              <button
                key={`${city.id}-${city.country}`}
                onClick={() => handleCitySelection(city)}
                className="city-result"
              >
                <strong>{city.name}</strong>
                <span>
                  {city.country}
                  {city.admin1 ? `, ${city.admin1}` : ""}
                </span>
              </button>
            ))}
          </div>
        )}
        </div>

        {error && (
          <p className="input-error">
            <img src="/images/icon-error.svg" alt="icon-error" />
            {error}
          </p>
        )}
      </div>
    </>
  );
};
