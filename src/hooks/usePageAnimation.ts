import { css } from '@emotion/react'

// 페이지 진입 애니메이션
export const usePageAnimation = () => {
  const fadeInUpStyle = css`
    animation: fadeInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `

  const fadeInStyle = css`
    animation: fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  `

  const slideInFromRightStyle = css`
    animation: slideInFromRight 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;

    @keyframes slideInFromRight {
      from {
        opacity: 0;
        transform: translateX(30px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
  `

  const slideInFromLeftStyle = css`
    animation: slideInFromLeft 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;

    @keyframes slideInFromLeft {
      from {
        opacity: 0;
        transform: translateX(-30px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
  `

  const scaleInStyle = css`
    animation: scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;

    @keyframes scaleIn {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
  `

  return {
    fadeInUp: fadeInUpStyle,
    fadeIn: fadeInStyle,
    slideInFromRight: slideInFromRightStyle,
    slideInFromLeft: slideInFromLeftStyle,
    scaleIn: scaleInStyle,
  }
}

// 부드러운 네비게이션을 위한 헬퍼 함수
export const smoothNavigate = (navigate: any, path: string, options?: any) => {
  // 클릭 피드백을 위한 약간의 지연
  setTimeout(() => {
    navigate(path, options)
  }, 100)
}
