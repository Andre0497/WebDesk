import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ConfirmModal from './ConfirmModal'

describe('ConfirmModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onConfirm: vi.fn(),
    title: 'Löschen bestätigen',
    message: 'Möchten Sie dieses Element wirklich löschen?',
  }

  it('zeigt die Nachricht an wenn isOpen=true', () => {
    render(<ConfirmModal {...defaultProps} />)
    expect(screen.getByText(defaultProps.message)).toBeInTheDocument()
  })

  it('rendert nichts wenn isOpen=false', () => {
    render(<ConfirmModal {...defaultProps} isOpen={false} />)
    expect(screen.queryByText(defaultProps.message)).not.toBeInTheDocument()
  })

  it('ruft onConfirm und onClose bei Bestätigen auf', () => {
    const onConfirm = vi.fn()
    const onClose = vi.fn()
    render(<ConfirmModal {...defaultProps} onConfirm={onConfirm} onClose={onClose} />)
    fireEvent.click(screen.getByRole('button', { name: /Bestätigen/i }))
    expect(onConfirm).toHaveBeenCalledOnce()
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('ruft onClose bei Abbrechen auf', () => {
    const onClose = vi.fn()
    render(<ConfirmModal {...defaultProps} onClose={onClose} />)
    fireEvent.click(screen.getByRole('button', { name: /Abbrechen/i }))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('verwendet benutzerdefinierten Bestätigen-Text', () => {
    render(<ConfirmModal {...defaultProps} confirmLabel="Ja, löschen" />)
    expect(screen.getByRole('button', { name: /Ja, löschen/i })).toBeInTheDocument()
  })

  it('zeigt Warn-Icon wenn isDangerous=true', () => {
    render(<ConfirmModal {...defaultProps} isDangerous={true} />)
    // The dangerous variant shows an ExclamationTriangleIcon (SVG)
    const container = screen.getByText(defaultProps.message).closest('div')
    expect(container?.parentElement?.querySelector('svg')).toBeInTheDocument()
  })
})
