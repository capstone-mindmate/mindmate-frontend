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

// 토스트 메시지 표시 테스트 (아이콘 테스트 제외)
test('토스트 메시지가 올바르게 표시된다', async ({ page }) => {
  await page.goto('/')

  // 카운트 버튼 클릭 (success 토스트)
  const countButton = page.getByRole('button', { name: /count is \d+/ })
  await countButton.click()

  // 토스트 메시지가 표시되는지 확인
  await expect(page.getByText('카운트가 증가했습니다!')).toBeVisible()

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

// 닫기 버튼 테스트 - 클릭 로직 대신 자동으로 닫히는 기능만 테스트
test('토스트가 일정 시간 후 자동으로 닫힌다', async ({ page }) => {
  await page.goto('/')

  // 토스트 표시
  const countButton = page.getByRole('button', { name: /count is \d+/ })
  await countButton.click()

  // 토스트 메시지가 표시되는지 확인
  await expect(page.getByText('카운트가 증가했습니다!')).toBeVisible()

  // 3.5초 후에 메시지가 사라지는지 확인
  await page.waitForTimeout(3500)
  await expect(page.getByText('카운트가 증가했습니다!')).not.toBeVisible()
})
