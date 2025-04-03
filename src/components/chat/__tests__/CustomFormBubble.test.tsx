import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import CustomFormBubbleSend from '../CustomFormBubbleSend'
import CustomFormBubbleReceive from '../CustomFormBubbleReceive'

describe('CustomFormBubble 컴포넌트', () => {
  const defaultProps = {
    isMe: true,
    profileImage: 'test-profile.jpg',
    timestamp: '오후 2:30',
    showTime: true,
    isLastMessage: false,
    isRead: false,
    isContinuous: false,
  }

  describe('CustomFormBubbleSend', () => {
    it('기본 요소들이 올바르게 렌더링되어야 함', () => {
      render(<CustomFormBubbleSend {...defaultProps} />)

      expect(screen.getByText('설문이 도착했어요!')).toBeInTheDocument()
      expect(screen.getByRole('img')).toHaveAttribute(
        'src',
        'customFormBubble.webp'
      )
      expect(screen.getByRole('button')).toHaveTextContent('답변하기')
    })

    it('버튼 스타일이 올바르게 적용되어야 함', () => {
      render(<CustomFormBubbleSend {...defaultProps} />)

      const button = screen.getByRole('button')
      expect(button).toHaveStyle({
        backgroundColor: '#fff9eb',
        border: '1px solid #f0daa9',
        color: '#393939',
      })
    })

    describe('타임스탬프와 읽음 상태', () => {
      it('showTime이 true이고 isLastMessage가 false일 때 타임스탬프가 표시되어야 함', () => {
        render(<CustomFormBubbleSend {...defaultProps} />)
        expect(screen.getByText('오후 2:30')).toBeInTheDocument()
      })

      it('isMe가 true이고 isLastMessage가 true일 때 읽음 상태가 표시되어야 함', () => {
        render(
          <CustomFormBubbleSend {...{ ...defaultProps, isLastMessage: true }} />
        )
        expect(screen.getByText('읽지 않음')).toBeInTheDocument()
      })

      it('isRead가 true일 때 읽음 상태가 "읽음"으로 표시되어야 함', () => {
        render(
          <CustomFormBubbleSend
            {...{ ...defaultProps, isLastMessage: true, isRead: true }}
          />
        )
        expect(screen.getByText('읽음')).toBeInTheDocument()
      })
    })

    describe('프로필 이미지', () => {
      it('isMe가 false이고 isContinuous가 false일 때 프로필 이미지가 표시되어야 함', () => {
        render(<CustomFormBubbleSend {...{ ...defaultProps, isMe: false }} />)
        const profileImg = screen.getByAltText('프로필')
        expect(profileImg).toHaveAttribute('src', 'test-profile.jpg')
      })

      it('isContinuous가 true일 때 프로필 이미지가 표시되지 않아야 함', () => {
        render(
          <CustomFormBubbleSend
            {...{ ...defaultProps, isMe: false, isContinuous: true }}
          />
        )
        expect(screen.queryByAltText('프로필')).not.toBeInTheDocument()
      })
    })
  })

  describe('CustomFormBubbleReceive', () => {
    it('기본 요소들이 올바르게 렌더링되어야 함', () => {
      render(<CustomFormBubbleReceive {...defaultProps} />)

      expect(screen.getByText('답변이 도착했어요!')).toBeInTheDocument()
      expect(screen.getByRole('button')).toHaveTextContent('확인하기')
    })

    it('버튼 스타일이 올바르게 적용되어야 함', () => {
      render(<CustomFormBubbleReceive {...defaultProps} />)

      const button = screen.getByRole('button')
      expect(button).toHaveStyle({
        backgroundColor: '#ffffff',
        border: '1px solid #d9d9d9',
        color: '#393939',
      })
    })

    describe('레이아웃', () => {
      it('컨테이너가 올바른 flex 속성을 가져야 함', () => {
        render(<CustomFormBubbleReceive {...defaultProps} />)

        const container = screen.getByTestId('custom-form-bubble-container')
        expect(container).toHaveStyle({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        })
      })

      it('버튼이 올바른 크기를 가져야 함', () => {
        render(<CustomFormBubbleReceive {...defaultProps} />)

        const button = screen.getByRole('button')
        expect(button).toHaveStyle({
          width: '160px',
          height: '32px',
        })
      })
    })

    describe('메시지 방향', () => {
      it('isMe가 true일 때 오른쪽 정렬되어야 함', () => {
        render(<CustomFormBubbleReceive {...defaultProps} />)

        const wrapper = screen.getByTestId('bubble-wrapper')
        expect(wrapper).toHaveStyle({
          justifyContent: 'flex-end',
        })
      })

      it('isMe가 false일 때 왼쪽 정렬되어야 함', () => {
        render(
          <CustomFormBubbleReceive {...{ ...defaultProps, isMe: false }} />
        )

        const wrapper = screen.getByTestId('bubble-wrapper')
        expect(wrapper).toHaveStyle({
          justifyContent: 'flex-start',
        })
      })
    })
  })
})
