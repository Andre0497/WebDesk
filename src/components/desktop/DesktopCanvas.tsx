import { useState, useEffect } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import type { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core'
import { restrictToParentElement } from '@dnd-kit/modifiers'
import { AnimatePresence } from 'framer-motion'
import { desktopCollisionDetection } from '../../utils/dndCollision'
import {
  PlusIcon,
  FolderPlusIcon,
  FolderOpenIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'
import AnimatedBackground from './AnimatedBackground'
import DesktopGrid from './DesktopGrid'
import DragPreview from './DragPreview'
import Taskbar from '../taskbar/Taskbar'
import FolderWindow from '../windows/FolderWindow'
import { useContextMenu } from '../../hooks/useContextMenu'
import ContextMenu from '../ui/ContextMenu'
import AddLinkModal from '../modals/AddLinkModal'
import AddFolderModal from '../modals/AddFolderModal'
import EditItemModal from '../modals/EditItemModal'
import SpotlightSearch from '../ui/SpotlightSearch'
import ConfirmModal from '../modals/ConfirmModal'
import SettingsModal from '../modals/SettingsModal'
import { defaultItems } from '../../utils/defaultData'
import { isFolderItem } from '../../types'
import type { DesktopItem, FolderItem, LinkItem, Position } from '../../types'
import type { DraggableData } from '../../types'

interface DesktopCanvasProps {
  theme: 'dark' | 'light'
  onToggleTheme: () => void
}

export default function DesktopCanvas({ theme, onToggleTheme }: DesktopCanvasProps) {
  const [items, setItems] = useState<DesktopItem[]>(defaultItems)
  const [activeItem, setActiveItem] = useState<DesktopItem | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
  )

  function handleDragStart(event: DragStartEvent) {
    const data = event.active.data.current as DraggableData
    setActiveItem(data.item)
    document.body.classList.add('is-dragging')
  }

  function handleDragOver(event: DragOverEvent) {
    console.log('dragOver', event.over?.id)
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveItem(null)
    document.body.classList.remove('is-dragging')

    const { active, over } = event

    if (!over) return

    const overData = over.data.current
    const activeId = String(active.id)

    if (overData?.type === 'folder') {
      // Prevent dropping an item onto itself
      if (activeId === overData.folderId) return

      setItems(prevItems => {
        const activeItem = prevItems.find(i => i.id === activeId)
        if (!activeItem) return prevItems

        const itemsInFolder = prevItems.filter(i => i.parentId === overData.folderId)
        const newPos: Position = {
          col: itemsInFolder.length % 4,
          row: Math.floor(itemsInFolder.length / 4),
        }

        return prevItems.map(item =>
          item.id === activeId ? { ...item, position: newPos, parentId: overData.folderId } : item,
        )
      })

      // Open the target folder
      setOpenFolderIds(prev =>
        prev.includes(overData.folderId) ? prev : [...prev, overData.folderId],
      )
      return
    }

    if (overData?.type === 'cell') {
      const newPos: Position = { col: overData.col, row: overData.row }

      setItems(prevItems => {
        const activeItem = prevItems.find(i => i.id === activeId)
        if (!activeItem) return prevItems

        const existingItem = prevItems.find(
          i =>
            i.position.col === newPos.col &&
            i.position.row === newPos.row &&
            i.parentId === null &&
            i.id !== activeId,
        )

        return prevItems.map(item => {
          if (item.id === activeId) {
            return { ...item, position: newPos }
          }
          if (existingItem && item.id === existingItem.id) {
            return { ...item, position: activeItem.position }
          }
          return item
        })
      })
    }
  }

  function handleDragCancel() {
    setActiveItem(null)
    document.body.classList.remove('is-dragging')
  }

  const contextMenu = useContextMenu()
  const iconContextMenu = useContextMenu()
  const folderContextMenu = useContextMenu()

  const [openFolderIds, setOpenFolderIds] = useState<string[]>([])
  const [isAddLinkOpen, setIsAddLinkOpen] = useState(false)
  const [isAddFolderOpen, setIsAddFolderOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<DesktopItem | null>(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

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
    items.filter(item => item.parentId === folderId).length

  const handleSettingsClick = () => {
    setIsSettingsOpen(true)
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

  const openFolders = items.filter(
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
      onClick: () => setEditingItem(items.find(i => i.id === itemId) ?? null),
    },
    {
      label: 'Löschen',
      icon: <TrashIcon />,
      danger: true,
      onClick: () => {
        const item = items.find(i => i.id === itemId)
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
      onClick: () => setEditingItem(items.find(i => i.id === folderId) ?? null),
    },
    {
      divider: true,
      label: 'Löschen',
      icon: <TrashIcon />,
      danger: true,
      onClick: () => {
        const item = items.find(i => i.id === folderId)
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
    <DndContext
      sensors={sensors}
      collisionDetection={desktopCollisionDetection}
      modifiers={[restrictToParentElement]}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
    <div
      className="relative w-screen h-screen overflow-hidden select-none"
      onContextMenu={handleContextMenu}
    >
      <AnimatedBackground />

      {/* Desktop-Grid mit Abstand nach unten für die Taskbar */}
      <div className="relative z-10 w-full h-full pb-12">
        <DesktopGrid
          items={items.filter(i => i.parentId === null)}
          allItems={items}
          onIconContextMenu={handleIconContextMenu}
          onFolderContextMenu={handleFolderContextMenu}
          onFolderDoubleClick={handleFolderDoubleClick}
        />
      </div>

      {/* Offene Ordner-Fenster */}
      <AnimatePresence>
        {openFolders.map(folder => (
          <FolderWindow
            key={folder.id}
            folder={folder}
            items={items.filter(item => item.parentId === folder.id)}
            onClose={() => handleFolderClose(folder.id)}
            onItemsReorder={updates => {
              setItems(prev =>
                prev.map(item => {
                  const update = updates.find(u => u.id === item.id)
                  return update ? { ...item, position: update.position } : item
                }),
              )
            }}
          />
        ))}
      </AnimatePresence>

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
        items={items}
        onOpenFolder={id => handleFolderDoubleClick(id)}
      />
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
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>

      <DragOverlay dropAnimation={null}>
        {activeItem ? <DragPreview item={activeItem} /> : null}
      </DragOverlay>
    </DndContext>
  )
}
