import styled from '@emotion/styled'
import { css } from '@emotion/react'

// 탑바 컨테이너 스타일
export const TopBarContainer = styled.div<{
  showBorder: boolean
  isFixed: boolean
}>`
  width: 100%;
  max-width: inherit; // 부모 요소의 max-width 상속
  height: 56px;
  display: flex;
  align-items: center;
  background-color: #ffffff;
  border-bottom: ${(props) =>
    props.showBorder ? '1px solid #eeeeee' : 'none'};

  // isFixed 속성으로 포지셔닝 제어
  ${(props) =>
    props.isFixed
      ? css`
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          margin: 0 auto; // 중앙 정렬
          z-index: 999;
        `
      : css`
          position: relative;
          z-index: 1;
        `}

  // 고정 상태일 때 트랜지션 효과 추가 (그림자 제거)
  transition: background-color 0.2s ease;
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
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

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
  padding: 0;

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

// 왼쪽 컨텐츠 스타일
export const TopBarLeftContent = styled.div`
  position: absolute;
  left: 24px;
  display: flex;
  align-items: center;

  /* 텍스트일 경우 스타일 */
  font-size: 16px;
  font-weight: 700;
  color: #392111;
`

// 오른쪽 컨텐츠 스타일
export const TopBarRightContent = styled.div`
  position: absolute;
  right: 24px;
  display: flex;
  align-items: center;

  /* 아이콘 버튼 스타일링 */
  button {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      opacity: 0.8;
    }
  }
`
