interface AnimatedBackgroundProps {
  wallpaper?: string // z. B. 'dark-space' | 'aurora' | 'abstract' | undefined
}

export default function AnimatedBackground({ wallpaper }: AnimatedBackgroundProps) {
  if (wallpaper) {
    return (
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/wallpapers/${wallpaper}.jpg')` }}
      >
        {/* Leichter Overlay für bessere Icon-Lesbarkeit */}
        <div className="absolute inset-0 bg-black/20" />
      </div>
    )
  }

  // Standard: Animierter Gradient
  return (
    <div className="absolute inset-0 animated-gradient">
      {/* Optionale Overlay-Schicht für Tiefe */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
    </div>
  )
}

