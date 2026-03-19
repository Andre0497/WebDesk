import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import Modal from '../ui/Modal'
import Button from '../ui/Button'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel?: string
  isDangerous?: boolean
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Bestätigen',
  isDangerous = false,
}: ConfirmModalProps) {
  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm" showCloseButton={false}>
      <div className="flex flex-col gap-4">
        {/* Icon + Nachricht */}
        <div className="flex gap-3 items-start">
          {isDangerous && (
            <div className="shrink-0 w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />
            </div>
          )}
          <p className="text-sm text-white/70 leading-relaxed pt-1.5">{message}</p>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 justify-end pt-1">
          <Button variant="secondary" onClick={onClose}>
            Abbrechen
          </Button>
          <Button variant={isDangerous ? 'danger' : 'primary'} onClick={handleConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
