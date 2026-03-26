export interface Wallpaper {
  id: string
  name: string
  thumbnail: string // Kleines Vorschaubild (oder identisch mit src)
  src: string // Pfad zu public/wallpapers/
  type: 'image' | 'gradient' | 'animated'
}

export const WALLPAPERS: Wallpaper[] = [
  {
    id: 'animated-gradient',
    name: 'Animierter Gradient',
    thumbnail: '',
    src: '',
    type: 'animated',
  },
  {
    id: 'dark-space',
    name: 'Dark Space',
    thumbnail: 'wallpapers/dark-space.jpg',
    src: 'wallpapers/dark-space.jpg',
    type: 'image',
  },
  {
    id: 'aurora',
    name: 'Aurora',
    thumbnail: 'wallpapers/aurora.jpg',
    src: 'wallpapers/aurora.jpg',
    type: 'image',
  },
  {
    id: 'abstract',
    name: 'Abstract',
    thumbnail: 'wallpapers/abstract.jpg',
    src: 'wallpapers/abstract.jpg',
    type: 'image',
  },
  {
    id: 'mesh-gradient',
    name: 'Mesh Gradient',
    thumbnail: 'wallpapers/mesh-gradient.jpg',
    src: 'wallpapers/mesh-gradient.jpg',
    type: 'image',
  },
]

export const DEFAULT_WALLPAPER_ID = 'animated-gradient'
