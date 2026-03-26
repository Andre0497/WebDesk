import { createPortal } from 'react-dom'
import { useEffect, useRef } from 'react'

export interface ContextMenuItem {
  label: string
  icon?: React.ReactNode
  onClick: () => void
  danger?: boolean
  disabled?: boolean
  divider?: boolean
}

interface ContextMenuProps {
  isOpen: boolean
  x: number
  y: number
  items: ContextMenuItem[]
  onClose: () => void
}

export default function ContextMenu({ isOpen, x, y, items, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  // Menü am Bildschirmrand spiegeln, wenn zu nah am Rand
  useEffect(() => {
    if (!menuRef.current || !isOpen) return
    const menu = menuRef.current
    const rect = menu.getBoundingClientRect()
    if (rect.right > window.innerWidth) {
      menu.style.left = `${x - rect.width}px`
    }
    if (rect.bottom > window.innerHeight) {
      menu.style.top = `${y - rect.height}px`
    }
  }, [isOpen, x, y])

  if (!isOpen) return null

  return createPortal(
    <div
      ref={menuRef}
      style={{
        top: y,
        left: x,
        background: 'var(--glass-bg-modal)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderColor: 'var(--glass-border)',
        boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
      }}
      className="fixed z-[9999] min-w-48 py-1
                 border rounded-xl
                 text-white text-sm"
      onClick={e => e.stopPropagation()}
    >
      {items.map((item, index) => (
        <div key={index}>
          {item.divider && <div className="my-1 border-t border-white/10" />}
          <button
            disabled={item.disabled}
            onClick={() => {
              item.onClick()
              onClose()
            }}
            className={`w-full flex items-center gap-3 px-4 py-2 text-left
                        transition-colors disabled:opacity-40 disabled:cursor-not-allowed
                        ${item.danger ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-white/10'}`}
          >
            {item.icon && <span className="w-4 h-4 shrink-0">{item.icon}</span>}
            {item.label}
          </button>
        </div>
      ))}
    </div>,
    document.body
  )
}
