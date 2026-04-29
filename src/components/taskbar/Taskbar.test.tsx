import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Taskbar from './Taskbar'

describe('Taskbar', () => {
  const defaultProps = {
    onSettingsClick: vi.fn(),
    onSearchClick: vi.fn(),
    theme: 'dark' as const,
    onToggleTheme: vi.fn(),
  }

  it('zeigt den App-Namen WebDesk an', () => {
    render(<Taskbar {...defaultProps} />)
    expect(screen.getByText('WebDesk')).toBeInTheDocument()
  })

  it('ruft onSettingsClick beim Klick auf den Settings-Button auf', () => {
    const onSettingsClick = vi.fn()
    render(<Taskbar {...defaultProps} onSettingsClick={onSettingsClick} />)
    fireEvent.click(screen.getByTitle('Einstellungen'))
    expect(onSettingsClick).toHaveBeenCalledOnce()
  })

  it('ruft onToggleTheme beim Klick auf den Theme-Toggle auf', () => {
    const onToggleTheme = vi.fn()
    render(<Taskbar {...defaultProps} onToggleTheme={onToggleTheme} />)
    fireEvent.click(screen.getByTitle('Light Mode aktivieren'))
    expect(onToggleTheme).toHaveBeenCalledOnce()
  })

  it('zeigt Dark-Mode-Button wenn theme=light', () => {
    render(<Taskbar {...defaultProps} theme="light" />)
    expect(screen.getByTitle('Dark Mode aktivieren')).toBeInTheDocument()
  })

  it('zeigt Light-Mode-Button wenn theme=dark', () => {
    render(<Taskbar {...defaultProps} theme="dark" />)
    expect(screen.getByTitle('Light Mode aktivieren')).toBeInTheDocument()
  })

  it('zeigt die Uhr an', () => {
    render(<Taskbar {...defaultProps} />)
    // Clock renders a time string in HH:MM format
    expect(document.body.textContent).toMatch(/\d{2}:\d{2}/)
  })
})
