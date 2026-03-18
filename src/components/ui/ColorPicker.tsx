interface ColorPickerProps {
  colors: string[]
  value: string
  onChange: (color: string) => void
  label?: string
}

export default function ColorPicker({ colors, value, onChange, label }: ColorPickerProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && <span className="text-sm font-medium text-white/80">{label}</span>}
      <div className="flex flex-wrap gap-2">
        {colors.map(color => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className={`w-7 h-7 rounded-full transition-all
                        ${value === color
                          ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-800 scale-110'
                          : 'hover:scale-110'
                        }`}
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>
    </div>
  )
}
