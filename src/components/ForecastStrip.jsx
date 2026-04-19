import { useState } from 'react';
import { motion } from 'framer-motion';
import GraphWave from './GraphWave';

export default function ForecastStrip({ forecast }) {
  const [activeIdx, setActiveIdx] = useState(
    forecast.findIndex((f) => f.active) > -1 ? forecast.findIndex((f) => f.active) : 1
  );

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut', delay: 0.4 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full px-2 lg:px-5 flex flex-col relative z-0 overflow-x-auto"
    >
      <div className="min-w-[600px] flex flex-col w-full">
        {/* ── High / Low Row ──────────────────────────────────────── */}
        <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', marginBottom: 10 }}>
          {forecast.map((city, i) => (
            <motion.div key={`hl-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 + i * 0.1 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}
            >
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10 }}>High {city.high}{i === 0 ? '.0' : ''}°C</span>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>low {city.low}°C</span>
              <span style={{ color: '#38bdf8', fontSize: 9, marginTop: 4, fontWeight: 500, letterSpacing: '0.05em' }}>
                {city.rainChance}% Rain
              </span>
            </motion.div>
          ))}
        </div>

        {/* ── Wave Graph ──────────────────────────────────────────── */}
        <div style={{ width: '100%', marginBottom: 20 }}>
          <GraphWave forecast={forecast} />
        </div>

        {/* ── Bottom Info Row ────────────────────────────────────── */}
        <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
          {forecast.map((city, i) => {
            const isActive = activeIdx === i;
            return (
              <motion.div
                key={`info-${i}`}
                onClick={() => setActiveIdx(i)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  flex: 1,
                  cursor: 'pointer',
                  gap: 12
                }}
              >
                {/* Temperature */}
                <span style={{
                  color: '#fff',
                  fontSize: 28,
                  fontWeight: 500,
                  letterSpacing: '-1px'
                }}>
                  {city.temp}°
                </span>

                {/* City Name */}
                <span style={{
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: 10,
                  fontWeight: isActive ? 600 : 400,
                  textAlign: 'center',
                  whiteSpace: 'nowrap'
                }}>
                  {city.city}
                </span>

                {/* Underlines */}
                <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                  <div style={{
                    width: 16,
                    height: 2,
                    background: '#C9A84C',
                    opacity: isActive ? 1 : 0.3,
                    transition: 'all 0.3s ease'
                  }} />
                  <div style={{
                    width: 8,
                    height: 2,
                    background: '#ef4444',
                    opacity: isActive ? 1 : 0.3,
                    transition: 'all 0.3s ease'
                  }} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
