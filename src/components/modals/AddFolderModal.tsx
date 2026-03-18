import { useState } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import Input from '../ui/Input'
import ColorPicker from '../ui/ColorPicker'
import { FolderIcon as HeroFolderIcon } from '@heroicons/react/24/solid'
import { folderColors } from '../../utils/defaultData'
import type { FolderItem } from '../../types'

interface AddFolderModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (folder: Omit<FolderItem, 'id' | 'createdAt' | 'updatedAt'>) => void
  defaultPosition?: { col: number; row: number }
}

interface FormState {
  name: string
  color: string
  emoji: string
}

interface FormErrors {
  name?: string
}

interface AddFolderFormProps {
  onClose: () => void
  onAdd: (folder: Omit<FolderItem, 'id' | 'createdAt' | 'updatedAt'>) => void
  defaultPosition: { col: number; row: number }
}

function AddFolderForm({ onClose, onAdd, defaultPosition }: AddFolderFormProps) {
  const [form, setForm] = useState<FormState>({
    name: '',
    color: folderColors[0],
    emoji: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})

  const validate = (): boolean => {
    const newErrors: FormErrors = {}
    if (!form.name.trim()) newErrors.name = 'Name ist erforderlich'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    onAdd({
      type: 'folder',
      name: form.name.trim(),
      color: form.color,
      emoji: form.emoji.trim() || undefined,
      isOpen: false,
      position: defaultPosition,
      parentId: null,
    })
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

      {/* Live-Vorschau */}
      <div className="flex justify-center py-2">
        <div className="flex flex-col items-center gap-2">
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center
                       border border-white/20"
            style={{ backgroundColor: `${form.color}33` }}
          >
            {form.emoji ? (
              <span className="text-4xl leading-none">{form.emoji}</span>
            ) : (
              <HeroFolderIcon className="w-10 h-10" style={{ color: form.color }} />
            )}
          </div>
          <span className="text-xs text-white/50">Vorschau</span>
        </div>
      </div>

      {/* Name */}
      <Input
        label="Name"
        placeholder="z. B. Entwicklung"
        value={form.name}
        onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
        error={errors.name}
        maxLength={30}
        autoFocus
      />

      {/* Farbauswahl */}
      <ColorPicker
        label="Farbe"
        colors={folderColors}
        value={form.color}
        onChange={color => setForm(prev => ({ ...prev, color }))}
      />

      {/* Emoji (optional) */}
      <Input
        label="Emoji (optional)"
        placeholder="z. B. 🚀 💻 📁"
        value={form.emoji}
        onChange={e => setForm(prev => ({ ...prev, emoji: e.target.value }))}
        maxLength={2}
      />

      {/* Buttons */}
      <div className="flex gap-2 justify-end pt-2">
        <Button type="button" variant="secondary" onClick={onClose}>
          Abbrechen
        </Button>
        <Button type="submit" variant="primary">
          Erstellen
        </Button>
      </div>
    </form>
  )
}

export default function AddFolderModal({
  isOpen,
  onClose,
  onAdd,
  defaultPosition = { col: 0, row: 0 },
}: AddFolderModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Neuen Ordner erstellen" size="sm">
      {/* key resets form state each time the modal opens */}
      <AddFolderForm
        key={isOpen ? 'open' : 'closed'}
        onClose={onClose}
        onAdd={onAdd}
        defaultPosition={defaultPosition}
      />
    </Modal>
  )
}
