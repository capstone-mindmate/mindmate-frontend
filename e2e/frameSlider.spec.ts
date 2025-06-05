import { test, expect } from '@playwright/test'

test.describe('FrameSlider 컴포넌트', () => {
  test.beforeEach(async ({ page }) => {
    // 애플리케이션의 홈 페이지로 이동
    await page.goto('http://lohttps://mindmate.shopcalhost:5173/home')

    // 페이지가 완전히 로드될 때까지 기다림
    await page.waitForLoadState('networkidle')

    // 페이지 상단으로 스크롤
    await page.evaluate(() => {
      window.scrollTo(0, 0)
    })

    // Frame 컴포넌트가 로드될 때까지 기다림
    await page.waitForSelector('text=친구 사이에도 거리두기가 필요해')
  })

  test('첫 번째 프레임이 올바르게 렌더링된다', async ({ page }) => {
    // 현재 활성화된 프레임 타이틀 확인
    const activeFrameTitle = page.getByText('친구 사이에도 거리두기가 필요해', {
      exact: true,
    })
    await expect(activeFrameTitle).toBeVisible()

    // 현재 활성화된 프레임 설명 확인
    const activeFrameDetail = page.getByText(
      '인간관계 때문에 고민중이라면 필독 👀',
      { exact: true }
    )
    await expect(activeFrameDetail).toBeVisible()

    // 페이지 인디케이터 확인
    const pageIndicator = page.getByText('1 / 5 >')
    await expect(pageIndicator).toBeVisible()
  })

  test('다음 프레임이 화면에 표시된다', async ({ page }) => {
    // 다음 프레임의 타이틀이 보이는지 확인
    const nextFrameTitle = page.getByText('익명 대화 뜻밖의 현실조언', {
      exact: true,
    })
    await expect(nextFrameTitle).toBeVisible()

    // 다음 프레임의 설명이 보이는지 확인
    const nextFrameDetail = page.getByText(
      '아무 이해관계 없는 사람이라 더 객관적인 조언들이 필요하다.',
      { exact: true }
    )
    await expect(nextFrameDetail).toBeVisible()
  })

  test('다음 프레임 클릭 시 해당 프레임이 활성화된다', async ({ page }) => {
    // 다음 프레임 타이틀 찾기
    const nextFrameTitle = page.getByText('익명 대화 뜻밖의 현실조언', {
      exact: true,
    })
    await expect(nextFrameTitle).toBeVisible()

    // 다음 프레임 클릭
    await nextFrameTitle.click()

    // 애니메이션 완료 대기
    await page.waitForTimeout(600)

    // 클릭한 프레임이 중앙에 위치했는지 확인 (가운데 정렬 여부 검사)
    const clickedFrameBounds = await nextFrameTitle.boundingBox()
    const pageWidth = await page.evaluate(() => window.innerWidth)

    if (clickedFrameBounds) {
      const frameCenter = clickedFrameBounds.x + clickedFrameBounds.width / 2
      const pageCenter = pageWidth / 2

      // 프레임이 페이지 중앙에 위치하는지 확인 (오차 허용)
      expect(Math.abs(frameCenter - pageCenter)).toBeLessThan(100)
    }

    // 페이지 인디케이터가 업데이트 되었는지 확인
    const pageIndicator = page.getByText('2 / 5 >')
    await expect(pageIndicator).toBeVisible()
  })

  test('자동 슬라이드 기능이 작동한다', async ({ page }) => {
    // 첫 번째 프레임 타이틀 확인
    const firstFrameTitle = page.getByText('친구 사이에도 거리두기가 필요해', {
      exact: true,
    })
    await expect(firstFrameTitle).toBeVisible()

    // 자동 슬라이드 대기 (코드에서 5초로 설정됨)
    await page.waitForTimeout(5500)

    // 두 번째 프레임이 활성화 되었는지 확인
    const secondFrameIndicator = page.getByText('2 / 5 >')
    await expect(secondFrameIndicator).toBeVisible()
  })

  test('왼쪽 스와이프 제스처 시뮬레이션', async ({ page }) => {
    // 프레임 슬라이더 컨테이너 찾기
    const frameContainer = page
      .locator('div')
      .filter({ hasText: '친구 사이에도 거리두기가 필요해' })
      .first()
    const box = await frameContainer.boundingBox()

    if (box) {
      // 오른쪽에서 왼쪽으로 스와이프 (다음 프레임으로 이동)
      await page.mouse.move(box.x + box.width * 0.8, box.y + box.height / 2)
      await page.mouse.down()
      await page.mouse.move(box.x + box.width * 0.2, box.y + box.height / 2, {
        steps: 10,
      })
      await page.mouse.up()

      // 애니메이션 완료 대기
      await page.waitForTimeout(600)

      // 다음 프레임이 활성화 되었는지 확인
      const nextFrameIndicator = page.getByText('2 / 5 >')
      await expect(nextFrameIndicator).toBeVisible()
    }
  })

  test('오른쪽 스와이프 제스처 시뮬레이션', async ({ page }) => {
    // 먼저 첫 번째 프레임에서 다음 프레임으로 이동
    const frameContainer = page
      .locator('div')
      .filter({ hasText: '친구 사이에도 거리두기가 필요해' })
      .first()
    const box = await frameContainer.boundingBox()

    if (box) {
      // 오른쪽에서 왼쪽으로 스와이프 (다음 프레임으로 이동)
      await page.mouse.move(box.x + box.width * 0.8, box.y + box.height / 2)
      await page.mouse.down()
      await page.mouse.move(box.x + box.width * 0.2, box.y + box.height / 2, {
        steps: 10,
      })
      await page.mouse.up()

      // 애니메이션 완료 대기
      await page.waitForTimeout(600)

      // 다음 프레임이 활성화 되었는지 확인
      const nextFrameIndicator = page.getByText('2 / 5 >')
      await expect(nextFrameIndicator).toBeVisible()

      // 이제 왼쪽에서 오른쪽으로 스와이프 (이전 프레임으로 이동)
      const updatedFrameContainer = page
        .locator('div')
        .filter({ hasText: '익명 대화 뜻밖의 현실조언' })
        .first()
      const updatedBox = await updatedFrameContainer.boundingBox()

      if (updatedBox) {
        await page.mouse.move(
          updatedBox.x + updatedBox.width * 0.2,
          updatedBox.y + updatedBox.height / 2
        )
        await page.mouse.down()
        await page.mouse.move(
          updatedBox.x + updatedBox.width * 0.8,
          updatedBox.y + updatedBox.height / 2,
          { steps: 10 }
        )
        await page.mouse.up()

        // 애니메이션 완료 대기
        await page.waitForTimeout(600)

        // 이전 프레임이 활성화 되었는지 확인
        const prevFrameIndicator = page.getByText('1 / 5 >')
        await expect(prevFrameIndicator).toBeVisible()
      }
    }
  })

  test('중앙 프레임 클릭 시 이벤트가 발생한다', async ({ page }) => {
    // 콘솔 이벤트 캡처 설정
    const consoleMessages: string[] = []
    page.on('console', (msg) => {
      consoleMessages.push(msg.text())
    })

    // 중앙 프레임 클릭
    const activeFrameTitle = page.getByText('친구 사이에도 거리두기가 필요해', {
      exact: true,
    })
    await activeFrameTitle.click()

    // 애니메이션 및 이벤트 처리 대기
    await page.waitForTimeout(100)

    // 콘솔 메시지에 이벤트 처리 메시지가 포함되어 있는지 확인
    const hasClickEvent = consoleMessages.some(
      (msg) => msg.includes('Frame') && msg.includes('clicked')
    )
    expect(hasClickEvent).toBeTruthy()
  })

  test('화면 호버 시 자동 슬라이드가 일시정지된다', async ({ page }) => {
    // 프레임 슬라이더 컨테이너 찾기
    const frameContainer = page
      .locator('div')
      .filter({ hasText: '친구 사이에도 거리두기가 필요해' })
      .first()

    // 마우스 호버
    await frameContainer.hover()

    // 일시정지된 상태에서는 자동 슬라이드가 발생하지 않아야 함
    await page.waitForTimeout(5500)

    // 첫 번째 프레임이 여전히 활성화되어 있는지 확인
    const firstFrameIndicator = page.getByText('1 / 5 >')
    await expect(firstFrameIndicator).toBeVisible()
  })

  test('모든 프레임이 정상적으로 표시된다', async ({ page }) => {
    // 모든 프레임 타이틀이 보이는지 확인
    const titles = [
      '친구 사이에도 거리두기가 필요해',
      '익명 대화 뜻밖의 현실조언',
      '작심삼일도 10번 하면 한달이다',
    ]

    for (const title of titles) {
      const titleElement = page.getByText(title, { exact: true })
      await expect(titleElement).toBeVisible()
    }
  })

  test('모바일 화면에서도 프레임 슬라이더가 올바르게 표시된다', async ({
    page,
  }) => {
    // 모바일 뷰포트 설정
    await page.setViewportSize({ width: 375, height: 667 })
    await page.reload()
    await page.waitForLoadState('networkidle')

    // 첫 번째 프레임 타이틀 확인
    const firstFrameTitle = page.getByText('친구 사이에도 거리두기가 필요해', {
      exact: true,
    })
    await expect(firstFrameTitle).toBeVisible()

    // 페이지 인디케이터 확인
    const pageIndicator = page.getByText('1 / 5 >')
    await expect(pageIndicator).toBeVisible()
  })
})
