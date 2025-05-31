import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import ToastProvider from './components/toast/ToastProvider.tsx'
import { GlobalStyles } from '../styles/GlobalStyles.tsx'
import * as Sentry from '@sentry/react'

// Sentry 초기화 - 애플리케이션 라이프사이클에서 가장 먼저 실행
if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE, // development, production 등

    // 통합 설정
    integrations: [
      Sentry.browserTracingIntegration(), // 성능 모니터링
      Sentry.replayIntegration({
        // Session Replay 설정
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],

    // 성능 모니터링 샘플링 비율
    tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,

    // Session Replay 샘플링 비율
    replaysSessionSampleRate: 0.1, // 10%의 세션을 기록
    replaysOnErrorSampleRate: 1.0, // 에러 발생 시 100% 기록

    // PII 데이터 전송 (IP 주소 등)
    sendDefaultPii: true,

    // 개발 환경에서 디버그 모드
    debug: import.meta.env.DEV,

    // 릴리즈 버전 (선택사항)
    release: import.meta.env.VITE_APP_VERSION,
  })
} else {
  console.warn(
    'Sentry DSN이 설정되지 않았습니다. 에러 모니터링이 비활성화됩니다.'
  )
}

createRoot(document.getElementById('root')!).render(
  <>
    <GlobalStyles />
    <ToastProvider>
      <App />
    </ToastProvider>
  </>
)
