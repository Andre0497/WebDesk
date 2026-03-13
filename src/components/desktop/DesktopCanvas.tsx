import AnimatedBackground from './AnimatedBackground'
import DesktopGrid from './DesktopGrid'
import Taskbar from '../taskbar/Taskbar'

export default function DesktopCanvas() {
  const handleSettingsClick = () => {
    // Wird in Task 3.x (SettingsModal) implementiert
    console.log('Settings öffnen')
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none">
      <AnimatedBackground />

      {/* Desktop-Grid mit Abstand nach unten für die Taskbar */}
      <div className="relative z-10 w-full h-full pb-12">
        <DesktopGrid />
      </div>

      {/* Taskbar */}
      <Taskbar onSettingsClick={handleSettingsClick} />
    </div>
  )
}

