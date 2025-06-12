export function setTokenCookie(token: string, key: string, days = 1) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${key}=${token}; path=/; expires=${expires}`
}

export function deleteAllCookies() {
  const cookies = document.cookie.split(';')

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i]
    const eqPos = cookie.indexOf('=')
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
  }
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

// isSessionExpired 플래그는 유지합니다.
let isSessionExpired = false

// isSessionExpired를 외부에서 리셋
export function resetSessionExpiredFlag() {
  isSessionExpired = false
  console.log('isSessionExpired 플래그가 리셋되었습니다.')
}

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
    //console.log('401 에러 감지, 토큰 갱신 시도...')

    const refreshToken = getTokenCookie('refreshToken')
    //console.log('Refresh token 존재 여부:', !!refreshToken)

    // 리프레시 토큰이 없으면 세션 만료 처리
    if (!refreshToken) {
      console.warn('리프레시 토큰이 없습니다. 로그인 페이지로 리디렉션합니다.')
      if (!isSessionExpired) {
        // 세션 만료 플래그 확인
        isSessionExpired = true // 플래그 설정
        setTokenCookie('', 'accessToken', -1)
        setTokenCookie('', 'refreshToken', -1)
        localStorage.removeItem('auth-store')
        if (
          typeof window !== 'undefined' &&
          typeof window.clearUser === 'function'
        ) {
          window.clearUser()
        }
        localStorage.clear()
        window.location.href = '/onboarding'
      }
      throw new Error('인증이 필요합니다.')
    }

    try {
      // 토큰 갱신 요청: 이전 코드의 URL과 헤더, 본문 방식 사용
      const refreshRes = await fetch('https://mindmate.shop/api/auth/refresh', {
        // 이전 URL로 복원
        method: 'POST',
        headers: {
          ...(refreshToken ? { Authorization: `Bearer ${refreshToken}` } : {}), // 이전 헤더 방식으로 복원
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })

      if (refreshRes.ok) {
        const refreshData = await refreshRes.json()
        // 쿠키 설정 방식은 이전 코드의 기본값 사용 (days 인자 제거)
        if (refreshData.accessToken)
          setTokenCookie(refreshData.accessToken, 'accessToken')
        if (refreshData.refreshToken)
          setTokenCookie(refreshData.refreshToken, 'refreshToken') // 이전 코드에는 이 줄이 없었지만, 토큰 갱신 후 리프레시 토큰도 업데이트하는 것이 좋으니 유지합니다.

        const newAccessToken = getTokenCookie('accessToken')
        const retryHeaders = {
          ...(init?.headers || {}),
          ...(newAccessToken
            ? { Authorization: `Bearer ${newAccessToken}` }
            : {}),
        }

        // 토큰 갱신 성공 시 isSessionExpired 플래그 리셋
        isSessionExpired = false

        res = await fetch(input, {
          ...init,
          headers: retryHeaders,
          credentials: 'include',
        })
      } else {
        // 토큰 갱신 실패 처리
        if (!isSessionExpired) {
          // 세션 만료 플래그 확인
          isSessionExpired = true // 플래그 설정
          setTokenCookie('', 'accessToken', -1)
          setTokenCookie('', 'refreshToken', -1)
          localStorage.removeItem('auth-store')
          if (
            typeof window !== 'undefined' &&
            typeof window.clearUser === 'function'
          ) {
            window.clearUser()
          }
          localStorage.clear()
          window.location.href = '/onboarding'
        }
        throw new Error('토큰 갱신 실패')
      }
    } catch (error) {
      console.error('토큰 갱신 중 오류:', error)

      // 네트워크 오류 등으로 갱신이 불가능한 경우
      if (!isSessionExpired) {
        // 세션 만료 플래그 확인
        isSessionExpired = true // 플래그 설정
        setTokenCookie('', 'accessToken', -1)
        setTokenCookie('', 'refreshToken', -1)
        localStorage.removeItem('auth-store')
        if (
          typeof window !== 'undefined' &&
          typeof window.clearUser === 'function'
        ) {
          window.clearUser()
        }
        localStorage.clear()
        window.location.href = '/onboarding'
      }
      throw error
    }
  }

  return res
}

// JWT 디코드 함수 (exp 등 payload 추출)
export function decodeJWT(token: string): any {
  try {
    const payload = token.split('.')[1]
    // 이전 코드의 Base64URL-safe 디코딩 로직을 다시 추가
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(decoded)
  } catch (e) {
    return null
  }
}
