import styled from '@emotion/styled'

export const ProfileContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 20px;
  width: 100%;
  gap: 16px;
`

export const ProfileImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
`

export const UserNameText = styled.h2`
  font-family: 'Pretendard', sans-serif;
  font-weight: 700; /* bold */
  font-size: 16px;
  color: #000000;
  margin: 0;
  flex-grow: 1;
`

export const ProfileEditButton = styled.button`
  background-color: #392111;
  color: #ffffff;
  font-family: 'Pretendard', sans-serif;
  font-weight: 600; /* semibold */
  font-size: 12px;
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`

export const ProfileEditWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 375px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 10px;
  margin: 20px 0;
`
