import { WALLPAPERS } from '../../utils/wallpapers'
import { useDesktopStore } from '../../store/desktopStore'
import Modal from '../ui/Modal'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

function WallpaperPicker() {
  const settings = useDesktopStore(s => s.settings)
  const updateSettings = useDesktopStore(s => s.updateSettings)

  return (
    <div>
      <h3 className="text-sm font-medium text-slate-300 mb-3">Hintergrund</h3>
      <div className="grid grid-cols-3 gap-2">
        {WALLPAPERS.map(wallpaper => (
          <button
            key={wallpaper.id}
            onClick={() => updateSettings({ wallpaper: wallpaper.id })}
            className={`
              relative rounded-lg overflow-hidden aspect-video border-2 transition-all
              ${
                settings.wallpaper === wallpaper.id
                  ? 'border-indigo-500 shadow-lg shadow-indigo-500/30'
                  : 'border-transparent hover:border-slate-600'
              }
            `}
          >
            {wallpaper.type === 'animated' ? (
              <div className="w-full h-full bg-gradient-to-br from-indigo-900 to-violet-900" />
            ) : (
              <img
                src={`${import.meta.env.BASE_URL}${wallpaper.thumbnail}`}
                alt={wallpaper.name}
                className="w-full h-full object-cover"
              />
            )}
            <span className="absolute bottom-0 left-0 right-0 text-xs text-center py-1 bg-black/50 text-white truncate px-1">
              {wallpaper.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Einstellungen" size="md">
      <WallpaperPicker />
    </Modal>
  )
}

