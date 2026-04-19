import { useEffect, useRef } from 'react';

export default function BackgroundAnimation() {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);

  // ── Rain canvas ────────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W = canvas.width  = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    const onResize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    // Spawn rain drops
    const drops = Array.from({ length: 200 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      len: Math.random() * 18 + 8,
      speed: Math.random() * 4 + 4,
      opacity: Math.random() * 0.4 + 0.1,
      thick: Math.random() * 0.8 + 0.3,
    }));

    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      drops.forEach((d) => {
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - 2, d.y + d.len);
        ctx.strokeStyle = `rgba(180, 210, 255, ${d.opacity})`;
        ctx.lineWidth = d.thick;
        ctx.stroke();
        d.y += d.speed;
        d.x -= 1;
        if (d.y > H + 20) { d.y = -d.len; d.x = Math.random() * W; }
      });
      animRef.current = requestAnimationFrame(tick);
    };

    tick();
    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <>
      {/* Deep storm-sky gradient base (semi-transparent to let AI image show through) */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          background: `
            radial-gradient(ellipse at 72% 40%, rgba(38,38,65,0.4) 0%, transparent 55%),
            radial-gradient(ellipse at 55% 65%, rgba(25,25,45,0.3) 0%, transparent 50%),
            radial-gradient(ellipse at 20% 30%, rgba(15,15,30,0.4) 0%, transparent 60%),
            linear-gradient(160deg, rgba(12,12,24,0.7) 0%, rgba(17,17,40,0.7) 40%, rgba(10,10,20,0.9) 100%)
          `,
          pointerEvents: 'none',
        }}
      />

      {/* Cloud-texture image layer (CSS cloud simulation) */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        {/* Large storm cloud mass — right side */}
        <div
          style={{
            position: 'absolute',
            right: '-5%',
            top: '-10%',
            width: '75%',
            height: '90%',
            borderRadius: '50% 40% 60% 30% / 40% 60% 40% 60%',
            background: `
              radial-gradient(ellipse at 40% 45%, rgba(60,60,80,0.85) 0%, rgba(30,30,50,0.7) 40%, transparent 70%),
              radial-gradient(ellipse at 70% 30%, rgba(70,65,85,0.75) 0%, rgba(40,35,60,0.5) 50%, transparent 70%)
            `,
            filter: 'blur(3px)',
            animation: 'float 12s ease-in-out infinite',
          }}
        />

        {/* Secondary cloud mass */}
        <div
          style={{
            position: 'absolute',
            right: '10%',
            top: '20%',
            width: '60%',
            height: '70%',
            borderRadius: '40% 60% 30% 50% / 60% 40% 60% 30%',
            background: `
              radial-gradient(ellipse at 50% 50%, rgba(50,50,70,0.7) 0%, rgba(25,25,45,0.5) 50%, transparent 70%)
            `,
            filter: 'blur(8px)',
            animation: 'float 16s ease-in-out infinite reverse',
          }}
        />

        {/* Dark storm underbelly */}
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: '30%',
            width: '70%',
            height: '50%',
            background: `
              radial-gradient(ellipse at 60% 60%, rgba(20,18,35,0.9) 0%, rgba(15,15,30,0.6) 40%, transparent 70%)
            `,
            filter: 'blur(12px)',
          }}
        />

        {/* Lightning flicker effect */}
        <div
          id="lightning"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(180, 200, 255, 0)',
            transition: 'background 0.05s ease',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Rain canvas */}
      <canvas
        ref={canvasRef}
        id="rain-canvas"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* Grain / noise texture */}
      <div className="grain-overlay" />

      {/* Vignette */}
      <div className="vignette" />
    </>
  );
}
