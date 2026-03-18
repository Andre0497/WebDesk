import { useState } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { GlobeAltIcon } from '@heroicons/react/24/outline'
import { useFavicon } from '../../hooks/useFavicon'
import { normalizeUrl, isValidUrl, extractHostname } from '../../utils/urlParser'
import { getFaviconUrl } from '../../utils/favicon'
import type { LinkItem } from '../../types'

interface AddLinkModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (link: Omit<LinkItem, 'id' | 'createdAt' | 'updatedAt'>) => void
  defaultPosition?: { col: number; row: number }
  defaultParentId?: string | null
}

interface FormState {
  url: string
  name: string
  description: string
}

interface FormErrors {
  url?: string
  name?: string
}

interface AddLinkFormProps {
  onClose: () => void
  onAdd: (link: Omit<LinkItem, 'id' | 'createdAt' | 'updatedAt'>) => void
  defaultPosition: { col: number; row: number }
  defaultParentId: string | null
}

function AddLinkForm({ onClose, onAdd, defaultPosition, defaultParentId }: AddLinkFormProps) {
  const [form, setForm] = useState<FormState>({ url: '', name: '', description: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const { faviconUrl, isLoading: faviconLoading } = useFavicon(form.url)

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setForm(prev => {
      const next: FormState = { ...prev, url }
      // Name automatisch aus Hostname vorschlagen, wenn noch kein Name gesetzt
      if (!prev.name && isValidUrl(url)) {
        const hostname = extractHostname(url).replace(/^www\./, '').split('.')[0]
        next.name = hostname.charAt(0).toUpperCase() + hostname.slice(1)
      }
      return next
    })
  }

  const validate = (): boolean => {
    const newErrors: FormErrors = {}
    if (!form.url.trim()) {
      newErrors.url = 'URL ist erforderlich'
    } else if (!isValidUrl(form.url)) {
      newErrors.url = 'Keine gültige URL'
    }
    if (!form.name.trim()) {
      newErrors.name = 'Name ist erforderlich'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    onAdd({
      type: 'link',
      name: form.name.trim(),
      url: normalizeUrl(form.url),
      description: form.description.trim() || undefined,
      faviconUrl: faviconUrl ?? getFaviconUrl(form.url),
      position: defaultPosition,
      parentId: defaultParentId,
    })
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* URL-Zeile mit Favicon-Vorschau */}
      <div className="flex gap-3 items-end">
        {/* Favicon-Vorschau */}
        <div
          className="w-10 h-10 rounded-lg bg-white/10 border border-white/20
                          flex items-center justify-center shrink-0 mb-0.5"
        >
          {faviconLoading ? (
            <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          ) : faviconUrl ? (
            <img
              src={faviconUrl}
              alt=""
              className="w-7 h-7 rounded object-contain"
              onError={e => {
                e.currentTarget.style.display = 'none'
              }}
            />
          ) : (
            <GlobeAltIcon className="w-5 h-5 text-white/40" />
          )}
        </div>

        <div className="flex-1">
          <Input
            label="URL"
            type="url"
            placeholder="https://beispiel.de"
            value={form.url}
            onChange={handleUrlChange}
            error={errors.url}
            autoFocus
          />
        </div>
      </div>

      {/* Name */}
      <Input
        label="Name"
        placeholder="z. B. GitHub"
        value={form.name}
        onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
        error={errors.name}
        maxLength={40}
      />

      {/* Beschreibung (optional) */}
      <Input
        label="Beschreibung (optional)"
        placeholder="Kurze Notiz zum Link"
        value={form.description}
        onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
        maxLength={100}
      />

      {/* Buttons */}
      <div className="flex gap-2 justify-end pt-2">
        <Button type="button" variant="secondary" onClick={onClose}>
          Abbrechen
        </Button>
        <Button type="submit" variant="primary">
          Hinzufügen
        </Button>
      </div>
    </form>
  )
}

export default function AddLinkModal({
  isOpen,
  onClose,
  onAdd,
  defaultPosition = { col: 0, row: 0 },
  defaultParentId = null,
}: AddLinkModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Neuen Link hinzufügen" size="md">
      {/* key resets form state each time the modal opens */}
      <AddLinkForm
        key={isOpen ? 'open' : 'closed'}
        onClose={onClose}
        onAdd={onAdd}
        defaultPosition={defaultPosition}
        defaultParentId={defaultParentId}
      />
    </Modal>
  )
}
