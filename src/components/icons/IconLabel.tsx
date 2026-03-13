interface IconLabelProps {
  name: string
  selected?: boolean
}

export default function IconLabel({ name, selected = false }: IconLabelProps) {
  return (
    <span
      className={`mt-1.5 px-1 py-0.5 rounded text-xs text-center leading-tight
                  max-w-[88px] line-clamp-2 break-words
                  ${
                    selected
                      ? 'bg-indigo-600 text-white'
                      : 'text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]'
                  }`}
    >
      {name}
    </span>
  )
}
