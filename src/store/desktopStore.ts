import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEFAULT_WALLPAPER_ID } from '../utils/wallpapers'

interface DesktopSettings {
  wallpaper: string
}

interface DesktopStore {
  settings: DesktopSettings
  setWallpaper: (id: string) => void
}

export const useDesktopStore = create<DesktopStore>()(
  persist(
    set => ({
      settings: {
        wallpaper: DEFAULT_WALLPAPER_ID,
      },
      setWallpaper: (id: string) =>
        set(state => ({
          settings: { ...state.settings, wallpaper: id },
        })),
    }),
    {
      name: 'webdesk-data',
      partialize: state => ({ settings: state.settings }),
    },
  ),
)

