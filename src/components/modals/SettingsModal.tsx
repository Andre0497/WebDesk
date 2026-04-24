import { useRef, useState } from 'react'
import { WALLPAPERS } from '../../utils/wallpapers'
import { useDesktopStore } from '../../store/desktopStore'
import Modal from '../ui/Modal'
import { downloadJson } from '../../utils/dataTransfer'

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
  const exportData = useDesktopStore(s => s.exportData)
  const importData = useDesktopStore(s => s.importData)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importError, setImportError] = useState<string | null>(null)
  const [importSuccess, setImportSuccess] = useState(false)

  const handleExport = () => {
    const json = exportData()
    const date = new Date().toISOString().split('T')[0]
    downloadJson(json, `webdesk-backup-${date}.json`)
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const confirmed = window.confirm(
      'Achtung: Der Import überschreibt alle aktuellen Daten. Fortfahren?',
    )
    if (!confirmed) {
      e.target.value = ''
      return
    }

    const reader = new FileReader()
    reader.onerror = () => {
      setImportError('Fehler beim Lesen der Datei.')
      setImportSuccess(false)
    }
    reader.onload = (event) => {
      const json = event.target?.result as string
      try {
        importData(json)
        setImportSuccess(true)
        setImportError(null)
        setTimeout(() => setImportSuccess(false), 3000)
      } catch (err) {
        setImportError((err as Error).message)
        setImportSuccess(false)
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Einstellungen" size="md">
      <WallpaperPicker />
      <div className="mt-6 pt-6 border-t border-slate-700">
        <h3 className="text-sm font-medium text-slate-300 mb-3">Daten</h3>
        <button
          onClick={handleExport}
          className="w-full px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium transition-colors text-left"
        >
          💾 Konfiguration exportieren
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          onClick={handleImportClick}
          className="w-full mt-2 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium transition-colors text-left"
        >
          📂 Konfiguration importieren
        </button>
        {importError && (
          <p className="text-red-400 text-sm mt-2">{importError}</p>
        )}
        {importSuccess && (
          <p className="text-green-400 text-sm mt-2">Import erfolgreich!</p>
        )}
      </div>
    </Modal>
  )
}

