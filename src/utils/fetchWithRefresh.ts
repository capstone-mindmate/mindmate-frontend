export async function fetchWithRefresh(input: RequestInfo, init?: RequestInit) {
  let res = await fetch(input, { ...init, credentials: 'include' })

  if (res.status === 401) {
    const refreshRes = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: {
        ...(init?.headers || {}),
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
    if (refreshRes.ok) {
      // 갱신 성공 → 원래 요청 재시도
      res = await fetch(input, { ...init, credentials: 'include' })
    } else {
      // 로그아웃 시키기
      throw new Error('토큰 갱신 실패')
    }
  }
  return res
}
