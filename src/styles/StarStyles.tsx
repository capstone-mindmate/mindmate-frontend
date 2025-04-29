import { css } from '@emotion/react'
import styled from '@emotion/styled'

// 별점 컴포넌트 기본 스타일
export const starContainerStyles = css`
  display: flex;
  flex-direction: row; /* 명시적으로 가로 방향으로 설정 */
  align-items: center;
  justify-content: flex-start;
  width: fit-content;
`

// 별 래퍼 스타일 (클릭 가능 여부에 따라 커서 스타일 변경)
export const StarWrapper = styled.div<{ isClickable: boolean }>`
  display: inline-flex; /* 명시적으로 인라인 플렉스로 설정 */
  cursor: ${(props) => (props.isClickable ? 'pointer' : 'default')};
  margin: 0 2px;

  &:hover svg path {
    ${(props) =>
      props.isClickable &&
      `
      transition: fill 0.2s ease;
    `}
  }
`
