import { test, expect } from '@playwright/test'

test.describe('홈화면 카테고리 버튼 컴포넌트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('카테고리 버튼 표시 확인', async ({ page }) => {
    const categoryButton = page
      .locator('div')
      .filter({ hasClass: 'container' })
      .first()
    await expect(categoryButton).toBeVisible()

    const button = categoryButton.locator('button')
    await expect(button).toBeVisible()
    await expect(button).toHaveCSS('background-color', 'rgb(255, 249, 235)')
    await expect(button).toHaveCSS('border', '1px solid rgb(240, 218, 169)')
    await expect(button).toHaveCSS('border-radius', '10px')

    const text = button.locator('.text')
    await expect(text).toBeVisible()
    await expect(text).toHaveCSS('font-size', '16px')
    await expect(text).toHaveCSS('font-weight', '700')
    await expect(text).toHaveCSS('color', 'rgb(0, 0, 0)')

    const emoji = button.locator('.emoji')
    await expect(emoji).toBeVisible()
    await expect(emoji).toHaveCSS('font-size', '30px')
  })

  test('레이아웃 확인', async ({ page }) => {
    const categoryButton = page
      .locator('div')
      .filter({ hasClass: 'container' })
      .first()

    await expect(categoryButton).toHaveCSS('width', /33\.3333%/)
    await expect(categoryButton).toHaveCSS('height', '96px')

    const top = categoryButton.locator('.top')
    await expect(top).toHaveCSS('width', '100%')
    await expect(top).toHaveCSS('display', 'flex')
    await expect(top).toHaveCSS('justify-content', 'flex-start')

    const bottom = categoryButton.locator('.bottom')
    await expect(bottom).toHaveCSS('width', '100%')
    await expect(bottom).toHaveCSS('display', 'flex')
    await expect(bottom).toHaveCSS('justify-content', 'flex-end')
  })

  test('상호작용 확인', async ({ page }) => {
    const categoryButton = page
      .locator('div')
      .filter({ hasClass: 'container' })
      .first()
    const button = categoryButton.locator('button')

    await expect(button).toBeEnabled()
    await button.click()
  })
})
