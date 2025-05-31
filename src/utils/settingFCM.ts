import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'

const app = initializeApp({
  apiKey: 'AIzaSyBAyIQnPXrlT67SGeroFWysun0pLcDzPhQ',
  authDomain: 'mindmate-ac476.firebaseapp.com',
  projectId: 'mindmate-ac476',
  storageBucket: 'mindmate-ac476.appspot.com',
  messagingSenderId: '895068697413',
  appId: '1:895068697413:web:7383e36432f90be96d842c',
})

export const requestPermission = async () => {
  const permission = await Notification.requestPermission()
  if (permission === 'granted') {
    const registration = await navigator.serviceWorker.ready
    const token = await getToken(getMessaging(app), {
      vapidKey:
        'BF23-B976Qg7HI9gI_m7Dk-zI4U1M5k-j93zanosLaTX92azU42wTFKpwTjfSUihVOJMB5KbX3l385Ut5AsaU6E',
      serviceWorkerRegistration: registration,
    })

    return token
  }
}

export const listenForegroundMessage = () => {
  const messaging = getMessaging(app)
  onMessage(messaging, (payload) => {
    console.log('📥 포그라운드 메시지:', payload)
    const { title, body } = payload.notification || {}
    if (Notification.permission === 'granted') {
      new Notification(title ?? '알림', {
        body: body ?? '내용 없음',
        icon: '/pwa-192x192.png',
      })
    }
  })
}
