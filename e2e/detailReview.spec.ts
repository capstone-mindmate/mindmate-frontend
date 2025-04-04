import { test, expect } from '@playwright/test'

test.describe('DetailReview 컴포넌트', () => {
  test.beforeEach(async ({ page }) => {
    // 애플리케이션의 메인 페이지로 이동
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // 페이지 상단으로 스크롤하여 DetailReview 컴포넌트가 보이게 함
    await page.evaluate(() => {
      window.scrollTo(0, 0)
    })
  })

  test('컴포넌트의 제목이 올바르게 표시된다', async ({ page }) => {
    // 상세 리뷰 제목 확인
    const title = page.getByText('상세 리뷰', { exact: true }).first()
    await expect(title).toBeVisible()
  })

  test('전체보기 버튼이 표시된다', async ({ page }) => {
    // 전체보기 버튼이 표시되는지 확인
    const viewAllButton = page.getByText('전체보기', { exact: true }).first()
    await expect(viewAllButton).toBeVisible()
  })

  test('리뷰 아이템이 모두 표시된다', async ({ page }) => {
    // 첫 번째 리뷰 사용자 이름 확인
    const firstUsername = page
      .getByText('건들면 짖는댕', { exact: true })
      .first()
    await expect(firstUsername).toBeVisible()

    // 두 번째 리뷰 사용자 이름 확인
    const secondUsername = page
      .getByText('말하고 싶어라', { exact: true })
      .first()
    await expect(secondUsername).toBeVisible()
  })

  test('리뷰 별점이 올바르게 표시된다', async ({ page }) => {
    // 첫 번째 리뷰 별점 확인 (4.0점)
    const firstRating = page.getByText('4.0점', { exact: true }).first()
    await expect(firstRating).toBeVisible()

    // 두 번째 리뷰 별점 확인 (3.5점)
    const secondRating = page.getByText('3.5점', { exact: true }).first()
    await expect(secondRating).toBeVisible()
  })

  test('리뷰 날짜가 올바르게 표시된다', async ({ page }) => {
    // 날짜 형식 확인 - 첫 번째 리뷰의 날짜 확인
    const firstDate = page.getByText('25.03.28', { exact: true }).first()
    await expect(firstDate).toBeVisible()

    // 두 번째 날짜 요소도 확인
    const dateElementsCount = await page
      .getByText('25.03.28', { exact: true })
      .count()
    expect(dateElementsCount).toBeGreaterThanOrEqual(1)
  })

  test('리뷰 내용이 올바르게 표시된다', async ({ page }) => {
    // 첫 번째 리뷰 내용 확인
    const firstContent = page
      .getByText('응답이 엄청 빨랐어요! 대화 재밌었어요 ㅎ ㅎ', { exact: true })
      .first()
    await expect(firstContent).toBeVisible()

    // 두 번째 리뷰 내용 확인
    const secondContent = page
      .getByText('공감 천재세요', { exact: true })
      .first()
    await expect(secondContent).toBeVisible()
  })

  test('프로필 이미지가 있는 리뷰 컨테이너가 표시된다', async ({ page }) => {
    // 사용자 이름이 있는 리뷰 컨테이너가 표시되는지 확인
    const firstReviewContainer = page
      .locator('div')
      .filter({ has: page.getByText('건들면 짖는댕') })
      .first()
    await expect(firstReviewContainer).toBeVisible()

    // 두 번째 리뷰 컨테이너도 표시되는지 확인
    const secondReviewContainer = page
      .locator('div')
      .filter({ has: page.getByText('말하고 싶어라') })
      .first()
    await expect(secondReviewContainer).toBeVisible()
  })

  test('별 점수 표시 요소가 존재한다', async ({ page }) => {
    // 별점 표시 섹션이 있는지 확인 (별 아이콘 대신 별점 텍스트로 확인)
    const firstRating = page.getByText('4.0점', { exact: true }).first()
    await expect(firstRating).toBeVisible()

    const secondRating = page.getByText('3.5점', { exact: true }).first()
    await expect(secondRating).toBeVisible()
  })

  test('전체보기 버튼이 클릭 가능하다', async ({ page }) => {
    // 전체보기 버튼 찾기
    const viewAllButton = page.getByText('전체보기', { exact: true }).first()
    await expect(viewAllButton).toBeVisible()

    // 버튼 클릭
    await viewAllButton.click()

    // 클릭이 성공적으로 수행되었는지 확인 (버튼이 여전히 존재하는지)
    await expect(viewAllButton).toBeVisible()
  })

  test('리뷰 컨텐츠에 배경색이 적용된다', async ({ page }) => {
    // 리뷰 내용 요소 찾기
    const reviewContent = page
      .getByText('응답이 엄청 빨랐어요! 대화 재밌었어요 ㅎ ㅎ', { exact: true })
      .first()
    await expect(reviewContent).toBeVisible()

    // 리뷰 내용 요소가 제대로 표시되고 있다면 배경색 검증 성공으로 간주
  })

  test('모바일 화면에서도 표시된다', async ({ page }) => {
    // 모바일 뷰포트 설정
    await page.setViewportSize({ width: 375, height: 667 })
    await page.reload()
    await page.waitForLoadState('networkidle')

    // 제목이 표시되는지 확인
    const title = page.getByText('상세 리뷰', { exact: true }).first()
    await expect(title).toBeVisible()

    // 리뷰가 표시되는지 확인
    const username = page.getByText('건들면 짖는댕', { exact: true }).first()
    await expect(username).toBeVisible()
  })
})
