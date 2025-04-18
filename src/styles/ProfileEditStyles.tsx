import styled from '@emotion/styled'

export const ProfileContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  gap: 10px;
  margin-top: 15px;
  padding: 0 10px;

  @media (max-width: 480px) {
    padding: 0 5px;
  }

  @media (min-width: 768px) {
    padding: 0 15px;
    gap: 20px;
  }
`

export const ProfileImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;

  @media (max-width: 480px) {
    width: 45px;
    height: 45px;
  }

  @media (min-width: 768px) {
    width: 70px;
    height: 70px;
  }
`

export const UserNameText = styled.h2`
  font-family: 'Pretendard', sans-serif;
  font-weight: 700;
  font-size: 18px;
  color: #000000;
  margin: 0;
  flex-grow: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-right: 10px;

  @media (max-width: 480px) {
    font-size: 16px;
    padding-right: 5px;
  }

  @media (min-width: 768px) {
    font-size: 20px;
    padding-right: min(
      10%,
      100px
    ); /* 화면 크기에 비례하여 최대 100px까지 패딩 적용 */
  }
`

export const ProfileEditButton = styled.button`
  background-color: #392111;
  color: #ffffff;
  font-family: 'Pretendard', sans-serif;
  font-weight: 600;
  font-size: 12px;
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;

  &:hover {
    opacity: 0.9;
  }

  @media (max-width: 480px) {
    padding: 6px 12px;
    font-size: 11px;
  }

  @media (min-width: 768px) {
    padding: 10px 20px;
    font-size: 14px;
  }

  @media (min-width: 1024px) {
    padding: 12px 24px;
    font-size: 16px;
  }
`
