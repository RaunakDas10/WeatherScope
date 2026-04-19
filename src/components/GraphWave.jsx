import { useMemo, useRef } from 'react';
import { motion } from 'framer-motion';

// ─── Animated SVG Wave Graph ──────────────────────────────────────────────────
export default function GraphWave({ forecast }) {
  const ref = useRef(null);

  const W = 700;
  const H = 60;
  const padY = 10;
  const colW = W / forecast.length;

  const temps = useMemo(() => forecast.map((f) => f.temp), [forecast]);
  const minT = Math.min(...temps) - 2;
  const maxT = Math.max(...temps) + 2;

  // Map temp → Y coordinate (inverted: higher temp = lower Y)
  const toY = (t) =>
    padY + ((maxT - t) / (maxT - minT)) * (H - 2 * padY);

  // Spread points across width matching flex: 1 centers
  const points = temps.map((t, i) => ({
    x: (i + 0.5) * colW,
    y: toY(t),
  }));

  // Build smooth cubic bezier path
  const path = useMemo(() => {
    if (points.length < 2) return '';
    let d = `M ${points[0].x},${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const cp1x = points[i].x + (points[i + 1].x - points[i].x) * 0.4;
      const cp1y = points[i].y;
      const cp2x = points[i + 1].x - (points[i + 1].x - points[i].x) * 0.4;
      const cp2y = points[i + 1].y;
      d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${points[i + 1].x},${points[i + 1].y}`;
    }
    return d;
  }, [points]);

  // Area fill path
  const areaPath = useMemo(() => {
    if (!path) return '';
    return `${path} L ${points[points.length - 1].x},${H} L ${points[0].x},${H} Z`;
  }, [path, points, H]);

  return (
    <div ref={ref} style={{ width: '100%', height: H, position: 'relative' }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        style={{ width: '100%', height: '100%', overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="waveAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#C9A84C" stopOpacity="0" />
          </linearGradient>
          <filter id="waveGlow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Area fill */}
        <motion.path
          d={areaPath}
          fill="url(#waveAreaGrad)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        />

        {/* Main wave line */}
        <motion.path
          d={path}
          fill="none"
          stroke="#C9A84C"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#waveGlow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, delay: 0.3, ease: 'easeInOut' }}
        />

        {/* Glow line (thicker, dimmer) */}
        <motion.path
          d={path}
          fill="none"
          stroke="rgba(201,168,76,0.3)"
          strokeWidth="6"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, delay: 0.3, ease: 'easeInOut' }}
        />

        {/* Dots at each point */}
        {points.map((p, i) => (
          <motion.circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={3}
            fill="#C9A84C"
            stroke="rgba(201,168,76,0.4)"
            strokeWidth={4}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 + i * 0.15, type: 'spring', stiffness: 300 }}
          />
        ))}
      </svg>
    </div>
  );
}
