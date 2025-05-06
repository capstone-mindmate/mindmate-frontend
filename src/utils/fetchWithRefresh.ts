export function setTokenCookie(token: string, key: string, days = 1) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${key}=${token}; path=/; expires=${expires}`
}

export function getTokenCookie(key: string) {
  return document.cookie
    .split('; ')
    .find((row) => row.startsWith(key + '='))
    ?.split('=')[1]
}

export async function fetchWithRefresh(input: RequestInfo, init?: RequestInit) {
  const accessToken = getTokenCookie('accessToken')
  const headers = {
    ...(init?.headers || {}),
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  }

  let res = await fetch(input, { ...init, headers, credentials: 'include' })

  if (res.status === 401) {
    // const refreshToken = getTokenCookie('refreshToken')
    // const refreshRes = await fetch('/api/auth/refresh', {
    //   method: 'POST',
    //   headers: {
    //     ...(refreshToken ? { 'Authorization': `Bearer ${refreshToken}` } : {}),
    //     'Content-Type': 'application/json',
    //   },
    //   credentials: 'include',
    // })
    // if (refreshRes.ok) {
    //   const refreshData = await refreshRes.json()
    //   if (refreshData.accessToken) setTokenCookie(refreshData.accessToken, 'accessToken')
    //   if (refreshData.refreshToken) setTokenCookie(refreshData.refreshToken, 'refreshToken')
    //   const newAccessToken = getTokenCookie('accessToken')
    //   const retryHeaders = {
    //     ...(init?.headers || {}),
    //     ...(newAccessToken ? { Authorization: `Bearer ${newAccessToken}` } : {}),
    //   }
    //   res = await fetch(input, { ...init, headers: retryHeaders, credentials: 'include' })
    // } else {
    //   throw new Error('토큰 갱신 실패')
    // }
  }
  return res
}
