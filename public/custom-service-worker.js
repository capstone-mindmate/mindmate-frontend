import { precacheAndRoute } from 'workbox-precaching';

console.log('Service Worker 스크립트 로드됨');

// Firebase 초기화
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

console.log('Firebase 스크립트 로드됨');

const firebaseConfig = {
  apiKey: "AIzaSyBAyIQnPXrlT67SGeroFWysun0pLcDzPhQ",
  authDomain: "mindmate-ac476.firebaseapp.com",
  projectId: "mindmate-ac476",
  storageBucket: "mindmate-ac476.firebasestorage.app",
  messagingSenderId: "895068697413",
  appId: "1:895068697413:web:7383e36432f90be96d842c"
}

// Firebase 초기화
let messaging = null;
try {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  messaging = firebase.messaging();
  console.log('Firebase 초기화 성공');
} catch (error) {
  console.error('Firebase 초기화 실패:', error);
}

// 알림 표시 함수
const showNotification = (title, options) => {
  console.log('알림 표시 시도:', { title, options });
  return self.registration.showNotification(title, options)
    .then(() => {
      console.log('알림 표시 성공');
      return;
    })
    .catch(error => console.error('알림 표시 실패:', error));
};

// 백그라운드 메시지 처리
self.addEventListener('push', (event) => {
  console.log('Push 이벤트 수신:', event);
  if (event.data) {
    const payload = event.data.json();
    console.log('Push 데이터:', payload);
    
    const { title, body, image } = payload.notification || {};
    
    return self.registration.getNotifications()
      .then(notifications => {
        const existingNotification = notifications.find(
          notification => 
            notification.title === (title || '알림') && 
            notification.body === (body || '내용 없음')
        );

        if (existingNotification) {
          console.log('이미 존재하는 알림');
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
              title: '열기',
            },
            {
              action: 'close',
              title: '닫기',
            },
          ],
        };

        return showNotification(title || '알림', notificationOptions);
      });
  }
});

// Firebase 메시징 백그라운드 핸들러
if (messaging) {
  console.log('Firebase Messaging 핸들러 등록 시도');
  messaging.onBackgroundMessage((payload) => {
    console.log('백그라운드 메시지 수신:', payload);
    const { title, body, image } = payload.notification || {};
    
    return self.registration.getNotifications()
      .then(notifications => {
        const existingNotification = notifications.find(
          notification => 
            notification.title === (title || '알림') && 
            notification.body === (body || '내용 없음')
        );

        if (existingNotification) {
          console.log('이미 존재하는 알림');
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
              title: '열기',
            },
            {
              action: 'close',
              title: '닫기',
            },
          ],
        };

        return showNotification(title || '알림', notificationOptions);
      });
  });
  console.log('Firebase Messaging 핸들러 등록 완료');
}

// 알림 클릭 이벤트 처리
self.addEventListener('notificationclick', (event) => {
  console.log('알림 클릭:', event);
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

// 구독 변경 이벤트 처리
self.addEventListener('pushsubscriptionchange', (event) => {
  console.log('Push 구독 변경:', event);
  // 필요한 경우 여기에 구독 갱신 로직 추가
});

// 서비스 워커 설치 시점
self.addEventListener('install', (event) => {
  console.log('Service Worker 설치 중...');
  event.waitUntil(
    Promise.all([
      self.skipWaiting(),
      // Firebase 초기화 확인
      new Promise((resolve) => {
        if (messaging) {
          console.log('Firebase Messaging 초기화 확인됨');
          resolve();
        } else {
          console.error('Firebase Messaging 초기화되지 않음');
          resolve();
        }
      })
    ])
  );
});

// 서비스 워커 활성화 시점
self.addEventListener('activate', (event) => {
  console.log('Service Worker 활성화됨');
  event.waitUntil(
    Promise.all([
      clients.claim(),
      // 기존 알림 정리
      self.registration.getNotifications().then(notifications => {
        notifications.forEach(notification => notification.close());
      })
    ])
  );
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