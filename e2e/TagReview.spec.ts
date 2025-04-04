import { test, expect } from '@playwright/test'

test.describe('TagReview 컴포넌트', () => {
  test.beforeEach(async ({ page }) => {
    // 애플리케이션의 메인 페이지로 이동
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // 페이지 상단으로 스크롤
    await page.evaluate(() => {
      window.scrollTo(0, 0)
    })
  })

  test('컴포넌트의 제목이 올바르게 표시된다', async ({ page }) => {
    // 제목 확인
    const title = page.getByText('받은 평가 및 리뷰', { exact: true }).first()
    await expect(title).toBeVisible()
  })

  test('초기 상태에서 태그들이 표시된다', async ({ page }) => {
    // '응답이 빨라요' 태그가 표시되는지 확인
    const fastResponseTag = page
      .locator('div')
      .filter({ hasText: /12/ })
      .filter({ hasText: /응답이 빨라요/ })
      .first()
    await expect(fastResponseTag).toBeVisible()

    // 신뢰 태그가 표시되는지 확인
    const trustTag = page
      .locator('div')
      .filter({ hasText: /9/ })
      .filter({ hasText: /신뢰/ })
      .first()
    await expect(trustTag).toBeVisible()

    // 공감 태그가 표시되는지 확인
    const empathyTag = page
      .locator('div')
      .filter({ hasText: /8/ })
      .filter({ hasText: /공감/ })
      .first()
    await expect(empathyTag).toBeVisible()
  })

  test('펼치기/접기 버튼이 있다', async ({ page }) => {
    // 제목 요소 찾기
    const title = page.getByText('받은 평가 및 리뷰', { exact: true }).first()

    // 컨테이너 찾기 (제목이 있는 가장 가까운 부모)
    const container = page.locator('div').filter({ has: title }).first()

    // 컨테이너 내부에 버튼이 있는지 확인
    const button = container.locator('button').first()
    await expect(button).toBeVisible()
  })

  test('태그는 이모지와 텍스트와 숫자를 포함한다', async ({ page }) => {
    // 첫 번째 태그 확인 (응답이 빨라요)
    const firstTag = page
      .locator('div')
      .filter({ hasText: /응답이 빨라요/ })
      .filter({ hasText: /12/ })
      .first()

    // 요소가 보이는지 확인
    await expect(firstTag).toBeVisible()

    // 내부 텍스트에 숫자가 포함되어 있는지 확인
    const hasNumber = await firstTag.evaluate((el) => {
      return /\d+/.test(el.textContent || '')
    })
    expect(hasNumber).toBeTruthy()

    // 이모지 또는 특수문자가 포함되어 있는지 확인
    const hasEmoji = await firstTag.evaluate((el) => {
      // 간단한 이모지 탐지 (완벽하진 않지만 테스트 목적으로는 충분)
      return /[\u{1F300}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F600}-\u{1F64F}⚡]/u.test(
        el.textContent || ''
      )
    })
    expect(hasEmoji).toBeTruthy()
  })

  test('모바일 화면에서도 표시된다', async ({ page }) => {
    // 모바일 뷰포트 설정
    await page.setViewportSize({ width: 375, height: 667 })
    await page.reload()
    await page.waitForLoadState('networkidle')

    // 제목이 표시되는지 확인
    const title = page.getByText('받은 평가 및 리뷰', { exact: true }).first()
    await expect(title).toBeVisible()

    // 태그가 하나 이상 표시되는지 확인
    const firstTag = page
      .locator('div')
      .filter({ hasText: /응답이 빨라요/ })
      .filter({ hasText: /12/ })
      .first()
    await expect(firstTag).toBeVisible()
  })
})
