import { test, expect } from '@playwright/test'

test.describe('PointHistory 컴포넌트 E2E 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/points')
  })

  test('포인트 내역이 올바르게 표시되어야 함', async ({ page }) => {
    const historyContainer = page.locator(
      '[data-testid="point-history-container"]'
    )
    await expect(historyContainer).toBeVisible()

    await expect(page.getByText('채팅 성공 보상')).toBeVisible()
    await expect(page.getByText(/\d{4}\.\d{2}\.\d{2}/)).toBeVisible()
    await expect(page.getByText(/[+-]\d+코인/)).toBeVisible()
    await expect(page.getByText(/\d+코인$/)).toBeVisible()
  })

  test('적립과 사용 내역의 색상이 올바르게 표시되어야 함', async ({ page }) => {
    const earnPoint = page.locator('.point-earn').first()
    await expect(earnPoint).toHaveCSS('color', 'rgb(27, 91, 254)')

    const usePoint = page.locator('.point-use').first()
    await expect(usePoint).toHaveCSS('color', 'rgb(251, 79, 80)')
  })

  test('스크롤 시 포인트 내역이 올바르게 표시되어야 함', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

    const historyItems = await page
      .locator('[data-testid="point-history-container"]')
      .all()
    expect(historyItems.length).toBeGreaterThan(1)
  })
})
