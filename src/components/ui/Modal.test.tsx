import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Modal from './Modal'

describe('Modal', () => {
  it('rendert Kinder wenn isOpen=true', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Test Modal">
        <p>Modal-Inhalt</p>
      </Modal>,
    )
    expect(screen.getByText('Modal-Inhalt')).toBeInTheDocument()
  })

  it('rendert nichts wenn isOpen=false', () => {
    render(
      <Modal isOpen={false} onClose={() => {}} title="Test Modal">
        <p>Modal-Inhalt</p>
      </Modal>,
    )
    expect(screen.queryByText('Modal-Inhalt')).not.toBeInTheDocument()
  })

  it('zeigt den Titel an', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Mein Titel">
        <p>Inhalt</p>
      </Modal>,
    )
    expect(screen.getByText('Mein Titel')).toBeInTheDocument()
  })

  it('ruft onClose bei Schließen-Button auf', () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen={true} onClose={onClose} title="Test Modal">
        <p>Inhalt</p>
      </Modal>,
    )
    fireEvent.click(screen.getByRole('button'))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('ruft onClose bei Backdrop-Klick auf', () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen={true} onClose={onClose} title="Test Modal">
        <p>Inhalt</p>
      </Modal>,
    )
    fireEvent.click(screen.getByTestId('modal-backdrop'))
    expect(onClose).toHaveBeenCalled()
  })

  it('versteckt Schließen-Button wenn showCloseButton=false', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Test Modal" showCloseButton={false}>
        <p>Inhalt</p>
      </Modal>,
    )
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
