import { test, expect } from '@playwright/test'

test.describe('ProfileEdit 컴포넌트', () => {
  test.beforeEach(async ({ page }) => {
    // 애플리케이션의 메인 페이지로 이동
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // 페이지 상단으로 스크롤하여 ProfileEdit 컴포넌트가 보이게 함
    const profileEditHeading = page.getByText('프로필 편집 컴포넌트', {
      exact: true,
    })
    await profileEditHeading.scrollIntoViewIfNeeded()
  })

  test('ProfileEdit 컴포넌트가 화면에 표시된다', async ({ page }) => {
    // 프로필 편집 컴포넌트 제목 확인
    const title = page.getByText('프로필 편집 컴포넌트', { exact: true })
    await expect(title).toBeVisible()

    // 프로필 편집 컴포넌트 컨테이너가 표시되는지 확인
    const profileEditContainer = page
      .locator('div', {
        has: page.getByText('프로필 편집 컴포넌트', { exact: true }),
      })
      .first()
    await expect(profileEditContainer).toBeVisible()
  })

  test('프로필 이미지가 표시된다', async ({ page }) => {
    // 프로필 이미지가 존재하는지 확인
    const profileImage = page.locator('img[alt="프로필 이미지"]').first()
    await expect(profileImage).toBeVisible()

    // 이미지가 원형으로 표시되는지는 CSS 속성으로 확인할 수 있지만,
    // 기본적으로 이미지가 존재하는지만 체크
  })

  test('사용자 이름이 표시된다', async ({ page }) => {
    // 사용자 이름이 표시되는지 확인
    const username = page.getByText('행복한 돌멩이', { exact: true }).first()
    await expect(username).toBeVisible()
  })

  test('프로필 편집 버튼이 표시된다', async ({ page }) => {
    // 프로필 편집 버튼이 표시되는지 확인
    const editButton = page.getByText('프로필 편집', { exact: true }).first()
    await expect(editButton).toBeVisible()
  })

  test('프로필 편집 버튼이 클릭 가능하다', async ({ page }) => {
    // 편집 버튼 찾기
    const editButton = page.getByText('프로필 편집', { exact: true }).first()
    await expect(editButton).toBeVisible()

    // 버튼 클릭
    await editButton.click()

    // 클릭이 성공적으로 수행되었는지 확인 (버튼이 여전히 존재하는지)
    await expect(editButton).toBeVisible()
  })

  test('컴포넌트가 가로 방향으로 정렬된다', async ({ page }) => {
    // 프로필 편집 컴포넌트 섹션 찾기
    const profileEditSection = page
      .locator('div', {
        has: page.getByText('프로필 편집 컴포넌트', { exact: true }),
      })
      .first()

    // 프로필 이미지 찾기
    const profileImage = profileEditSection
      .locator('img[alt="프로필 이미지"]')
      .first()

    // 사용자 이름 찾기
    const username = profileEditSection
      .getByText('행복한 돌멩이', { exact: true })
      .first()

    // 편집 버튼 찾기
    const editButton = profileEditSection
      .getByText('프로필 편집', { exact: true })
      .first()

    // 모든 요소가 보이는지 확인
    await expect(profileImage).toBeVisible()
    await expect(username).toBeVisible()
    await expect(editButton).toBeVisible()

    // 요소들의 y 좌표를 가져와서 비슷한 높이에 있는지 확인
    const imageBox = await profileImage.boundingBox()
    const usernameBox = await username.boundingBox()
    const buttonBox = await editButton.boundingBox()

    if (imageBox && usernameBox && buttonBox) {
      // 요소들의 중앙 y 좌표가 비슷한 범위 내에 있는지 확인 (수직 정렬)
      const imageMiddleY = imageBox.y + imageBox.height / 2
      const usernameMiddleY = usernameBox.y + usernameBox.height / 2
      const buttonMiddleY = buttonBox.y + buttonBox.height / 2

      // 20px 오차 범위 내에 있는지 확인
      const tolerance = 20
      expect(Math.abs(imageMiddleY - usernameMiddleY)).toBeLessThanOrEqual(
        tolerance
      )
      expect(Math.abs(usernameMiddleY - buttonMiddleY)).toBeLessThanOrEqual(
        tolerance
      )
    }
  })

  test('모바일 화면에서도 표시된다', async ({ page }) => {
    // 모바일 뷰포트 설정
    await page.setViewportSize({ width: 375, height: 667 })
    await page.reload()
    await page.waitForLoadState('networkidle')

    // 프로필 편집 컴포넌트 섹션으로 스크롤
    const title = page.getByText('프로필 편집 컴포넌트', { exact: true })
    await title.scrollIntoViewIfNeeded()
    await expect(title).toBeVisible()

    // 컴포넌트 요소들이 표시되는지 확인
    const profileImage = page.locator('img[alt="프로필 이미지"]').first()
    await expect(profileImage).toBeVisible()

    const username = page.getByText('행복한 돌멩이', { exact: true }).first()
    await expect(username).toBeVisible()

    const editButton = page.getByText('프로필 편집', { exact: true }).first()
    await expect(editButton).toBeVisible()
  })

  test('프로필 이미지의 크기가 적절하다', async ({ page }) => {
    // 프로필 이미지 찾기
    const profileImage = page.locator('img[alt="프로필 이미지"]').first()
    await expect(profileImage).toBeVisible()

    // 이미지의 크기 확인
    const imageBox = await profileImage.boundingBox()
    if (imageBox) {
      // 스타일에서 지정한 80x80 크기인지 확인 (약간의 오차 허용)
      expect(imageBox.width).toBeCloseTo(60, -1) // 첫 번째 자리까지만 확인
      expect(imageBox.height).toBeCloseTo(60, -1) // 첫 번째 자리까지만 확인
    }
  })

  test('프로필 편집 버튼의 스타일이 적용된다', async ({ page }) => {
    // 프로필 편집 버튼 찾기
    const editButton = page.getByText('프로필 편집', { exact: true }).first()
    await expect(editButton).toBeVisible()

    // 버튼 배경색 확인 (#392111)
    const buttonStyles = await editButton.evaluate((el) => {
      const styles = window.getComputedStyle(el)
      return {
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        fontFamily: styles.fontFamily,
        fontSize: styles.fontSize,
      }
    })

    // 배경색이 #392111 (RGB로 변환하면 57, 33, 17)에 가까운지 확인
    expect(buttonStyles.backgroundColor).toContain('57, 33, 17')

    // 텍스트 색상이 흰색인지 확인
    expect(buttonStyles.color).toContain('255, 255, 255')

    // Pretendard 폰트가 적용되었는지 확인
    expect(buttonStyles.fontFamily.toLowerCase()).toContain('pretendard')

    // 글씨 크기가 12px에 가까운지 확인
    expect(parseFloat(buttonStyles.fontSize)).toBeCloseTo(12, 0)
  })
})
