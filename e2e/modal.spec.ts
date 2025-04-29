import { test, expect } from '@playwright/test'

test.describe('모달 컴포넌트 E2E 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('매칭신청 모달 플로우', async ({ page }) => {
    // 매칭신청 버튼 클릭
    await page.click('[data-testid="matching-button"]')

    // 모달이 표시되는지 확인
    const modal = page.locator('[data-testid="modal-overlay"]')
    await expect(modal).toBeVisible()

    // 프로필 정보 확인
    await expect(page.getByText('건드리면 짖는댕')).toBeVisible()
    await expect(page.getByText('소프트웨어학과')).toBeVisible()
    await expect(page.getByText('03월 24일 18:52')).toBeVisible()

    // 메시지 입력
    const messageInput = page.locator('[data-testid="message-input"]')
    await messageInput.fill('테스트 메시지입니다')
    await expect(messageInput).toHaveValue('테스트 메시지입니다')

    // 매칭 신청 버튼 클릭
    await page.click('button:has-text("매칭 신청")')
    await expect(modal).not.toBeVisible()
  })

  test('매칭실패 모달 플로우', async ({ page }) => {
    // 매칭실패 모달 열기
    await page.click('[data-testid="matching-failure-button"]')

    // 실패 메시지 확인
    await expect(page.getByText('매칭에 실패했어요 🥹')).toBeVisible()
    await expect(
      page.getByText('다른 사람과 매칭을 시도해보세요!')
    ).toBeVisible()

    // BackIcon 클릭하여 상세 정보 확인
    const backIcon = page.locator('[data-testid="back-icon"]')
    await backIcon.click()

    // 상세 정보가 표시되는지 확인
    await expect(page.getByText('진로 고민 들어주세요')).toBeVisible()
    await expect(
      page.getByPlaceholderText(
        '상대방에게 전달하고 싶은 메시지를 입력해주세요'
      )
    ).toBeVisible()

    // 다시 BackIcon 클릭하여 상세 정보 숨기기
    await backIcon.click()
    await expect(page.getByText('진로 고민 들어주세요')).not.toBeVisible()
  })

  test('모달 접근성 테스트', async ({ page }) => {
    // 모달 열기
    await page.click('[data-testid="matching-button"]')

    // Tab 키로 포커스 이동
    await page.keyboard.press('Tab')

    // ESC 키로 모달 닫기
    await page.keyboard.press('Escape')
    await expect(
      page.locator('[data-testid="modal-overlay"]')
    ).not.toBeVisible()
  })

  test('모달 반응형 디자인 테스트', async ({ page }) => {
    // 모바일 뷰포트 설정
    await page.setViewportSize({ width: 375, height: 667 })

    // 모달 열기
    await page.click('[data-testid="matching-button"]')

    // 모달 컨테이너 크기 확인
    const modalContent = page.locator('[data-testid="modal-content"]')
    const boundingBox = await modalContent.boundingBox()
    expect(boundingBox?.width).toBeLessThanOrEqual(342)
  })
})
