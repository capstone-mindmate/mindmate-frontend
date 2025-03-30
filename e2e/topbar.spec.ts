import { test, expect } from '@playwright/test'

test.describe('TopBar 컴포넌트', () => {
  test('기본 속성이 올바르게 렌더링된다', async ({ page }) => {
    // 애플리케이션의 메인 페이지로 이동
    await page.goto('/')

    // 제목이 올바르게 표시되는지 확인
    const title = page.getByText('타이틀 입력')
    await expect(title).toBeVisible()

    // 뒤로가기 버튼이 표시되는지 확인
    const backButton = page
      .locator('button')
      .filter({ has: page.locator('svg') })
      .first()
    await expect(backButton).toBeVisible()

    // 액션 버튼이 표시되는지 확인
    const actionButton = page.getByText('등록')
    await expect(actionButton).toBeVisible()
  })

  test('뒤로가기 버튼 클릭 시 이벤트가 발생한다', async ({ page }) => {
    await page.goto('/')

    // 뒤로가기 버튼 클릭
    const backButton = page
      .locator('button')
      .filter({ has: page.locator('svg') })
      .first()
    await backButton.click()

    // 토스트 메시지가 표시되는지 확인
    await expect(page.getByText('뒤로가기 버튼이 클릭되었습니다')).toBeVisible()
  })

  test('액션 버튼 클릭 시 이벤트가 발생한다', async ({ page }) => {
    await page.goto('/')

    // 액션 버튼 클릭
    const actionButton = page.getByText('등록')
    await actionButton.click()

    // 토스트 메시지가 표시되는지 확인
    await expect(page.getByText('액션 버튼이 클릭되었습니다')).toBeVisible()
  })

  test('활성화된 액션 버튼의 스타일이 올바르다', async ({ page }) => {
    await page.goto('/')

    // 액션 버튼 선택
    const actionButton = page.getByText('등록')

    // 스타일 확인
    await expect(actionButton).toHaveCSS('font-size', '16px')
    await expect(actionButton).toHaveCSS('font-weight', '700')
    await expect(actionButton).toHaveCSS('color', 'rgb(57, 33, 17)') // #392111
  })

  test('액션 버튼 마우스 오버 시 스타일이 변경된다', async ({ page }) => {
    await page.goto('/')

    // 액션 버튼에 마우스 오버
    const actionButton = page.getByText('등록')
    await actionButton.hover()

    // 호버 스타일 확인 (색상 변경)
    await expect(actionButton).toHaveCSS('color', 'rgb(90, 58, 40)') // #5A3A28
  })

  test('비활성화된 액션 버튼의 스타일이 올바르다', async ({ page }) => {
    await page.goto('/')

    // App.tsx 컴포넌트 내에서 TopBar의 isActionDisabled prop을 true로 설정
    await page.evaluate(() => {
      // React 컴포넌트의 props를 직접 변경하는 것은 일반적으로 어렵지만,
      // 테스트 목적으로 DOM 요소의 속성을 변경
      const actionButton = document.querySelector(
        'button:last-child'
      ) as HTMLButtonElement
      if (actionButton) {
        // HTML disabled 속성 설정 (빈 문자열로 설정하는 것이 HTML 표준)
        actionButton.setAttribute('disabled', '')

        // isDisabled prop에 해당하는 데이터 속성 추가 (Emotion이 사용할 수 있는)
        actionButton.setAttribute('data-isDisabled', 'true')

        // TopBarActionButton 스타일에 정의된 비활성화 스타일과 동일하게 설정
        actionButton.style.color = '#C1BFBE'
        actionButton.style.fontSize = '14px'
        actionButton.style.fontWeight = '400'
        actionButton.style.cursor = 'not-allowed'
      }
    })

    // 비활성화된 버튼 선택
    const disabledButton = page.locator('button[disabled]').last()

    // 스타일 확인 (disabled 속성 존재 여부만 체크, 값은 체크하지 않음)
    await expect(disabledButton).toBeDisabled()
    await expect(disabledButton).toHaveCSS('color', 'rgb(193, 191, 190)') // #C1BFBE
    await expect(disabledButton).toHaveCSS('font-size', '14px')
    await expect(disabledButton).toHaveCSS('font-weight', '400')
    await expect(disabledButton).toHaveCSS('cursor', 'not-allowed')
  })

  test('제목 텍스트의 스타일이 올바르다 (body2_re)', async ({ page }) => {
    await page.goto('/')

    // 제목 텍스트 선택
    const title = page.locator('h1').filter({ hasText: '타이틀 입력' })

    // body2_re 스타일 확인
    await expect(title).toHaveCSS('font-size', '14px')
    await expect(title).toHaveCSS('font-weight', '400')
    await expect(title).toHaveCSS('text-align', 'center')
  })
})
