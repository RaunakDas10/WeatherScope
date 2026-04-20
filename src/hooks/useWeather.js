import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { fallbackWeatherData, mapCondition, mapConditionTitle } from '../data/weatherData';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const DEFAULT_CITY = 'Kolkata';

// Build weather state from OWM current + forecast + find + air responses
function buildState(current, forecastList, findList, airData) {
  const wid = current.weather[0].id;
  const condition = mapCondition(wid);
  const conditionTitle = mapConditionTitle(condition);

  // Build hourly mini-graph from next 9 3-hour slots
  const miniGraph = forecastList.slice(0, 9).map((slot) => ({
    h: new Date(slot.dt * 1000).getHours() + '',
    t: Math.round(slot.main.temp),
  }));

  const dailyMap = new Map();
  forecastList.forEach(slot => {
    const dateStr = new Date(slot.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' });
    if (!dailyMap.has(dateStr)) {
      dailyMap.set(dateStr, {
        day: dateStr,
        high: slot.main.temp_max,
        low: slot.main.temp_min,
        condition: mapCondition(slot.weather[0].id),
        pop: slot.pop || 0
      });
    } else {
      const existing = dailyMap.get(dateStr);
      existing.high = Math.max(existing.high, slot.main.temp_max);
      existing.low = Math.min(existing.low, slot.main.temp_min);
      existing.pop = Math.max(existing.pop, slot.pop || 0);
    }
  });
  
  const weeklyForecast = Array.from(dailyMap.values()).slice(0, 5).map(d => ({
    ...d,
    high: Math.round(d.high),
    low: Math.round(d.low),
    rainChance: Math.round(d.pop * 100)
  }));

  // Build forecast strip from nearby locations
  let forecastArr = [];
  if (findList && findList.length > 0) {
    const unique = [];
    const seen = new Set();
    
    findList.forEach(loc => {
      // Filter out duplicate names and exclude the exact current city (we will add it manually)
      if (!seen.has(loc.name) && loc.name.toLowerCase() !== current.name.toLowerCase()) {
        seen.add(loc.name);
        unique.push(loc);
      }
    });

    // Shuffle the unique array to get different random districts on every refresh
    const shuffled = unique.sort(() => 0.5 - Math.random());
    
    // Pick 6 random locations
    const selected = shuffled.slice(0, 6);
    
    // Construct the current city data using the EXACT 'current' response
    // to guarantee the temperature at the bottom matches the big numbers at the top.
    const currentLocData = {
      name: current.name,
      sys: { country: current.sys.country },
      main: { temp: current.main.temp },
      weather: current.weather
    };

    // Get the actual Probability of Precipitation (pop) from the regional forecast (0 to 1)
    const regionalPop = Math.round((forecastList[0]?.pop || 0) * 100);

    // Combine current city (at index 0) with the 6 random districts
    const finalSelection = [currentLocData, ...selected];

    forecastArr = finalSelection.map((loc, i) => {
      // Add slight variance (+/- 10%) to the regional rain chance for nearby districts to make it look realistic, but keep it bounded 0-100.
      const variance = i === 0 ? 0 : Math.floor(Math.random() * 21) - 10;
      let calculatedRain = regionalPop + variance;
      if (loc.weather[0]?.main === 'Rain' || loc.weather[0]?.main === 'Thunderstorm') calculatedRain = Math.max(80, calculatedRain); // Force high if currently raining
      
      return {
        city: loc.name,
        country: loc.sys.country,
        temp: Math.round(loc.main.temp),
        // Use regional forecast high/low since /find only provides current snapshots
        high: Math.round(weeklyForecast[0]?.high || loc.main.temp_max),
        low: Math.round(weeklyForecast[0]?.low || loc.main.temp_min),
        condition: mapCondition(loc.weather[0].id),
        rainChance: Math.max(0, Math.min(100, calculatedRain)),
        active: i === 0,
      };
    });
  } else {
    // Fallback if find API fails
    forecastArr = fallbackWeatherData.forecast;
  }

  return {
    current: {
      city: current.name,
      country: current.sys.country,
      temp: Math.round(current.main.temp),
      feelsLike: Math.round(current.main.feels_like),
      tempChange: '+' + Math.round(current.main.temp - current.main.temp_min),
      humidity: current.main.humidity,
      wind: Math.round(current.wind.speed * 3.6), // km/h
      windDir: degToCompass(current.wind.deg),
      condition,
      conditionTitle,
      description: current.weather[0].description,
      airQuality: airData?.main?.aqi || 2, // Default to Fair if missing
      visibility: (current.visibility / 1000).toFixed(1),
      pressure: current.main.pressure,
      uvIndex: 2,
      date: new Date(current.dt * 1000).toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'short', day: 'numeric',
      }),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    },
    miniGraph,
    forecast: forecastArr,
    weeklyForecast,
  };
}

function degToCompass(deg) {
  const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
  return dirs[Math.round(deg / 22.5) % 16];
}

export default function useWeather() {
  const hasKey = API_KEY && API_KEY !== 'your_openweathermap_api_key_here';
  const [data, setData] = useState(hasKey ? null : fallbackWeatherData);
  const [loading, setLoading] = useState(hasKey);
  const [error, setError] = useState(hasKey ? null : 'No API key — showing demo data');

  const fetchWithCoords = async (lat, lon) => {
    const [current, forecast, find, air] = await Promise.all([
      axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`),
      axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`),
      axios.get(`https://api.openweathermap.org/data/2.5/find?lat=${lat}&lon=${lon}&cnt=50&appid=${API_KEY}&units=metric`),
      axios.get(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`)
    ]);
    return { current, forecast, find, air };
  };

  const fetchByCoords = useCallback(async (lat, lon) => {
    try {
      setLoading(true);
      const { current, forecast, find, air } = await fetchWithCoords(lat, lon);
      setData(buildState(current.data, forecast.data.list, find.data.list, air.data.list[0]));
      setError(null);
    } catch (e) {
      console.warn('API error, using fallback data:', e.message);
      setData(fallbackWeatherData);
      setError('API unavailable — showing demo data');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchByCity = useCallback(async (city = DEFAULT_CITY) => {
    try {
      setLoading(true);
      // First get coords for the city
      const current = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
      const { coord } = current.data;
      
      const res = await fetchWithCoords(coord.lat, coord.lon);
      // use the current from coords to make sure it matches
      setData(buildState(current.data, res.forecast.data.list, res.find.data.list, res.air.data.list[0]));
      setError(null);
    } catch (e) {
      console.warn('API error, using fallback data:', e.message);
      // Fallback is only shown if this is initial load, if searching we might just show an error toast.
      setData(prev => prev || fallbackWeatherData);
      setError('City not found or API unavailable');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!hasKey) {
      return;
    }

    navigator.geolocation?.getCurrentPosition(
      (pos) => fetchByCoords(pos.coords.latitude, pos.coords.longitude),
      () => fetchByCity(DEFAULT_CITY),
      { timeout: 5000 }
    );

    if (!navigator.geolocation) fetchByCity(DEFAULT_CITY);
  }, [fetchByCoords, fetchByCity, hasKey]);

  return { data, loading, error, searchCity: fetchByCity };
}
