import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudRain, ChevronRight } from 'lucide-react';

export default function WeatherMain({ data }) {
  const { current, weeklyForecast } = data;
  const [showDetails, setShowDetails] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{
        flex: 1,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 32px',
        position: 'relative',
        zIndex: 10,
      }}
    >
      {/* ── NATIONAL WEATHER Label ────────────────────────────── */}
      <motion.div variants={itemVariants} style={{ marginBottom: 20 }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 6,
          padding: '6px 12px',
        }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: '#C9A84C',
            boxShadow: '0 0 8px rgba(201,168,76,0.8)',
          }} />
          <span style={{ color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em' }}>
            NATIONAL WEATHER
          </span>
        </div>
      </motion.div>

      {/* ── Weather Forecast Label ────────────────────────────── */}
      <motion.div variants={itemVariants} style={{ marginBottom: 8 }}>
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, letterSpacing: '0.02em' }}>
          Weather Forecast
        </span>
      </motion.div>

      {/* ── BIG Condition Title ───────────────────────────────── */}
      <motion.h1
        variants={itemVariants}
        style={{
          fontSize: 'clamp(48px, 6vw, 68px)',
          fontWeight: 800,
          color: '#fff',
          lineHeight: 1.05,
          letterSpacing: '-1.5px',
          marginBottom: 16,
        }}
      >
        {current.conditionTitle ?? 'Storm with Heavy Rain'}
      </motion.h1>

      {/* ── Date / Time / Location ────────────────────────────── */}
      <motion.div
        variants={itemVariants}
        style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}
      >
        <CloudRain size={14} color="rgba(255,255,255,0.6)" />
        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: 500 }}>
          {current.country}, {current.date}, {current.time}
        </span>
      </motion.div>

      {/* ── Big Temp + Description ────────────────────────────── */}
      <motion.div
        variants={itemVariants}
        style={{ display: 'flex', alignItems: 'flex-start', gap: 20, marginBottom: 24 }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', marginTop: -8 }}>
          <span style={{ fontSize: 64, fontWeight: 300, color: '#fff', lineHeight: 1 }}>
            {current.temp}°
          </span>
        </div>
        
        <p style={{
          color: 'rgba(255,255,255,0.7)',
          fontSize: 10,
          lineHeight: 1.8,
          maxWidth: 280,
          textTransform: 'capitalize'
        }}>
          {current.description}. High {data.forecast[0]?.high || current.temp}°C. Winds<br/>
          {current.windDir} at {current.wind} to {current.wind + 5} mph.
        </p>
      </motion.div>

      {/* ── Action Row: Button + AQI ─────────────────────────── */}
      <motion.div variants={itemVariants} style={{ position: 'relative', zIndex: 50, display: 'flex', alignItems: 'center', gap: 24 }}>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="details-btn"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            padding: '8px 16px',
            borderRadius: 6,
            fontSize: 9,
            fontWeight: 600,
            color: 'rgba(255,255,255,0.8)',
            background: showDetails ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
            letterSpacing: '0.02em',
            width: 130,
            transition: 'all 0.3s ease'
          }}
        >
          {showDetails ? 'HIDE DETAILS' : 'SEE DETAILS'}
          <motion.span
            animate={{ rotate: showDetails ? 90 : -45 }}
            transition={{ duration: 0.3 }}
            style={{ display: 'inline-block' }}
          >
            ➔
          </motion.span>
        </button>

        {/* AQI Block */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ 
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(255,255,255,0.04)', padding: '6px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)' 
          }}>
             <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 8, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>AQI</span>
             <span style={{ fontSize: 16, fontWeight: 600, color: current.airQuality <= 2 ? '#22c55e' : current.airQuality === 3 ? '#eab308' : current.airQuality === 4 ? '#f97316' : '#ef4444' }}>
               {current.airQuality || '-'}
             </span>
          </div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 9, lineHeight: 1.5, maxWidth: 200 }}>
            {current.airQuality === 1 && "Air quality is excellent. Ideal for outdoor activities."}
            {current.airQuality === 2 && "Air quality is fair. Acceptable for most individuals."}
            {current.airQuality === 3 && "Air quality is moderate. Sensitive groups should limit exertion."}
            {current.airQuality === 4 && "Air quality is poor. Limit prolonged outdoor exposure."}
            {current.airQuality === 5 && "Air quality is very poor. Stay indoors if possible."}
            {!current.airQuality && "Air quality data currently unavailable."}
          </div>
        </div>

        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                top: 56,
                left: 0,
                zIndex: 100,
                width: 320
              }}
            >
              <div style={{
                background: 'rgba(5, 5, 10, 0.95)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 12,
                padding: '16px 20px',
                backdropFilter: 'blur(24px)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.8)'
              }}>
                <h3 style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, letterSpacing: '0.1em', marginBottom: 16, textTransform: 'uppercase' }}>
                  5-Day Prediction
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {weeklyForecast?.map((day, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 12, width: 70, fontWeight: 500 }}>
                        {idx === 0 ? 'Today' : day.day}
                      </span>
                      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 2 }}>
                        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, textTransform: 'capitalize' }}>
                          {day.condition}
                        </span>
                        <span style={{ color: '#38bdf8', fontSize: 9, fontWeight: 500 }}>
                          {day.rainChance || 0}% Rain
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: 70, justifyContent: 'flex-end' }}>
                        <span style={{ color: '#fff', fontSize: 12, fontWeight: 600 }}>{day.high}°</span>
                        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>{day.low}°</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
