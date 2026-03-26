import { motion } from 'framer-motion'

export function AnimatedGradient() {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: '#0a0a0f' }}>
      {/* Blob 1 – Indigo */}
      <motion.div
        className="absolute rounded-full opacity-20 blur-3xl"
        style={{
          width: '60vw',
          height: '60vw',
          background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)',
          top: '-20%',
          left: '-10%',
        }}
        animate={{
          x: [0, 50, -30, 0],
          y: [0, 30, -20, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      {/* Blob 2 – Violet */}
      <motion.div
        className="absolute rounded-full blur-3xl"
        style={{
          width: '50vw',
          height: '50vw',
          background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)',
          bottom: '-10%',
          right: '-10%',
          opacity: 0.15,
        }}
        animate={{
          x: [0, -40, 20, 0],
          y: [0, -30, 40, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  )
}
