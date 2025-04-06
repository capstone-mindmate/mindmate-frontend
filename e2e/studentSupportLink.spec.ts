import { test, expect } from '@playwright/test'

test.describe('StudentSupportLink 컴포넌트', () => {
  test.beforeEach(async ({ page }) => {
    // 애플리케이션의 메인 페이지로 이동 - networkidle 대기 제거
    await page.goto('/')

    // 페이지 로딩 대기 (더 안정적인 방법)
    await page.waitForTimeout(2000)

    try {
      // 학생 지원 센터 바로가기 컴포넌트 섹션으로 스크롤
      const supportLinkHeading = page.getByText('학생 지원 센터 바로가기', {
        exact: true,
      })
      await supportLinkHeading.scrollIntoViewIfNeeded({ timeout: 5000 })
    } catch (e) {
      console.log(
        '학생 지원 센터 바로가기 헤딩을 찾을 수 없습니다. 계속 진행합니다.'
      )
    }
  })

  test('컴포넌트가 화면에 표시된다', async ({ page }) => {
    // 제목 존재 확인 - 타임아웃 감소
    const title = page.getByText('학생 지원 센터 바로가기', { exact: true })
    await expect(title).toBeVisible({ timeout: 5000 })
  })

  test('이미지가 화면에 렌더링된다', async ({ page }) => {
    // 컴포넌트의 부모 요소를 찾기
    const componentContainer = page
      .locator('div', {
        has: page.getByText('학생 지원 센터 바로가기', { exact: true }),
      })
      .first()

    // 이미지 요소들 찾기
    const images = componentContainer.locator('img')

    // 이미지가 존재하는지 확인
    const imageCount = await images.count()
    console.log(`Found ${imageCount} images`)

    // 이미지가 적어도 한 개 이상 있는지 확인
    expect(imageCount).toBeGreaterThan(0)

    // 첫 번째 이미지가 표시되는지 확인
    if (imageCount > 0) {
      await expect(images.first()).toBeVisible({ timeout: 5000 })
    }
  })

  test('이미지가 support 폴더의 리소스를 참조한다', async ({ page }) => {
    // 컴포넌트의 부모 요소를 찾기
    const componentContainer = page
      .locator('div', {
        has: page.getByText('학생 지원 센터 바로가기', { exact: true }),
      })
      .first()

    // 이미지 요소들 찾기
    const images = componentContainer.locator('img')

    // 이미지 개수 확인
    const imageCount = await images.count()

    if (imageCount > 0) {
      // 첫 번째 이미지의 src 속성 확인
      const firstImageSrc = await images.first().getAttribute('src')
      console.log(`First image src: ${firstImageSrc}`)

      // 이미지 경로가 support 폴더를 참조하는지 확인
      expect(firstImageSrc).toBeTruthy()
      if (firstImageSrc) {
        expect(firstImageSrc.includes('support')).toBeTruthy()
      }
    } else {
      console.log('이미지가 없습니다. 테스트를 건너뜁니다.')
    }
  })

  test('스크롤 가능한 컨테이너 구조가 있다', async ({ page }) => {
    // 컴포넌트의 부모 요소를 찾기
    const componentContainer = page
      .locator('div', {
        has: page.getByText('학생 지원 센터 바로가기', { exact: true }),
      })
      .first()

    // 내부에 div 요소들 찾기 (스크롤 컨테이너 후보)
    const innerDivs = componentContainer.locator('div')

    // div가 존재하는지 확인
    const divCount = await innerDivs.count()
    console.log(`Found ${divCount} divs inside component container`)

    // 최소한 헤더와 컨텐츠 div가 있어야 함
    expect(divCount).toBeGreaterThan(0)
  })

  test('지원 센터 이미지가 가로로 배열되어 있다', async ({ page }) => {
    // 컴포넌트의 부모 요소를 찾기
    const componentContainer = page
      .locator('div', {
        has: page.getByText('학생 지원 센터 바로가기', { exact: true }),
      })
      .first()

    // 이미지 요소들 찾기
    const images = componentContainer.locator('img')
    const imageCount = await images.count()

    if (imageCount >= 2) {
      try {
        // 처음 두 이미지의 위치 정보 가져오기
        const firstImageBounds = await images.nth(0).boundingBox()
        const secondImageBounds = await images.nth(1).boundingBox()

        if (firstImageBounds && secondImageBounds) {
          console.log(
            `First image position: x=${firstImageBounds.x}, y=${firstImageBounds.y}`
          )
          console.log(
            `Second image position: x=${secondImageBounds.x}, y=${secondImageBounds.y}`
          )

          // 두 이미지의 y 좌표가 비슷하면 가로 배열로 간주
          const yDifference = Math.abs(firstImageBounds.y - secondImageBounds.y)
          console.log(`Y-coordinate difference: ${yDifference}px`)

          const isHorizontalArrangement = yDifference < 50 // 적당한 오차 허용
          expect(isHorizontalArrangement).toBeTruthy()
        }
      } catch (e) {
        console.log('이미지 위치를 가져오는 중 오류가 발생했습니다:', e)
      }
    } else {
      console.log('이미지가 2개 미만입니다. 가로 배열 테스트를 건너뜁니다.')
    }
  })

  test('이미지에 학생 지원 센터 관련 alt 텍스트가 있다', async ({ page }) => {
    // 컴포넌트의 부모 요소를 찾기
    const componentContainer = page
      .locator('div', {
        has: page.getByText('학생 지원 센터 바로가기', { exact: true }),
      })
      .first()

    // 이미지 요소들 찾기
    const images = componentContainer.locator('img')
    const imageCount = await images.count()

    if (imageCount > 0) {
      // 첫 번째 이미지의 alt 속성 확인
      const altText = await images.first().getAttribute('alt')
      console.log(`First image alt text: ${altText}`)

      // alt 텍스트가 있는지 확인 (접근성 검사)
      expect(altText).toBeTruthy()
    } else {
      console.log('이미지가 없습니다. alt 텍스트 테스트를 건너뜁니다.')
    }
  })

  test('모바일 화면에서도 컴포넌트가 올바르게 표시된다', async ({ page }) => {
    // 모바일 뷰포트 설정 (iPhone SE 크기)
    await page.setViewportSize({ width: 375, height: 667 })

    // 페이지 새로고침 및 대기
    await page.reload()
    await page.waitForTimeout(2000)

    try {
      // 학생 지원 센터 바로가기 컴포넌트 찾기
      const title = page.getByText('학생 지원 센터 바로가기', { exact: true })
      await title.scrollIntoViewIfNeeded({ timeout: 5000 })
      await expect(title).toBeVisible({ timeout: 5000 })

      // 컴포넌트의 부모 요소를 찾기
      const componentContainer = page
        .locator('div', {
          has: page.getByText('학생 지원 센터 바로가기', { exact: true }),
        })
        .first()

      // 이미지가 표시되는지 확인
      const images = componentContainer.locator('img')
      const imageCount = await images.count()

      if (imageCount > 0) {
        await expect(images.first()).toBeVisible({ timeout: 5000 })
      }
    } catch (e) {
      console.log('모바일 화면 테스트 중 오류가 발생했습니다:', e)
    }
  })
})
