import styled from '@emotion/styled'
import { css } from '@emotion/react'
import { ToastType } from '../components/Toast/ToastProvider.tsx'

// 토스트 컨테이너 스타일
export const ToastsContainer = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
`

// 토스트 컴포넌트 스타일
export const ToastContainer = styled.div<{
  isVisible: boolean
  type: ToastType
}>`
  display: flex;
  align-items: center;
  padding: 10px 15px;
  border-radius: 30px;
  margin-bottom: 12px;
  min-width: 350px;
  max-width: 600px;
  transition:
    opacity 0.3s,
    transform 0.3s;
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
  transform: ${(props) =>
    props.isVisible ? 'translateY(0)' : 'translateY(-20px)'};
  z-index: 1000;

  ${(props) => {
    switch (props.type) {
      case 'info':
        return css`
          background-color: #b8ccff;
          color: #000000;
          border: 1px solid #1b5bfe;
        `
      case 'error':
        return css`
          background-color: #ffe6e6;
          color: #000000;
          border: 1px solid #fb4f50;
        `
      case 'warning':
        return css`
          background-color: #fff1ca;
          color: #000000;
          border: 1px solid #f8c73d;
        `
      case 'success':
        return css`
          background-color: #d1f6d1;
          color: #000000;
          border: 1px solid #01a700;
        `
      default:
        return css`
          background-color: #e6eeff;
          color: #000000;
          border: 1px solid #1b5bfe;
        `
    }
  }}
`

// 아이콘 컨테이너 스타일
export const IconContainer = styled.div`
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`

// 아이콘 스타일
export const IconImage = styled.img<{ type: ToastType }>`
  width: 24px;
  height: 24px;
  filter: ${(props) =>
    props.type === 'info'
      ? 'invert(31%) sepia(85%) saturate(2151%) hue-rotate(215deg) brightness(97%) contrast(101%)' // #1B5BFE
      : props.type === 'error'
        ? 'invert(43%) sepia(82%) saturate(1752%) hue-rotate(330deg) brightness(101%) contrast(101%)' // #FB4F50
        : props.type === 'warning'
          ? 'invert(79%) sepia(61%) saturate(861%) hue-rotate(338deg) brightness(103%) contrast(96%)' // #F8C73D
          : props.type === 'success'
            ? 'invert(42%) sepia(99%) saturate(1073%) hue-rotate(61deg) brightness(95%) contrast(106%)' // #01A700
            : 'none'};
`

// 메시지 텍스트 스타일 - 왼쪽 정렬
export const MessageText = styled.div`
  flex: 1;
  font-size: 14px;
  text-align: left;
`

export const CloseButton = styled.button`
  background: none;
  font-size: 20px;
  padding: 0;
  line-height: 1;
  color: #000000;

  &:hover {
    color: #333;
  }
`
