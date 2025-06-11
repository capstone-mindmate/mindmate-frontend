import { precacheAndRoute } from 'workbox-precaching';

// Firebase 초기화
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyBAyIQnPXrlT67SGeroFWysun0pLcDzPhQ",
  authDomain: "mindmate-ac476.firebaseapp.com",
  projectId: "mindmate-ac476",
  storageBucket: "mindmate-ac476.firebasestorage.app",
  messagingSenderId: "895068697413",
  appId: "1:895068697413:web:7383e36432f90be96d842c"
}

// Firebase 앱 초기화
let app = null;
try {
  app = firebase.initializeApp(firebaseConfig);
} catch (error) {
  console.error('Firebase 앱 초기화 실패:', error);
  app = firebase.app();
}

const messaging = firebase.messaging(app);

// 알림 표시 함수
const showNotification = (title, options) => {
  return self.registration.showNotification(title, options)
    .then(() => {
      return;
    })
    .catch(error => console.error('알림 표시 실패:', error));
};

messaging.onBackgroundMessage((payload) => {
  const { title, body, image } = payload.notification || {};
  
  return self.registration.getNotifications()
    .then(notifications => {
      const existingNotification = notifications.find(
        notification => 
          notification.title === (title || '알림') && 
          notification.body === (body || '내용 없음')
      );

      if (existingNotification) {
        return;
      }

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
            title: '열기'
          },
          {
            action: 'close',
            title: '닫기'
          }
        ]
      };

      return showNotification(title || '알림', notificationOptions);
    });
});

// 알림 클릭 이벤트 처리
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'open') {
    if (event.notification.data?.type === '매칭 수락') {
      event.waitUntil(
        clients.openWindow('/chat')
      );
    } else if (event.notification.data?.type === '매칭 거절') {
      event.waitUntil(
        clients.openWindow('/matching')
      );
    } else {
      event.waitUntil(
        clients.openWindow('/home')
      );
    }
  } else {
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        if (clientList.length > 0) {
          return clientList[0].focus();
        }
        return clients.openWindow('/home');
      })
    );
  }
});

// 프리캐시 매니페스트 적용
precacheAndRoute(self.__WB_MANIFEST);

// 라우팅 처리
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/')) {
    return;
  }
  if (event.request.url.includes('/admin/')) {
    return;
  }
});