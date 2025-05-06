// zustand 사용 예시

import create from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  name: string
  profileImage: string
  department: string
}

interface AuthStore {
  user: User | null
  setUser: (user: User) => void
  clearUser: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user: User) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    { name: 'auth-store' }
  )
)
