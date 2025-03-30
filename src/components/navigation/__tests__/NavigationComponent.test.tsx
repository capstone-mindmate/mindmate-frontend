import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { vi } from 'vitest'
import NavigationComponent from '../NavigationComponent'
import { useMessageStore } from '../../../store/messageStore'

vi.mock('../../../hooks/useSocketMessage', () => ({
  useSocketMessage: vi.fn(),
}))

vi.mock('../../../store/messageStore', () => ({
  useMessageStore: vi.fn(),
}))

describe('NavigationComponent', () => {
  const renderNavigationComponent = () => {
    return render(
      <BrowserRouter>
        <NavigationComponent />
      </BrowserRouter>
    )
  }

  beforeEach(() => {
    vi.mocked(useMessageStore).mockImplementation((selector) =>
      selector({ unreadCount: 0 })
    )
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('모든 네비게이션 아이템이 렌더링되어야 한다', () => {
    renderNavigationComponent()

    expect(screen.getByText('홈')).toBeInTheDocument()
    expect(screen.getByText('매칭')).toBeInTheDocument()
    expect(screen.getByText('채팅')).toBeInTheDocument()
    expect(screen.getByText('마이페이지')).toBeInTheDocument()
  })

  it('읽지 않은 메시지가 있을 때 ChatAlertIcon이 표시되어야 한다', () => {
    vi.mocked(useMessageStore).mockImplementation((selector) =>
      selector({ unreadCount: 5 })
    )

    renderNavigationComponent()

    const alertIcon = screen.getByTestId('chat-alert-icon')
    expect(alertIcon).toBeInTheDocument()
    expect(alertIcon).toHaveTextContent('5')
  })

  it('읽지 않은 메시지가 없을 때 ChatAlertIcon이 표시되지 않아야 한다', () => {
    vi.mocked(useMessageStore).mockImplementation((selector) =>
      selector({ unreadCount: 0 })
    )

    renderNavigationComponent()

    const alertIcon = screen.queryByTestId('chat-alert-icon')
    expect(alertIcon).not.toBeInTheDocument()
  })

  it('활성화된 메뉴 아이템의 색상이 #392111이어야 한다', () => {
    renderNavigationComponent()

    const homeLink = screen.getByText('홈').closest('a')
    expect(homeLink).toHaveStyle({ color: '#392111' })
  })

  it('비활성화된 메뉴 아이템의 색상이 #D9D9D9이어야 한다', () => {
    renderNavigationComponent()

    const chatLink = screen.getByText('채팅').closest('a')
    expect(chatLink).toHaveStyle({ color: '#D9D9D9' })
  })
})
