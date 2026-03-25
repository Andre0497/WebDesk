export function snapToGrid(x: number, y: number, gridSize: number): [number, number] {
  return [
    Math.round(x / gridSize) * gridSize,
    Math.round(y / gridSize) * gridSize,
  ]
}
