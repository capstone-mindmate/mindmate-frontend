import { test, expect } from '@playwright/test'

test.describe('DetailReview 컴포넌트 테스트', () => {
  test.beforeEach(async ({ page }) => {
    // 애플리케이션의 메인 페이지로 이동
    await page.goto('/mypage')
    await page.waitForLoadState('networkidle')

    // 상세 리뷰 컴포넌트로 스크롤
    const detailReviewTitle = page
      .getByText('상세 리뷰', { exact: true })
      .first()
    await detailReviewTitle.scrollIntoViewIfNeeded()
  })

  test('컴포넌트 기본 구조 확인', async ({ page }) => {
    // 제목 확인
    const title = page.getByText('상세 리뷰', { exact: true }).first()
    await expect(title).toBeVisible()

    // 전체보기 버튼 확인
    const viewAllButton = page.getByText('전체보기', { exact: true }).first()
    await expect(viewAllButton).toBeVisible()

    // 적어도 하나의 리뷰 항목이 표시되는지 확인
    const username = page.getByText('건들면 짖는댕', { exact: true }).first()
    await expect(username).toBeVisible()
  })

  test('리뷰 항목 내용 확인', async ({ page }) => {
    // 첫 번째 리뷰 사용자 이름 확인
    const firstUsername = page
      .getByText('건들면 짖는댕', { exact: true })
      .first()
    await expect(firstUsername).toBeVisible()

    // 첫 번째 리뷰 별점 확인
    const firstRating = page.getByText('4.0점', { exact: true }).first()
    await expect(firstRating).toBeVisible()

    // 첫 번째 리뷰 날짜 확인
    const firstDate = page.getByText('25.03.28', { exact: true }).first()
    await expect(firstDate).toBeVisible()

    // 첫 번째 리뷰 내용 확인
    const firstContent = page
      .getByText('응답이 엄청 빨랐어요! 대화 재밌었어요 ㅎ ㅎ', { exact: true })
      .first()
    await expect(firstContent).toBeVisible()

    // 두 번째 리뷰 사용자 이름 확인
    const secondUsername = page
      .getByText('말하고 싶어라', { exact: true })
      .first()
    await expect(secondUsername).toBeVisible()

    // 두 번째 리뷰 별점 확인
    const secondRating = page.getByText('3.5점', { exact: true }).first()
    await expect(secondRating).toBeVisible()

    // 두 번째 리뷰 내용 확인
    const secondContent = page
      .getByText('공감 천재세요', { exact: true })
      .first()
    await expect(secondContent).toBeVisible()
  })

  test('별점 표시 확인', async ({ page }) => {
    // 별 아이콘 존재 확인
    const starIcons = page.locator('svg[viewBox="0 0 24 24"]')
    const iconCount = await starIcons.count()
    expect(iconCount).toBeGreaterThan(0)

    // 첫 번째 리뷰의 별 아이콘 확인
    const firstStarIcon = starIcons.first()
    await expect(firstStarIcon).toBeVisible()

    // 별 아이콘 색상 확인 (fill 속성)
    const fillColor = await firstStarIcon
      .locator('path')
      .first()
      .getAttribute('fill')
    expect(fillColor).toBe('#F0DAA9')
  })

  test('프로필 이미지 표시 확인', async ({ page }) => {
    // 프로필 이미지 확인
    const profileImages = page.locator('img[alt$="의 프로필 이미지"]')
    const imageCount = await profileImages.count()
    expect(imageCount).toBeGreaterThan(0)

    // 첫 번째 프로필 이미지가 보이는지 확인
    await expect(profileImages.first()).toBeVisible()
  })

  test('전체보기 버튼 클릭 동작 확인', async ({ page }) => {
    // 전체보기 버튼 찾기
    const viewAllButton = page.getByText('전체보기', { exact: true }).first()
    await expect(viewAllButton).toBeVisible()

    // 버튼 클릭
    await viewAllButton.click()

    // 페이지 이동 후 리뷰 전체보기 타이틀 확인
    await page.waitForLoadState('networkidle')
    const pageTitle = page.getByText('리뷰 전체보기', { exact: true })
    await expect(pageTitle).toBeVisible()

    // 뒤로가기 버튼이 표시되는지 확인
    const backButton = page
      .locator('button')
      .filter({ has: page.locator('svg') })
      .first()
    await expect(backButton).toBeVisible()
  })

  test('리뷰 컨텐츠 스타일 확인', async ({ page }) => {
    // 리뷰 컨텐츠 찾기
    const reviewContent = page
      .getByText('응답이 엄청 빨랐어요! 대화 재밌었어요 ㅎ ㅎ', { exact: true })
      .first()
    await expect(reviewContent).toBeVisible()

    // 컨텐츠 스타일 확인
    const backgroundColor = await reviewContent.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor
    })
    expect(backgroundColor).not.toBe('rgba(0, 0, 0, 0)') // 배경색이 투명하지 않음을 확인

    const padding = await reviewContent.evaluate((el) => {
      return window.getComputedStyle(el).padding
    })
    expect(padding).not.toBe('0px') // 패딩이 있는지 확인
  })

  test('모바일 화면에서 컴포넌트 표시 확인', async ({ page }) => {
    // 모바일 뷰포트 설정
    await page.setViewportSize({ width: 375, height: 667 })
    await page.reload()
    await page.waitForLoadState('networkidle')

    // 상세 리뷰 컴포넌트로 스크롤
    const detailReviewTitle = page
      .getByText('상세 리뷰', { exact: true })
      .first()
    await detailReviewTitle.scrollIntoViewIfNeeded()

    // 제목이 표시되는지 확인
    await expect(detailReviewTitle).toBeVisible()

    // 리뷰 항목이 표시되는지 확인
    const username = page.getByText('건들면 짖는댕', { exact: true }).first()
    await expect(username).toBeVisible()

    // 전체보기 버튼이 표시되는지 확인
    const viewAllButton = page.getByText('전체보기', { exact: true }).first()
    await expect(viewAllButton).toBeVisible()
  })

  test('전체보기 페이지의 리뷰 목록 확인', async ({ page }) => {
    // 전체보기 버튼 클릭
    const viewAllButton = page.getByText('전체보기', { exact: true }).first()
    await viewAllButton.click()
    await page.waitForLoadState('networkidle')

    // 타이틀 확인
    const pageTitle = page.getByText('리뷰 전체보기', { exact: true })
    await expect(pageTitle).toBeVisible()

    // 모든 리뷰 항목이 표시되는지 확인 (최소 3개 이상)
    const reviewItems = page
      .locator('div')
      .filter({ has: page.locator('img[alt$="의 프로필 이미지"]') })
    const itemCount = await reviewItems.count()
    expect(itemCount).toBeGreaterThanOrEqual(3)

    // 세 번째 리뷰도 표시되는지 확인 (전체보기 페이지에서만 보이는 항목)
    const thirdUsername = page.getByText('햇살가득 바다', { exact: true })
    await expect(thirdUsername).toBeVisible()

    // 세 번째 리뷰 별점 확인
    const thirdRating = page.getByText('5.0점', { exact: true })
    await expect(thirdRating).toBeVisible()
  })

  test('TopBar 컴포넌트와의 연동 확인', async ({ page }) => {
    // 전체보기 버튼 클릭
    const viewAllButton = page.getByText('전체보기', { exact: true }).first()
    await viewAllButton.click()
    await page.waitForLoadState('networkidle')

    // TopBar 컴포넌트가 표시되는지 확인
    const topBar = page
      .locator('div')
      .filter({ has: page.getByText('리뷰 전체보기') })
      .first()
    await expect(topBar).toBeVisible()

    // 뒤로가기 버튼 클릭
    const backButton = page
      .locator('button')
      .filter({ has: page.locator('svg') })
      .first()
    await expect(backButton).toBeVisible()
    await backButton.click()

    // 원래 페이지로 돌아왔는지 확인
    await page.waitForLoadState('networkidle')
    const title = page.getByText('상세 리뷰', { exact: true }).first()
    await expect(title).toBeVisible()
  })
})
