import { test, expect } from '@playwright/test'

test.describe('Navigation Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('네비게이션 바가 화면 하단에 표시되어야 한다', async ({ page }) => {
    const nav = await page.locator('nav')
    await expect(nav).toBeVisible()

    const navPosition = await nav.evaluate((el) => {
      const style = window.getComputedStyle(el)
      return {
        position: style.position,
        bottom: style.bottom,
      }
    })

    expect(navPosition.position).toBe('fixed')
    expect(navPosition.bottom).toBe('0px')
  })

  test('아이템 표시 여부 확인', async ({ page }) => {
    await expect(page.getByText('홈')).toBeVisible()
    await expect(page.getByText('매칭')).toBeVisible()
    await expect(page.getByText('채팅')).toBeVisible()
    await expect(page.getByText('마이페이지')).toBeVisible()
  })

  test('페이지 이동 확인', async ({ page }) => {
    await page.getByText('채팅').click()
    await expect(page).toHaveURL('/나중에 정하기')
  })

  //   test('채팅 알림이 존재할때 ChatAlertIcon 표시 여부 확인', async ({ page }) => {
  //     await page.route('ws://**', async route => {
  //       const ws = route.request()
  //       await ws.fulfill({
  //         body: JSON.stringify({
  //           type: 'UNREAD_COUNT_UPDATE',
  //           count: 5
  //         })
  //       })
  //     })

  //     await page.reload()
  //     const alertIcon = await page.getByTestId('chat-alert-icon')
  //     await expect(alertIcon).toBeVisible()
  //     await expect(alertIcon).toHaveText('5')
  //   })

  test('active 시 스타일 확인', async ({ page }) => {
    await page.goto('/')

    const homeLink = await page.getByText('홈').closest('a')
    const computedStyle = await homeLink.evaluate((el) => {
      return window.getComputedStyle(el).color
    })

    expect(computedStyle).toBe('rgb(57, 33, 17)')
  })
})
