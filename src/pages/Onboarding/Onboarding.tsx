/** @jsxImportSource @emotion/react */
import { useState, useEffect, TouchEvent, MouseEvent } from 'react'
import Emoticon from '../../components/emoticon/Emoticon'
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { fetchWithRefresh } from '../../utils/fetchWithRefresh'
import {
  pageContainerStyle,
  headerStyle,
  contentContainerStyle,
  containerStyle,
  sliderWrapperStyle,
  textContainerStyle,
  head2BoldStyle,
  body2ReStyle,
  emoticonContainerStyle,
  progressBarContainerStyle,
  progressBarDotsContainerStyle,
  progressDotStyle,
  buttonContainerStyle,
  googleButtonStyle,
  iconStyle,
  slideContentStyle,
  textFadeStyle,
  emoticonSlideStyle,
} from '../../styles/OnboardingStyles'
import { useNavigate } from 'react-router-dom'
import { setTokenCookie } from '../../utils/fetchWithRefresh'
import { useAuthStore } from '../../stores/userStore'

const clientId =
  '886143898358-4cja76nlu7mp5upid042la3k3vovnd8p.apps.googleusercontent.com'

// 반응형을 위한 화면 크기 감지 hook
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowSize
}

function OnboardingContent() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [currentX, setCurrentX] = useState(0)
  const [autoPlayPaused, setAutoPlayPaused] = useState(false)
  const { width } = useWindowSize()
  const navigate = useNavigate()
  const { setUser, user } = useAuthStore()

  // 반응형 이모티콘 크기 설정
  const getEmoticonSize = () => {
    if (width <= 375) return 'xxlarge'
    if (width <= 479) return 'xxlarge'
    return 'huge'
  }

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
      body: '서로의 고민을 나누며 들으며 성장해보세요. \n 모두에게 소중한 경험이 될거에요!',
      emoticonType: 'student',
    },
    {
      heading: '당신의 경험이 후배들의\n길잡이가 될 수 있어요.',
      body: '선배에게 조언을 구하고 싶었던 적이 있지 않나요?\n이제는 당신이 후배들에게 길을 보여줄 차례예요!',
      emoticonType: 'graduate',
    },
    {
      heading: '혼자 고민하지 마세요\n마인드 메이트가 함께 할게요!',
      body: '지금 바로 나와 맞는 대화 상대를 찾아볼까요?\n 마인드 메이트가 함께할게요!',
      emoticonType: 'study',
    },
  ]

  const TEMP_PASSWORD = '@Test1234!'

  // 구글 로그인 성공 시 서버에 access_token 전달
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      // 1. 구글 유저 정보 가져오기 (여기는 credentials 필요 없음)
      const googleUserInfo = await fetch(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        }
      ).then((res) => res.json())

      // 2. 회원가입 시도 (credentials: 'include')
      const registerRes = await fetch('http://localhost/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: googleUserInfo.email,
          password: TEMP_PASSWORD,
          confirmPassword: TEMP_PASSWORD,
          agreeToTerm: true,
        }),
      }).then((res) => res.json())

      // 3. 로그인 시도 (credentials: 'include')
      const loginRes = await fetch('http://localhost/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: googleUserInfo.email,
          password: TEMP_PASSWORD,
          fcmToken: '',
        }),
      })

      if (loginRes.ok) {
        loginRes.json().then(async (data) => {
          if (data.accessToken && data.refreshToken) {
            setTokenCookie(data.accessToken, 'accessToken')
            setTokenCookie(data.refreshToken, 'refreshToken')

            if (data.message == null) {
              const res = await fetchWithRefresh(
                `http://localhost/api/profiles/${localStorage.getItem('userId')}`,
                {
                  method: 'GET',
                  headers: { 'Content-Type': 'application/json' },
                }
              )
              const ProfileData = await res.json()
              if (!res.ok) throw new Error('프로필 생성 실패')

              setUser(ProfileData)

              navigate('/home')
            } else {
              navigate('/register')
            }
          }
        })
      }
    },
    onError: (errorResponse) => {
      alert('구글 로그인에 실패했습니다.')
      console.error(errorResponse)
    },
    flow: 'implicit',
  })

  // ProgressBar 관련 기능 구현
  useEffect(() => {
    setIsInitialized(true)
  }, [])

  useEffect(() => {
    if (!isInitialized || autoPlayPaused || isDragging) return

    const timer = setInterval(() => {
      nextSlide()
    }, 5000) // 5초 간격으로 자동 슬라이드

    return () => clearInterval(timer)
  }, [currentIndex, isInitialized, autoPlayPaused, isDragging])

  const nextSlide = () => {
    const nextIndex = (currentIndex + 1) % slides.length
    setCurrentIndex(nextIndex)
  }

  const prevSlide = () => {
    const prevIndex = currentIndex <= 0 ? slides.length - 1 : currentIndex - 1
    setCurrentIndex(prevIndex)
  }

  const handleDragStart = (e: TouchEvent | MouseEvent) => {
    setIsDragging(true)
    setAutoPlayPaused(true)
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    setStartX(clientX)
    setCurrentX(clientX)
  }

  const handleDragMove = (e: TouchEvent | MouseEvent) => {
    if (!isDragging) return
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    setCurrentX(clientX)
  }

  const handleDragEnd = () => {
    if (!isDragging) return

    const diff = currentX - startX
    const threshold = 50 // 슬라이드 전환을 위한 최소 드래그 거리

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        // 오른쪽으로 드래그
        if (currentIndex > 0) {
          prevSlide()
        } else {
          // 첫 번째 슬라이드에서 마지막으로
          setCurrentIndex(slides.length - 1)
        }
      } else if (diff < 0) {
        // 왼쪽으로 드래그
        if (currentIndex < slides.length - 1) {
          nextSlide()
        } else {
          // 마지막 슬라이드에서 처음으로
          setCurrentIndex(0)
        }
      }
    }

    setIsDragging(false)
    setTimeout(() => setAutoPlayPaused(false), 1000)
  }

  const dragOffset = isDragging ? currentX - startX : 0
  const getSlideOffset = (index: number, currentIndex: number) => {
    let offset = (index - currentIndex) * 100 + dragOffset / 5

    // 첫 번째 슬라이드에서 오른쪽으로 드래그할 때
    if (currentIndex === 0 && dragOffset > 0) {
      const lastSlideOffset = (slides.length - 1 - currentIndex) * 100
      offset = dragOffset / 5 - lastSlideOffset
    }

    // 마지막 슬라이드에서 왼쪽으로 드래그할 때
    else if (currentIndex === slides.length - 1 && dragOffset < 0) {
      offset = dragOffset / 5 + 100
    }

    return offset
  }

  const handleDotClick = (index: number) => {
    if (index === currentIndex) return
    setCurrentIndex(index)
  }

  // 이미 로그인된 경우 home으로 이동
  useEffect(() => {
    if (user) {
      navigate('/home', { replace: true })
    }
  }, [user, navigate])

  if (!isInitialized) return null

  const emoticonSize = getEmoticonSize()

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <div
        style={{ width: '100%', maxWidth: '767px', boxSizing: 'border-box' }}
      >
        <div css={pageContainerStyle}>
          {/* 헤더 */}
          <div css={headerStyle} />

          {/* 콘텐츠 영역 */}
          <div css={contentContainerStyle}>
            {/* 슬라이더 영역 */}
            <div css={containerStyle}>
              <div
                css={sliderWrapperStyle}
                onTouchStart={handleDragStart}
                onTouchMove={handleDragMove}
                onTouchEnd={handleDragEnd}
                onMouseDown={handleDragStart}
                onMouseMove={handleDragMove}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
              >
                {/* 슬라이드 컴포넌트 생성 */}
                {slides.map((slide, idx) => (
                  <div
                    key={`slide${idx + 1}`}
                    css={slideContentStyle(
                      idx === currentIndex,
                      idx,
                      currentIndex,
                      isDragging
                    )}
                  >
                    {/* 제목과 설명 */}
                    <div
                      css={[
                        textContainerStyle,
                        textFadeStyle(idx === currentIndex),
                      ]}
                    >
                      <h2 css={head2BoldStyle}>{slide.heading}</h2>
                      <p css={body2ReStyle}>{slide.body}</p>
                    </div>

                    {/* 이모티콘 */}
                    <div
                      css={[
                        emoticonContainerStyle,
                        emoticonSlideStyle(
                          idx === currentIndex,
                          idx,
                          currentIndex,
                          getSlideOffset(idx, currentIndex),
                          isDragging
                        ),
                      ]}
                    >
                      <Emoticon
                        type={slide.emoticonType as any}
                        size={emoticonSize as any}
                        alt={`Onboarding illustration ${idx + 1}`}
                      />
                    </div>

                    {/* 프로그레스바 - 활성화된 슬라이드에서만 표시 */}
                    {idx === currentIndex && (
                      <div css={progressBarContainerStyle}>
                        <div css={progressBarDotsContainerStyle}>
                          {slides.map((_, index) => (
                            <button
                              key={index}
                              css={progressDotStyle(index === currentIndex)}
                              onClick={() => handleDotClick(index)}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            {/* 버튼 영역 */}
            <div css={buttonContainerStyle}>
              <button
                css={googleButtonStyle}
                onClick={() => googleLogin()}
                type="button"
              >
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google"
                  css={iconStyle}
                />
                아주대학교 계정으로 로그인
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const OnboardingPage = () => {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <OnboardingContent />
    </GoogleOAuthProvider>
  )
}

export default OnboardingPage
