import { describe, it, expect, beforeEach } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import CategoryButton from '../categoryButton'
import ConfirmButton from '../confirmButton'
import BrownRoundButton from '../brownRoundButton'
import YellowRoundButton from '../yellowRoundButton'
import FilterButton from '../filterButton'
import FloatingButton from '../floatingButton'
import { ReportButton, ReportItem } from '../reportButton'
import ReviewButton from '../reviewButton'
import BrownRectButton from '../brownRectButton'
import { NormalPlusIcon } from '../../icon/iconComponents'

describe('CategoryButton', () => {
  const mockOnActiveChange = vi.fn()

  beforeEach(() => {
    mockOnActiveChange.mockClear()
  })

  it('텍스트 렌더링 확인', () => {
    const { getByRole } = render(<CategoryButton buttonText="카테고리" />)
    expect(getByRole('button')).toHaveTextContent('카테고리')
  })

  it('클릭 시 스타일 변경 확인', () => {
    const { getByRole } = render(
      <CategoryButton
        buttonText="카테고리"
        onActiveChange={mockOnActiveChange}
      />
    )
    const button = getByRole('button')

    fireEvent.click(button)
    expect(mockOnActiveChange).toHaveBeenCalledWith(true)
    expect(button).toHaveStyle({
      backgroundColor: '#FFF9EB',
      color: '#392111',
    })
  })
})

describe('ConfirmButton', () => {
  const mockOnActiveChange = vi.fn()

  beforeEach(() => {
    mockOnActiveChange.mockClear()
  })

  it('텍스트 렌더링 확인', () => {
    const { getByRole } = render(<ConfirmButton buttonText="확인" />)
    expect(getByRole('button')).toHaveTextContent('확인')
  })

  it('클릭 시 스타일 변경 확인', () => {
    const { getByRole } = render(
      <ConfirmButton buttonText="확인" onActiveChange={mockOnActiveChange} />
    )
    const button = getByRole('button')

    fireEvent.click(button)
    expect(mockOnActiveChange).toHaveBeenCalledWith(true)
    expect(button).toHaveStyle({
      backgroundColor: '#392111',
    })
  })
})

describe('BrownRoundButton', () => {
  const mockOnActiveChange = vi.fn()

  beforeEach(() => {
    mockOnActiveChange.mockClear()
  })

  it('텍스트 렌더링 확인', () => {
    const { getByRole } = render(<BrownRoundButton buttonText="리스너" />)
    expect(getByRole('button')).toHaveTextContent('리스너')
  })

  it('클릭 시 스타일 변경 확인', () => {
    const { getByRole } = render(
      <BrownRoundButton
        buttonText="리스너"
        onActiveChange={mockOnActiveChange}
      />
    )
    const button = getByRole('button')

    fireEvent.click(button)
    expect(mockOnActiveChange).toHaveBeenCalledWith(true)
    expect(button).toHaveStyle({
      backgroundColor: '#5C351B',
      color: '#FFFFFF',
    })
  })
})

describe('YellowRoundButton', () => {
  const mockOnActiveChange = vi.fn()

  beforeEach(() => {
    mockOnActiveChange.mockClear()
  })

  it('텍스트 렌더링 확인', () => {
    const { getByRole } = render(<YellowRoundButton buttonText="스피커" />)
    expect(getByRole('button')).toHaveTextContent('스피커')
  })

  it('클릭 시 스타일 변경 확인', () => {
    const { getByRole } = render(
      <YellowRoundButton
        buttonText="스피커"
        onActiveChange={mockOnActiveChange}
      />
    )
    const button = getByRole('button')

    fireEvent.click(button)
    expect(mockOnActiveChange).toHaveBeenCalledWith(true)
    expect(button).toHaveStyle({
      backgroundColor: '#FFF9EB',
      color: '#392111',
    })
  })
})

describe('FilterButton', () => {
  const mockOnActiveChange = vi.fn()

  beforeEach(() => {
    mockOnActiveChange.mockClear()
  })

  it('텍스트 렌더링 확인', () => {
    const { getByRole } = render(<FilterButton buttonText="전체" />)
    expect(getByRole('button')).toHaveTextContent('전체')
  })

  it('클릭 시 스타일 변경 확인', () => {
    const { getByRole } = render(
      <FilterButton buttonText="전체" onActiveChange={mockOnActiveChange} />
    )
    const button = getByRole('button')

    fireEvent.click(button)
    expect(mockOnActiveChange).toHaveBeenCalledWith(true)
    expect(button).toHaveStyle({
      backgroundColor: '#393939',
      color: '#FFFFFF',
    })
  })
})

describe('FloatingButton', () => {
  const mockOnActiveChange = vi.fn()

  beforeEach(() => {
    mockOnActiveChange.mockClear()
  })

  it('텍스트와 아이콘 렌더링 확인', () => {
    const { getByRole, container } = render(
      <FloatingButton
        buttonText="글쓰기"
        buttonIcon={<NormalPlusIcon data-testid="plus-icon" color="#ffffff" />}
      />
    )
    expect(getByRole('button')).toHaveTextContent('글쓰기')
    expect(
      container.querySelector('[data-testid="plus-icon"]')
    ).toBeInTheDocument()
  })

  it('클릭 시 이벤트가 발생하는지 확인', () => {
    const { getByRole } = render(
      <FloatingButton
        buttonText="글쓰기"
        buttonIcon={<NormalPlusIcon color="#ffffff" />}
        onActiveChange={mockOnActiveChange}
      />
    )

    fireEvent.click(getByRole('button'))
    expect(mockOnActiveChange).toHaveBeenCalledWith(true)
  })
})

describe('ReportButton and ReportItem', () => {
  const mockOnActiveChange = vi.fn()

  beforeEach(() => {
    mockOnActiveChange.mockClear()
  })

  it('ReportItem 텍스트 렌더링 확인', () => {
    const { getByRole } = render(<ReportItem reportText="신고 항목" />)
    expect(getByRole('button')).toHaveTextContent('신고 항목')
  })

  it('ReportItem 클릭 시 스타일 변경 확인', () => {
    const { getByRole } = render(
      <ReportItem reportText="신고 항목" onActiveChange={mockOnActiveChange} />
    )
    const button = getByRole('button')

    fireEvent.click(button)
    expect(mockOnActiveChange).toHaveBeenCalledWith(true)
    expect(button).toHaveStyle({
      border: '1px solid #392111',
    })
  })

  it('ReportButton 클릭 시 스타일 변경 확인', () => {
    const { getByRole } = render(
      <ReportButton onActiveChange={mockOnActiveChange} />
    )
    const button = getByRole('button')

    fireEvent.click(button)
    expect(mockOnActiveChange).toHaveBeenCalledWith(true)
    expect(button).toHaveStyle({
      backgroundColor: '#FB4F50',
    })
  })
})

describe('ReviewButton', () => {
  const mockOnActiveChange = vi.fn()

  beforeEach(() => {
    mockOnActiveChange.mockClear()
  })

  it('텍스트 렌더링 확인', () => {
    const { getByRole } = render(
      <ReviewButton reviewText="⚡️ 응답이 빨라요" />
    )
    expect(getByRole('button')).toHaveTextContent('⚡️ 응답이 빨라요')
  })

  it('클릭 시 스타일 변경 확인', () => {
    const { getByRole } = render(
      <ReviewButton
        reviewText="⚡️ 응답이 빨라요"
        onActiveChange={mockOnActiveChange}
      />
    )
    const button = getByRole('button')

    fireEvent.click(button)
    expect(mockOnActiveChange).toHaveBeenCalledWith(true)
    expect(button).toHaveStyle({
      backgroundColor: '#FFFCF5',
      border: '1px solid #F0DAA9',
    })
  })
})

describe('BrownRectButton', () => {
  const mockOnActiveChange = vi.fn()

  beforeEach(() => {
    mockOnActiveChange.mockClear()
  })

  it('텍스트 렌더링 확인', () => {
    const { getByRole } = render(<BrownRectButton buttonText="버튼" />)
    expect(getByRole('button')).toHaveTextContent('버튼')
  })

  it('클릭 시 이벤트 발생 확인', () => {
    const { getByRole } = render(
      <BrownRectButton buttonText="버튼" onActiveChange={mockOnActiveChange} />
    )

    fireEvent.click(getByRole('button'))
    expect(mockOnActiveChange).toHaveBeenCalledWith(true)
  })

  it('기본 스타일 적용 확인', () => {
    const { getByRole } = render(<BrownRectButton buttonText="버튼" />)
    const button = getByRole('button')

    expect(button).toHaveStyle({
      backgroundColor: '#392111',
      color: '#ffffff',
    })
  })
})
