import styled from '@emotion/styled'
import { css } from '@emotion/react'

// 탑바 컨테이너 스타일
export const TopBarContainer = styled.div`
  width: 100%;
  height: 56px;
  display: flex;
  align-items: center;
  background-color: #ffffff;
  border-bottom: 1px solid #eeeeee;
  position: relative;
`

// 페이지 제목 스타일 (body2_re)
export const TopBarTitle = styled.h1`
  font-size: 14px;
  font-weight: 400;
  color: #000000;
  margin: 0;
  flex-grow: 1;
  text-align: center;
`

// 뒤로가기 버튼 스타일
export const TopBarBackButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  position: absolute;
  left: 24px;

  &:hover {
    opacity: 0.8;
  }
`

// 액션 버튼 스타일
export const TopBarActionButton = styled.button<{ isDisabled: boolean }>`
  background: none;
  border: none;
  position: absolute;
  right: 24px;

  ${(props) => {
    if (props.isDisabled) {
      return css`
        /* body2_re */
        font-size: 14px;
        font-weight: 400;
        color: #c1bfbe;
        cursor: not-allowed;
      `
    } else {
      return css`
        /* body1_bold */
        font-size: 16px;
        font-weight: 700;
        color: #392111;
        cursor: pointer;

        &:hover {
          color: #5a3a28; /* 마우스 오버 시 더 어두운 갈색 */
          opacity: 0.9;
        }
      `
    }
  }}
`
