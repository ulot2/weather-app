"use client";

import { useState } from "react";
import { Header } from "./components/Header";
import { SearchButton } from "./components/SearchButton";
import { WeatherReport } from "./components/WeatherReport";

export default function Home() {
  // const [query, setQuery] = useState("");
  // const [city, setCity] = useState("Berlin");

  // const onSearch = () => {
  //   if (!query.trim()) return;
  //   setCity(query.trim());
  // };

  return (
    <div className="general-container">
      <div className="container">
        <Header />
        <SearchButton />
        <WeatherReport />
      </div>
    </div>
  );
}


//  return (
//     <div className="general-container">
//       <div className="container">
//         <Header />
//         <SearchButton value={query} onChange={setQuery} onSearch={onSearch} />
//         <WeatherReport city={city} />
//       </div>
//     </div>
//   );