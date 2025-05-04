import styled from '@emotion/styled'

// 알림 페이지 컨테이너
export const NotificationContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: start;
  overflow: hidden;
`

// 컨텐츠 컨테이너
export const ContentContainer = styled.div`
  width: 100%;
  max-width: 884px;
  box-sizing: border-box;
  margin: 0 auto;
`

// 알림 아이템 컨테이너
export const NotificationItemContainer = styled.div<{ isRead: boolean }>`
  display: flex;
  padding: 16px;
  background-color: ${({ isRead }) => (isRead ? '#F5F5F5' : '#FFFCF5')};
  border-bottom: 1px solid #d9d9d9;
`

// 알림 아이템 내부 컨테이너
export const ItemInnerContainer = styled.div`
  display: flex;
  width: 100%;
  gap: 16px;
  margin: 0 16px;
  align-items: flex-start;
`

// 아이콘 컨테이너
export const IconContainer = styled.div<{ isRead: boolean }>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid ${({ isRead }) => (isRead ? '#D9D9D9' : '#392111')};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`

// 알림 내용 컨테이너
export const NotificationContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
`

// 알림 제목
export const NotificationTitle = styled.p`
  font-family: 'Pretendard';
  font-size: 16px;
  font-weight: 700;
  color: #000000;
  margin: 0;
`

// 알림 설명
export const NotificationDescription = styled.p`
  font-family: 'Pretendard';
  font-size: 14px;
  font-weight: 400;
  color: #565656;
  margin: 0;
`

// 알림 시간
export const NotificationTime = styled.p`
  font-family: 'Pretendard';
  font-size: 12px;
  font-weight: 400;
  color: #9e9e9e;
  margin: 4px 0 0 0;
`
