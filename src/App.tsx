import { DndContext } from '@dnd-kit/core'

function App() {
  return (
    <DndContext>
      <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
        <h1 className="text-4xl font-bold">WebDesk</h1>
      </div>
    </DndContext>
  )
}

export default App
