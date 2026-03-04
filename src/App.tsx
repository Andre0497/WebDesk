import { motion } from 'framer-motion'

function App() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-900">
      <motion.h1
        className="text-4xl font-bold text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        WebDesk
      </motion.h1>
    </div>
  )
}

export default App
