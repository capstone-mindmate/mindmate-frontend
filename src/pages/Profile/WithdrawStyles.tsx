import styled from '@emotion/styled'
import { media } from '../../styles/breakpoints'

export const RootContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #ffffff;
`

export const MainContainer = styled.div`
  width: 100%;
  max-width: 478px;
  height: 100%;
  position: relative;
  box-sizing: border-box;
  padding: 24px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  position: relative;

  ${media.mobileBig} {
    width: 100%;
  }
`

export const WithdrawTitle = styled.h1`
  font-size: 18px;
  font-weight: bold;
  margin: 20px 0 24px 0;
  text-align: left;
  width: 100%;
  display: flex;
  align-items: center;
`

export const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  margin: 16px 0 0 0;
`

export const SectionDescription = styled.p`
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin-bottom: 16px;
`

export const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 12px 0;
  position: relative;
`

export const CheckboxInput = styled.input`
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;

  &:checked + label::before {
    background-color: #392111;
    border-color: #392111;
  }

  &:checked + label::after {
    content: '';
    position: absolute;
    left: 6.5px;
    top: 2px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }
`

export const CheckboxLabel = styled.label`
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding-left: 28px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 20px;
    height: 20px;
    border: 1px solid #ccc;
    border-radius: 3px;
    background-color: white;
    box-sizing: border-box;
  }
`

export const ReasonSection = styled.div`
  margin: 24px 0;
`

export const ReasonSubtitle = styled.p`
  font-size: 14px;
  color: #888;
  margin-top: 0;
  margin-bottom: 16px;
`

export const TextArea = styled.textarea`
  width: 100%;
  height: 100px;
  padding: 12px;
  box-sizing: border-box;
  border: 1px solid #eee;
  border-radius: 8px;
  resize: none;
  margin-top: 8px;
  font-size: 14px;
  background-color: #f9f9f9;
  transition: all 0.2s ease;
  color: #000000;
  &::placeholder {
    color: #aaa;
  }
`

export const WithdrawButton = styled.button<{ isActive: boolean }>`
  width: calc(100% - 48px);
  height: 50px !important;
  border-radius: 8px;
  border: none;
  font-size: 16px;
  font-weight: 600;
  position: absolute;
  bottom: 24px;
  cursor: ${(props) => (props.isActive ? 'pointer' : 'not-allowed')};
  background-color: ${(props) => (props.isActive ? '#000000' : '#e0e0e0')};
  color: ${(props) => (props.isActive ? '#ffffff' : '#888888')};
  transition: all 0.2s ease;
`
