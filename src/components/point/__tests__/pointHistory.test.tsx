import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import PointHistory from '../pointHistory'

describe('PointHistory 컴포넌트', () => {
  const defaultProps = {
    historyName: '매칭 성공 보상',
    historyDate: '2024.03.24 18:52',
    historyPoint: 50,
    historyBalance: 1000,
    historyType: 'earn' as const,
    borderTop: true,
    borderBottom: true,
  }

  describe('기본 렌더링', () => {
    it('모든 정보가 올바르게 표시되어야 함', () => {
      render(<PointHistory {...defaultProps} />)

      expect(screen.getByText('매칭 성공 보상')).toBeInTheDocument()
      expect(screen.getByText('2024.03.24 18:52')).toBeInTheDocument()
      expect(screen.getByText('+50코인')).toBeInTheDocument()
      expect(screen.getByText('1000코인')).toBeInTheDocument()
    })

    it('적립 타입일 때 파란색으로 표시되어야 함', () => {
      render(<PointHistory {...defaultProps} />)

      const pointElement = screen.getByText('+50코인')
      expect(pointElement).toHaveStyle({ color: '#1B5BFE' })
    })

    it('사용 타입일 때 빨간색으로 표시되어야 함', () => {
      render(<PointHistory {...defaultProps} historyType="use" />)

      const pointElement = screen.getByText('-50코인')
      expect(pointElement).toHaveStyle({ color: '#FB4F50' })
    })
  })

  describe('테두리 스타일', () => {
    it('상단 테두리가 있어야 함 (borderTop=true)', () => {
      render(<PointHistory {...defaultProps} borderTop={true} />)

      const container = screen.getByTestId('point-history-container')
      expect(container).toHaveStyle({ borderTop: '1px solid #D9D9D9' })
    })

    it('하단 테두리가 있어야 함 (borderBottom=true)', () => {
      render(<PointHistory {...defaultProps} borderBottom={true} />)

      const container = screen.getByTestId('point-history-container')
      expect(container).toHaveStyle({ borderBottom: '1px solid #D9D9D9' })
    })

    it('테두리가 없어야 함 (borderTop=false, borderBottom=false)', () => {
      render(
        <PointHistory
          {...defaultProps}
          borderTop={false}
          borderBottom={false}
        />
      )

      const container = screen.getByTestId('point-history-container')
      expect(container).toHaveStyle({ borderTop: 'none', borderBottom: 'none' })
    })
  })

  describe('레이아웃', () => {
    it('좌우 정렬이 올바르게 되어야 함', () => {
      render(<PointHistory {...defaultProps} />)

      const container = screen.getByTestId('point-history-container')
      expect(container).toHaveStyle({
        display: 'flex',
        justifyContent: 'space-between',
      })
    })

    it('텍스트 정렬이 올바르게 되어야 함', () => {
      render(<PointHistory {...defaultProps} />)

      const leftSection = screen.getByTestId('point-history-left')
      const rightSection = screen.getByTestId('point-history-right')

      expect(leftSection).toHaveStyle({ alignItems: 'flex-start' })
      expect(rightSection).toHaveStyle({ alignItems: 'flex-end' })
    })
  })
})
