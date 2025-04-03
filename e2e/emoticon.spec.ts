import { test, expect } from '@playwright/test'

test.describe('이모티콘 컴포넌트', () => {
  test.beforeEach(async ({ page }) => {
    // 애플리케이션의 메인 페이지로 이동
    await page.goto('/')

    // 페이지가 완전히 로드될 때까지 기다림
    await page.waitForLoadState('networkidle')

    // 상단으로 스크롤
    await page.evaluate(() => {
      window.scrollTo(0, 0)
    })

    // 이모티콘 테스트 섹션 헤더 확인
    await page.waitForSelector('h2:has-text("이모티콘 테스트")')
  })

  test('이모티콘 이미지가 그리드에 표시된다', async ({ page }) => {
    // 이모티콘 테스트 섹션 찾기
    const emoticonTestSection = page
      .locator('h2:has-text("이모티콘 테스트")')
      .locator('..')
      .locator('..')

    // 이모티콘 이미지들이 표시되는지 확인
    const emoticons = emoticonTestSection.locator('img')

    // 최소 10개 이상의 이모티콘이 있는지 확인
    const count = await emoticons.count()
    expect(count).toBeGreaterThanOrEqual(10)

    // 첫 번째 이모티콘이 보이는지 확인
    await expect(emoticons.first()).toBeVisible()
  })

  test('채팅 버블에 이모티콘이 표시된다', async ({ page }) => {
    // "이모티콘을 보내드릴게요!" 메시지를 포함하는 버블 컨테이너 찾기
    const messageText = page.getByText('이모티콘을 보내드릴게요!')
    await expect(messageText).toBeVisible()

    // 메시지 다음에 나오는 버블에서 이모티콘 이미지 찾기
    // 화면에서 이모티콘을 포함하는 요소를 특정하기 위한 보다 일반적인 선택자 사용
    const emoticonImages = page.locator('img[alt*="이모티콘"]')

    // 최소 하나 이상의 이모티콘 이미지가 있는지 확인
    expect(await emoticonImages.count()).toBeGreaterThan(0)

    // 첫 번째 이모티콘 이미지가 보이는지 확인
    await expect(emoticonImages.first()).toBeVisible()
  })

  test('메시지 버블이 적절한 간격으로 표시된다', async ({ page }) => {
    // "감사합니다!" 메시지를 포함하는 버블 찾기
    const thanksMessage = page.getByText('감사합니다!')
    await expect(thanksMessage).toBeVisible()

    // 버블이 화면에 표시되는 위치 확인
    const boundingBox = await thanksMessage.boundingBox()
    expect(boundingBox).not.toBeNull()

    // 위치가 화면 내에 있는지 확인
    if (boundingBox) {
      expect(boundingBox.x).toBeGreaterThan(0)
      expect(boundingBox.y).toBeGreaterThan(0)
      expect(boundingBox.width).toBeGreaterThan(0)
      expect(boundingBox.height).toBeGreaterThan(0)
    }
  })
})
