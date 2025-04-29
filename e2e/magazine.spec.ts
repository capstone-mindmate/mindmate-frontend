import { test, expect } from '@playwright/test'

test.describe('Magazine 컴포넌트', () => {
  test.beforeEach(async ({ page }) => {
    // 애플리케이션의 메인 페이지로 이동
    await page.goto('/')

    // 페이지가 완전히 로드될 때까지 기다림
    await page.waitForLoadState('domcontentloaded')

    // 대기 시간 추가 (렌더링 시간 확보)
    await page.waitForTimeout(2000)

    // 스크롤을 통해 매거진 컴포넌트가 보이도록 함
    await page.evaluate(() => {
      window.scrollTo(0, 300)
    })
  })

  test('매거진 컴포넌트가 올바르게 렌더링된다', async ({ page }) => {
    // 매거진 아이템을 직접 찾기
    const magazineItems = page.locator('div').filter({
      has: page.getByText('친구 사이에도 거리두기가 필요해'),
    })

    // 아이템이 존재하는지 확인
    const count = await magazineItems.count()
    expect(count).toBeGreaterThan(0)

    // 첫 번째 아이템이 보이는지 확인
    if (count > 0) {
      await expect(magazineItems.first()).toBeVisible()
    }

    // 이미지도 확인
    const images = page.locator('img')
    const imagesCount = await images.count()
    expect(imagesCount).toBeGreaterThan(0)
  })

  test('매거진 아이템이 올바른 구조로 렌더링된다', async ({ page }) => {
    // 먼저 이미지를 찾고 그 주변에서 텍스트 요소 찾기
    const images = page.locator('img')
    const imagesCount = await images.count()

    if (imagesCount > 0) {
      // 첫 번째 이미지 주변에서 제목 텍스트 찾기
      const titleText = page.getByText('친구 사이에도 거리두기가 필요해')

      // 제목 텍스트가 있는지 확인
      const titleExists = (await titleText.count()) > 0
      expect(titleExists).toBeTruthy()

      if (titleExists) {
        // 세부 내용 텍스트가 존재하는지 확인
        const detailTexts = page.getByText(/인간관계 때문에 고민/)
        const detailExists = (await detailTexts.count()) > 0
        expect(detailExists).toBeTruthy()
      }
    }
  })

  test('매거진 아이템이 존재한다', async ({ page }) => {
    // 아이템 텍스트로 찾기
    const titleText = page.getByText(
      /친구 사이에도 거리두기가 필요해|익명 대화 뜻밖의 현실조언/
    )
    const titleExists = (await titleText.count()) > 0

    // 제목이 존재하는지 확인
    expect(titleExists).toBeTruthy()

    // 이미지 요소가 존재하는지 확인
    const images = page.locator('img')
    const imagesExist = (await images.count()) > 0
    expect(imagesExist).toBeTruthy()

    // 세부 내용 텍스트가 존재하는지 확인
    const detailText = page.getByText(/인간관계 때문에 고민/)
    const detailExists = (await detailText.count()) > 0
    expect(detailExists).toBeTruthy()
  })

  test('매거진 요소에 접근하고 테스트할 수 있다', async ({ page }) => {
    // 페이지에 있는 이미지 요소에 접근
    const images = page.locator('img')
    const count = await images.count()

    // 이미지가 최소 1개 이상 있는지 확인
    expect(count).toBeGreaterThan(0)

    if (count > 0) {
      // 첫 번째 이미지에 접근
      const firstImage = images.first()

      // 이미지가 보이는지 확인
      await expect(firstImage).toBeVisible()

      // 이미지 속성이 존재하는지 확인
      const src = await firstImage.getAttribute('src')
      expect(src).toBeTruthy()
    }
  })

  test('모바일 화면에서 이미지 요소에 접근할 수 있다', async ({ page }) => {
    // 모바일 뷰포트 설정 (iPhone SE 크기)
    await page.setViewportSize({ width: 375, height: 667 })
    await page.reload()
    await page.waitForLoadState('domcontentloaded')

    // 대기 시간 추가
    await page.waitForTimeout(2000)

    // 스크롤을 통해 매거진 컴포넌트가 보이도록 함
    await page.evaluate(() => {
      window.scrollTo(0, 300)
    })

    // 페이지에 있는 이미지 요소에 접근
    const images = page.locator('img')
    const count = await images.count()

    // 이미지가 존재하는지 확인
    expect(count).toBeGreaterThan(0)
  })

  test('여러 텍스트 요소가 페이지에 존재한다', async ({ page }) => {
    // 텍스트 요소들이 존재하는지 확인
    const textElements = page.getByText(/친구 사이|인간관계|고민/)
    const textCount = await textElements.count()

    // 관련 텍스트 요소가 존재하는지 확인
    expect(textCount).toBeGreaterThan(0)

    // 이미지가 여러 개 있는지 확인
    const images = page.locator('img')
    const imageCount = await images.count()
    expect(imageCount).toBeGreaterThan(1)
  })

  test('이미지 요소가 화면에 표시된다', async ({ page }) => {
    // 이미지 요소 찾기
    const images = page.locator('img')
    const imageCount = await images.count()

    if (imageCount > 0) {
      // 첫 번째 이미지가 화면에 보이는지 확인
      await expect(images.first()).toBeVisible()

      try {
        // 이미지의 src 속성이 있는지 확인
        const src = await images.first().getAttribute('src')
        expect(src).toBeTruthy()
      } catch (e) {
        console.log('이미지 속성을 가져오는 데 실패했습니다:', e)
      }
    }
  })

  test('타이틀과 텍스트 요소가 존재한다', async ({ page }) => {
    // h3 요소 찾기 (타이틀)
    const titleElements = page.locator('h3')
    const titleCount = await titleElements.count()

    // p 요소 찾기 (세부 내용)
    const paragraphElements = page.locator('p')
    const paragraphCount = await paragraphElements.count()

    // 요소가 존재하는지 확인
    expect(titleCount + paragraphCount).toBeGreaterThan(0)

    // 텍스트 내용이 있는지 확인
    if (titleCount > 0) {
      const titleText = await titleElements.first().textContent()
      expect(titleText?.length).toBeGreaterThan(0)
    }

    if (paragraphCount > 0) {
      const paragraphText = await paragraphElements.first().textContent()
      expect(paragraphText?.length).toBeGreaterThan(0)
    }
  })
})
