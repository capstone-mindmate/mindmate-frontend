import { useEffect } from 'react'
import { useMessageStore } from '../store/messageStore'

export const useSocketMessage = () => {
  const {
    setUnreadCount,
    incrementUnreadCount,
    decrementUnreadCount,
    resetUnreadCount,
  } = useMessageStore()

  useEffect(() => {
    const socket = new WebSocket('나중에 웹소켓 주소 받으면 연결하기')

    socket.onopen = () => {
      console.log('connected')
    }

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)

      switch (
        data.type // 아래 타입들 나중에 조정
      ) {
        case '새 메세지 왔을때':
          incrementUnreadCount()
          break
        case '메세지 읽을 때':
          decrementUnreadCount()
          break
        case '나중에 채팅 목록 조회 했을때':
          setUnreadCount(data.count)
          break
        case '다 읽었을때 ':
          resetUnreadCount()
          break
      }
    }

    socket.onclose = () => {
      console.log('disconnected')
    }

    return () => {
      socket.close()
    }
  }, [])
}
