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

import { useAuthStore } from '../stores/userStore'

declare global {
  interface Window {
    clearUser?: () => void
  }
}

let isSessionExpired = false

export async function fetchWithRefresh(input: RequestInfo, init?: RequestInit) {
  const accessToken = getTokenCookie('accessToken')

  let headers = {
    ...(init?.headers || {}),
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  }

  // FormData일 경우 Content-Type 헤더 제거 (브라우저가 자동 생성)
  if (init?.body instanceof FormData) {
    if ('Content-Type' in headers) {
      // @ts-ignore
      delete headers['Content-Type']
    }
  }

  let res = await fetch(input, { ...init, headers, credentials: 'include' })

  if (res.status === 401) {
    const refreshToken = getTokenCookie('refreshToken')
    const refreshRes = await fetch('httpss://mindmate.shop/api/auth/refresh', {
      method: 'POST',
      headers: {
        ...(refreshToken ? { Authorization: `Bearer ${refreshToken}` } : {}),
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
    if (refreshRes.ok) {
      const refreshData = await refreshRes.json()
      if (refreshData.accessToken)
        setTokenCookie(refreshData.accessToken, 'accessToken')
      if (refreshData.refreshToken)
        setTokenCookie(refreshData.refreshToken, 'refreshToken')
      const newAccessToken = getTokenCookie('accessToken')
      const retryHeaders = {
        ...(init?.headers || {}),
        ...(newAccessToken
          ? { Authorization: `Bearer ${newAccessToken}` }
          : {}),
      }
      res = await fetch(input, {
        ...init,
        headers: retryHeaders,
        credentials: 'include',
      })
    } else {
      // 세션 만료 처리: 한 번만 실행
      if (!isSessionExpired) {
        isSessionExpired = true
        setTokenCookie('', 'accessToken', -1)
        setTokenCookie('', 'refreshToken', -1)
        localStorage.removeItem('auth-store')
        if (
          typeof window !== 'undefined' &&
          typeof window.clearUser === 'function'
        ) {
          window.clearUser()
        }
        // alert('세션이 만료되었습니다. 다시 로그인 해주세요.')
        localStorage.clear()
        window.location.href = '/onboarding'
      }
      throw new Error('토큰 갱신 실패')
    }
  }
  return res
}
