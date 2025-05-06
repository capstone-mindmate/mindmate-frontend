import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '../stores/userStore'
import { useEffect } from 'react'
import { fetchWithRefresh } from '../utils/fetchWithRefresh'

async function fetchMe() {
  const res = await fetchWithRefresh(
    `http://localhost/api/profiles/${localStorage.getItem('userId')}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    }
  )

  if (!res.ok) throw new Error('인증 필요')
  return res.json()
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
