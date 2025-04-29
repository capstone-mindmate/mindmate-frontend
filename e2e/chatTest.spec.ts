import { test, expect } from '@playwright/test'

test.describe('ChatTest 컴포넌트와 EmoticonPicker', () => {
  test.beforeEach(async ({ page }) => {
    // 애플리케이션의 채팅 테스트 페이지로 이동
    await page.goto('/chat-test')
    await page.waitForLoadState('networkidle')
  })

  test('채팅 UI 기본 요소가 올바르게 렌더링된다', async ({ page }) => {
    // TopBar 확인
    const topBar = page
      .locator('div')
      .filter({ hasText: '채팅 테스트' })
      .first()
    await expect(topBar).toBeVisible()

    // 뒤로가기 버튼 확인
    const backButton = page.locator('button').first()
    await expect(backButton).toBeVisible()

    // 초기 메시지 확인
    const initialMessage = page.getByText('안녕하세요! 어떤 고민이 있으신가요?')
    await expect(initialMessage).toBeVisible()

    // 채팅 입력창 확인
    const chatInput = page.getByPlaceholder('메시지를 입력하세요')
    await expect(chatInput).toBeVisible()
  })

  test('메시지를 입력하고 전송할 수 있다', async ({ page }) => {
    // 채팅 입력창 찾기
    const chatInput = page.getByPlaceholder('메시지를 입력하세요')
    await expect(chatInput).toBeVisible()

    // 메시지 입력
    const testMessage = '안녕하세요, 테스트 메시지입니다!'
    await chatInput.fill(testMessage)
    await chatInput.press('Enter')

    // 전송된 메시지가 화면에 표시되는지 확인
    const sentMessage = page.getByText(testMessage)
    await expect(sentMessage).toBeVisible()

    // 메시지의 시간 정보가 표시되는지 확인
    const timePattern = /오(전|후) \d{1,2}:\d{2}/
    const timeInfo = page.getByText(timePattern).last()
    await expect(timeInfo).toBeVisible()
  })

  test('연속적인 메시지를 보낼 수 있다', async ({ page }) => {
    // 채팅 입력창 찾기
    const chatInput = page.getByPlaceholder('메시지를 입력하세요')

    // 첫 번째 메시지 입력 및 전송
    await chatInput.fill('첫 번째 테스트 메시지')
    await chatInput.press('Enter')

    // 두 번째 메시지 입력 및 전송
    await chatInput.fill('두 번째 테스트 메시지')
    await chatInput.press('Enter')

    // 두 메시지가 모두 표시되는지 확인
    const firstMessage = page.getByText('첫 번째 테스트 메시지')
    const secondMessage = page.getByText('두 번째 테스트 메시지')
    await expect(firstMessage).toBeVisible()
    await expect(secondMessage).toBeVisible()
  })

  test('뒤로가기 버튼이 클릭되면 토스트 메시지가 표시된다', async ({
    page,
  }) => {
    // 뒤로가기 버튼 찾아서 클릭
    const backButton = page.locator('button').first()
    await backButton.click()

    // 토스트 메시지 확인
    const toastMessage = page.getByText('뒤로가기 버튼이 클릭되었습니다')
    await expect(toastMessage).toBeVisible()
  })

  test('채팅 말풍선에 프로필 이미지가 표시된다', async ({ page }) => {
    // 상대방 메시지의 프로필 이미지 확인
    const profileImage = page.locator('img[alt="프로필"]').first()
    await expect(profileImage).toBeVisible()

    // 내 메시지 생성
    const chatInput = page.getByPlaceholder('메시지를 입력하세요')
    await chatInput.fill('내 메시지 테스트')
    await chatInput.press('Enter')

    // 내 메시지 확인
    const myMessage = page.getByText('내 메시지 테스트')
    await expect(myMessage).toBeVisible()

    // 참고: 실제 구현에서는 내 메시지에도 프로필 이미지가 있을 수 있음
    // 이 테스트는 단순히 메시지가 표시되는지만 확인
  })

  // 모바일 화면 테스트
  test('모바일 화면에서도 UI가 올바르게 표시된다', async ({ page }) => {
    // 모바일 뷰포트 설정
    await page.setViewportSize({ width: 375, height: 667 })

    // 주요 UI 요소들이 모바일 환경에서도 표시되는지 확인
    const topBar = page
      .locator('div')
      .filter({ hasText: '채팅 테스트' })
      .first()
    await expect(topBar).toBeVisible()

    const chatInput = page.getByPlaceholder('메시지를 입력하세요')
    await expect(chatInput).toBeVisible()

    // 메시지 전송 테스트
    await chatInput.fill('모바일 테스트 메시지')
    await chatInput.press('Enter')

    const sentMessage = page.getByText('모바일 테스트 메시지')
    await expect(sentMessage).toBeVisible()
  })
})
