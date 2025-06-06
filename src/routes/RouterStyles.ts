import { css } from '@emotion/react'

// 라우터 컨테이너 스타일
export const routerContainerStyle = css`
  width: 100%;
  height: 100vh;
  overflow: hidden;
`

// 페이지 래퍼 스타일
export const pageWrapperStyle = css`
  width: 100%;
  height: 100%;
  background: #ffffff;
`

// 로딩 스타일
export const loadingStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  background: #ffffff;

  > div {
    font-size: 16px;
    color: #666666;
  }
`

// 404 페이지 스타일
export const notFoundStyle = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #f0daa9 0%, #fffcf5 90%);
  color: white;
  text-align: center;
  padding: 0 auto;
`

export const notFoundContentStyle = css`
  max-width: 400px;
  animation: fadeInUp 0.6s ease-out;

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`

export const notFoundNumberStyle = css`
  font-size: 120px;
  font-weight: 900;
  margin: 0;
  background: linear-gradient(45deg, #392111);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 10px #392111;
  line-height: 1;
  margin-bottom: 20px;
`

export const notFoundTitleStyle = css`
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 16px 0;
  color: #392111;
`

export const notFoundDescriptionStyle = css`
  font-size: 18px;
  margin: 0 0 40px 0;
  color: #392111;
  line-height: 1.5;
`

export const notFoundButtonStyle = css`
  display: inline-flex;
  align-items: center;
  padding: 16px 32px;
  background: #392111;
  color: white;
  text-decoration: none;
  border-radius: 50px;
  font-weight: 600;
  font-size: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid#5c351b;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background: #5c351b;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px #5c351b;
  }

  &:active {
    transform: translateY(0);
  }
`

export const notFoundIconStyle = css`
  margin-right: 8px;
  font-size: 20px;
`
