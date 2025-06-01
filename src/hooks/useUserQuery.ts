import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '../stores/userStore'
import { useEffect } from 'react'
import { fetchWithRefresh } from '../utils/fetchWithRefresh'

async function fetchMe() {
  const res = await fetchWithRefresh(`https://mindmate.shop/api/profiles`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  })

  try {
    if (!res.ok) throw new Error(res.statusText)
    return res.json()
  } catch (error) {
    console.error('프로필 조회 실패:', error)
    throw error
  }
}

export function useUserQuery() {
  const { setUser, clearUser } = useAuthStore()
  const query = useQuery({
    queryKey: ['me'],
    queryFn: fetchMe,
    retry: false,
    staleTime: 1000 * 60 * 5,
  })

  useEffect(() => {
    if (query.data) setUser(query.data)
    if (query.error) clearUser()
  }, [query.data, query.error, setUser, clearUser])

  return query
}
