import styled from '@emotion/styled'
import { media } from '../../../styles/breakpoints'

export const ToggleContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
`

export const ToggleText = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #333;
`

export const ToggleSwitchContainer = styled.div<{ isActive: boolean }>`
  position: relative;
  width: 44px;
  height: 25px;
  border-radius: 28px;
  background-color: ${(props) => (props.isActive ? '#392111' : '#D9D9D9')};
  cursor: pointer;
  transition: background-color 0.3s ease;
`

export const ToggleSwitchThumb = styled.div<{ isActive: boolean }>`
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: white;
  top: 2.5px;
  left: ${(props) => (props.isActive ? '22px' : '2px')};
  transition: left 0.3s ease;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
`
