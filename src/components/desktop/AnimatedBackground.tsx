import { AnimatePresence, motion } from 'framer-motion'
import { WALLPAPERS } from '../../utils/wallpapers'
import { useDesktopStore } from '../../store/desktopStore'
import { AnimatedGradient } from './AnimatedGradient'

export default function AnimatedBackground() {
  const wallpaperId = useDesktopStore(s => s.settings.wallpaper)
  const wallpaper = WALLPAPERS.find(w => w.id === wallpaperId) ?? WALLPAPERS[0]

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={wallpaper.id}
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {wallpaper.type === 'animated' ? (
          <AnimatedGradient />
        ) : (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${import.meta.env.BASE_URL}${wallpaper.src})`,
            }}
          >
            {/* Leichter Overlay für bessere Icon-Lesbarkeit */}
            <div className="absolute inset-0 bg-black/20" />
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

