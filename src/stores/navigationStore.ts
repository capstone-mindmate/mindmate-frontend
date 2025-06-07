import { create } from 'zustand'

interface NavigationState {
  previousPath: string | null
  setPreviousPath: (path: string) => void
  clearPreviousPath: () => void
}

export const useNavigationStore = create<NavigationState>((set) => ({
  previousPath: null,
  setPreviousPath: (path) => set({ previousPath: path }),
  clearPreviousPath: () => set({ previousPath: null }),
}))
