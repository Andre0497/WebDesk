import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ContextMenu from './ContextMenu'
import type { ContextMenuItem } from './ContextMenu'

describe('ContextMenu', () => {
  const items: ContextMenuItem[] = [
    { label: 'Bearbeiten', onClick: vi.fn() },
    { label: 'Löschen', onClick: vi.fn(), danger: true },
  ]

  it('rendert nichts wenn isOpen=false', () => {
    render(<ContextMenu isOpen={false} x={100} y={100} items={items} onClose={() => {}} />)
    expect(screen.queryByText('Bearbeiten')).not.toBeInTheDocument()
  })

  it('rendert Menüpunkte wenn isOpen=true', () => {
    render(<ContextMenu isOpen={true} x={100} y={100} items={items} onClose={() => {}} />)
    expect(screen.getByText('Bearbeiten')).toBeInTheDocument()
    expect(screen.getByText('Löschen')).toBeInTheDocument()
  })

  it('ruft onClick des Items auf wenn geklickt', () => {
    const onClick = vi.fn()
    const onClose = vi.fn()
    const testItems: ContextMenuItem[] = [{ label: 'Aktion', onClick }]
    render(<ContextMenu isOpen={true} x={100} y={100} items={testItems} onClose={onClose} />)
    fireEvent.click(screen.getByText('Aktion'))
    expect(onClick).toHaveBeenCalledOnce()
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('deaktiviert Items mit disabled=true', () => {
    const onClick = vi.fn()
    const testItems: ContextMenuItem[] = [{ label: 'Gesperrt', onClick, disabled: true }]
    render(<ContextMenu isOpen={true} x={100} y={100} items={testItems} onClose={() => {}} />)
    expect(screen.getByText('Gesperrt').closest('button')).toBeDisabled()
  })

  it('rendert ein Trennzeichen wenn divider=true', () => {
    const testItems: ContextMenuItem[] = [
      { label: 'Eins', onClick: vi.fn() },
      { label: 'Zwei', onClick: vi.fn(), divider: true },
    ]
    render(<ContextMenu isOpen={true} x={100} y={100} items={testItems} onClose={() => {}} />)
    // Both items are rendered
    expect(screen.getByText('Eins')).toBeInTheDocument()
    expect(screen.getByText('Zwei')).toBeInTheDocument()
  })
})
