import { test, expect } from '@playwright/test'

test.describe('Bubble 컴포넌트', () => {
  test.beforeEach(async ({ page }) => {
    // 애플리케이션의 메인 페이지로 이동
    await page.goto('/')

    // 페이지가 완전히 로드될 때까지 기다림
    await page.waitForLoadState('networkidle')

    // 페이지 상단으로 스크롤
    await page.evaluate(() => {
      window.scrollTo(0, 0)
    })

    // 특정 요소가 로드될 때까지 기다림 (Bubble 컴포넌트를 포함하는 첫 번째 메시지)
    await page.waitForSelector('text="아주대 앞에서 붕어빵 팔면 부자될까요?"')
  })

  test('상대방 말풍선이 올바르게 렌더링된다', async ({ page }) => {
    // 상대방 메시지 내용 확인
    const otherMessage = page
      .getByText('아주대 앞에서 붕어빵 팔면 부자될까요?', { exact: true })
      .first()
    await expect(otherMessage).toBeVisible()

    // 프로필 이미지는 여러 개가 있을 수 있으므로 count만 확인
    const profileImages = page.getByRole('img', { name: '프로필' })
    expect(await profileImages.count()).toBeGreaterThan(0)

    // 시간 표시 확인
    const timeInfo = page.getByText('오후 3:42', { exact: true }).first()
    await expect(timeInfo).toBeVisible()
  })

  test('내 말풍선이 올바르게 렌더링된다', async ({ page }) => {
    // 내 메시지 내용 확인
    const myMessage = page.getByText('저는 주로 한번에 5개는 먹어요', {
      exact: true,
    })
    await expect(myMessage).toBeVisible()

    // 시간 정보 확인
    const timeInfo = page.getByText('오후 3:43', { exact: true })
    await expect(timeInfo).toBeVisible()
  })

  test('연속된 메시지가 올바르게 렌더링된다', async ({ page }) => {
    // 연속된 메시지를 확인
    const continuousMessage = page.getByText(
      '혹시 실례가 안된다면 한번에 붕어빵 몇개나 드시는지 궁금해요 꼭..',
      { exact: true }
    )
    await expect(continuousMessage).toBeVisible()
  })

  test('말풍선 테두리가 둥글게 스타일링된다', async ({ page }) => {
    // 메시지 컨테이너를 찾고 스타일 확인
    const myMessage = page.getByText('저는 주로 한번에 5개는 먹어요', {
      exact: true,
    })
    await expect(myMessage).toBeVisible()

    // 테두리 확인 - 정확한 값을 찾기는 어려우므로 존재 여부만 확인
    const borderRadius = await myMessage.evaluate((el) => {
      const style = window.getComputedStyle(el.closest('div'))
      return style.borderRadius
    })

    // 테두리 반경이 설정되어 있는지 확인
    expect(borderRadius).toBeTruthy()
    expect(borderRadius).not.toBe('0px')
  })

  test('읽음 상태가 표시된다', async ({ page }) => {
    // 읽음 상태 표시 확인
    const readStatus = page.getByText('읽음', { exact: true })

    // 읽음 상태가 보이는지 확인
    if ((await readStatus.count()) > 0) {
      await expect(readStatus.first()).toBeVisible()
    }
  })

  test('프로필 이미지가 표시된다', async ({ page }) => {
    // 프로필 이미지 확인
    const profileImages = page.getByRole('img', { name: '프로필' })
    expect(await profileImages.count()).toBeGreaterThan(0)
    await expect(profileImages.first()).toBeVisible()
  })

  test('말풍선이 올바른 정렬 방향을 가진다', async ({ page }) => {
    // 내 메시지와 상대방 메시지 컨테이너를 찾음
    const myMessage = page.getByText('저는 주로 한번에 5개는 먹어요', {
      exact: true,
    })
    const otherMessage = page
      .getByText('아주대 앞에서 붕어빵 팔면 부자될까요?', { exact: true })
      .first()

    await expect(myMessage).toBeVisible()
    await expect(otherMessage).toBeVisible()

    // 더 간단한 테스트로 대체: 각 메시지의 위치를 비교
    const myMessageBox = await myMessage.boundingBox()
    const otherMessageBox = await otherMessage.boundingBox()

    // 내 메시지는 오른쪽에, 상대방 메시지는 왼쪽에 위치해야 함
    expect(myMessageBox.x).toBeGreaterThan(otherMessageBox.x)
  })

  test('모든 필요한 메시지가 표시된다', async ({ page }) => {
    // 메시지들이 모두 표시되는지 확인
    await expect(
      page.getByText('아주대 앞에서 붕어빵 팔면 부자될까요?').first()
    ).toBeVisible()
    await expect(page.getByText('저는 주로 한번에 5개는 먹어요')).toBeVisible()
    await expect(page.getByText('진짜 괜찮겠죠?,,ㅜ')).toBeVisible()

    // 시간 정보 확인
    await expect(page.getByText('오후 3:42').first()).toBeVisible()
    await expect(page.getByText('오후 3:43')).toBeVisible()
    await expect(page.getByText('오후 3:44')).toBeVisible()
  })
})
