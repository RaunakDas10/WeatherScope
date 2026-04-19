import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useAIBackground from '../hooks/useAIBackground';

export default function AIBackground({ city, condition }) {
  const { imageUrl, isGenerating, error } = useAIBackground(city, condition);
  const [currentImage, setCurrentImage] = useState(null);
  const [previousImage, setPreviousImage] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Smooth crossfade: when a new URL comes in, shift the old one to "previous"
  useEffect(() => {
    if (imageUrl && imageUrl !== currentImage) {
      setPreviousImage(currentImage);
      setCurrentImage(imageUrl);
      setImageLoaded(false);
    }
  }, [imageUrl, currentImage]);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none', background: '#0a0a0f' }}>

      {/* ── Loading Shimmer ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div
            key="shimmer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              position: 'absolute', inset: 0, zIndex: 1,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 16,
            }}
          >
            {/* Animated glow orb */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              style={{
                width: 60, height: 60,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(201,168,76,0.4) 0%, transparent 70%)',
                boxShadow: '0 0 40px rgba(201,168,76,0.3), 0 0 80px rgba(201,168,76,0.15)',
              }}
            />
            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              style={{
                color: '#C9A84C',
                fontSize: 11,
                letterSpacing: '0.2em',
                fontWeight: 500,
                fontFamily: 'Inter, sans-serif',
              }}
            >
              GENERATING AI BACKGROUND
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Previous Image (fading out) ────────────────────────────────── */}
      {previousImage && (
        <motion.img
          key={`prev-${previousImage.slice(-20)}`}
          src={previousImage}
          initial={{ opacity: 0.55 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 2, ease: 'easeOut' }}
          onAnimationComplete={() => setPreviousImage(null)}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            zIndex: 2,
          }}
          alt=""
        />
      )}

      {/* ── Current AI Image (fading in) ──────────────────────────────── */}
      {currentImage && (
        <motion.img
          key={`curr-${currentImage.slice(-20)}`}
          src={currentImage}
          onLoad={() => setImageLoaded(true)}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{
            opacity: imageLoaded ? 0.55 : 0,
            scale: imageLoaded ? 1 : 1.06,
          }}
          transition={{ duration: 2, ease: 'easeOut' }}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            zIndex: 3,
            filter: 'saturate(1.15) contrast(1.05)',
          }}
          alt="AI Generated Background"
        />
      )}

      {/* ── Cinematic Overlays ─────────────────────────────────────────── */}
      {/* Top-to-bottom dark gradient for readability */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 4,
        background: `
          linear-gradient(180deg, 
            rgba(5,5,15,0.35) 0%, 
            rgba(5,5,15,0.15) 25%,
            rgba(5,5,15,0.25) 50%,
            rgba(5,5,15,0.7) 80%,
            rgba(5,5,15,0.92) 100%
          )`,
      }} />

      {/* Side vignette for depth */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 5,
        background: 'radial-gradient(ellipse at 50% 40%, transparent 30%, rgba(5,5,15,0.5) 100%)',
      }} />

      {/* Subtle amber/gold tint matching the UI accent */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 6,
        background: 'radial-gradient(ellipse at 60% 30%, rgba(201,168,76,0.04) 0%, transparent 60%)',
        mixBlendMode: 'screen',
      }} />
    </div>
  );
}
