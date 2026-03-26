import Modal from '../ui/Modal'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Einstellungen" size="md">
      {/* TODO: Implementierung in Task 2.6 */}
      <p className="text-white/50 text-sm">Einstellungen werden in einem zukünftigen Update hinzugefügt.</p>
    </Modal>
  )
}
