import { NextResponse } from "next/server";

// In production set ALLOWED_ORIGIN to your Vercel URL (e.g. https://your-app.vercel.app).
const corsHeaders = {
  "Access-Control-Allow-Origin": process.env.ALLOWED_ORIGIN || "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// Map Open-Meteo weather codes to a human-readable description.
// https://open-meteo.com/en/docs (WMO weather interpretation codes)
const WEATHER_CODES = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  71: "Slight snow",
  73: "Moderate snow",
  75: "Heavy snow",
  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  95: "Thunderstorm",
  96: "Thunderstorm with slight hail",
  99: "Thunderstorm with heavy hail",
};

// Fetch JSON with a small retry to ride out transient network hiccups.
async function fetchJson(url, attempts = 3) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr;
}

// Backend: GET /api/weather?city=London
// Uses Open-Meteo (free, no API key required).
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const city = (searchParams.get("city") || "London").trim();

  try {
    // 1) Geocode the city name -> latitude/longitude.
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      city
    )}&count=1&language=en&format=json`;
    const geoData = await fetchJson(geoUrl);

    if (!geoData.results || geoData.results.length === 0) {
      return NextResponse.json(
        { error: `City not found: ${city}` },
        { status: 404, headers: corsHeaders }
      );
    }

    const place = geoData.results[0];

    // 2) Fetch current weather for those coordinates.
    const wxUrl = `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`;
    const wxData = await fetchJson(wxUrl);
    const cur = wxData.current;

    return NextResponse.json(
      {
        city: place.name,
        country: place.country,
        latitude: place.latitude,
        longitude: place.longitude,
        temperature: cur.temperature_2m,
        temperatureUnit: wxData.current_units.temperature_2m,
        humidity: cur.relative_humidity_2m,
        windSpeed: cur.wind_speed_10m,
        windSpeedUnit: wxData.current_units.wind_speed_10m,
        condition: WEATHER_CODES[cur.weather_code] || "Unknown",
        observedAt: cur.time,
      },
      { headers: corsHeaders }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch weather data" },
      { status: 502, headers: corsHeaders }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}
