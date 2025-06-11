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
  // console.log('📦 백그라운드 메시지 수신:', payload);
  
  const { title, body, image } = payload.notification || {};
  
  // 이미 표시된 알림이 있는지 확인
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
        tag: 'fcm-notification', // 알림 그룹화를 위한 태그
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

  // 액션 버튼 클릭 처리
  if (event.action === 'open') {
    // 알림 타입에 따른 페이지 이동
    if (event.notification.data?.type === '매칭 수락') {
      event.waitUntil(
        clients.openWindow('/chat')
      );
    } else if (event.notification.data?.type === '매칭 거절') {
      event.waitUntil(
        clients.openWindow('/matching')
      );
    } else {
      // 기본 동작: 홈으로 이동
      event.waitUntil(
        clients.openWindow('/home')
      );
    }
  } else {
    // 액션 버튼이 없거나 'close' 액션인 경우
    // 현재 열려있는 창이 있다면 포커스
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        if (clientList.length > 0) {
          return clientList[0].focus();
        }
        // 열려있는 창이 없다면 홈으로 이동
        return clients.openWindow('/home');
      })
    );
  }
});
