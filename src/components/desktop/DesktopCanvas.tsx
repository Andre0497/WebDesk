import { useState } from 'react'
import {
  PlusIcon,
  FolderPlusIcon,
  FolderOpenIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'
import AnimatedBackground from './AnimatedBackground'
import DesktopGrid from './DesktopGrid'
import Taskbar from '../taskbar/Taskbar'
import FolderWindow from '../windows/FolderWindow'
import { useContextMenu } from '../../hooks/useContextMenu'
import ContextMenu from '../ui/ContextMenu'
import { defaultItems } from '../../utils/defaultData'
import { isFolderItem } from '../../types'
import type { FolderItem } from '../../types'

interface DesktopCanvasProps {
  theme: 'dark' | 'light'
  onToggleTheme: () => void
}

export default function DesktopCanvas({ theme, onToggleTheme }: DesktopCanvasProps) {
  const contextMenu = useContextMenu()
  const iconContextMenu = useContextMenu()
  const folderContextMenu = useContextMenu()

  const [openFolderIds, setOpenFolderIds] = useState<string[]>([])

  // Später kommt dieser Wert aus dem desktopStore (Task 6.1)
  const wallpaper = undefined // undefined = animierter Gradient

  const handleSettingsClick = () => {
    // Wird in Task 3.x (SettingsModal) implementiert
    console.log('Settings öffnen')
  }

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    contextMenu.open(e.clientX, e.clientY, null)
  }

  const handleIconContextMenu = (e: React.MouseEvent, id: string) => {
    iconContextMenu.open(e.clientX, e.clientY, id)
  }

  const handleFolderContextMenu = (e: React.MouseEvent, id: string) => {
    folderContextMenu.open(e.clientX, e.clientY, id)
  }

  const handleFolderDoubleClick = (id: string) => {
    setOpenFolderIds(prev => (prev.includes(id) ? prev : [...prev, id]))
  }

  const handleFolderClose = (id: string) => {
    setOpenFolderIds(prev => prev.filter(fid => fid !== id))
  }

  const openFolders = defaultItems.filter(
    item => isFolderItem(item) && openFolderIds.includes(item.id),
  ) as FolderItem[]

  const desktopMenuItems = [
    {
      label: 'Neuer Link',
      icon: <PlusIcon />,
      onClick: () => console.log('Neuer Link'), // Task 3.6
    },
    {
      label: 'Neuer Ordner',
      icon: <FolderPlusIcon />,
      onClick: () => console.log('Neuer Ordner'), // Task 3.7
    },
  ]

  const getIconMenuItems = (itemId: string) => [
    {
      label: 'Bearbeiten',
      icon: <PencilIcon />,
      onClick: () => console.log('Bearbeiten:', itemId), // Task 3.8
    },
    {
      label: 'Löschen',
      icon: <TrashIcon />,
      danger: true,
      onClick: () => console.log('Löschen:', itemId), // Task 3.9
    },
  ]

  const getFolderMenuItems = (folderId: string) => [
    {
      label: 'Öffnen',
      icon: <FolderOpenIcon />,
      onClick: () => handleFolderDoubleClick(folderId),
    },
    {
      label: 'Bearbeiten',
      icon: <PencilIcon />,
      onClick: () => console.log('Bearbeiten:', folderId), // Task 3.8
    },
    {
      divider: true,
      label: 'Löschen',
      icon: <TrashIcon />,
      danger: true,
      onClick: () => console.log('Löschen:', folderId), // Task 3.9
    },
  ]

  return (
    <div
      className="relative w-screen h-screen overflow-hidden select-none"
      onContextMenu={handleContextMenu}
    >
      <AnimatedBackground wallpaper={wallpaper} />

      {/* Desktop-Grid mit Abstand nach unten für die Taskbar */}
      <div className="relative z-10 w-full h-full pb-12">
        <DesktopGrid
          onIconContextMenu={handleIconContextMenu}
          onFolderContextMenu={handleFolderContextMenu}
          onFolderDoubleClick={handleFolderDoubleClick}
        />
      </div>

      {/* Offene Ordner-Fenster */}
      {openFolders.map(folder => (
        <FolderWindow
          key={folder.id}
          folder={folder}
          items={defaultItems.filter(item => item.parentId === folder.id)}
          onClose={() => handleFolderClose(folder.id)}
        />
      ))}

      {/* Taskbar */}
      <Taskbar onSettingsClick={handleSettingsClick} theme={theme} onToggleTheme={onToggleTheme} />

      <ContextMenu
        isOpen={contextMenu.isOpen}
        x={contextMenu.x}
        y={contextMenu.y}
        items={desktopMenuItems}
        onClose={contextMenu.close}
      />

      <ContextMenu
        isOpen={iconContextMenu.isOpen}
        x={iconContextMenu.x}
        y={iconContextMenu.y}
        items={iconContextMenu.targetId ? getIconMenuItems(iconContextMenu.targetId) : []}
        onClose={iconContextMenu.close}
      />

      <ContextMenu
        isOpen={folderContextMenu.isOpen}
        x={folderContextMenu.x}
        y={folderContextMenu.y}
        items={folderContextMenu.targetId ? getFolderMenuItems(folderContextMenu.targetId) : []}
        onClose={folderContextMenu.close}
      />
    </div>
  )
}
