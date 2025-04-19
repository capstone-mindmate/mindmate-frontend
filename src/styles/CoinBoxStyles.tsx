import styled from '@emotion/styled'

export const CoinBoxContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  background-color: #f5f5f5;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  width: 90%;
  box-sizing: border-box;
  margin: 30px auto;
  max-width: 700px;
`

export const CoinBoxText = styled.span`
  font-family: 'Pretendard', sans-serif;
  font-size: 15px;
  color: #150c06;
  font-weight: 350;
`

export const CoinBoxValue = styled.div`
  display: flex;
  align-items: center;
  font-family: 'Pretendard', sans-serif;
  font-size: 15px;
  color: #392111;
  font-weight: 600;

  svg {
    margin-right: 4px;
  }
`
