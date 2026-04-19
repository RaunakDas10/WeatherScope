import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import WeatherMain from './components/WeatherMain';
import ForecastStrip from './components/ForecastStrip';
import useWeather from './hooks/useWeather';
import AIBackground from './components/AIBackground';
import LoadingSkeleton from './components/LoadingSkeleton';
import ErrorBanner from './components/ErrorBanner';


// ─── App Root ──────────────────────────────────────────────────────────────────
export default function App() {
  const { data, loading, error, searchCity } = useWeather();

  return (
    <div
      className="bg-storm w-full min-h-screen overflow-y-auto overflow-x-hidden relative flex items-start lg:items-center justify-center p-4 lg:p-8"
      style={{
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* Dynamic AI Image Background */}
      {data && <AIBackground city={data.current.city} condition={data.current.conditionTitle} />}

      {/* Error / demo notice */}
      <ErrorBanner message={error} />

      {/* Loading state */}
      <AnimatePresence>
        {loading && <LoadingSkeleton key="loader" />}
      </AnimatePresence>

      {/* Main dashboard (fades in when data is ready) */}
      <AnimatePresence>
        {!loading && data && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, filter: 'blur(12px)', scale: 0.95 }}
            animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative z-10 w-full max-w-[1600px] h-auto lg:h-full lg:max-h-[900px] flex flex-col gap-6"
          >
            {/* ── Top bar ──────────────────────────────────────────── */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 4px',
            }}>
              <span style={{
                color: 'rgba(255,255,255,0.3)',
                fontSize: 10,
                letterSpacing: '0.15em',
                fontWeight: 500,
              }}>
                {data.current.temp}°C
              </span>
              <span style={{
                color: 'rgba(255,255,255,0.3)',
                fontSize: 10,
                letterSpacing: '0.15em',
                fontWeight: 500,
              }}>
                {data.current.city} Weather
              </span>
            </div>

            {/* ── Main Content Row ──────────────────────────────────── */}
            <div className="flex-1 flex flex-col lg:flex-row gap-4 lg:gap-3 min-h-0 relative z-50">
              {/* Left: Sidebar */}
              <Sidebar data={data} searchCity={searchCity} />

              {/* Right: Main weather panel (glass overlay on storm bg) */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
                className="glass flex-1 rounded-2xl relative min-w-0 z-10 min-h-[400px] lg:min-h-0"
              >
                {/* Storm accent — dark left bleed into transparent right */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 16,
                  background: 'linear-gradient(to right, rgba(10,10,20,0.85) 0%, rgba(10,10,20,0.55) 50%, rgba(10,10,20,0.1) 100%)',
                  pointerEvents: 'none',
                  zIndex: 0,
                }} />

                <div style={{ position: 'relative', zIndex: 1, height: '100%' }}>
                  <WeatherMain data={data} />
                </div>
              </motion.div>
            </div>

            {/* ── Bottom: Forecast Strip ────────────────────────────── */}
            <ForecastStrip forecast={data.forecast} />

          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Outer Corner Labels ──────────────────────────────── */}
      {!loading && data && (
        <>
          <div style={{
            position: 'absolute',
            bottom: 20,
            left: 20,
            color: 'rgba(255,255,255,0.4)',
            fontSize: 14,
            fontWeight: 600,
            zIndex: 1,
            pointerEvents: 'none'
          }}>
            17°C
          </div>
          <div style={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            color: 'rgba(255,255,255,0.4)',
            fontSize: 14,
            fontWeight: 500,
            zIndex: 1,
            pointerEvents: 'none'
          }}>
            {data.current.city} Weather
          </div>
        </>
      )}
    </div>
  );
}
