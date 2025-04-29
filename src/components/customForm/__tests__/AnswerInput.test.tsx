import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import AnswerInput from '../AnswerInput'

describe('AnswerInput 컴포넌트', () => {
  const defaultProps = {
    title: '질문 제목',
  }

  describe('렌더링', () => {
    it('제목과 입력창이 올바르게 렌더링되어야 함', () => {
      render(<AnswerInput {...defaultProps} />)

      expect(screen.getByText('질문 제목')).toBeInTheDocument()
      expect(
        screen.getByPlaceholderText('답변을 입력해주세요')
      ).toBeInTheDocument()
    })

    it('제목이 올바른 스타일로 렌더링되어야 함', () => {
      render(<AnswerInput {...defaultProps} />)

      const title = screen.getByText('질문 제목')
      expect(title).toHaveStyle({
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#150c06',
      })
    })
  })

  describe('입력 상호작용', () => {
    it('텍스트 입력 시 스타일이 변경되어야 함', () => {
      render(<AnswerInput {...defaultProps} />)

      const input = screen.getByPlaceholderText('답변을 입력해주세요')
      fireEvent.change(input, { target: { value: '테스트 답변' } })

      expect(input).toHaveStyle({
        backgroundColor: '#FFF9EB',
        border: '1px solid #F0DAA9',
      })
    })

    it('입력값이 올바르게 업데이트되어야 함', () => {
      render(<AnswerInput {...defaultProps} />)

      const input = screen.getByPlaceholderText('답변을 입력해주세요')
      fireEvent.change(input, { target: { value: '테스트 답변' } })

      expect(input).toHaveValue('테스트 답변')
    })
  })

  describe('스타일', () => {
    it('입력창 focus 시 테두리 색상이 변경되어야 함', () => {
      render(<AnswerInput {...defaultProps} />)

      const input = screen.getByPlaceholderText('답변을 입력해주세요')
      fireEvent.focus(input)

      expect(input).toHaveStyle({
        borderColor: '#f0daa9',
      })
    })

    it('컨테이너가 올바른 레이아웃 스타일을 가져야 함', () => {
      render(<AnswerInput {...defaultProps} />)

      const container = screen.getByTestId('answer-input-container')
      expect(container).toHaveStyle({
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      })
    })
  })
})
