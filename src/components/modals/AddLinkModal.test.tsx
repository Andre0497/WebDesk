import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AddLinkModal from './AddLinkModal'

vi.mock('../../hooks/useFavicon', () => ({
  useFavicon: vi.fn(() => ({ faviconUrl: null, isLoading: false, hasError: false })),
}))

describe('AddLinkModal', () => {
  it('rendert das Formular wenn isOpen=true', () => {
    render(<AddLinkModal isOpen={true} onClose={() => {}} onAdd={() => {}} />)
    expect(screen.getByLabelText(/^URL$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^Name$/i)).toBeInTheDocument()
  })

  it('rendert nichts wenn isOpen=false', () => {
    render(<AddLinkModal isOpen={false} onClose={() => {}} onAdd={() => {}} />)
    expect(screen.queryByLabelText(/^URL$/i)).not.toBeInTheDocument()
  })

  it('ruft onClose bei Abbrechen auf', async () => {
    const onClose = vi.fn()
    render(<AddLinkModal isOpen={true} onClose={onClose} onAdd={() => {}} />)
    await userEvent.click(screen.getByRole('button', { name: /Abbrechen/i }))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('zeigt Fehler wenn URL leer ist', async () => {
    render(<AddLinkModal isOpen={true} onClose={() => {}} onAdd={() => {}} />)
    await userEvent.click(screen.getByRole('button', { name: /Hinzufügen/i }))
    expect(screen.getByText(/URL ist erforderlich/i)).toBeInTheDocument()
  })

  it('zeigt Fehler wenn URL ungültig ist', () => {
    render(<AddLinkModal isOpen={true} onClose={() => {}} onAdd={() => {}} />)
    // Use fireEvent.change so the value is set at once (avoids jsdom url-type constraint)
    fireEvent.change(screen.getByLabelText(/^URL$/i), { target: { value: 'https://' } })
    // Use fireEvent.submit to bypass jsdom url-type constraint validation
    fireEvent.submit(screen.getByLabelText(/^URL$/i).closest('form')!)
    expect(screen.getByText(/Keine gültige URL/i)).toBeInTheDocument()
  })

  it('ruft onAdd mit korrekten Daten auf', async () => {
    const onAdd = vi.fn()
    render(<AddLinkModal isOpen={true} onClose={() => {}} onAdd={onAdd} />)
    await userEvent.type(screen.getByLabelText(/^URL$/i), 'https://example.com')
    await userEvent.clear(screen.getByLabelText(/^Name$/i))
    await userEvent.type(screen.getByLabelText(/^Name$/i), 'MyLink')
    await userEvent.click(screen.getByRole('button', { name: /Hinzufügen/i }))
    expect(onAdd).toHaveBeenCalledWith(
      expect.objectContaining({ url: 'https://example.com', name: 'MyLink' }),
    )
  })
})
