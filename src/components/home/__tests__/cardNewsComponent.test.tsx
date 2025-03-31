import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import CardNewsComponent from '../cardNewsComponent'

describe('CardNewsComponent', () => {
  const defaultProps = {
    imgUrl: '/test-image.jpg',
    title: '테스트 뉴스 제목',
    organization: '테스트 조직',
    date: '2024.03.21',
  }

  it('모든 필수 요소가 렌더링되는지 확인', () => {
    const { getByText, getByAltText } = render(
      <CardNewsComponent {...defaultProps} />
    )

    const image = getByAltText(defaultProps.title)
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', defaultProps.imgUrl)

    expect(getByText(defaultProps.date)).toBeInTheDocument()
    expect(getByText(defaultProps.title)).toBeInTheDocument()
    expect(getByText(defaultProps.organization)).toBeInTheDocument()
  })

  it('컨테이너 스타일이 올바르게 적용되는지 확인', () => {
    const { container } = render(<CardNewsComponent {...defaultProps} />)
    const containerElement = container.firstChild as HTMLElement

    expect(containerElement).toHaveStyle({
      display: 'flex',
      flexDirection: 'column',
      width: '250px',
      cursor: 'pointer',
    })
  })

  it('이미지 스타일이 올바르게 적용되는지 확인', () => {
    const { getByAltText } = render(<CardNewsComponent {...defaultProps} />)
    const image = getByAltText(defaultProps.title)

    expect(image).toHaveStyle({
      width: '100%',
      height: '100%',
      borderRadius: '4px',
      objectFit: 'cover',
      userSelect: 'none',
    })
  })

  it('텍스트 스타일이 올바르게 적용되는지 확인', () => {
    const { getByText } = render(<CardNewsComponent {...defaultProps} />)

    const dateElement = getByText(defaultProps.date)
    expect(dateElement).toHaveStyle({
      fontSize: '14px',
      lineHeight: '1.4',
      color: 'rgb(114, 114, 114)',
      margin: '0',
    })

    const titleElement = getByText(defaultProps.title)
    expect(titleElement).toHaveStyle({
      fontSize: '16px',
      lineHeight: '1.5',
      fontWeight: 'bold',
      color: 'rgb(0, 0, 0)',
      margin: '0',
    })

    const organizationElement = getByText(defaultProps.organization)
    expect(organizationElement).toHaveStyle({
      fontSize: '14px',
      lineHeight: '1.4',
      color: 'rgb(57, 57, 57)',
      margin: '0',
    })
  })

  it('이미지 박스와 정보 박스의 레이아웃이 올바른지 확인', () => {
    const { container } = render(<CardNewsComponent {...defaultProps} />)

    const imgBox = container.querySelector('.imgBox')
    expect(imgBox).toHaveStyle({
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    })

    const infoBox = container.querySelector('.infoBox')
    expect(infoBox).toHaveStyle({
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      marginTop: '8px',
    })
  })
})
