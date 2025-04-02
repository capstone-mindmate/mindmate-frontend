import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ModalComponent from '../modalComponent'

describe('ModalComponent', () => {
  const defaultProps = {
    modalType: '매칭신청',
    buttonText: '닫기',
    buttonClick: vi.fn(),
    isOpen: true,
    onClose: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('매칭신청 모달', () => {
    it('기본 요소들이 올바르게 렌더링되어야 함', () => {
      render(<ModalComponent {...defaultProps} />)

      expect(screen.getByText('건드리면 짖는댕')).toBeInTheDocument()
      expect(screen.getByText('소프트웨어학과')).toBeInTheDocument()
      expect(screen.getByText('03월 24일 18:52')).toBeInTheDocument()
      expect(
        screen.getByText('매칭 신청 시 50코인이 차감됩니다')
      ).toBeInTheDocument()
    })

    it('입력 필드들이 올바르게 렌더링되어야 함', () => {
      render(<ModalComponent {...defaultProps} />)

      expect(screen.getByText('진로 고민 들어주세요')).toBeInTheDocument()
      expect(
        screen.getByText('저 아주대 앞에서 붕어빵 팔아도 될까요?')
      ).toBeInTheDocument()
      expect(
        screen.getByPlaceholderText(
          '상대방에게 전달하고 싶은 메시지를 입력해주세요'
        )
      ).toBeInTheDocument()
    })

    it('모달 외부 클릭 시 onClose가 호출되어야 함', () => {
      render(<ModalComponent {...defaultProps} />)

      const overlay = screen.getByTestId('modal-overlay')
      fireEvent.click(overlay)
      expect(defaultProps.onClose).toHaveBeenCalled()
    })

    it('닫기 버튼 클릭 시 onClose가 호출되어야 함', () => {
      render(<ModalComponent {...defaultProps} />)

      const closeButton = screen.getByRole('button', { name: '닫기' })
      fireEvent.click(closeButton)
      expect(defaultProps.onClose).toHaveBeenCalled()
    })
  })

  describe('매칭실패 모달', () => {
    const failureProps = {
      ...defaultProps,
      modalType: '매칭실패',
    }

    it('실패 메시지가 올바르게 렌더링되어야 함', () => {
      render(<ModalComponent {...failureProps} />)

      expect(screen.getByText('매칭에 실패했어요 🥹')).toBeInTheDocument()
      expect(
        screen.getByText('다른 사람과 매칭을 시도해보세요!')
      ).toBeInTheDocument()
    })

    it('BackIcon 클릭 시 상세 정보가 토글되어야 함', async () => {
      render(<ModalComponent {...failureProps} />)

      const backIcon = screen.getByTestId('back-icon')

      act(() => {
        fireEvent.click(backIcon)
      })

      const matchedInfo = screen.getByTestId('matched-info')
      expect(matchedInfo).toHaveStyle({ height: expect.any(String) })

      act(() => {
        fireEvent.click(backIcon)
      })

      expect(matchedInfo).toHaveStyle({ height: '0px' })
    })
  })

  describe('채팅종료 모달', () => {
    const chatEndProps = {
      ...defaultProps,
      modalType: '채팅종료',
    }

    it('기본 구조가 렌더링되어야 함', () => {
      render(<ModalComponent {...chatEndProps} />)

      expect(screen.getByRole('button', { name: '닫기' })).toBeInTheDocument()
    })
  })

  describe('모달 접근성', () => {
    it('모달이 열렸을 때 배경 스크롤이 비활성화되어야 함', () => {
      render(<ModalComponent {...defaultProps} />)
      expect(document.body.style.overflow).toBe('hidden')
    })

    it('모달이 닫혔을 때 배경 스크롤이 활성화되어야 함', () => {
      const { unmount } = render(<ModalComponent {...defaultProps} />)
      unmount()
      expect(document.body.style.overflow).toBe('')
    })
  })
})
