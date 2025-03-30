import { test, expect } from '@playwright/test'

// App.tsx에 있는 카운트 버튼을 사용하여 다양한 토스트 타입 테스트
test('카운트 버튼 클릭 시 다양한 타입의 토스트가 표시된다', async ({
  page,
}) => {
  // 애플리케이션의 메인 페이지로 이동
  await page.goto('/')

  // 성공 토스트 (count % 4 === 0)
  const countButton = page.getByRole('button', { name: /count is \d+/ })
  await countButton.click()

  // 토스트가 표시되는지 확인
  await expect(page.getByText('카운트가 증가했습니다!')).toBeVisible()

  // 자동으로 닫히는지 확인 (기본 3초 + 애니메이션 시간)
  await page.waitForTimeout(3500)
  await expect(page.getByText('카운트가 증가했습니다!')).not.toBeVisible()

  // 정보 토스트 (count % 4 === 1)
  await countButton.click()
  await expect(page.getByText('아주대학교 이메일을 입력해주세요')).toBeVisible()
  await page.waitForTimeout(3500)

  // 경고 토스트 (count % 4 === 2)
  await countButton.click()
  await expect(page.getByText('네트워크 연결을 확인해주세요')).toBeVisible()
  await page.waitForTimeout(3500)

  // 에러 토스트 (count % 4 === 3)
  await countButton.click()
  await expect(page.getByText('전송에 실패했습니다')).toBeVisible()
  await page.waitForTimeout(3500)
})

// 토스트 메시지가 올바르게 표시되는지 테스트
test('토스트 메시지와 아이콘이 올바르게 표시된다', async ({ page }) => {
  await page.goto('/')

  // 카운트 버튼 클릭 (success 토스트)
  const countButton = page.getByRole('button', { name: /count is \d+/ })
  await countButton.click()

  // 토스트 메시지가 표시되는지 확인
  await expect(page.getByText('카운트가 증가했습니다!')).toBeVisible()

  // 아이콘이 표시되는지 확인
  await expect(page.locator('img[alt="success icon"]')).toBeVisible()

  // 다음 토스트로 넘어가기 전에 충분한 시간 기다림
  await page.waitForTimeout(3500)
})

// 여러 토스트가 연속으로 표시될 때 하나만 표시되는지 테스트
test('새 토스트가 표시되면 기존 토스트가 대체된다', async ({ page }) => {
  await page.goto('/')

  // 첫 번째 토스트 (success)
  const countButton = page.getByRole('button', { name: /count is \d+/ })
  await countButton.click()
  await expect(page.getByText('카운트가 증가했습니다!')).toBeVisible()

  // 바로 두 번째 토스트 표시 (info)
  await countButton.click()

  // 첫 번째 토스트는 사라지고 두 번째 토스트만 표시되어야 함
  await expect(page.getByText('카운트가 증가했습니다!')).not.toBeVisible()
  await expect(page.getByText('아주대학교 이메일을 입력해주세요')).toBeVisible()
})

// 닫기 버튼 테스트
test('닫기 버튼을 클릭하면 토스트가 닫힌다', async ({ page }) => {
  await page.goto('/')

  // 토스트 표시
  const countButton = page.getByRole('button', { name: /count is \d+/ })
  await countButton.click()
  await expect(page.getByText('카운트가 증가했습니다!')).toBeVisible()

  // 닫기 버튼 찾아서 클릭
  const closeButton = page.locator('button').filter({ hasText: '×' })
  await closeButton.click()

  // 애니메이션 시간을 고려하여 약간의 시간 대기
  await page.waitForTimeout(500)

  // 토스트가 사라졌는지 확인
  await expect(page.getByText('카운트가 증가했습니다!')).not.toBeVisible()
})
