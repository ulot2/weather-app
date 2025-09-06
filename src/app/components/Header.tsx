"use client";
import React, { useState, useEffect } from "react";
import "@/app/styles/Header.css";

export const Header = () => {
  const [isUnitsDropdownOpen, setIsUnitsDropdownOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const toggleDropdown = () => {
    if (isUnitsDropdownOpen) {
      setIsAnimating(true);
      setTimeout(() => {
        setIsUnitsDropdownOpen(false);
        setIsAnimating(false);
      }, 300);
    } else {
      setIsUnitsDropdownOpen(true);
    }
  };

  return (
    <div className="header">
      <div className="logo-container">
        <img src="/images/logo.svg" alt="logo" className="logo-image" />
      </div>
      <div className="unit-dropdown">
        <div
          className={`units-dropdown-button ${
            isUnitsDropdownOpen ? "open" : ""
          }`}
          onClick={toggleDropdown}
        >
          <img src="/images/icon-units.svg" alt="icon" />
          <span>Units</span>
          <img src="/images/icon-dropdown.svg" alt="" />
        </div>
        {isUnitsDropdownOpen && (
          <div
            className={`units-dropdown-content ${isAnimating ? "closing" : ""}`}
          >
            <button type="button">Switch to Imperial</button>
            <div>
              <p>Temperature</p>
              <button type="button">
                Celsius (°C) <img src="/images/icon-checkmark.svg" alt="" />
              </button>
              <button type="button">
                Fahrenheit (°F) <img src="/images/icon-checkmark.svg" alt="" />
              </button>
            </div>
            <hr />
            <div>
              <p>Wind Speed</p>
              <button type="button">
                km/h <img src="/images/icon-checkmark.svg" alt="" />
              </button>
              <button type="button">
                mph <img src="/images/icon-checkmark.svg" alt="" />
              </button>
            </div>
            <hr />
            <div>
              <p>Precipitation</p>
              <button type="button">
                Millimeters (mm) <img src="/images/icon-checkmark.svg" alt="" />
              </button>
              <button type="button">
                Inches (in) <img src="/images/icon-checkmark.svg" alt="" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
