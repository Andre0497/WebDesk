interface WindowTitleBarProps {
  title: string
  color: string
  emoji?: string
  onClose: () => void
  onMinimize?: () => void
  onMaximize?: () => void
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>
}

export default function WindowTitleBar({
  title,
  emoji,
  onClose,
  onMinimize,
  onMaximize,
  dragHandleProps,
}: WindowTitleBarProps) {
  return (
    <div
      className="flex items-center gap-2 px-4 border-b cursor-move select-none"
      style={{
        height: '44px',
        borderColor: 'var(--glass-border-light)',
        background: 'var(--glass-bg-light)',
      }}
      {...dragHandleProps}
    >
      {/* macOS-Stil Traffic-Light-Buttons */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={e => {
            e.stopPropagation()
            onClose()
          }}
          className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors"
          aria-label="Schließen"
        />
        <button
          onClick={e => {
            e.stopPropagation()
            onMinimize?.()
          }}
          className="w-3 h-3 rounded-full bg-amber-500 hover:bg-amber-400 transition-colors"
          aria-label="Minimieren"
        />
        <button
          onClick={e => {
            e.stopPropagation()
            onMaximize?.()
          }}
          className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors"
          aria-label="Maximieren"
        />
      </div>

      {/* Ordner-Name */}
      <span className="ml-3 text-sm font-medium text-slate-200 flex items-center gap-2">
        {emoji && <span>{emoji}</span>}
        {title}
      </span>
    </div>
  )
}
