import { initializeApp, getApp } from 'firebase/app'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'
import { fetchWithRefresh } from './fetchWithRefresh'

const FCM_TOKEN_KEY = 'fcm_token'
const TOKEN_EXPIRY_KEY = 'fcm_token_expiry'
const TOKEN_EXPIRY_DAYS = 7 // 토큰 유효 기간 (일)

const firebaseConfig = {
  apiKey: 'AIzaSyBAyIQnPXrlT67SGeroFWysun0pLcDzPhQ',
  authDomain: 'mindmate-ac476.firebaseapp.com',
  projectId: 'mindmate-ac476',
  storageBucket: 'mindmate-ac476.appspot.com',
  messagingSenderId: '895068697413',
  appId: '1:895068697413:web:7383e36432f90be96d842c',
}

// Firebase 앱 초기화를 한 번만 수행
let app = null
try {
  app = initializeApp(firebaseConfig)
} catch (error) {
  // 이미 초기화된 경우 기존 앱 인스턴스 사용
  app = getApp()
}

// 토큰 유효성 검사
const isTokenValid = () => {
  const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY)
  if (!expiry) return false

  const expiryDate = new Date(expiry)
  return expiryDate > new Date()
}

// 토큰 저장
const saveToken = (token: string) => {
  localStorage.setItem(FCM_TOKEN_KEY, token)
  const expiryDate = new Date()
  expiryDate.setDate(expiryDate.getDate() + TOKEN_EXPIRY_DAYS)
  localStorage.setItem(TOKEN_EXPIRY_KEY, expiryDate.toISOString())
}

// 토큰 가져오기
const getStoredToken = () => {
  return localStorage.getItem(FCM_TOKEN_KEY)
}

// 앱이 포그라운드에 있는지 확인하는 함수
const isAppInForeground = () => {
  return document.visibilityState === 'visible'
}

export const requestPermission = async () => {
  try {
    // 저장된 토큰이 있고 유효한 경우 재사용
    const storedToken = getStoredToken()
    if (storedToken && isTokenValid()) {
      console.log('기존 FCM 토큰 사용:', storedToken)
      return storedToken
    }

    const permission = await Notification.requestPermission()
    console.log('알림 권한 상태:', permission)

    if (permission === 'granted') {
      if ('serviceWorker' in navigator) {
        try {
          // 기존 Service Worker 확인
          const registration = await navigator.serviceWorker.getRegistration()
          console.log('기존 Service Worker:', registration)

          // Service Worker가 없거나 업데이트가 필요한 경우에만 새로 등록
          if (!registration || registration.active?.state === 'redundant') {
            const newRegistration = await navigator.serviceWorker.register(
              '/custom-service-worker.js',
              {
                scope: '/',
              }
            )
            console.log('Service Worker 등록 성공:', newRegistration)
          }

          // 현재 활성화된 Service Worker 사용
          const activeRegistration = await navigator.serviceWorker.ready
          console.log('Service Worker 준비 완료:', activeRegistration)

          const messaging = getMessaging(app)
          const token = await getToken(messaging, {
            vapidKey:
              'BF23-B976Qg7HI9gI_m7Dk-zI4U1M5k-j93zanosLaTX92azU42wTFKpwTjfSUihVOJMB5KbX3l385Ut5AsaU6E',
            serviceWorkerRegistration: activeRegistration,
          })

          console.log('FCM 토큰 발급 성공:', token)

          // 새 토큰 저장
          saveToken(token)
          return token
        } catch (error) {
          console.error('Service Worker 등록 실패:', error)
          throw error
        }
      } else {
        throw new Error('Service Worker를 지원하지 않는 브라우저입니다.')
      }
    }
    throw new Error('알림 권한이 거부되었습니다.')
  } catch (error) {
    console.error('FCM 토큰 요청 실패:', error)
    throw error
  }
}

export const setupForegroundMessageListener = () => {
  try {
    const messaging = getMessaging(app)
    console.log('포그라운드 메시지 리스너 설정 시작')

    onMessage(messaging, (payload) => {
      console.log('포그라운드 메시지 수신:', payload)

      const { title, body, image } = payload.notification || {}
      const notificationOptions = {
        body: body || '내용 없음',
        icon: '/fav/favicon-196x196.png',
        badge: '/fav/favicon-196x196.png',
        image: image,
        requireInteraction: true,
        vibrate: [200, 100, 200],
        data: payload.data || {},
        tag: 'fcm-notification',
        actions: [
          {
            action: 'open',
            title: '열기',
          },
          {
            action: 'close',
            title: '닫기',
          },
        ],
      }

      if (Notification.permission === 'granted') {
        console.log('포그라운드 알림 표시 시도:', {
          title,
          notificationOptions,
        })

        const notification = new Notification(
          title || '알림',
          notificationOptions
        )

        notification.onclick = (event) => {
          event.preventDefault()
          console.log('포그라운드 알림 클릭:', event)

          // 알림 닫기
          notification.close()

          // 알림 데이터에 따른 페이지 이동
          if (payload.data?.type === '매칭 수락') {
            window.location.href = '/chat'
          } else if (payload.data?.type === '매칭 거절') {
            window.location.href = '/matching'
          } else {
            window.location.href = '/home'
          }
        }
      } else {
        console.log('알림 권한이 없어 알림을 표시할 수 없습니다.')
      }
    })
    console.log('포그라운드 메시지 리스너 설정 완료')
  } catch (error) {
    console.error('포그라운드 메시지 리스너 설정 실패:', error)
  }
}

// FCM 토큰을 서버에 등록하는 함수
export const registerFCMToken = async (token: string) => {
  try {
    console.log('FCM 토큰 서버 등록 시도:', token)
    const response = await fetchWithRefresh('http://localhost/api/fcm/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
      credentials: 'include', // 쿠키 포함
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      console.error('FCM 토큰 등록 실패:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
      })
      throw new Error(
        `FCM 토큰 등록 실패: ${response.status} ${response.statusText}`
      )
    }

    const data = await response.json()
    console.log('FCM 토큰 서버 등록 성공:', data)
    return data
  } catch (error) {
    console.error('FCM 토큰 등록 중 오류 발생:', error)
    throw error
  }
}
