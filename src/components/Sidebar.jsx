import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Wind, Droplets, Thermometer, Search, CloudRain } from 'lucide-react';

// ─── Sidebar ───────────────────────────────────────────────────────────────────
export default function Sidebar({ data, searchCity }) {
  const { current, miniGraph } = data;

  const graphData = useMemo(() =>
    miniGraph.map((d) => ({ name: d.h, temp: d.t })),
    [miniGraph]
  );

  const sidebarVariants = {
    hidden: { x: -60, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.7, ease: 'easeOut' } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { delay: 0.15 * i, duration: 0.5, ease: 'easeOut' } }),
  };

  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      searchCity(searchValue.trim());
      setSearchValue('');
    }
  };

  return (
    <motion.div
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col flex-shrink-0 w-full lg:w-[220px] lg:min-w-[220px] h-auto lg:h-full overflow-y-visible lg:overflow-y-auto overflow-x-hidden border-b lg:border-b-0 lg:border-r border-white/5 p-4"
      style={{
        background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 100%)',
      }}
    >
      {/* ── Location Header ──────────────────────────────────── */}
      <motion.form
        onSubmit={handleSearch}
        custom={0}
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, padding: '5px 10px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, background: 'rgba(255,255,255,0.03)' }}
      >
        <Thermometer size={13} color="rgba(255,255,255,0.6)" />
        <input 
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder={`${current.city}, ${current.country}`}
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'rgba(255,255,255,0.8)',
            fontSize: 11,
            fontWeight: 500,
            width: '100%',
            textAlign: 'center',
            padding: '0 8px'
          }}
        />
        <button type="submit" style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex' }}>
          <Search size={13} color="rgba(255,255,255,0.4)" />
        </button>
      </motion.form>

      {/* ── Main Temperature ──────────────────────────────────── */}
      <motion.div custom={1} variants={itemVariants} initial="hidden" animate="visible">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 4 }}>
          <span style={{ fontSize: 52, fontWeight: 300, color: '#fff', lineHeight: 1 }}>
            {current.temp}°
          </span>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: 4 }}>
              <span style={{ color: '#fff', fontSize: 14, fontWeight: 300, lineHeight: 0.8 }}>+</span>
              <span style={{ color: '#fff', fontSize: 12, fontWeight: 300, transform: 'rotate(-45deg)' }}>/</span>
              <span style={{ color: '#fff', fontSize: 16, fontWeight: 300, lineHeight: 0.8 }}>-</span>
            </div>
            <span style={{ color: '#fff', fontSize: 26, fontWeight: 300, marginTop: -4 }}>{Math.abs(parseInt(current.tempChange)) || 0}</span>
          </div>
        </div>
      </motion.div>

      {/* ── Humidity + Wind ───────────────────────────────────── */}
      <motion.div custom={2} variants={itemVariants} initial="hidden" animate="visible"
        style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}
      >
        <span style={{ color: '#fff', fontSize: 15, fontWeight: 400 }}>
          {current.humidity}%
        </span>
        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10 }}>
          Wind {current.windDir} {current.wind} km/h
        </span>
      </motion.div>

      {/* ── Indicator Dots ────────────────────────────────────── */}
      <motion.div custom={3} variants={itemVariants} initial="hidden" animate="visible"
        style={{ marginBottom: 16 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 10 }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444', zIndex: 4 }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f97316', zIndex: 3, marginLeft: -3 }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#eab308', zIndex: 2, marginLeft: -3 }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#fde047', zIndex: 1, marginLeft: -3 }} />
          <span style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: 400 }}>
            • 0.8%
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div style={{ color: '#22c55e', fontSize: 9, fontWeight: 500 }}>Safe</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 8 }}>• 0.00% - 0.9%</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 8 }}>• 0.9% - 11%</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-start' }}>
            <div style={{ color: '#ef4444', fontSize: 9, fontWeight: 500 }}>Dangerous</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 8 }}>• 17% - 18%</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 8 }}>• 39% - 90%</div>
          </div>
        </div>
      </motion.div>

      {/* ── Hourly Temperature Graph ─────────────────────────── */}
      <motion.div custom={4} variants={itemVariants} initial="hidden" animate="visible"
        style={{ flex: 1, minHeight: 140, padding: '12px 14px', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, background: 'rgba(255,255,255,0.02)', display: 'flex', flexDirection: 'column' }}
      >
        {/* Title */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>
            Hourly Forecast
          </span>
          <span className="gold-text" style={{ fontSize: 10, fontWeight: 500 }}>
            Next {graphData.length * 3}h
          </span>
        </div>

        {/* SVG Graph with temp labels */}
        <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
          <svg viewBox="0 0 300 100" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%', overflow: 'visible', display: 'block' }}>
            <defs>
              <linearGradient id="sidebarWave" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#C9A84C" stopOpacity="0" />
              </linearGradient>
            </defs>
            {(() => {
              const temps = graphData.map(d => d.temp);
              const minT = Math.min(...temps) - 2;
              const maxT = Math.max(...temps) + 2;
              const topPad = 18;
              const botPad = 6;
              const H = 100;
              const chartH = H - topPad - botPad;
              const toY = (t) => topPad + ((maxT - t) / (maxT - minT)) * chartH;
              const leftPad = 10;
              const rightPad = 10;
              const chartW = 300 - leftPad - rightPad;
              const colW = chartW / (temps.length > 1 ? temps.length - 1 : 1);
              
              const points = temps.map((t, i) => ({ x: leftPad + i * colW, y: toY(t), temp: t }));
              
              if (points.length < 2) return null;
              
              let d = `M ${points[0].x},${points[0].y}`;
              for (let i = 0; i < points.length - 1; i++) {
                const cp1x = points[i].x + (points[i + 1].x - points[i].x) * 0.4;
                const cp2x = points[i + 1].x - (points[i + 1].x - points[i].x) * 0.4;
                d += ` C ${cp1x},${points[i].y} ${cp2x},${points[i+1].y} ${points[i+1].x},${points[i+1].y}`;
              }
              const areaPath = `${d} L ${points[points.length - 1].x},${H} L ${points[0].x},${H} Z`;

              return (
                <>
                  <motion.path d={areaPath} fill="url(#sidebarWave)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} />
                  <motion.path d={d} fill="none" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: "easeInOut" }} />
                  {points.map((p, i) => (
                    <g key={i}>
                      <motion.circle cx={p.x} cy={p.y} r={3.5} fill="#0a0a0f" stroke="#C9A84C" strokeWidth={2} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 + i * 0.08, type: 'spring', stiffness: 300 }} />
                      <text x={p.x} y={p.y - 9} textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="9" fontFamily="Inter, sans-serif" fontWeight="600">
                        {p.temp}°
                      </text>
                    </g>
                  ))}
                </>
              );
            })()}
          </svg>
        </div>

        {/* Time labels along X-axis */}
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 4, flexShrink: 0, padding: '4px 10px 0' }}>
          {graphData.map((d, i) => {
            const hr = parseInt(d.name);
            const ampm = hr >= 12 ? 'pm' : 'am';
            const hr12 = hr === 0 ? 12 : hr > 12 ? hr - 12 : hr;
            return (
              <span key={i} style={{ color: i === 0 ? '#C9A84C' : 'rgba(255,255,255,0.4)', fontSize: 9, fontWeight: i === 0 ? 600 : 400 }}>
                {hr12}{ampm}
              </span>
            );
          })}
        </div>
      </motion.div>

      {/* ── City Name ─────────────────────────────────────────── */}
      <motion.div custom={5} variants={itemVariants} initial="hidden" animate="visible"
        style={{ marginTop: 'auto', flexShrink: 0 }}
      >
        <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: 500 }}>
          {current.city}
        </div>
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 9, lineHeight: 1.4, marginTop: 4 }}>
          Data provided by OpenWeatherMap API. Update frequency depends on active station pings.
        </div>
      </motion.div>
    </motion.div>
  );
}
