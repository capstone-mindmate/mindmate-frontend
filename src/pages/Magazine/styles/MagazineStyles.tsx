import styled from '@emotion/styled'

// 스타일 컴포넌트 정의
export const MagazineDetailContainer = styled.div`
  width: 100%;
  max-width: 884px;
  margin: 0 auto;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  overflow: hidden;
  overflow-y: auto;
`

export const CoverImage = styled.div<{ featuredImage: string | null }>`
  width: 100%;
  height: 40vh;
  min-height: 300px;
  background-image: ${({ featuredImage }) =>
    featuredImage ? `url(${featuredImage})` : 'url(/public/image.png)'};
  background-size: cover;
  background-position: center;
  position: relative;
`

export const TitleOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  color: white;
`

export const MagazineTitle = styled.h1`
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 700;
  word-break: keep-all; /* 단어 유지 */
  max-width: 70%; /* 컨테이너 너비의 70%까지만 사용 */
  color: #ffffff;
`

export const MagazineSubtitle = styled.h2`
  margin: 0;
  font-size: 16px;
  font-weight: 400;
  color: #ffffff;
  opacity: 0.9;
`

export const ContentContainer = styled.div`
  flex: 1;
  padding: 24px;
  display: flex;
  flex-direction: column;
  padding-bottom: 100px;
`

export const MagazineContent = styled.div`
  font-size: 16px;
  line-height: 1.6;
  color: #333333;
  flex: 1;

  img {
    max-width: 100%;
    height: auto;
    margin: 16px 0;
  }

  p {
    margin-bottom: 16px;
  }
`

export const AuthorProfileContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: #f8f8f8;
  border-radius: 12px;
  padding: 16px;
  margin-top: 20px;
  cursor: pointer;

  &:hover {
    background-color: #f0f0f0;
  }
`

export const AuthorProfileImage = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 16px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

export const AuthorProfileInfo = styled.div`
  flex: 1;
`

export const NameRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 4px;
`

export const AuthorProfileName = styled.p`
  font-size: 16px;
  font-weight: 600;
  color: #333333;
  margin: 0;
`

export const AuthorProfileDepartment = styled.p`
  font-size: 14px;
  color: #666666;
  margin: 0 0 0 8px;
`

export const AuthorDate = styled.p`
  font-size: 14px;
  color: #999999;
  margin: 0;
`

export const AuthorProfileArrow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

export const BottomToolbar = styled.div`
  display: flex;
  padding: 5px 16px;
  border-top: 1px solid #d9d9d9;
  bottom: 0;
  width: 100%;
  background-color: #ffffff;
  position: fixed;
`

export const ToolbarButton = styled.button<{ active?: boolean }>`
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:last-child {
    margin-right: 0;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

export const LikeCount = styled.span`
  font-size: 14px;
  color: #333333;
  margin-left: 4px;
`
