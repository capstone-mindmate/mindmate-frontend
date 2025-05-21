import styled from '@emotion/styled'
import { media } from '../../../../styles/breakpoints'

export const ChatItemContainer = styled.div<{ borderBottom: boolean }>`
  width: 100%;
  padding: 22px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  gap: 12px;
  border-bottom: ${({ borderBottom }) =>
    borderBottom ? '1px solid #E6E6E6' : 'none'};
`

export const ChatTopInfoContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

export const ChatBottomInfoContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

export const LeftContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
`

export const RightContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`

export const ProfileImage = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
`

export const NickName = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 1.4;
  color: #727272;
  margin: 0;
`

export const LastTime = styled.div`
  font-size: 12px;
  font-weight: 400;
  line-height: 1.4;
  color: #727272;
  margin: 0;
`

export const UnreadCount = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.4;
  color: #ffffff;
  background-color: #fb4f50;
  margin: 0;
`

export const InfoBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
`

export const MainInfoBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 2px;
`

export const MessageInfoBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`

export const Subject = styled.div`
  font-size: 16px;
  font-weight: 600;
  line-height: 1.5;
  color: #150c06;
  margin: 0;
`

export const Category = styled.div`
  font-size: 10px;
  font-weight: bold;
  line-height: 1.3;
  color: #393939;
  margin: 0;
  padding: 3px;
  background-color: #f5f5f5;
  border-radius: 2px;
`

export const UserType = styled.div<{ userType: string }>`
  font-size: 10px;
  font-weight: bold;
  line-height: 1.3;
  margin: 0;
  padding: 3px;
  background-color: #fff9eb;
  border-radius: 2px;
  margin-left: 4px;
  ${({ userType }) =>
    userType === '스피커'
      ? `
    background-color: #FFF9EB;
    color: #393939;
  `
      : `
    background-color: #5C351B;
    color: #FFFFFF;
  `}
`

export const Message = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 1.4;
  color: #727272;
  margin: 0;
`
