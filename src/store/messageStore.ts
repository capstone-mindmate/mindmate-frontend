import { create } from 'zustand'

interface RoomUnreadCount {
  [roomId: string]: number
}

interface MessageState {
  // 총 읽지 않은 메시지 수
  totalUnreadCount: number
  setTotalUnreadCount: (count: number) => void

  // 채팅방별 읽지 않은 메시지 수
  roomUnreadCounts: RoomUnreadCount
  updateRoomUnreadCount: (roomId: string, count: number) => void

  // 마지막 업데이트 시간 (중복 업데이트 방지용)
  lastUpdated: number

  // 이전 기능 유지 (하위 호환성)
  unreadCount: number
  setUnreadCount: (count: number) => void
  incrementUnreadCount: () => void
  decrementUnreadCount: () => void
  resetUnreadCount: () => void
}

export const useMessageStore = create<MessageState>((set, get) => ({
  // 총 읽지 않은 메시지 수 관련
  totalUnreadCount: 0,
  setTotalUnreadCount: (count) => {
    // count가 NaN이거나 undefined인 경우 무시
    if (isNaN(count) || count === undefined) {
      console.log('메시지 스토어: 유효하지 않은 값 무시', count)
      return
    }

    // 음수 값은 0으로 처리
    const validCount = count < 0 ? 0 : count

    const current = get().totalUnreadCount
    const now = Date.now()
    const lastUpdated = get().lastUpdated

    // 값이 같으면 업데이트 안함
    if (current === validCount) {
      console.log('메시지 스토어: 이미 같은 값으로 설정됨', validCount)
      return
    }

    // 마지막 업데이트 후 2초 이내에는 불필요한 업데이트 방지
    if (now - lastUpdated < 2000) {
      console.log('메시지 스토어: 빈번한 업데이트 방지 (2초 내 중복)')
      return
    }

    console.log('메시지 스토어: 읽지 않은 메시지 수 업데이트', validCount)
    set({ totalUnreadCount: validCount, lastUpdated: now })
  },

  // 채팅방별 읽지 않은 메시지 수 관련
  roomUnreadCounts: {},
  updateRoomUnreadCount: (roomId, count) => {
    const current = get().roomUnreadCounts[roomId]

    // 값이 같으면 업데이트 안함
    if (current === count) return

    set((state) => ({
      roomUnreadCounts: {
        ...state.roomUnreadCounts,
        [roomId]: count,
      },
      lastUpdated: Date.now(),
    }))
  },

  // 마지막 업데이트 시간
  lastUpdated: 0,

  // 이전 기능 유지 (하위 호환성)
  unreadCount: 0,
  setUnreadCount: (count) => set({ unreadCount: count }),
  incrementUnreadCount: () =>
    set((state) => ({ unreadCount: Math.min(state.unreadCount + 1, 99) })),
  decrementUnreadCount: () =>
    set((state) => ({ unreadCount: Math.max(0, state.unreadCount - 1) })),
  resetUnreadCount: () => set({ unreadCount: 0 }),
}))
