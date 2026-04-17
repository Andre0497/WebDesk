import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import DesktopCanvas from './components/desktop/DesktopCanvas'
import { SplashScreen } from './components/ui/SplashScreen'
import { useTheme } from './hooks/useTheme'

const SPLASH_SESSION_KEY = 'webdesk-splash-shown'

function App() {
  // Wird in Task 6.1 durch den desktopStore ersetzt
  const { theme, toggleTheme } = useTheme('dark')
  const shouldReduceMotion = useReducedMotion()
  const [showSplash, setShowSplash] = useState(
    () => !sessionStorage.getItem(SPLASH_SESSION_KEY),
  )

  const handleSplashComplete = () => {
    sessionStorage.setItem(SPLASH_SESSION_KEY, 'true')
    setShowSplash(false)
  }

  return (
    <>
      <AnimatePresence>
        {showSplash && !shouldReduceMotion && (
          <SplashScreen onComplete={handleSplashComplete} />
        )}
      </AnimatePresence>

      <motion.div
        className="fixed inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <DesktopCanvas theme={theme} onToggleTheme={toggleTheme} />
      </motion.div>
    </>
  )
}

export default App
