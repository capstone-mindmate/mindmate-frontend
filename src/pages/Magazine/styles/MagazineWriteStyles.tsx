import styled from '@emotion/styled'

export const MagazineWriteContainer = styled.div`
  width: 100%;
  max-width: 884px;
  margin: 0 auto;
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;

  .write-content {
    margin: 0 24px;
    padding: 0px 16px 0 16px;
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
    position: relative;
  }

  .input-wrapper {
    position: relative;
    width: 100%;
    margin-bottom: 4px;
  }

  .char-count {
    position: absolute;
    right: 0;
    bottom: 10px;
    font-size: 12px;
    color: #999;
  }

  .title-input {
    width: 100%;
    box-sizing: border-box;
    border: none;
    font-size: 16px;
    font-weight: 500;
    padding: 12px 0 8px 0;
    background-color: #ffffff;
    color: #333333;
    display: block;
    &::placeholder {
      color: #888;
    }
    &:focus {
      outline: none;
    }
  }

  /* 소제목 스타일 추가 */
  .subtitle-input {
    width: 100%;
    box-sizing: border-box;
    border: none;
    font-size: 14px;
    font-weight: 400;
    padding: 0 0 12px 0;
    background-color: #ffffff;
    color: #555555;
    display: block;
    &::placeholder {
      color: #999;
    }
    &:focus {
      outline: none;
    }
  }

  .divider {
    width: 100%;
    height: 1px;
    background-color: #c1bfbe;
  }

  @media (max-width: 768px) {
    .write-content {
      margin: 0 16px;
    }
  }
`

export const QuillEditorContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  z-index: 110;

  /* Quill 에디터 스타일 */
  .quill {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .ql-container {
    font-size: 14px;
    flex: 1;
    overflow-y: auto;
    border: none;
    margin-bottom: 80px;
  }

  .ql-editor {
    padding: 12px 0;
    min-height: 200px;

    &.ql-blank::before {
      font-style: normal;
      color: #888;
      left: 0;
      /* 플레이스홀더 항상 표시 */
      opacity: 1 !important;
    }

    /* 이미지 스타일 */
    img.magazine-image {
      max-width: 100%;
      height: auto;
      margin: 10px 0;

      &.featured-image {
        border: 2px solid gold;
      }
    }
  }

  /* Quill 내장 툴바 위치 및 아이콘 간격 조정 */
  .ql-toolbar {
    border: none;
    border-bottom: 1px solid #c1bfbe;
    padding: 8px 0;
    margin-bottom: 10px;

    /* 툴바 버튼 간 간격 조정 */
    button {
      margin: 0 0px;
    }

    /* 툴바 버튼 그룹 간 간격 조정 */
    .ql-formats {
      margin-right: 0px;
    }
  }
`

export const ImageInput = styled.input`
  display: none;
`

// 탑바의 title 영역에 사용할 카테고리 선택 컴포넌트 스타일
export const CategorySelect = styled.select`
  border: none;
  color: #392111;
  background: transparent;
  font-size: 16px;
  font-weight: 400;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  cursor: pointer;
  text-align: center;
  padding: 0 20px 0 0;
  min-width: 80px;

  &:focus {
    outline: none;
  }

  /* 화살표 스타일링 */
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath fill='none' stroke='%23392111' stroke-width='1.5' d='M1 1l4 4 4-4'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right center;

  option {
    font-size: 14px;
    background: #ffffff;
    padding: 8px;
  }
`

// 검토 알림 말풍선 스타일 컴포넌트 추가
export const ReviewNoticeTooltip = styled.div`
  background-color: #f5f5f5;
  border-radius: 12px;
  padding: 12px 16px;
  margin: 0;
  font-size: 13px;
  color: #666;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  position: fixed;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  width: 74%;
  max-width: 800px;
  z-index: 100;
  transition: opacity 0.5s ease-in-out;

  &::before {
    content: '';
    position: absolute;
    top: -6px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 6px solid #f5f5f5;
  }

  &.fade-in {
    opacity: 1;
  }

  &.fade-out {
    opacity: 0;
  }
`
