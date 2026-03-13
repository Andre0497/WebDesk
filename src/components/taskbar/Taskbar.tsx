import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import Clock from './Clock'
import SearchBar from './SearchBar'

interface TaskbarProps {
  onSettingsClick: () => void
}

export default function Taskbar({ onSettingsClick }: TaskbarProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-50 h-12 px-4
                    flex items-center justify-between
                    bg-white/10 backdrop-blur-md border-t border-white/20
                    text-white">
      {/* Linke Seite: App-Name */}
      <span className="font-bold text-sm tracking-widest uppercase select-none">
        WebDesk
      </span>

      {/* Mitte: Suchleiste (Platzhalter) */}
      <SearchBar />

      {/* Rechte Seite: Settings + Uhr */}
      <div className="flex items-center gap-4">
        <button
          onClick={onSettingsClick}
          className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
          title="Einstellungen"
        >
          <Cog6ToothIcon className="w-5 h-5" />
        </button>
        <Clock />
      </div>
    </div>
  )
}

