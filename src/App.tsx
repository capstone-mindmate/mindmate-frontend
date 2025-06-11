import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuthStore } from './stores/userStore'
import { GoogleOAuthProvider } from '@react-oauth/google'
import {
  requestPermission,
  setupForegroundMessageListener,
} from './utils/settingFCM'
import { useEffect } from 'react'
import * as Sentry from '@sentry/react'
import { decodeJWT } from './utils/fetchWithRefresh'

function App() {
  const queryClient = new QueryClient()
  window.clearUser = useAuthStore.getState().clearUser

  // accessToken 구독
  const accessToken = useAuthStore((state) => state.user?.accessToken)

  useEffect(() => {
    requestPermission()
    setupForegroundMessageListener()

    // JWT 만료 자동 로그아웃
    if (accessToken) {
      const payload = decodeJWT(accessToken)
      if (payload && payload.exp) {
        const now = Math.floor(Date.now() / 1000)
        const remain = payload.exp - now
        if (remain > 0) {
          const timer = setTimeout(() => {
            if (typeof window.clearUser === 'function') window.clearUser()
            localStorage.clear()
            window.location.href = '/onboarding'
          }, remain * 1000)
          return () => clearTimeout(timer)
        } else {
          if (typeof window.clearUser === 'function') window.clearUser()
          localStorage.clear()
          window.location.href = '/onboarding'
        }
      }
    }
  }, [accessToken])

  return (
    <GoogleOAuthProvider clientId="886143898358-4cja76nlu7mp5upid042la3k3vovnd8p.apps.googleusercontent.com">
      <QueryClientProvider client={queryClient}>
        <Sentry.ErrorBoundary
          fallback={({ error, resetError }) => (
            <div
              style={{
                padding: '20px',
                textAlign: 'center',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                fontFamily: 'Pretendard, sans-serif',
              }}
            >
              <h2 style={{ color: '#392111', marginBottom: '16px' }}>
                문제가 발생했습니다
              </h2>
              <p style={{ color: '#666', marginBottom: '24px' }}>
                예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
              </p>
              <button
                onClick={resetError}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#392111',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontFamily: 'Pretendard, sans-serif',
                }}
              >
                다시 시도
              </button>
            </div>
          )}
          showDialog
        >
          <RouterProvider router={router} />
        </Sentry.ErrorBoundary>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  )
}

export default App
