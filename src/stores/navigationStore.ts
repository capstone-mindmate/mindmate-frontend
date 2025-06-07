import { create } from 'zustand'

interface NavigationState {
  previousPath: string | null
  originPath: string | null // 이모티콘 페이지로 들어오기 전의 원래 위치
  setPreviousPath: (path: string) => void
  setOriginPath: (path: string) => void
  clearPreviousPath: () => void
  clearOriginPath: () => void
}

export const useNavigationStore = create<NavigationState>((set) => ({
  previousPath: null,
  originPath: null,
  setPreviousPath: (path) => set({ previousPath: path }),
  setOriginPath: (path) => set({ originPath: path }),
  clearPreviousPath: () => set({ previousPath: null }),
  clearOriginPath: () => set({ originPath: null }),
}))
