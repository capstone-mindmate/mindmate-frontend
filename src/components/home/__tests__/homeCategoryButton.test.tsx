import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import HomeCategoryButton from '../homeCategoryButton'

describe('HomeCategoryButton', () => {
  const defaultProps = {
    buttonText: '진로고민',
    emoji: '🤯',
  }

  it('렌더링 확인', () => {
    const { getByText } = render(<HomeCategoryButton {...defaultProps} />)

    expect(getByText(defaultProps.buttonText)).toBeInTheDocument()
    expect(getByText(defaultProps.emoji)).toBeInTheDocument()
  })

  it('컨테이너 스타일 확인', () => {
    const { container } = render(<HomeCategoryButton {...defaultProps} />)
    const containerElement = container.querySelector('.container')

    expect(containerElement).toHaveStyle({
      width: 'calc(33.3333% - 10px)',
      height: '96px',
    })
  })

  it('버튼 스타일 확인', () => {
    const { container } = render(<HomeCategoryButton {...defaultProps} />)
    const buttonElement = container.querySelector('button')

    expect(buttonElement).toHaveStyle({
      width: '100%',
      height: '100%',
      backgroundColor: '#fff9eb',
      color: '#000000',
      border: '1px solid #f0daa9',
      borderRadius: '10px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      gap: '4px',
    })
  })

  it('텍스트 및 이모지 스타일 확인', () => {
    const { getByText } = render(<HomeCategoryButton {...defaultProps} />)

    const textElement = getByText(defaultProps.buttonText)
    expect(textElement).toHaveStyle({
      fontSize: '16px',
      fontWeight: 'bold',
      lineHeight: '1.5',
      color: '#000000',
      margin: '0',
      marginLeft: '12px',
    })

    const emojiElement = getByText(defaultProps.emoji)
    expect(emojiElement).toHaveStyle({
      fontSize: '30px',
      fontWeight: 'bold',
      lineHeight: '1.5',
      margin: '0',
      marginRight: '12px',
    })
  })

  it('레이아웃 구조 확인', () => {
    const { container } = render(<HomeCategoryButton {...defaultProps} />)

    const topElement = container.querySelector('.top')
    expect(topElement).toHaveStyle({
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
    })

    const bottomElement = container.querySelector('.bottom')
    expect(bottomElement).toHaveStyle({
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
    })
  })
})
