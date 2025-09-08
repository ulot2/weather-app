import { Header } from "./components/Header";
import { SearchButton } from "./components/SearchButton";
import { WeatherReport } from "./components/WeatherReport";

export default function Home() {
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
