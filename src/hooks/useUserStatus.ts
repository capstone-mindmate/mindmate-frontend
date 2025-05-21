import { useEffect, useState, useRef } from 'react'
import { fetchWithRefresh } from '../utils/fetchWithRefresh'

export function useUserStatus() {
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const intervalRef = useRef<number | null>(null)

  const fetchUnread = async () => {
    setIsLoading(true)
    try {
      const res = await fetchWithRefresh(
        'https://mindmate.shop/api/chat/unread/total',
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      )
      if (!res.ok) throw new Error('unread fetch fail')
      const count = await res.json()
      setUnreadCount(typeof count === 'number' ? count : 0)
    } catch (e) {
      setUnreadCount(0)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUnread()
    intervalRef.current = window.setInterval(fetchUnread, 2000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return { unreadCount, isLoading, refetch: fetchUnread }
}
