import { useState, useEffect } from 'react'
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
import AddLinkModal from '../modals/AddLinkModal'
import AddFolderModal from '../modals/AddFolderModal'
import EditItemModal from '../modals/EditItemModal'
import SpotlightSearch from '../ui/SpotlightSearch'
import ConfirmModal from '../modals/ConfirmModal'
import { defaultItems } from '../../utils/defaultData'
import { isFolderItem } from '../../types'
import type { DesktopItem, FolderItem, LinkItem } from '../../types'

interface DesktopCanvasProps {
  theme: 'dark' | 'light'
  onToggleTheme: () => void
}

export default function DesktopCanvas({ theme, onToggleTheme }: DesktopCanvasProps) {
  const contextMenu = useContextMenu()
  const iconContextMenu = useContextMenu()
  const folderContextMenu = useContextMenu()

  const [openFolderIds, setOpenFolderIds] = useState<string[]>([])
  const [isAddLinkOpen, setIsAddLinkOpen] = useState(false)
  const [isAddFolderOpen, setIsAddFolderOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<DesktopItem | null>(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen(prev => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean
    itemId: string | null
    itemName: string
    isFolder: boolean
  } | null>(null)

  const getChildCount = (folderId: string) =>
    defaultItems.filter(item => item.parentId === folderId).length

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
      onClick: () => setIsAddLinkOpen(true),
    },
    {
      label: 'Neuer Ordner',
      icon: <FolderPlusIcon />,
      onClick: () => setIsAddFolderOpen(true),
    },
  ]

  const getIconMenuItems = (itemId: string) => [
    {
      label: 'Bearbeiten',
      icon: <PencilIcon />,
      onClick: () => setEditingItem(defaultItems.find(i => i.id === itemId) ?? null),
    },
    {
      label: 'Löschen',
      icon: <TrashIcon />,
      danger: true,
      onClick: () => {
        const item = defaultItems.find(i => i.id === itemId)
        if (!item) return
        setConfirmState({
          isOpen: true,
          itemId: item.id,
          itemName: item.name,
          isFolder: item.type === 'folder',
        })
      },
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
      onClick: () => setEditingItem(defaultItems.find(i => i.id === folderId) ?? null),
    },
    {
      divider: true,
      label: 'Löschen',
      icon: <TrashIcon />,
      danger: true,
      onClick: () => {
        const item = defaultItems.find(i => i.id === folderId)
        if (!item) return
        setConfirmState({
          isOpen: true,
          itemId: item.id,
          itemName: item.name,
          isFolder: item.type === 'folder',
        })
      },
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
      <Taskbar
        onSettingsClick={handleSettingsClick}
        onSearchClick={() => setIsSearchOpen(true)}
        theme={theme}
        onToggleTheme={onToggleTheme}
      />

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

      <AddLinkModal
        isOpen={isAddLinkOpen}
        onClose={() => setIsAddLinkOpen(false)}
        onAdd={(link: Omit<LinkItem, 'id' | 'createdAt' | 'updatedAt'>) =>
          console.log('Link hinzufügen:', link)
        }
      />

      <AddFolderModal
        isOpen={isAddFolderOpen}
        onClose={() => setIsAddFolderOpen(false)}
        onAdd={folder => console.log('Ordner hinzufügen:', folder)}
      />

      <EditItemModal
        isOpen={editingItem !== null}
        onClose={() => setEditingItem(null)}
        item={editingItem}
        onSave={(id, updates) => console.log('Update:', id, updates)}
      />

      <SpotlightSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        items={defaultItems}
        onOpenFolder={id => handleFolderDoubleClick(id)}
      <ConfirmModal
        isOpen={confirmState?.isOpen ?? false}
        onClose={() => setConfirmState(null)}
        onConfirm={() => {
          if (confirmState?.itemId) {
            console.log('Löschen:', confirmState.itemId) // Task 6.1
          }
        }}
        title={`„${confirmState?.itemName}" löschen?`}
        message={
          confirmState?.isFolder
            ? `Der Ordner „${confirmState.itemName}" und alle ${getChildCount(confirmState.itemId ?? '')} enthaltenen Elemente werden unwiderruflich gelöscht.`
            : `Der Link „${confirmState?.itemName}" wird unwiderruflich gelöscht.`
        }
        confirmLabel="Löschen"
        isDangerous={true}
      />
    </div>
  )
}
