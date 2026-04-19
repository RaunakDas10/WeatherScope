import { motion } from 'framer-motion';

export default function LoadingSkeleton() {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(5,5,15,0.95)',
    }}>
      <div style={{ textAlign: 'center' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
          style={{
            width: 48, height: 48,
            borderRadius: '50%',
            border: '3px solid rgba(201,168,76,0.15)',
            borderTopColor: '#C9A84C',
            margin: '0 auto 16px',
          }}
        />
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, letterSpacing: '0.1em' }}>
          LOADING WEATHER DATA…
        </p>
      </div>
    </div>
  );
}
