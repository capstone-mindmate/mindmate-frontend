import { test, expect } from '@playwright/test'

test.describe('홈화면 카드 뉴스 컴포넌트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('카드 뉴스 컴포넌트가 올바르게 표시되는지 확인', async ({ page }) => {
    const cardNews = page
      .locator('div')
      .filter({ hasClass: 'container' })
      .first()
    await expect(cardNews).toBeVisible()

    const image = cardNews.locator('img')
    await expect(image).toBeVisible()
    await expect(image).toHaveAttribute('src', /.*/)
    await expect(image).toHaveAttribute('alt', /.*/)

    await expect(image).toHaveCSS('border-radius', '4px')
    await expect(image).toHaveCSS('object-fit', 'cover')
    await expect(image).toHaveCSS('user-select', 'none')

    const infoBox = cardNews.locator('.infoBox')
    await expect(infoBox).toBeVisible()

    const dateText = infoBox.locator('.date p')
    await expect(dateText).toBeVisible()
    await expect(dateText).toHaveCSS('font-size', '14px')
    await expect(dateText).toHaveCSS('color', 'rgb(114, 114, 114)')

    const titleText = infoBox.locator('.title p')
    await expect(titleText).toBeVisible()
    await expect(titleText).toHaveCSS('font-size', '16px')
    await expect(titleText).toHaveCSS('font-weight', '700')
    await expect(titleText).toHaveCSS('color', 'rgb(0, 0, 0)')

    const organizationText = infoBox.locator('.organization p')
    await expect(organizationText).toBeVisible()
    await expect(organizationText).toHaveCSS('font-size', '14px')
    await expect(organizationText).toHaveCSS('color', 'rgb(57, 57, 57)')
  })

  test('카드 뉴스 레이아웃 구조 확인', async ({ page }) => {
    const cardNews = page
      .locator('div')
      .filter({ hasClass: 'container' })
      .first()

    await expect(cardNews).toHaveCSS('display', 'flex')
    await expect(cardNews).toHaveCSS('flex-direction', 'column')
    await expect(cardNews).toHaveCSS('width', '250px')
    await expect(cardNews).toHaveCSS('cursor', 'pointer')

    const imgBox = cardNews.locator('.imgBox')
    await expect(imgBox).toHaveCSS('width', '100%')
    await expect(imgBox).toHaveCSS('display', 'flex')
    await expect(imgBox).toHaveCSS('align-items', 'center')
    await expect(imgBox).toHaveCSS('justify-content', 'center')

    const infoBox = cardNews.locator('.infoBox')
    await expect(infoBox).toHaveCSS('display', 'flex')
    await expect(infoBox).toHaveCSS('flex-direction', 'column')
    await expect(infoBox).toHaveCSS('width', '100%')
    await expect(infoBox).toHaveCSS('margin-top', '8px')
  })

  test('카드 뉴스 상호작용 확인', async ({ page }) => {
    const cardNews = page
      .locator('div')
      .filter({ hasClass: 'container' })
      .first()

    await cardNews.hover()
    await expect(cardNews).toHaveCSS('cursor', 'pointer')

    await cardNews.click()
  })
})
