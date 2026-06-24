"use client";

import { useEffect, useState } from "react";

// URL of the separate Next.js backend project.
const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

// Pick an emoji for the weather condition text returned by the backend.
function weatherIcon(condition = "") {
  const c = condition.toLowerCase();
  if (c.includes("thunder")) return "⛈️";
  if (c.includes("snow")) return "❄️";
  if (c.includes("drizzle")) return "🌦️";
  if (c.includes("rain") || c.includes("shower")) return "🌧️";
  if (c.includes("fog") || c.includes("rime")) return "🌫️";
  if (c.includes("overcast")) return "☁️";
  if (c.includes("cloud")) return "⛅";
  if (c.includes("clear")) return "☀️";
  return "🌡️";
}

export default function Home() {
  const [online, setOnline] = useState(null); // null = checking
  const [city, setCity] = useState("London");
  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/hello`)
      .then((res) => res.json())
      .then(() => setOnline(true))
      .catch(() => setOnline(false));
  }, []);

  async function getWeather(e) {
    e.preventDefault();
    if (!city.trim()) return;
    setLoading(true);
    setWeatherError("");
    setWeather(null);
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/weather?city=${encodeURIComponent(city)}`
      );
      const data = await res.json();
      if (!res.ok) {
        setWeatherError(data.error || "Could not fetch weather");
      } else {
        setWeather(data);
      }
    } catch {
      setWeatherError("Failed to reach backend");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <div className="hero">
        <h1>Hello World 👋</h1>
        <p>Next.js frontend talking to a separate Next.js backend.</p>
        <span className="badge">
          <span className={`dot ${online === false ? "offline" : ""}`} />
          {online === null
            ? "Checking backend…"
            : online
            ? "Backend online"
            : "Backend offline"}
        </span>
      </div>

      <div className="card">
        <form className="search" onSubmit={getWeather}>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Search a city…"
            aria-label="City"
          />
          <button type="submit" disabled={loading}>
            {loading ? "…" : "Search"}
          </button>
        </form>

        {loading && <div className="skeleton" />}

        {!loading && weatherError && <p className="error">⚠️ {weatherError}</p>}

        {!loading && weather && (
          <div className="weather">
            <p className="place">
              📍 {weather.city}
              {weather.country ? `, ${weather.country}` : ""}
            </p>
            <div className="icon">{weatherIcon(weather.condition)}</div>
            <p className="temp">
              {Math.round(weather.temperature)}
              {weather.temperatureUnit}
            </p>
            <p className="condition">{weather.condition}</p>
            <div className="stats">
              <div className="stat">
                <div className="label">Humidity</div>
                <div className="value">{weather.humidity}%</div>
              </div>
              <div className="stat">
                <div className="label">Wind</div>
                <div className="value">
                  {weather.windSpeed} {weather.windSpeedUnit}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <p className="footer">Weather data by Open-Meteo · free, no API key</p>
    </main>
  );
}
