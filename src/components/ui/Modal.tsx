import { useEffect } from 'react'
import { Dialog } from '@headlessui/react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { overlayVariants, modalVariants } from '../../utils/animations'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  showCloseButton?: boolean
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
}: ModalProps) {
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog static open={isOpen} onClose={onClose} className="relative z-[9998]">
          {/* Backdrop */}
          <motion.div
            data-testid="modal-backdrop"
            className="fixed inset-0 backdrop-blur-sm"
            style={{ background: 'rgba(0, 0, 0, 0.65)' }}
            variants={shouldReduceMotion ? undefined : overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />

          {/* Zentrierter Container */}
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <motion.div
              variants={shouldReduceMotion ? undefined : modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Dialog.Panel
                className={`w-full ${sizeClasses[size]} backdrop-blur-md border rounded-2xl text-white`}
                style={{
                  background: 'var(--glass-bg-modal)',
                  backdropFilter: 'blur(20px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                  borderColor: 'var(--glass-border)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)',
                }}
              >
                {/* Header */}
                <div
                  className="flex items-center justify-between px-6 pt-5 pb-4 border-b"
                  style={{ borderColor: 'var(--glass-border-light)' }}
                >
                  <Dialog.Title className="text-lg font-semibold">{title}</Dialog.Title>
                  {showCloseButton && (
                    <button
                      onClick={onClose}
                      className="p-1 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* Inhalt */}
                <div className="px-6 py-5">{children}</div>
              </Dialog.Panel>
            </motion.div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  )
}
