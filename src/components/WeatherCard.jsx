import { motion } from 'framer-motion';
import {
  Cloud, CloudRain, CloudSnow, CloudLightning, Wind, Sun, CloudDrizzle
} from 'lucide-react';

const conditionConfig = {
  'Storm':  { Icon: CloudLightning, color: '#a78bfa' },
  'Rainy':  { Icon: CloudRain,      color: '#60a5fa' },
  'Snow':   { Icon: CloudSnow,      color: '#e2e8f0' },
  'Cloudy': { Icon: Cloud,          color: '#94a3b8' },
  'Clear':  { Icon: Sun,            color: '#fbbf24' },
  'Windy':  { Icon: Wind,           color: '#7dd3fc' },
  'Foggy':  { Icon: CloudDrizzle,   color: '#cbd5e1' },
};

export default function WeatherCard({ city, temp, high, low, condition, active, onClick }) {
  const cfg = conditionConfig[condition] ?? conditionConfig['Storm'];
  const { Icon, color } = cfg;

  return (
    <motion.button
      id={`weather-card-${city.replace(/\s+/g, '-').toLowerCase()}`}
      onClick={onClick}
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.97 }}
      style={{
        flexShrink: 0,
        width: 100,
        cursor: 'pointer',
        background: active ? 'rgba(201,168,76,0.12)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${active ? 'rgba(201,168,76,0.35)' : 'rgba(255,255,255,0.07)'}`,
        borderRadius: 10,
        padding: '10px 12px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        position: 'relative',
        overflow: 'hidden',
        transition: 'background 0.2s ease, border 0.2s ease',
        fontFamily: 'Inter, sans-serif',
        boxShadow: active ? '0 0 18px rgba(201,168,76,0.2)' : 'none',
      }}
    >
      {/* Active underline glow */}
      {active && (
        <motion.div
          layoutId="activeIndicator"
          style={{
            position: 'absolute',
            bottom: 0,
            left: '15%',
            right: '15%',
            height: 2,
            background: 'linear-gradient(90deg, #C9A84C, #F59E0B)',
            borderRadius: '2px 2px 0 0',
            boxShadow: '0 -2px 8px rgba(201,168,76,0.6)',
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      )}

      {/* Weather icon */}
      <Icon size={16} color={color} strokeWidth={1.5} />

      {/* Temperature */}
      <motion.span
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, type: 'spring' }}
        style={{
          fontSize: 20,
          fontWeight: 800,
          color: active ? '#C9A84C' : '#fff',
          lineHeight: 1,
          letterSpacing: '-0.5px',
        }}
      >
        {temp}°
      </motion.span>

      {/* City */}
      <span style={{
        color: active ? 'rgba(201,168,76,0.9)' : 'rgba(255,255,255,0.55)',
        fontSize: 9,
        fontWeight: 500,
        textAlign: 'center',
        lineHeight: 1.3,
      }}>
        {city}
      </span>

      {/* High / Low */}
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        <span style={{ color: '#f87171', fontSize: 9, fontWeight: 600 }}>H:{high}°</span>
        <span style={{ color: '#60a5fa', fontSize: 9, fontWeight: 600 }}>L:{low}°</span>
      </div>
    </motion.button>
  );
}
