"use client";
import React, { useState, useEffect } from "react";
import "@/app/styles/Header.css";

interface UnitOption {
  id: string;
  label: string;
  value: string;
}

interface UnitCategory {
  id: string;
  name: string;
  options: UnitOption[];
}

const unitCategories: UnitCategory[] = [
  {
    id: "temperature",
    name: "Temperature",
    options: [
      { id: "celsius", label: "Celsius (°C)", value: "celsius" },
      { id: "fahrenheit", label: "Fahrenheit (°F)", value: "fahrenheit" },
    ],
  },
  {
    id: "windSpeed",
    name: "Wind Speed",
    options: [
      { id: "kmh", label: "km/h", value: "kmh" },
      { id: "mph", label: "mph", value: "mph" },
    ],
  },
  {
    id: "precipitation",
    name: "Precipitation",
    options: [
      { id: "mm", label: "Millimeters (mm)", value: "mm" },
      { id: "in", label: "Inches (in)", value: "in" },
    ],
  },
];

type Units = {
  selectedUnits: {
    temperature: string,
    windSpeed: string,
    precipitation: string
  }
  onUnitsChange: any
};

export const Header: React.FC<Units> = ({selectedUnits, onUnitsChange}) => {
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

  const handleUnitSelection = (categoryId: string, optionValue: string) => {
  // Create the updated units object
  const updatedUnits = {
    ...selectedUnits,
    [categoryId]: optionValue, 
  };
  
  onUnitsChange(updatedUnits); 
};

  const switchToImperial = () => {
    onUnitsChange({
      temperature: "fahrenheit",
      windSpeed: "mph",
      precipitation: "in",
    });
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
            <button type="button" onClick={switchToImperial}>
              Switch to Imperial
            </button>
            {unitCategories.map((category, index) => (
              <React.Fragment key={category.id}>
                <div>
                  <p>{category.name}</p>
                  {category.options.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() =>
                        handleUnitSelection(category.id, option.value)
                      }
                      className={
                        selectedUnits[
                          category.id as keyof typeof selectedUnits
                        ] === option.value
                          ? "selected"
                          : ""
                      }
                    >
                      {option.label}
                      {selectedUnits[
                        category.id as keyof typeof selectedUnits
                      ] === option.value && (
                        <img src="/images/icon-checkmark.svg" alt="" />
                      )}
                    </button>
                  ))}
                </div>
                {index < unitCategories.length - 1 && <hr />}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
