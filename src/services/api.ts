import { fetchWithRefresh } from '../utils/fetchWithRefresh'

export async function createOrder(productId: number) {
  const res = await fetchWithRefresh('http://localhost/api/payments/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ productId }),
  })
  if (!res.ok) throw new Error('주문 생성 실패')
  return res.json()
}
