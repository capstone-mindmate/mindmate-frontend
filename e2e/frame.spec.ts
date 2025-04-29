import { test, expect } from '@playwright/test'

test.describe('Frame 컴포넌트', () => {
  test.beforeEach(async ({ page }) => {
    // 애플리케이션의 메인 페이지로 이동
    await page.goto('/')

    // 페이지가 완전히 로드될 때까지 기다림
    await page.waitForLoadState('networkidle')
  })

  test('첫 번째 프레임이 올바르게 렌더링된다', async ({ page }) => {
    // 첫 번째 프레임 컴포넌트 컨테이너를 찾기 위해 제목으로 역추적
    const frameTitle = page.getByRole('heading', {
      name: '친구 사이에도 거리두기가 필요해',
    })
    await expect(frameTitle).toBeVisible()

    // 이미지를 이름 속성으로 찾음
    const image = page.getByRole('img', {
      name: '친구 사이에도 거리두기가 필요해',
    })
    await expect(image).toBeVisible()

    // 세부 내용 확인
    const detail = page.getByText('인간관계 때문에 고민중이라면 필독 👀', {
      exact: true,
    })
    await expect(detail).toBeVisible()

    // 페이지 인디케이터 확인 (정확한 텍스트로 선택)
    const pageIndicator = page.getByText('2 / 25 >', { exact: true })
    await expect(pageIndicator).toBeVisible()
  })

  test('클릭 이벤트가 토스트 메시지를 표시한다', async ({ page }) => {
    // 첫 번째 프레임 컨테이너를 찾기 위해 제목으로 역추적하여 클릭
    const frameTitle = page.getByRole('heading', {
      name: '친구 사이에도 거리두기가 필요해',
    })

    // 프레임의 부모 컨테이너를 찾아 클릭 (클릭 이벤트가 컨테이너에 연결되어 있음)
    const frameContainer = frameTitle.locator('xpath=./../../..')
    await frameContainer.click()

    // 토스트 메시지가 표시되는지 확인
    const toastMessage = page.getByText('프레임이 클릭되었습니다', {
      exact: true,
    })
    await expect(toastMessage).toBeVisible()
  })

  test('모든 프레임이 올바르게 표시된다', async ({ page }) => {
    // 모든 제목 확인
    await expect(
      page.getByRole('heading', { name: '친구 사이에도 거리두기가 필요해' })
    ).toBeVisible()
    await expect(
      page.getByRole('heading', { name: '익명 대화 뜻밖의 현실조언' })
    ).toBeVisible()
    await expect(
      page.getByRole('heading', { name: '작심삼일도 10번 하면 한달이다' })
    ).toBeVisible()

    // 모든 세부 내용 확인
    await expect(
      page.getByText('인간관계 때문에 고민중이라면 필독 👀', { exact: true })
    ).toBeVisible()
    await expect(
      page.getByText(
        '아무 이해관계 없는 사람이라 더 객관적인 조언들이 필요하다.',
        { exact: true }
      )
    ).toBeVisible()
    await expect(
      page.getByText('작심삼일하던 사람이 1등한 비법', { exact: true })
    ).toBeVisible()

    // 모든 페이지 인디케이터 확인
    await expect(page.getByText('2 / 25 >', { exact: true })).toBeVisible()
    await expect(page.getByText('25 / 25 >', { exact: true })).toBeVisible()
    await expect(page.getByText('3 / 25 >', { exact: true })).toBeVisible()
  })

  test('이미지가 올바른 src 속성을 가진다', async ({ page }) => {
    // 각 이미지의 src 속성 확인
    const firstImage = page.getByRole('img', {
      name: '친구 사이에도 거리두기가 필요해',
    })
    await expect(firstImage).toHaveAttribute('src', /image\.png$/)

    const secondImage = page.getByRole('img', {
      name: '익명 대화 뜻밖의 현실조언',
    })
    await expect(secondImage).toHaveAttribute('src', /image copy\.png$/)

    const thirdImage = page.getByRole('img', {
      name: '작심삼일도 10번 하면 한달이다',
    })
    await expect(thirdImage).toHaveAttribute('src', /image copy 2\.png$/)
  })

  test('제목 텍스트 스타일이 올바르게 적용된다', async ({ page }) => {
    // 첫 번째 제목 찾기
    const title = page.getByRole('heading', {
      name: '친구 사이에도 거리두기가 필요해',
    })

    // 제목에 CSS 클래스가 적용되었는지 확인
    await expect(title).toHaveClass(/css/)

    // 컴퓨티드 스타일 속성을 개별적으로 확인
    const fontWeight = await title.evaluate(
      (el) => window.getComputedStyle(el).fontWeight
    )
    expect(fontWeight).toBe('700')

    const overflow = await title.evaluate(
      (el) => window.getComputedStyle(el).overflow
    )
    expect(overflow).toBe('hidden')

    // 제목 텍스트가 올바른지 확인
    await expect(title).toHaveText('친구 사이에도 거리두기가 필요해')
  })

  test('세부 내용 텍스트 스타일이 올바르게 적용된다', async ({ page }) => {
    // 첫 번째 세부 내용 찾기
    const detail = page.getByText('인간관계 때문에 고민중이라면 필독 👀', {
      exact: true,
    })

    // 세부 내용에 CSS 클래스가 적용되었는지 확인
    await expect(detail).toHaveClass(/css/)

    // 개별적으로 스타일 속성 확인
    const overflow = await detail.evaluate(
      (el) => window.getComputedStyle(el).overflow
    )
    expect(overflow).toBe('hidden')

    const textOverflow = await detail.evaluate(
      (el) => window.getComputedStyle(el).textOverflow
    )
    expect(textOverflow).toBe('ellipsis')

    // 내용이 올바른지 확인
    await expect(detail).toHaveText('인간관계 때문에 고민중이라면 필독 👀')
  })

  test('페이지 인디케이터 스타일이 올바르게 적용된다', async ({ page }) => {
    // 첫 번째 페이지 인디케이터 찾기
    const pageIndicator = page.getByText('2 / 25 >', { exact: true })

    // 페이지 인디케이터에 CSS 클래스가 적용되었는지 확인
    await expect(pageIndicator).toHaveClass(/css/)

    // 텍스트 내용이 올바른지 확인
    await expect(pageIndicator).toHaveText('2 / 25 >')

    // 위치 속성 확인
    const position = await pageIndicator.evaluate(
      (el) => window.getComputedStyle(el).position
    )
    expect(position).toBe('absolute')

    // 배경색이 있는지 확인 (정확한 값 대신 존재 여부만 확인)
    const backgroundColor = await pageIndicator.evaluate(
      (el) => window.getComputedStyle(el).backgroundColor
    )
    expect(backgroundColor).toBeTruthy()
  })
})
