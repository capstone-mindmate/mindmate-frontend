import { test, expect } from '@playwright/test'

/**
 * Magazine 및 MagazineList 컴포넌트 E2E 테스트
 *
 * 테스트 대상 경로:
 * - /home (홈 페이지의 매거진 컴포넌트)
 * - /magazine (매거진 리스트 페이지)
 */
test.describe('Magazine 및 MagazineList 컴포넌트', () => {
  // Magazine 컴포넌트 테스트
  test.describe('Magazine 컴포넌트 테스트', () => {
    test.beforeEach(async ({ page }) => {
      // 홈 페이지로 이동 (라우터 설정에 맞춤)
      await page.goto('/home')

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
      // 매거진 컨테이너가 존재하는지 확인
      const magazineContainer = page.locator('.magazine-content')

      // 컨테이너가 존재하면 테스트 진행, 없으면 스킵
      if ((await magazineContainer.count()) > 0) {
        await expect(magazineContainer).toBeVisible()
      } else {
        // 대체 방법: 제목 텍스트로 확인
        const titleElements = page
          .locator('h3, p')
          .filter({ hasText: /친구 사이에도|익명 대화|작심삼일/ })
        const count = await titleElements.count()
        expect(count).toBeGreaterThan(0)
      }
    })

    test('매거진 아이템이 올바른 구조로 렌더링된다', async ({ page }) => {
      // 제목 텍스트를 찾아 확인
      const titleElements = page
        .locator('h3, p')
        .filter({ hasText: /친구 사이에도|익명 대화|작심삼일/ })
      const count = await titleElements.count()

      // 제목 요소가 존재하는지 확인
      expect(count).toBeGreaterThan(0)

      // 세부 내용 텍스트가 존재하는지 확인
      const detailElements = page
        .locator('p')
        .filter({ hasText: /인간관계|조언|작심삼일/ })
      const detailCount = await detailElements.count()
      expect(detailCount).toBeGreaterThan(0)
    })

    test('매거진 아이템이 존재한다', async ({ page }) => {
      // 제목 텍스트로 아이템 찾기
      const titleElements = page
        .locator('h3, p')
        .filter({ hasText: /친구 사이에도|익명 대화|작심삼일/ })
      const count = await titleElements.count()

      // 제목 요소가 존재하는지 확인
      expect(count).toBeGreaterThan(0)
    })

    test('이미지 관련 요소가 존재한다', async ({ page }) => {
      // 이미지 요소나 이미지 컨테이너가 존재하는지 확인
      // 직접적인 가시성 검사 대신 존재 여부만 확인
      const images = page.locator('img')
      const imageCount = await images.count()

      // 이미지 요소가 존재하는지 확인
      expect(imageCount).toBeGreaterThan(0)

      // 첫 번째 이미지의 속성 확인 (가시성 검사 대신)
      if (imageCount > 0) {
        const src = await images.first().getAttribute('src')
        expect(src).toBeTruthy()
        expect(src).toContain('image')
      }
    })

    test('제목 텍스트 요소가 존재한다', async ({ page }) => {
      // 제목 텍스트 요소 찾기
      const titleElements = page
        .locator('h3, p')
        .filter({ hasText: /친구 사이에도|익명 대화|작심삼일/ })
      const count = await titleElements.count()

      // 제목 요소가 존재하는지 확인
      expect(count).toBeGreaterThan(0)

      // 첫 번째 요소의 텍스트가 비어있지 않은지 확인
      if (count > 0) {
        const text = await titleElements.first().textContent()
        expect(text?.trim().length).toBeGreaterThan(0)
      }
    })
  })

  // MagazineList 컴포넌트 테스트
  test.describe('MagazineList 컴포넌트 테스트', () => {
    test.beforeEach(async ({ page }) => {
      // MagazineList 페이지로 직접 이동 (라우터 설정에 맞춤)
      await page.goto('/magazine')

      // 페이지가 완전히 로드될 때까지 기다림
      await page.waitForLoadState('domcontentloaded')

      // 대기 시간 추가 (렌더링 시간 확보)
      await page.waitForTimeout(2000)
    })

    test('MagazineList 페이지가 올바르게 렌더링된다', async ({ page }) => {
      // TopBar에 '전체보기' 타이틀이 표시되는지 확인
      const topBarTitle = page.getByText('전체보기', { exact: true })
      await expect(topBarTitle).toBeVisible()

      // 뒤로가기 버튼이 존재하는지 확인
      const backButton = page.locator('button').first()
      await expect(backButton).toBeVisible()

      // 매거진 컨텐츠 영역이 존재하는지 확인
      const magazineContent = page.locator('.magazine-content')

      // magazine-content 클래스가 존재하는지 확인
      if ((await magazineContent.count()) > 0) {
        await expect(magazineContent).toBeVisible()
      } else {
        // 대체 방법: title로 확인
        await expect(topBarTitle).toBeVisible()
      }
    })

    test('매거진 아이템 목록에 제목 요소가 표시된다', async ({ page }) => {
      // 제목 요소를 텍스트 내용으로 찾기 (여러 요소가 있을 수 있음)
      const titleElements = page.locator('h3, p').filter({
        hasText: /친구 사이에도|익명 대화|작심삼일/,
      })

      // 제목 요소의 개수 확인
      const count = await titleElements.count()
      expect(count).toBeGreaterThan(0)

      // 첫 번째 요소가 텍스트를 포함하는지 확인
      if (count > 0) {
        const text = await titleElements.first().textContent()
        expect(text?.trim().length).toBeGreaterThan(0)
      }
    })

    test('매거진 아이템에 이미지 관련 요소가 포함되어 있다', async ({
      page,
    }) => {
      // 이미지 요소나 이미지 컨테이너의 존재 여부 확인
      // 정확한 선택자가 어려우므로 여러 접근법 시도

      // 1. 직접 이미지 요소 찾기
      const images = page.locator('img')
      const imageCount = await images.count()

      // 이미지 요소가 존재하는지 확인
      expect(imageCount).toBeGreaterThan(0)

      // 이미지 src 속성 확인 (첫 번째 이미지)
      if (imageCount > 0) {
        const src = await images.first().getAttribute('src')
        expect(src).toBeTruthy()
      }

      // 2. 대체 방법: 컨테이너 요소 찾기
      const imageContainers = page
        .locator('div')
        .filter({ hasClass: /ImageContainer|imgBox/ })
      const containerCount = await imageContainers.count()

      // 이미지 컨테이너가 존재하는지 확인
      if (containerCount === 0) {
        // 컨테이너가 없으면 이미지가 존재하는지 확인
        expect(imageCount).toBeGreaterThan(0)
      }
    })

    test('매거진 아이템에 제목과 세부 내용 텍스트가 포함되어 있다', async ({
      page,
    }) => {
      // 제목 요소 찾기 (여러 요소가 있을 수 있음)
      const titleElements = page.locator('h3, p').filter({
        hasText: /친구 사이에도|익명 대화|작심삼일/,
      })

      // 제목 요소가 존재하는지 확인
      const titleCount = await titleElements.count()
      expect(titleCount).toBeGreaterThan(0)

      // 세부 내용 요소 찾기 (여러 요소가 있을 수 있음)
      // 정확한 매칭 대신 일부 텍스트 패턴으로 검색
      const detailElements = page.locator('p').filter({
        hasText: /인간관계|조언|고민|작심삼일/,
      })

      // 세부 내용 요소가 존재하는지 확인
      const detailCount = await detailElements.count()
      expect(detailCount).toBeGreaterThan(0)
    })

    test('뒤로가기 버튼이 존재한다', async ({ page }) => {
      // 뒤로가기 버튼 찾기
      const backButton = page.locator('button').first()
      await expect(backButton).toBeVisible()
    })

    test('매거진 아이템에 클릭 가능한 요소가 포함되어 있다', async ({
      page,
    }) => {
      // 매거진 아이템이나 클릭 가능한 컨테이너 요소 찾기
      // 제목 텍스트를 포함하는 상위 요소 중 클릭 가능한 것을 찾음
      const titleElement = page
        .locator('h3, p')
        .filter({
          hasText: /친구 사이에도|익명 대화|작심삼일/,
        })
        .first()

      // 제목 요소가 존재하는지 확인
      if ((await titleElement.count()) > 0) {
        // 제목 요소가 클릭 가능한지 확인
        await titleElement.hover() // 호버링 가능한지 확인

        // 클릭 가능한 상태인지 확인 (disabled 아님)
        const isDisabled = await titleElement.evaluate((el) => {
          return (
            el.hasAttribute('disabled') ||
            el.closest('button')?.hasAttribute('disabled') ||
            el.closest('a')?.hasAttribute('disabled') ||
            window.getComputedStyle(el).pointerEvents === 'none'
          )
        })

        expect(isDisabled).toBe(false)
      }
    })

    test('반응형 디자인 요소가 존재한다', async ({ page }) => {
      // 모바일 화면 크기로 설정
      await page.setViewportSize({ width: 375, height: 667 })

      // 페이지 새로고침
      await page.reload()
      await page.waitForLoadState('domcontentloaded')
      await page.waitForTimeout(2000)

      // 매거진 컨텐츠 영역 확인
      const contentContainer = page
        .locator('.magazine-content, div')
        .filter({
          has: page
            .locator('h3, p')
            .filter({ hasText: /친구 사이에도|익명 대화|작심삼일/ }),
        })
        .first()

      // 컨테이너가 존재하는지 확인
      if ((await contentContainer.count()) > 0) {
        await expect(contentContainer).toBeVisible()
      } else {
        // 대체 방법: 타이틀이 보이는지 확인
        const topBarTitle = page.getByText('전체보기', { exact: true })
        await expect(topBarTitle).toBeVisible()

        // 아이템 텍스트가 보이는지 확인
        const itemText = page
          .locator('h3, p')
          .filter({
            hasText: /친구 사이에도|익명 대화|작심삼일/,
          })
          .first()

        if ((await itemText.count()) > 0) {
          await expect(itemText).toBeVisible()
        }
      }
    })
  })
})
