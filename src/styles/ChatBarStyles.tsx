import styled from '@emotion/styled'

export const ChatBarContainer = styled.div`
  position: sticky;
  bottom: 0;
  padding: 20px 0px;
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3000;
  width: 100%;

  @media all and (max-width: 767px) {
    padding: 10px 15px;
  }
`

export const InputContainer = styled.div`
  display: flex;
  width: 100%;
  position: relative;
  align-items: center;

  @media all and (max-width: 767px) {
    max-width: 100%;
  }
`

export const StyledInput = styled.input`
  width: 100%;
  padding: 12px 45px 12px 15px;
  border: 1px solid #ffffff;
  border-radius: 24px;
  font-family: 'Pretendard', sans-serif;
  font-weight: 400;
  font-size: 14px;
  color: #333333;
  outline: none;
  background-color: #f5f5f5;
  text-align: left;

  &::placeholder {
    color: #a3a3a3;
    text-align: left;
  }
`

interface IconButtonProps {
  position: 'left' | 'right'
}

export const IconButton = styled.button<IconButtonProps>`
  position: absolute;
  ${(props) => (props.position === 'left' ? 'left: 10px;' : 'right: 10px;')}
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  z-index: 2;

  svg {
    width: 24px;
    height: 24px;
  }

  &:active {
    opacity: 0.7;
  }
`
