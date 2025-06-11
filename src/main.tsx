import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import ToastProvider from './components/toast/ToastProvider.tsx'
import { GlobalStyles } from '../styles/GlobalStyles.tsx'
import * as Sentry from '@sentry/react'

// FCM 및 PWA 서비스워커를 모두 등록
if ('serviceWorker' in navigator) {
  // FCM용 서비스워커 등록 (반드시 루트 경로)
  navigator.serviceWorker.register('/firebase-messaging-sw.js')
  // PWA(Workbox)용 서비스워커 등록
  navigator.serviceWorker.register('/custom-service-worker.js')
}

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

    // 디버그 모드 켬
    debug: false,

    // 릴리즈 버전 (선택사항)
    release: import.meta.env.VITE_APP_VERSION,
    beforeSend(event, hint) {
      // 이 함수가 event 객체를 반환하지 않고 null을 반환하면 이벤트는 전송되지 않음
      console.log('[Sentry] beforeSend called. Event:', event) // 이벤트 내용을 콘솔에 출력
      console.log('[Sentry] beforeSend hint:', hint) // 힌트 내용도 콘솔에 출력

      // 특정 조건에 따라 이벤트를 필터링하는 로직
      if (event.message && event.message.includes('특정 메시지')) {
        console.log('[Sentry] Filtering out event with specific message.')
        return null // 이 이벤트를 전송하지 않음
      }

      // 항상 이벤트를 전송하려면 event 객체를 그대로 반환
      return event
    },
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
