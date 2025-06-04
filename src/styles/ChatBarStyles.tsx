import styled from '@emotion/styled'

export const WrapperStyle = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

export const ChatBarContainer = styled.div`
  position: sticky;
  bottom: 0;
  padding: 15px 0px;
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: flex-end; /* center에서 flex-end로 변경 */
  z-index: 3000;
  width: 100%;
  border-top: 1px solid #eee;
  box-sizing: border-box;

  @media all and (max-width: 767px) {
    padding: 10px 15px;
  }
`

export const ControlsContainer = styled.div`
  display: flex;
  align-items: flex-end; /* center에서 flex-end로 변경 */
  width: 100%;
  max-width: 767px;
  margin: 0 auto;
  gap: 10px;
  padding: 0 15px;
`

export const InputContainer = styled.div`
  display: flex;
  width: 100%;
  position: relative;
  align-items: flex-end; /* center에서 flex-end로 변경 */
  box-sizing: border-box;

  @media all and (max-width: 767px) {
    max-width: 100%;
  }
`

export const StyledInput = styled.input<{ disabled?: boolean }>`
  width: 100%;
  padding: 12px 45px 12px 15px;
  border: 1px solid #eeeeee;
  border-radius: 24px;
  font-family: 'Pretendard', sans-serif;
  font-weight: 400;
  font-size: 14px;
  color: #333333;
  outline: none;
  background-color: #f5f5f5;
  text-align: left;
  cursor: ${(props) => (props.disabled ? 'default' : 'text')};
  &::placeholder {
    color: ${(props) => (props.disabled ? '#dadada' : '#a3a3a3')};
    text-align: left;
  }
`

export const IconWrapper = styled.div`
  cursor: pointer;
  margin-bottom: 8px; /* 아이콘들을 약간 위로 올림 */
`

interface IconButtonProps {
  position: 'left' | 'right'
  disabled?: boolean
}

export const IconButton = styled.button<IconButtonProps>`
  position: absolute;
  ${(props) => (props.position === 'left' ? 'left: 10px;' : 'right: 10px;')}
  bottom: 8px; /* 버튼을 아래쪽에 고정 */
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  z-index: 2;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};

  svg {
    width: 24px;
    height: 24px;
  }

  &:active {
    opacity: ${(props) => (props.disabled ? 0.5 : 0.7)};
  }
`
