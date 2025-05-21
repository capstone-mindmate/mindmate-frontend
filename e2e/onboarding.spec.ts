import { test, expect } from '@playwright/test'

test.describe('Onboarding 페이지', () => {
  // 각 테스트 전에 실행되는 설정
  test.beforeEach(async ({ page }) => {
    // Onboarding 페이지로 이동
    await page.goto('httpss://mindmate.shop:5173/onboarding')
    await page.waitForLoadState('networkidle')
  })

  test('페이지가 올바르게 로드된다', async ({ page }) => {
    // 페이지가 로드되었는지 확인
    await expect(page).toHaveURL('httpss://mindmate.shop:5173/onboarding')
  })

  test('슬라이드 이미지와 텍스트가 표시된다', async ({ page }) => {
    // 첫 번째 슬라이드의 텍스트 확인 - 클래스 선택자 사용
    const firstSlideHeading = page.locator('h2').first()
    await expect(firstSlideHeading).toBeVisible()

    // 헤딩 텍스트 내용 확인
    const headingText = await firstSlideHeading.textContent()
    expect(headingText).toContain('대학생활이 처음이라서 낯설다면')

    // 첫 번째 슬라이드의 설명 텍스트 확인
    const firstSlideDescription = page.locator('p').first()
    await expect(firstSlideDescription).toBeVisible()

    // 설명 텍스트 내용 확인
    const descriptionText = await firstSlideDescription.textContent()
    expect(descriptionText).toContain('어떻게 적응해야 할지 고민이라면?')

    // 이모티콘 컨테이너가 있는지 확인
    // 전체 컨테이너 대신 특정 클래스로 접근
    const emojiContainer = page.locator('.css-1a9vboy').first()
    await expect(emojiContainer).toBeVisible()
  })

  test('프로그레스 표시기가 있다', async ({ page }) => {
    // 프로그레스바 컨테이너가 있는지 확인 (실제 CSS 클래스에 맞게 수정)
    const progressBarContainer = page
      .locator('div')
      .filter({
        has: page.locator('button').first(),
      })
      .last()

    await expect(progressBarContainer).toBeVisible()

    // 최소한 하나의 버튼이 있는지 확인
    const progressButtons = page.locator('button')
    const buttonCount = await progressButtons.count()
    expect(buttonCount).toBeGreaterThan(0)
  })

  test('슬라이더 기능이 작동한다', async ({ page }) => {
    // 첫 번째 슬라이드 텍스트 확인
    const firstSlideText = page.getByText('대학생활이 처음이라서 낯설다면', {
      exact: false,
    })
    await expect(firstSlideText).toBeVisible()

    // 모든 버튼을 찾고 두 번째 버튼 클릭 (인덱스 1)
    const buttons = page.locator('button')
    const buttonCount = await buttons.count()

    if (buttonCount > 1) {
      // 버튼이 두 개 이상이라면 두 번째 버튼 클릭
      await buttons.nth(1).click()
      await page.waitForTimeout(1000) // 애니메이션 대기

      // 두 번째 슬라이드의 텍스트가 표시되는지 확인 (두 번째 슬라이드 텍스트에 맞게 조정)
      const secondSlideText = page.getByText('선배들에게 조언을 구하고', {
        exact: false,
      })
      await expect(secondSlideText).toBeVisible()
    }
  })

  test('로그인 버튼이 표시된다', async ({ page }) => {
    // 구글 로그인 버튼이 표시되는지 확인
    const loginButton = page.getByText('아주대학교 계정으로 로그인', {
      exact: true,
    })
    await expect(loginButton).toBeVisible()

    // 구글 아이콘이 로그인 버튼에 포함되어 있는지 확인
    const googleIcon = page.locator('img[src*="google"]')
    await expect(googleIcon).toBeVisible()
  })

  test('로그인 버튼이 클릭 가능하다', async ({ page }) => {
    // 로그인 버튼 찾기
    const loginButton = page.getByText('아주대학교 계정으로 로그인', {
      exact: true,
    })

    // 클릭 이벤트가 알림(alert)을 발생시키는 것으로 가정하고 대기 설정
    page.on('dialog', async (dialog) => {
      expect(dialog.message()).toContain('구글 로그인 버튼 클릭됨')
      await dialog.accept()
    })

    // 버튼 클릭
    await loginButton.click()

    // 1초 대기 (알림 다이얼로그가 표시될 시간)
    await page.waitForTimeout(1000)
  })

  test('스와이프 제스처가 슬라이드를 변경한다', async ({ page }) => {
    // 첫 번째 슬라이드 텍스트 확인
    const firstSlideText = page.getByText('대학생활이 처음이라서 낯설다면', {
      exact: false,
    })
    await expect(firstSlideText).toBeVisible()

    // 슬라이더 컨테이너 찾기
    const sliderContainer = page
      .locator('div')
      .filter({ has: firstSlideText })
      .first()

    // 왼쪽으로 스와이프 (다음 슬라이드로 이동)
    const box = await sliderContainer.boundingBox()
    if (box) {
      // 오른쪽에서 왼쪽으로 드래그 (다음 슬라이드로 이동)
      await page.mouse.move(box.x + box.width * 0.8, box.y + box.height / 2)
      await page.mouse.down()
      await page.mouse.move(box.x + box.width * 0.2, box.y + box.height / 2, {
        steps: 10,
      })
      await page.mouse.up()
    }

    // 애니메이션 완료 대기
    await page.waitForTimeout(1000)

    // 두 번째 슬라이드 텍스트가 표시되는지 확인
    const secondSlideText = page.getByText('선배들에게 조언을 구하고', {
      exact: false,
    })
    await expect(secondSlideText).toBeVisible()
  })

  test('자동 슬라이드 기능이 동작한다', async ({ page }) => {
    // 첫 번째 슬라이드 텍스트 확인
    const firstSlideText = page.getByText('대학생활이 처음이라서 낯설다면', {
      exact: false,
    })
    await expect(firstSlideText).toBeVisible()

    // 자동 슬라이드 시간(5초) 대기
    await page.waitForTimeout(5500)

    // 두 번째 슬라이드 텍스트가 표시되는지 확인
    const secondSlideText = page.getByText('선배들에게 조언을 구하고', {
      exact: false,
    })
    await expect(secondSlideText).toBeVisible()
  })

  test('모바일 화면에서 정상적으로 표시된다', async ({ page }) => {
    // 모바일 화면 크기로 설정 (iPhone SE 사이즈)
    await page.setViewportSize({ width: 375, height: 667 })
    await page.reload()
    await page.waitForLoadState('networkidle')

    // 헤딩 텍스트가 제대로 표시되는지 확인
    const heading = page.getByText('대학생활이 처음이라서 낯설다면', {
      exact: false,
    })
    await expect(heading).toBeVisible()

    // 버튼이 제대로 표시되는지 확인
    const loginButton = page.getByText('아주대학교 계정으로 로그인', {
      exact: true,
    })
    await expect(loginButton).toBeVisible()
  })

  test('슬라이드 이동 순환이 정상적으로 작동한다', async ({ page }) => {
    // 첫 번째 슬라이드 확인
    await expect(
      page.getByText('대학생활이 처음이라서 낯설다면', { exact: false })
    ).toBeVisible()

    // 모든 슬라이드를 이동해보기 (총 4개 슬라이드 가정)
    const sliderContainer = page
      .locator('div')
      .filter({
        has: page.getByText('대학생활이 처음이라서 낯설다면', { exact: false }),
      })
      .first()

    const box = await sliderContainer.boundingBox()
    if (box) {
      // 모든 슬라이드를 이동해 보기
      for (let i = 0; i < 3; i++) {
        // 왼쪽으로 스와이프
        await page.mouse.move(box.x + box.width * 0.8, box.y + box.height / 2)
        await page.mouse.down()
        await page.mouse.move(box.x + box.width * 0.2, box.y + box.height / 2, {
          steps: 10,
        })
        await page.mouse.up()
        await page.waitForTimeout(1000) // 애니메이션 대기
      }

      // 마지막 슬라이드에서 다시 첫 번째로 이동
      await page.mouse.move(box.x + box.width * 0.8, box.y + box.height / 2)
      await page.mouse.down()
      await page.mouse.move(box.x + box.width * 0.2, box.y + box.height / 2, {
        steps: 10,
      })
      await page.mouse.up()
      await page.waitForTimeout(1000) // 애니메이션 대기

      // 첫 번째 슬라이드로 돌아왔는지 확인
      await expect(
        page.getByText('대학생활이 처음이라서 낯설다면', { exact: false })
      ).toBeVisible()
    }
  })
})
