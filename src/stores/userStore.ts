// zustand 사용 예시

import create from 'zustand'
import { persist } from 'zustand/middleware'

export interface Review {
  id: number
  chatRoomId: number
  reviewerId: number
  reviewerNickname: string
  reviewerProfileImage: string
  reviewedProfileId: number
  rating: number
  comment: string
  tags: string[]
  createdAt: string
}

export interface User {
  id: number
  userId: number
  nickname: string
  profileImage: string
  department: string
  entranceTime: number
  graduation: boolean
  totalCounselingCount: number
  avgResponseTime: number
  averageRating: number
  tagCounts: Record<string, number>
  categoryCounts: Record<string, number>
  speakerRoleCount: number
  listenerRoleCount: number
  reviews: Review[]
  points: number
  createdAt: string
}

interface AuthStore {
  user: User | null
  setUser: (user: User) => void
  clearUser: () => void
  hydrated: boolean
  setHydrated: (hydrated: boolean) => void
  restoreUserFromStorage: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user: User) => {
        console.log('[zustand] setUser 호출:', user)
        set({ user })
      },
      clearUser: () => {
        console.log('[zustand] clearUser 호출')
        set({ user: null })
      },
      hydrated: false,
      setHydrated: (hydrated: boolean) => {
        console.log('[zustand] setHydrated 호출:', hydrated)
        set({ hydrated })
      },
      restoreUserFromStorage: () => {
        const raw = localStorage.getItem('auth-store')
        console.log('[zustand] restoreUserFromStorage 호출, raw:', raw)
        if (raw) {
          try {
            const parsed = JSON.parse(raw)
            console.log('[zustand] parsed:', parsed)
            if (parsed.state?.user) {
              set({ user: parsed.state.user })
              console.log('[zustand] user 복원 성공:', parsed.state.user)
            } else {
              console.log('[zustand] user 복원 실패: user 없음')
            }
          } catch (e) {
            console.log('[zustand] user 복원 실패: JSON 파싱 에러', e)
          }
        } else {
          console.log('[zustand] user 복원 실패: localStorage에 없음')
        }
      },
    }),
    {
      name: 'auth-store',
      onRehydrateStorage: () => (state) => {
        console.log('[zustand] onRehydrateStorage 실행, state:', state)
        state?.setHydrated(true)
        setTimeout(() => {
          console.log('[zustand] hydration 후 user:', state?.user)
        }, 100)
      },
    }
  )
)
