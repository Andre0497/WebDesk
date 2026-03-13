import AnimatedBackground from './AnimatedBackground'
import DesktopGrid from './DesktopGrid'

export default function DesktopCanvas() {
  return (
    <div className="relative w-screen h-screen overflow-hidden select-none">
      {/* Hintergrund-Layer */}
      <AnimatedBackground />

      {/* Icon-Grid-Layer */}
      <div className="relative z-10 w-full h-full">
        <DesktopGrid />
      </div>
    </div>
  )
}

