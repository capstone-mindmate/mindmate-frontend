import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import AskInput from '../AskInput'

describe('AskInput 컴포넌트', () => {
  const defaultProps = {
    placeHolder: '한 직업을 평생 할 수 있다고 생각하시나요?',
    onCloseBtnClick: vi.fn(),
  }

  describe('렌더링', () => {
    it('기본 상태에서 올바르게 렌더링되어야 함', () => {
      render(<AskInput {...defaultProps} />)

      const input = screen.getByPlaceholderText(defaultProps.placeHolder)
      expect(input).toBeInTheDocument()
      expect(input).toHaveStyle({
        backgroundColor: '#FFFFFF',
        border: '1px solid #D9D9D9',
      })
    })

    it('CloseIcon이 회색으로 렌더링되어야 함', () => {
      render(<AskInput {...defaultProps} />)

      const closeButton = screen.getByRole('button')
      const closeIcon = closeButton.querySelector('svg')
      expect(closeIcon).toHaveAttribute('color', '#A3A3A3')
    })
  })

  describe('입력 상호작용', () => {
    it('텍스트 입력 시 스타일이 변경되어야 함', () => {
      render(<AskInput {...defaultProps} />)

      const input = screen.getByPlaceholderText(defaultProps.placeHolder)
      fireEvent.change(input, { target: { value: '테스트 입력' } })

      expect(input).toHaveStyle({
        backgroundColor: '#FFF9EB',
        border: '1px solid #F0DAA9',
      })
    })

    it('텍스트 입력 시 CloseIcon 색상이 변경되어야 함', () => {
      render(<AskInput {...defaultProps} />)

      const input = screen.getByPlaceholderText(defaultProps.placeHolder)
      fireEvent.change(input, { target: { value: '테스트 입력' } })

      const closeButton = screen.getByRole('button')
      const closeIcon = closeButton.querySelector('svg')
      expect(closeIcon).toHaveAttribute('color', '#000000')
    })

    it('Close 버튼 클릭 시 입력값이 초기화되어야 함', () => {
      render(<AskInput {...defaultProps} />)

      const input = screen.getByPlaceholderText(defaultProps.placeHolder)
      fireEvent.change(input, { target: { value: '테스트 입력' } })

      const closeButton = screen.getByRole('button')
      fireEvent.click(closeButton)

      expect(input).toHaveValue('')
      expect(defaultProps.onCloseBtnClick).toHaveBeenCalled()
    })
  })

  describe('스타일', () => {
    it('입력창 focus 시 테두리 색상이 변경되어야 함', () => {
      render(<AskInput {...defaultProps} />)

      const input = screen.getByPlaceholderText(defaultProps.placeHolder)
      fireEvent.focus(input)

      expect(input).toHaveStyle({
        borderColor: '#f0daa9',
      })
    })
  })
})
