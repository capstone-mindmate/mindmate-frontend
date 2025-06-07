import { precacheAndRoute } from 'workbox-precaching';

// 프리캐시 매니페스트 적용 (필수)
precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener('fetch', (event) => {
  // /api로 시작하는 모든 요청은 서비스워커가 관여하지 않음 → 네트워크로만 처리
  if (event.request.url.includes('https://mindmate.shop/api/')) {
    return;
  }
  if (event.request.url.includes('/admin/')) {
    return;
  }
  // 나머지 요청은 Workbox가 처리 (별도 respondWith 불필요)
});