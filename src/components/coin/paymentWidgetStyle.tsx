import styled from '@emotion/styled'

export const PaymentModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const Wrapper = styled.div`
  max-width: 480px;
  width: 100%;
  margin: 0 auto;
  padding: 0 20px;
`

export const BoxSection = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 24px;
  margin-bottom: 20px;
  max-height: 90vh;
  overflow: auto;
`

export const Button = styled.button<{ disabled?: boolean }>`
  width: 100%;
  height: 48px;
  background-color: ${(props) => (props.disabled ? '#DDDFE0' : '#392111')};
  color: white;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  margin-top: 24px;
`

export const Checkable = styled.div`
  padding: 8px 0;
`

export const CheckableLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
`

export const CheckableInput = styled.input`
  margin-right: 8px;
  width: 18px;
  height: 18px;
`

export const CheckableLabelText = styled.span`
  font-size: 16px;
`

export const TypographyP = styled.p`
  margin-bottom: 16px;
`

export const PriceContainer = styled.div`
  padding: 16px 0;
  border-bottom: 1px solid #f2f2f2;
  margin-bottom: 16px;
`

export const PriceInfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  font-weight: bold;
`

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`

export const Title = styled.h2`
  margin: 0;
  font-size: 18px;
`
