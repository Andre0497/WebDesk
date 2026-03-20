import type { DesktopItem } from './desktop'

export interface DraggableData {
  type: 'link' | 'folder'
  item: DesktopItem
}
