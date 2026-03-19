import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

interface SearchBarProps {
  onOpen: () => void
}

export default function SearchBar({ onOpen }: SearchBarProps) {
  return (
    <button
      onClick={onOpen}
      className="flex items-center gap-2 px-3 py-1.5
                 bg-white/10 hover:bg-white/20
                 border border-white/15 rounded-lg
                 text-white/50 hover:text-white/80
                 text-sm transition-colors"
    >
      <MagnifyingGlassIcon className="w-4 h-4 shrink-0" />
      <span className="hidden sm:inline">Suchen …</span>
      <kbd className="hidden sm:inline text-[10px] bg-white/10 px-1.5 py-0.5 rounded">
        Strg K
      </kbd>
    </button>
  )
}
