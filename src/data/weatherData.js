// Fallback weather data (used when API is unavailable)
export const fallbackWeatherData = {
  current: {
    city: 'Kolkata',
    country: 'India',
    temp: 20,
    feelsLike: 17,
    tempChange: '3',
    humidity: 9.8,
    wind: 6,
    windDir: 'WSW',
    condition: 'Storm with Heavy Rain',
    description:
      'Variable clouds with snow showers. High 17°C at 10 to 20 mph. Chance of snow 90%. Snow accumulations less than one inch.',
    airQuality: -0.8,
    visibility: 8,
    pressure: 1013,
    uvIndex: 2,
    date: 'Friday, Jan 3, 2003',
    time: '8:45AM',
  },
  miniGraph: [
    { h: '6a', t: 14 },
    { h: '7a', t: 15 },
    { h: '8a', t: 16 },
    { h: '9a', t: 18 },
    { h: '10a', t: 20 },
    { h: '11a', t: 21 },
    { h: '12p', t: 21 },
    { h: '1p', t: 20 },
    { h: '2p', t: 19 },
  ],
  forecast: [
    { city: 'Washington D.C.', country: 'USA', temp: 20, high: 23, low: 18, condition: 'Storm', active: false },
    { city: 'Kolkata',         country: 'India', temp: 17, high: 20, low: 13, condition: 'Storm', active: true  },
    { city: 'Philadelphia',    country: 'USA', temp: 14, high: 18, low: 13, condition: 'Rainy', active: false },
    { city: 'San Francisco',   country: 'USA', temp: 12, high: 14, low: 10, condition: 'Cloudy',active: false },
    { city: 'New York City',   country: 'USA', temp: 10, high: 11, low: -4, condition: 'Rainy', active: false },
    { city: 'South Dakota',    country: 'USA', temp: -8, high: -8, low: -12, condition: 'Snow',  active: false },
    { city: 'North Dakota',    country: 'USA', temp: -9, high: -9, low: -12, condition: 'Snow',  active: false },
  ],
};

// Map OpenWeatherMap condition IDs → display text
export function mapCondition(weatherId) {
  if (weatherId >= 200 && weatherId < 300) return 'Storm';
  if (weatherId >= 300 && weatherId < 400) return 'Rainy';
  if (weatherId >= 500 && weatherId < 600) return 'Rainy';
  if (weatherId >= 600 && weatherId < 700) return 'Snow';
  if (weatherId === 701 || weatherId === 721) return 'Hazy';
  if (weatherId >= 700 && weatherId < 800) return 'Foggy';
  if (weatherId === 800) return 'Clear';
  if (weatherId > 800)  return 'Cloudy';
  return 'Storm';
}

export function mapConditionTitle(condition) {
  const map = {
    'Storm':  'Storm with Heavy Rain',
    'Rainy':  'Rain with Overcast Clouds',
    'Snow':   'Heavy Snow',
    'Hazy':   'Mist & Haze',
    'Foggy':  'Dense Fog',
    'Clear':  'Clear Sky',
    'Cloudy': 'Partly Cloudy',
    'Windy':  'Strong Winds',
  };
  return map[condition] ?? 'Variable Weather';
}
