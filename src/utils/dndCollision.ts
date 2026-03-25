import {
  pointerWithin,
  rectIntersection,
  type CollisionDetection,
} from '@dnd-kit/core'

export const desktopCollisionDetection: CollisionDetection = (args) => {
  // Check first if the pointer is directly over a folder drop-target
  const pointerCollisions = pointerWithin(args)
  const folderCollision = pointerCollisions.find(
    c => String(c.id).startsWith('folder-drop-'),
  )
  if (folderCollision) return [folderCollision]

  // Otherwise: use the nearest grid cell
  return rectIntersection(args)
}
