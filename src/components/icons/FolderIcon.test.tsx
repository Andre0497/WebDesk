import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import FolderIcon from './FolderIcon'
import type { FolderItem } from '../../types'

vi.mock('@dnd-kit/core', () => ({
  useDraggable: vi.fn(() => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
    transform: null,
    isDragging: false,
  })),
  useDroppable: vi.fn(() => ({
    setNodeRef: vi.fn(),
    isOver: false,
  })),
}))

const defaultItem: FolderItem = {
  id: 'folder-1',
  type: 'folder',
  name: 'Mein Ordner',
  color: '#6366f1',
  isOpen: false,
  position: { col: 1, row: 1 },
  parentId: null,
  createdAt: 1000,
  updatedAt: 1000,
}

describe('FolderIcon', () => {
  it('zeigt den Ordner-Namen an', () => {
    render(<FolderIcon item={defaultItem} />)
    expect(screen.getByText('Mein Ordner')).toBeInTheDocument()
  })

  it('ruft onDoubleClick beim Doppelklick auf', () => {
    const onDoubleClick = vi.fn()
    render(<FolderIcon item={defaultItem} onDoubleClick={onDoubleClick} />)
    fireEvent.dblClick(screen.getByText('Mein Ordner'))
    expect(onDoubleClick).toHaveBeenCalledWith('folder-1')
  })

  it('zeigt Item-Count Badge wenn itemCount größer 0', () => {
    render(<FolderIcon item={defaultItem} itemCount={3} />)
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('zeigt kein Badge wenn itemCount 0 ist', () => {
    render(<FolderIcon item={defaultItem} itemCount={0} />)
    expect(screen.queryByText('0')).not.toBeInTheDocument()
  })

  it('zeigt 99+ Badge wenn itemCount über 99', () => {
    render(<FolderIcon item={defaultItem} itemCount={100} />)
    expect(screen.getByText('99+')).toBeInTheDocument()
  })

  it('ruft onContextMenu auf wenn Rechtsklick', () => {
    const onContextMenu = vi.fn()
    render(<FolderIcon item={defaultItem} onContextMenu={onContextMenu} />)
    fireEvent.contextMenu(screen.getByText('Mein Ordner'))
    expect(onContextMenu).toHaveBeenCalledOnce()
  })
})
