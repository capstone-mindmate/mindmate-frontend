// zustand 사용 예시

import create from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  name: string
}

interface AuthStore {
  user: User | null
  setUser: (user: User) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user: User) => set({ user }),
}))
