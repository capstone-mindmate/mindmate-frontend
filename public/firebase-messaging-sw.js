import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute,
} from 'workbox-precaching';
import { clientsClaim } from 'workbox-core';
import { NavigationRoute, registerRoute } from 'workbox-routing';

precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();
registerRoute(new NavigationRoute(createHandlerBoundToURL('index.html')));

self.skipWaiting();
clientsClaim();


importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js')
importScripts(
  'https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js'
)

const firebaseConfig = {
  apiKey: 'AIzaSyBAyIQnPXrlT67SGeroFWysun0pLcDzPhQ',
  authDomain: 'mindmate-ac476.firebaseapp.com',
  projectId: 'mindmate-ac476',
  storageBucket: 'mindmate-ac476.appspot.com',
  messagingSenderId: '895068697413',
  appId: '1:895068697413:web:7383e36432f90be96d842c',
}

const app = firebase.initializeApp(firebaseConfig)
const messaging = firebase.messaging(app)

messaging.onBackgroundMessage((payload) => {
  console.log('📦 백그라운드 메시지:', payload)
  const { title, body } = payload.notification || {}
  self.registration.showNotification(title || '알림', {
    body: body || '내용 없음',
    icon: '/fav/favicon-196x196.png',
  })
})
