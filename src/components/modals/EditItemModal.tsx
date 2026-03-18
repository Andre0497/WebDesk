import { useState } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import Input from '../ui/Input'
import ColorPicker from '../ui/ColorPicker'
import { GlobeAltIcon } from '@heroicons/react/24/outline'
import { FolderIcon as HeroFolderIcon } from '@heroicons/react/24/solid'
import { useFavicon } from '../../hooks/useFavicon'
import { normalizeUrl, isValidUrl } from '../../utils/urlParser'
import { folderColors } from '../../utils/defaultData'
import { isLinkItem, isFolderItem } from '../../types'
import type { DesktopItem, LinkItem, FolderItem } from '../../types'

interface EditItemModalProps {
  isOpen: boolean
  onClose: () => void
  item: DesktopItem | null
  onSave: (id: string, updates: Partial<DesktopItem>) => void
}

interface EditItemFormProps {
  item: DesktopItem
  onClose: () => void
  onSave: (id: string, updates: Partial<DesktopItem>) => void
}

function EditItemForm({ item, onClose, onSave }: EditItemFormProps) {
  // Formularfelder für Links
  const [url, setUrl] = useState(isLinkItem(item) ? item.url : '')
  const [name, setName] = useState(item.name)
  const [description, setDescription] = useState(isLinkItem(item) ? (item.description ?? '') : '')

  // Formularfelder für Ordner
  const [color, setColor] = useState(isFolderItem(item) ? item.color : folderColors[0])
  const [emoji, setEmoji] = useState(isFolderItem(item) ? (item.emoji ?? '') : '')

  const [errors, setErrors] = useState<{ url?: string; name?: string }>({})

  // Favicon-Vorschau für Links
  const { faviconUrl } = useFavicon(url)

  const validate = (): boolean => {
    const newErrors: { url?: string; name?: string } = {}
    if (!name.trim()) newErrors.name = 'Name ist erforderlich'
    if (isLinkItem(item)) {
      if (!url.trim()) newErrors.url = 'URL ist erforderlich'
      else if (!isValidUrl(url)) newErrors.url = 'Keine gültige URL'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    if (isLinkItem(item)) {
      onSave(item.id, {
        name: name.trim(),
        url: normalizeUrl(url),
        description: description.trim() || undefined,
        faviconUrl: faviconUrl ?? item.faviconUrl,
        updatedAt: Date.now(),
      } as Partial<LinkItem>)
    }

    if (isFolderItem(item)) {
      onSave(item.id, {
        name: name.trim(),
        color,
        emoji: emoji.trim() || undefined,
        updatedAt: Date.now(),
      } as Partial<FolderItem>)
    }

    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

      {/* === Link-Felder === */}
      {isLinkItem(item) && (
        <>
          {/* URL mit Favicon-Vorschau */}
          <div className="flex gap-3 items-end">
            <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/20
                            flex items-center justify-center shrink-0 mb-0.5">
              {faviconUrl ? (
                <img src={faviconUrl} alt="" className="w-7 h-7 rounded object-contain"
                     onError={e => { e.currentTarget.style.display = 'none' }} />
              ) : (
                <GlobeAltIcon className="w-5 h-5 text-white/40" />
              )}
            </div>
            <div className="flex-1">
              <Input
                label="URL"
                type="url"
                value={url}
                onChange={e => setUrl(e.target.value)}
                error={errors.url}
              />
            </div>
          </div>

          <Input
            label="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            error={errors.name}
            maxLength={40}
          />

          <Input
            label="Beschreibung (optional)"
            value={description}
            onChange={e => setDescription(e.target.value)}
            maxLength={100}
          />
        </>
      )}

      {/* === Ordner-Felder === */}
      {isFolderItem(item) && (
        <>
          {/* Ordner-Vorschau */}
          <div className="flex justify-center py-2">
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center border border-white/20"
              style={{ backgroundColor: `${color}33` }}
            >
              {emoji ? (
                <span className="text-4xl leading-none">{emoji}</span>
              ) : (
                <HeroFolderIcon className="w-10 h-10" style={{ color }} />
              )}
            </div>
          </div>

          <Input
            label="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            error={errors.name}
            maxLength={30}
            autoFocus
          />

          <ColorPicker label="Farbe" colors={folderColors} value={color} onChange={setColor} />

          <Input
            label="Emoji (optional)"
            placeholder="z. B. 🚀"
            value={emoji}
            onChange={e => setEmoji(e.target.value)}
            maxLength={2}
          />
        </>
      )}

      {/* Buttons */}
      <div className="flex gap-2 justify-end pt-2">
        <Button type="button" variant="secondary" onClick={onClose}>
          Abbrechen
        </Button>
        <Button type="submit" variant="primary">
          Speichern
        </Button>
      </div>
    </form>
  )
}

export default function EditItemModal({
  isOpen,
  onClose,
  item,
  onSave,
}: EditItemModalProps) {
  if (!item) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isLinkItem(item) ? 'Link bearbeiten' : 'Ordner bearbeiten'}
      size="md"
    >
      {/* key resets form state each time the modal opens with a different item */}
      <EditItemForm
        key={`${item.id}-${isOpen}`}
        item={item}
        onClose={onClose}
        onSave={onSave}
      />
    </Modal>
  )
}
