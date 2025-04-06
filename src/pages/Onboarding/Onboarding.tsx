/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProgressBar from '../../components/buttons/progressBar'
import Emoticon from '../../components/emoticon/Emoticon'
import {
  pageContainerStyle,
  headerStyle,
  contentContainerStyle,
  textContainerStyle,
  head2BoldStyle,
  body2ReStyle,
  emoticonContainerStyle,
  progressBarContainerStyle,
  buttonContainerStyle,
  googleButtonStyle,
  iconStyle,
} from '../../styles/OnboardingStyles'

const OnboardingPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const navigate = useNavigate()

  // 슬라이드 내용
  const slides = [
    {
      heading:
        '대학생활이 처음이라서 낯설다면\n마인드 메이트에서 시작해보세요!',
      body: '어떻게 적응해야 할지 고민이라면?\n마인드 메이트가 도와줄게요!',
      emoticonType: 'hoodie',
    },
    {
      heading: '선배들에게 조언을 구하고,\n후배들에게 경험을 나누세요!',
      body: '서로의 고민을 나누며,\n들으며 성장해보세요.',
      emoticonType: 'student',
    },
    {
      heading: '당신의 경험이 후배들의\n길잡이가 될 수 있어요.',
      body: '선배에게 조언을 구하고 싶었던 적이 있지 않나요?\n이제는 당신이 후배들에게 길을 보여줄 차례예요!',
      emoticonType: 'graduate',
    },
    {
      heading: '혼자 고민하지 마세요\n마인드 메이트가 함께 할게요!',
      body: '지금 바로 \n나와 맞는 대화 상대를 찾아볼까요?',
      emoticonType: 'study',
    },
  ]

  // 구글 로그인 핸들러
  const handleGoogleLogin = () => {
    console.log('Google login clicked')
    alert('구글 로그인 버튼 클릭됨')
  }

  // 현재 슬라이드 정보
  const currentSlide = slides[currentIndex]

  // ProgressBar에 전달할 슬라이드 컴포넌트
  const slideComponents = slides.map((_, idx) => (
    <div key={`slide${idx + 1}`}></div>
  ))

  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '767px' }}>
        <div css={[pageContainerStyle]}>
          {/* 헤더 */}
          <div css={headerStyle} />

          {/* 콘텐츠 영역 */}
          <div css={contentContainerStyle}>
            {/* 텍스트 영역 */}
            <div css={textContainerStyle}>
              <h2 css={head2BoldStyle}>{currentSlide.heading}</h2>
              <p css={body2ReStyle}>{currentSlide.body}</p>
            </div>

            {/* 이모티콘 영역 */}
            <div css={emoticonContainerStyle}>
              <Emoticon
                type={currentSlide.emoticonType as any}
                size="huge"
                alt={`Onboarding illustration ${currentIndex + 1}`}
              />
            </div>

            {/* 프로그레스바 영역 */}
            <div css={[progressBarContainerStyle]}>
              <ProgressBar
                slides={slideComponents}
                duration={5000}
                onIndexChange={setCurrentIndex}
                autoPlay={true}
              />
            </div>

            {/* 버튼 영역 - 항상 하단에 고정되도록 수정 */}
            <div css={[buttonContainerStyle]}>
              <button
                css={googleButtonStyle}
                onClick={handleGoogleLogin}
                type="button"
              >
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google"
                  css={iconStyle}
                />
                아이디링크 계정으로 로그인
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OnboardingPage
