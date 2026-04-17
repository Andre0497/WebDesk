import { create } from 'zustand'
import type { UIState, ModalType } from '../types/store'

interface UIStore extends UIState {
  // Actions
  openContextMenu: (x: number, y: number, targetId?: string | null) => void
  closeContextMenu: () => void
  openModal: (modal: ModalType, editingItemId?: string | null) => void
  closeModal: () => void
  setSearchQuery: (query: string) => void
  toggleSearch: () => void
  openSearch: () => void
  closeSearch: () => void
  setDraggingItemId: (id: string | null) => void
  setConfirmAction: (action: (() => void) | null) => void
}

export const useUIStore = create<UIStore>()(set => ({
  contextMenu: { isOpen: false, x: 0, y: 0, targetId: null },
  activeModal: null,
  editingItemId: null,
  confirmAction: null,
  searchQuery: '',
  isSearchOpen: false,
  draggingItemId: null,

  openContextMenu: (x, y, targetId = null) =>
    set({ contextMenu: { isOpen: true, x, y, targetId } }),

  closeContextMenu: () =>
    set({ contextMenu: { isOpen: false, x: 0, y: 0, targetId: null } }),

  openModal: (modal, editingItemId = null) =>
    set({ activeModal: modal, editingItemId }),

  closeModal: () =>
    set({ activeModal: null, editingItemId: null, confirmAction: null }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  toggleSearch: () => set(state => ({ isSearchOpen: !state.isSearchOpen })),

  openSearch: () => set({ isSearchOpen: true }),

  closeSearch: () => set({ isSearchOpen: false }),

  setDraggingItemId: (id) => set({ draggingItemId: id }),

  setConfirmAction: (action) => set({ confirmAction: action }),
}))
