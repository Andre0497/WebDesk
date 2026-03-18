import { XMarkIcon } from '@heroicons/react/24/outline'

interface WindowTitleBarProps {
  title: string
  color: string
  emoji?: string
  onClose: () => void
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>
}

export default function WindowTitleBar({
  title,
  color,
  emoji,
  onClose,
  dragHandleProps,
}: WindowTitleBarProps) {
  return (
    <div
      className="flex items-center justify-between px-4 py-3
                 border-b border-white/10 cursor-move select-none"
      {...dragHandleProps}
    >
      {/* Linke Seite: Ordner-Farbe + Titel */}
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
        {emoji && <span className="text-base leading-none">{emoji}</span>}
        <span className="text-sm font-semibold text-white">{title}</span>
      </div>

      {/* Rechte Seite: Schließen-Button */}
      <button
        onClick={onClose}
        className="w-6 h-6 rounded-full bg-red-500/80 hover:bg-red-500
                   flex items-center justify-center
                   text-red-900 hover:text-white transition-colors group"
        title="Schließen"
      >
        <XMarkIcon className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>
    </div>
  )
}
