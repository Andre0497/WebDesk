import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AddFolderModal from './AddFolderModal'

describe('AddFolderModal', () => {
  it('rendert das Formular wenn isOpen=true', () => {
    render(<AddFolderModal isOpen={true} onClose={() => {}} onAdd={() => {}} />)
    expect(screen.getByLabelText(/^Name$/i)).toBeInTheDocument()
  })

  it('rendert nichts wenn isOpen=false', () => {
    render(<AddFolderModal isOpen={false} onClose={() => {}} onAdd={() => {}} />)
    expect(screen.queryByLabelText(/^Name$/i)).not.toBeInTheDocument()
  })

  it('ruft onClose bei Abbrechen auf', async () => {
    const onClose = vi.fn()
    render(<AddFolderModal isOpen={true} onClose={onClose} onAdd={() => {}} />)
    await userEvent.click(screen.getByRole('button', { name: /Abbrechen/i }))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('zeigt Fehler wenn Name leer ist', async () => {
    render(<AddFolderModal isOpen={true} onClose={() => {}} onAdd={() => {}} />)
    await userEvent.click(screen.getByRole('button', { name: /Erstellen/i }))
    expect(screen.getByText(/Name ist erforderlich/i)).toBeInTheDocument()
  })

  it('ruft onAdd mit korrekten Daten auf', async () => {
    const onAdd = vi.fn()
    render(<AddFolderModal isOpen={true} onClose={() => {}} onAdd={onAdd} />)
    await userEvent.type(screen.getByLabelText(/^Name$/i), 'TestOrdner')
    await userEvent.click(screen.getByRole('button', { name: /Erstellen/i }))
    expect(onAdd).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'TestOrdner', type: 'folder' }),
    )
  })
})
