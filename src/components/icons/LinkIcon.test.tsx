import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import LinkIcon from './LinkIcon'
import type { LinkItem } from '../../types'

vi.mock('@dnd-kit/core', () => ({
  useDraggable: vi.fn(() => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
    transform: null,
    isDragging: false,
  })),
}))

const defaultItem: LinkItem = {
  id: 'link-1',
  type: 'link',
  name: 'GitHub',
  url: 'https://github.com',
  faviconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=github.com',
  position: { col: 1, row: 1 },
  parentId: null,
  createdAt: 1000,
  updatedAt: 1000,
}

describe('LinkIcon', () => {
  it('zeigt den Link-Namen an', () => {
    render(<LinkIcon item={defaultItem} />)
    expect(screen.getByText('GitHub')).toBeInTheDocument()
  })

  it('öffnet den Link beim Doppelklick', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
    render(<LinkIcon item={defaultItem} />)
    fireEvent.dblClick(screen.getByText('GitHub'))
    expect(openSpy).toHaveBeenCalledWith('https://github.com', '_blank', 'noopener,noreferrer')
    openSpy.mockRestore()
  })

  it('zeigt Favicon-Bild mit korrekter src', () => {
    render(<LinkIcon item={defaultItem} />)
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', expect.stringContaining('github.com'))
  })

  it('zeigt Fallback-Icon wenn kein Favicon gesetzt ist', () => {
    const itemWithoutFavicon: LinkItem = { ...defaultItem, faviconUrl: undefined }
    render(<LinkIcon item={itemWithoutFavicon} />)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('ruft onContextMenu auf wenn Rechtsklick', () => {
    const onContextMenu = vi.fn()
    render(<LinkIcon item={defaultItem} onContextMenu={onContextMenu} />)
    fireEvent.contextMenu(screen.getByText('GitHub'))
    expect(onContextMenu).toHaveBeenCalledOnce()
  })
})
