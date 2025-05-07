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
  profileId?: number // 내 프로필 id (프론트에서 관리용, 선택적)
  email: string // 로그인 이메일
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
  accessToken?: string // JWT 액세스 토큰
  refreshToken?: string // JWT 리프레시 토큰
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
        set({ user })
      },
      clearUser: () => {
        set({ user: null })
      },
      hydrated: false,
      setHydrated: (hydrated: boolean) => {
        set({ hydrated })
      },
      restoreUserFromStorage: () => {
        const raw = localStorage.getItem('auth-store')
        if (raw) {
          try {
            const parsed = JSON.parse(raw)
            if (parsed.state?.user) {
              set({ user: parsed.state.user })
            }
          } catch (e) {}
        }
      },
    }),
    {
      name: 'auth-store',
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true)
      },
    }
  )
)
