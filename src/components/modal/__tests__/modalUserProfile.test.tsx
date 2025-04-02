import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import {
  ModalMatchingUserProfile,
  ModalMatchingFailureUserProfile,
} from '../modalUserProfile'

describe('ModalUserProfile 컴포넌트', () => {
  describe('ModalMatchingUserProfile', () => {
    const defaultProps = {
      profileImage: 'test-image.jpg',
      name: '건드리면 짖는댕',
      department: '소프트웨어학과',
      makeDate: '03월 24일 18:52',
    }

    it('프로필 정보가 올바르게 렌더링되어야 함', () => {
      render(<ModalMatchingUserProfile {...defaultProps} />)

      expect(screen.getByText('건드리면 짖는댕')).toBeInTheDocument()
      expect(screen.getByText('소프트웨어학과')).toBeInTheDocument()
      expect(screen.getByText('03월 24일 18:52')).toBeInTheDocument()
    })

    it('프로필 이미지가 올바른 src로 렌더링되어야 함', () => {
      render(<ModalMatchingUserProfile {...defaultProps} />)
      const imgElement = screen.getByRole('img')
      expect(imgElement).toHaveAttribute('src', 'test-image.jpg')
    })

    it('스타일이 올바르게 적용되어야 함', () => {
      render(<ModalMatchingUserProfile {...defaultProps} />)

      const container = screen.getByTestId('profile-container')
      expect(container).toHaveStyle({
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      })
    })
  })

  describe('ModalMatchingFailureUserProfile', () => {
    const defaultProps = {
      profileImage: 'test-image.jpg',
      name: '건드리면 짖는댕',
      department: '소프트웨어학과',
      onBackClick: vi.fn(),
      showDetails: false,
    }

    it('실패 프로필 정보가 올바르게 렌더링되어야 함', () => {
      render(<ModalMatchingFailureUserProfile {...defaultProps} />)

      expect(screen.getByText('건드리면 짖는댕')).toBeInTheDocument()
      expect(screen.getByText('소프트웨어학과')).toBeInTheDocument()
    })

    it('BackIcon 클릭 시 onBackClick이 호출되어야 함', () => {
      render(<ModalMatchingFailureUserProfile {...defaultProps} />)

      const backIcon = screen.getByTestId('back-icon')
      fireEvent.click(backIcon)
      expect(defaultProps.onBackClick).toHaveBeenCalled()
    })

    it('showDetails 상태에 따라 BackIcon이 올바르게 회전해야 함', () => {
      const { rerender } = render(
        <ModalMatchingFailureUserProfile {...defaultProps} />
      )

      const backIcon = screen.getByTestId('back-icon')
      expect(backIcon).toHaveStyle('transform: rotate(-90deg)')

      rerender(
        <ModalMatchingFailureUserProfile {...defaultProps} showDetails={true} />
      )
      expect(backIcon).toHaveStyle('transform: rotate(90deg)')
    })
  })
})
