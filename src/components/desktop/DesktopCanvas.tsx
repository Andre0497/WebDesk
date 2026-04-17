import { useEffect } from 'react'
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
import { isFolderItem } from '../../types'
import type { FolderItem, LinkItem, Position } from '../../types'
import type { DraggableData } from '../../types'
import { useDesktopStore } from '../../store/desktopStore'
import { useUIStore } from '../../store/uiStore'

interface DesktopCanvasProps {
  theme: 'dark' | 'light'
  onToggleTheme: () => void
}

export default function DesktopCanvas({ theme, onToggleTheme }: DesktopCanvasProps) {
  const {
    items,
    addLink,
    addFolder,
    updateItem,
    deleteItem,
    moveItem,
    openFolder,
    closeFolder,
  } = useDesktopStore()

  const {
    isSearchOpen,
    openSearch,
    closeSearch,
    activeModal,
    editingItemId,
    openModal,
    closeModal,
    confirmAction,
    setConfirmAction,
    draggingItemId,
    setDraggingItemId,
  } = useUIStore()

  const activeItem = draggingItemId ? (items.find(i => i.id === draggingItemId) ?? null) : null

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
  )

  function handleDragStart(event: DragStartEvent) {
    const data = event.active.data.current as DraggableData
    setDraggingItemId(data.item.id)
    document.body.classList.add('is-dragging')
  }

  function handleDragOver(event: DragOverEvent) {
    console.log('dragOver', event.over?.id)
  }

  function handleDragEnd(event: DragEndEvent) {
    setDraggingItemId(null)
    document.body.classList.remove('is-dragging')

    const { active, over } = event

    if (!over) return

    const overData = over.data.current
    const activeId = String(active.id)

    if (overData?.type === 'folder') {
      if (activeId === overData.folderId) return

      const itemsInFolder = items.filter(i => i.parentId === overData.folderId)
      const newPos: Position = {
        col: itemsInFolder.length % 4,
        row: Math.floor(itemsInFolder.length / 4),
      }

      moveItem(activeId, newPos, overData.folderId)
      openFolder(overData.folderId)
      return
    }

    if (overData?.type === 'cell') {
      const newPos: Position = { col: overData.col, row: overData.row }
      const draggedItem = items.find(i => i.id === activeId)
      if (!draggedItem) return

      const existingItem = items.find(
        i =>
          i.position.col === newPos.col &&
          i.position.row === newPos.row &&
          i.parentId === null &&
          i.id !== activeId,
      )

      moveItem(activeId, newPos, draggedItem.parentId)
      if (existingItem) {
        moveItem(existingItem.id, draggedItem.position, existingItem.parentId)
      }
    }
  }

  function handleDragCancel() {
    setDraggingItemId(null)
    document.body.classList.remove('is-dragging')
  }

  const contextMenu = useContextMenu()
  const iconContextMenu = useContextMenu()
  const folderContextMenu = useContextMenu()

  const isAddLinkOpen = activeModal === 'addLink'
  const isAddFolderOpen = activeModal === 'addFolder'
  const isSettingsOpen = activeModal === 'settings'

  const editingItem = editingItemId ? (items.find(i => i.id === editingItemId) ?? null) : null

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        isSearchOpen ? closeSearch() : openSearch()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isSearchOpen, openSearch, closeSearch])

  const getChildCount = (folderId: string) =>
    items.filter(item => item.parentId === folderId).length

  const handleSettingsClick = () => {
    openModal('settings')
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
    openFolder(id)
  }

  const handleFolderClose = (id: string) => {
    closeFolder(id)
  }

  const openFolders = items.filter(
    item => isFolderItem(item) && item.isOpen,
  ) as FolderItem[]

  const desktopMenuItems = [
    {
      label: 'Neuer Link',
      icon: <PlusIcon />,
      onClick: () => openModal('addLink'),
    },
    {
      label: 'Neuer Ordner',
      icon: <FolderPlusIcon />,
      onClick: () => openModal('addFolder'),
    },
  ]

  const getIconMenuItems = (itemId: string) => [
    {
      label: 'Bearbeiten',
      icon: <PencilIcon />,
      onClick: () => openModal('edit', itemId),
    },
    {
      label: 'Löschen',
      icon: <TrashIcon />,
      danger: true,
      onClick: () => {
        const item = items.find(i => i.id === itemId)
        if (!item) return
        setConfirmAction(() => deleteItem(item.id))
        openModal('confirm', item.id)
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
      onClick: () => openModal('edit', folderId),
    },
    {
      divider: true,
      label: 'Löschen',
      icon: <TrashIcon />,
      danger: true,
      onClick: () => {
        const item = items.find(i => i.id === folderId)
        if (!item) return
        setConfirmAction(() => deleteItem(item.id))
        openModal('confirm', item.id)
      },
    },
  ]

  const confirmItem = editingItemId ? items.find(i => i.id === editingItemId) : null

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
              updates.forEach(u => updateItem(u.id, { position: u.position }))
            }}
          />
        ))}
      </AnimatePresence>

      {/* Taskbar */}
      <Taskbar
        onSettingsClick={handleSettingsClick}
        onSearchClick={openSearch}
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
        onClose={closeModal}
        onAdd={(link: Omit<LinkItem, 'id' | 'createdAt' | 'updatedAt'>) => {
          addLink(link)
          closeModal()
        }}
      />

      <AddFolderModal
        isOpen={isAddFolderOpen}
        onClose={closeModal}
        onAdd={folder => {
          addFolder(folder)
          closeModal()
        }}
      />

      <EditItemModal
        isOpen={activeModal === 'edit' && editingItem !== null}
        onClose={closeModal}
        item={editingItem}
        onSave={(id, updates) => {
          updateItem(id, updates)
          closeModal()
        }}
      />

      <SpotlightSearch
        isOpen={isSearchOpen}
        onClose={closeSearch}
        items={items}
        onOpenFolder={id => handleFolderDoubleClick(id)}
      />
      <ConfirmModal
        isOpen={activeModal === 'confirm'}
        onClose={closeModal}
        onConfirm={() => {
          if (confirmAction) {
            confirmAction()
          }
          closeModal()
        }}
        title={confirmItem ? `„${confirmItem.name}" löschen?` : 'Löschen?'}
        message={
          confirmItem?.type === 'folder'
            ? `Der Ordner „${confirmItem.name}" und alle ${getChildCount(confirmItem.id)} enthaltenen Elemente werden unwiderruflich gelöscht.`
            : `Der Link „${confirmItem?.name}" wird unwiderruflich gelöscht.`
        }
        confirmLabel="Löschen"
        isDangerous={true}
      />
      <SettingsModal isOpen={isSettingsOpen} onClose={closeModal} />
    </div>

      <DragOverlay dropAnimation={null}>
        {activeItem ? <DragPreview item={activeItem} /> : null}
      </DragOverlay>
    </DndContext>
  )
}
