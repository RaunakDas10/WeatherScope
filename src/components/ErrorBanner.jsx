import { motion } from 'framer-motion';

export default function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        position: 'fixed', top: 12, left: '50%', transform: 'translateX(-50%)',
        zIndex: 100,
        background: 'rgba(201,168,76,0.15)',
        border: '1px solid rgba(201,168,76,0.35)',
        borderRadius: 8,
        padding: '6px 16px',
        fontSize: 11,
        color: '#C9A84C',
        pointerEvents: 'none',
        backdropFilter: 'blur(12px)',
      }}
    >
      ⚡ {message}
    </motion.div>
  );
}
