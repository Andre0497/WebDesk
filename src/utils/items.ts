import type { LinkItem, FolderItem } from '../types/desktop'

/** Erzeugt eine eindeutige ID via crypto.randomUUID() */
export function generateId(): string {
  return crypto.randomUUID()
}

/** Erstellt ein neues LinkItem mit Standardwerten */
export function createLinkItem(
  params: Pick<LinkItem, 'url' | 'name'> &
    Partial<Omit<LinkItem, 'id' | 'type' | 'createdAt' | 'updatedAt' | 'url' | 'name'>>,
): LinkItem {
  return {
    id: generateId(),
    type: 'link',
    position: { col: 0, row: 0 },
    parentId: null,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    ...params,
  }
}

/** Erstellt ein neues FolderItem mit Standardwerten */
export function createFolderItem(
  params: Pick<FolderItem, 'name'> &
    Partial<Omit<FolderItem, 'id' | 'type' | 'createdAt' | 'updatedAt' | 'name'>>,
): FolderItem {
  return {
    id: generateId(),
    type: 'folder',
    color: '#6366f1',
    isOpen: false,
    position: { col: 0, row: 0 },
    parentId: null,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    ...params,
  }
}
