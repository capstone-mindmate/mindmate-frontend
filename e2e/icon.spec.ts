import { test, expect } from '@playwright/test'

test.describe('Icon Components', () => {
  test('icons are visible and interactive', async ({ page }) => {
    await page.goto('/')

    // 아이콘이 보이는지 확인
    const alarmIcon = page.getByTestId('alarm-icon')
    await expect(alarmIcon).toBeVisible()

    // 호버 효과 확인
    await alarmIcon.hover()
    await expect(alarmIcon).toHaveCSS('transform', 'scale(1.05)')

    // 클릭 이벤트 확인
    await alarmIcon.click()
    // 클릭 후의 동작 확인
  })

  test('ChatAlertIcon displays correct count', async ({ page }) => {
    await page.goto('/')

    const alertCount = page.getByText('1')
    await expect(alertCount).toBeVisible()

    // 알림 수가 변경되는 경우 테스트
    await page.click('[data-testid="trigger-alert"]')
    await expect(page.getByText('2')).toBeVisible()
  })
})
