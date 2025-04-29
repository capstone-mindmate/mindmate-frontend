import { test, expect } from '@playwright/test'

test.describe('버튼 및 인풋 컴포넌트 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('카테고리 버튼 동작 확인', async ({ page }) => {
    const categoryButton = page.getByText('💼 취업')
    await expect(categoryButton).toBeVisible()

    await categoryButton.click()
    await expect(categoryButton).toHaveCSS(
      'background-color',
      'rgb(255, 249, 235)'
    )
    await expect(categoryButton).toHaveCSS('font-weight', '700')

    await categoryButton.click()
    await expect(categoryButton).toHaveCSS(
      'background-color',
      'rgb(255, 255, 255)'
    )
  })

  test('확인 버튼 동작 확인', async ({ page }) => {
    const confirmButton = page.getByText('인증하기')
    await expect(confirmButton).toBeVisible()

    await confirmButton.click()
    await expect(confirmButton).toHaveCSS('background-color', 'rgb(57, 33, 17)')
    await expect(confirmButton).toHaveCSS('color', 'rgb(255, 255, 255)')
  })

  test('갈색 라운드 버튼 동작 확인', async ({ page }) => {
    const brownRoundButton = page.getByText('리스너')
    await expect(brownRoundButton).toBeVisible()

    await brownRoundButton.click()
    await expect(brownRoundButton).toHaveCSS(
      'background-color',
      'rgb(92, 53, 27)'
    )
    await expect(brownRoundButton).toHaveCSS('color', 'rgb(255, 255, 255)')
  })

  test('노란색 라운드 버튼 동작 확인', async ({ page }) => {
    const yellowRoundButton = page.getByText('스피커')
    await expect(yellowRoundButton).toBeVisible()

    await yellowRoundButton.click()
    await expect(yellowRoundButton).toHaveCSS(
      'background-color',
      'rgb(255, 249, 235)'
    )
    await expect(yellowRoundButton).toHaveCSS('color', 'rgb(57, 33, 17)')
  })

  test('필터 버튼 동작 확인', async ({ page }) => {
    const filterButton = page.getByText('전체')
    await expect(filterButton).toBeVisible()

    await filterButton.click()
    await expect(filterButton).toHaveCSS('background-color', 'rgb(57, 57, 57)')
    await expect(filterButton).toHaveCSS('color', 'rgb(255, 255, 255)')
  })

  test('플로팅 버튼 동작 확인', async ({ page }) => {
    const floatingButton = page.getByText('글쓰기')
    await expect(floatingButton).toBeVisible()

    await floatingButton.hover()
    await expect(floatingButton).toHaveCSS(
      'transform',
      'matrix(1.03, 0, 0, 1.03, 0, 0)'
    )

    await floatingButton.click()
  })

  test('신고 버튼 및 신고 항목 동작 확인', async ({ page }) => {
    const reportItem = page.getByText('신고 항목 내용')
    await expect(reportItem).toBeVisible()

    await reportItem.click()
    await expect(reportItem).toHaveCSS('border-color', 'rgb(57, 33, 17)')

    const reportButton = page.locator('button').filter({ hasText: '신고하기' })
    await expect(reportButton).toBeVisible()

    await reportButton.click()
    await expect(reportButton).toHaveCSS('background-color', 'rgb(251, 79, 80)')
  })

  test('리뷰 버튼 동작 확인', async ({ page }) => {
    const reviewButton = page.getByText('⚡️ 응답이 빨라요')
    await expect(reviewButton).toBeVisible()

    await reviewButton.click()
    await expect(reviewButton).toHaveCSS(
      'background-color',
      'rgb(255, 252, 245)'
    )
    await expect(reviewButton).toHaveCSS('border-color', 'rgb(240, 218, 169)')
  })
})
