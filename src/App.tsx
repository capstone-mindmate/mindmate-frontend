import './App.css'
import * as IconComponents from './components/icon/iconComponents'
import { GlobalStyles } from '../styles/GlobalStyles'
import { BrowserRouter as Router, Routes } from 'react-router-dom'
import NavigationComponent from './components/navigation/navigationComponent'
import { useToast } from './components/Toast/ToastProvider.tsx'
import TopBar from './components/topbar/Topbar.tsx'
import Frame from './components/frame/Frame'
import InputBox from './components/buttons/inputBox'
import CategoryButton from './components/buttons/categoryButton'
import ConfirmButton from './components/buttons/confirmButton'
import BrownRoundButton from './components/buttons/brownRoundButton'
import YellowRoundButton from './components/buttons/yellowRoundButton'
import FilterButton from './components/buttons/filterButton'
import FloatingButton from './components/buttons/floatingButton'
import PurchaseButton from './components/buttons/purchaseButton'
import { ReportButton, ReportItem } from './components/buttons/reportButton'
import ReviewButton from './components/buttons/reviewButton'
import ProgressBar from './components/buttons/progressBar'
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useState } from 'react'

const iconListStyles = css`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
`

const handleInputChange = (value: string) => {
  console.log('input 박스 값 변경되는가?? : ', value)
}

function App() {
  const [count, setCount] = useState(0)
  const { showToast } = useToast()

  const handleBackClick = () => {
    showToast('뒤로가기 버튼이 클릭되었습니다', 'info')
  }

  const handleAction = () => {
    showToast('액션 버튼이 클릭되었습니다', 'success')
  }

  const handleFrameClick = () => {
    showToast('프레임이 클릭되었습니다', 'info')
  }

  return (
    <>
      <GlobalStyles />
      <TopBar
        title="타이틀 입력"
        showBackButton
        onBackClick={handleBackClick}
        actionText="등록"
        onActionClick={handleAction}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'c햣enter',
          height: '100%',
          paddingTop: '70px', // TopBar 높이만큼 여백 추가
        }}
      >
        {/* Frame 컴포넌트 예시들 (다양한 길이의 제목) */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '20px',
            maxWidth: '900px',
            flexWrap: 'wrap',
            gap: '15px',
          }}
        >
          <div style={{ width: '280px', height: '380px' }}>
            <Frame
              title="친구 사이에도 거리두기가 필요해"
              imageSrc="public/image.png"
              detail="인간관계 때문에 고민중이라면 필독 👀"
              currentPage={2}
              totalPages={25}
              onClick={handleFrameClick}
            />
          </div>

          <div style={{ width: '280px', height: '380px' }}>
            <Frame
              title="익명 대화 뜻밖의 현실조언"
              imageSrc="public/image copy.png"
              detail="아무 이해관계 없는 사람이라 더 객관적인 조언들이 필요하다."
              currentPage={25}
              totalPages={25}
              onClick={handleFrameClick}
            />
          </div>

          <div style={{ width: '280px', height: '380px' }}>
            <Frame
              title="작심삼일도 10번 하면 한달이다"
              imageSrc="public/image copy 2.png"
              detail="작심삼일하던 사람이 1등한 비법"
              currentPage={3}
              totalPages={25}
              onClick={handleFrameClick}
            />
          </div>
        </div>

        <div className="card" style={{ marginBottom: '30px' }}>
          <button
            onClick={() => {
              setCount((count) => count + 1)
              if (count % 4 === 0) {
                showToast('카운트가 증가했습니다!', 'success')
              } else if (count % 4 === 1) {
                showToast('아주대학교 이메일을 입력해주세요', 'info')
              } else if (count % 4 === 2) {
                showToast('네트워크 연결을 확인해주세요', 'warning')
              } else {
                showToast('전송에 실패했습니다', 'error')
              }
            }}
          >
            count is {count}
          </button>
        </div>

        <div className="icon-list" css={iconListStyles}>
          <IconComponents.AlarmIcon color="#F7374F" />
          <IconComponents.BackIcon color="#F7374F" />
          <IconComponents.CheckIconBig color="#F7374F" />
          <IconComponents.CheckIconSmall color="#F7374F" />
          <IconComponents.ErrorIcon color="#F7374F" />
          <IconComponents.ImageIcon color="#F7374F" />
          <IconComponents.InfoIcon color="#F7374F" />
          <IconComponents.KebabIcon color="#F7374F" />
          <IconComponents.ListIcon color="#F7374F" />
          <IconComponents.PlusIcon color="#F7374F" />
          <IconComponents.SearchIcon color="#F7374F" />
          <IconComponents.SendIcon color="#F7374F" />
          <IconComponents.SettingIcon color="#F7374F" />
          <IconComponents.SmileIcon color="#F7374F" />
          <IconComponents.StarIcon color="#F7374F" />
          <IconComponents.TextIcon color="#F7374F" />
          <IconComponents.UploadIcon color="#F7374F" />
          <IconComponents.WarningIcon color="#F7374F" />
          <IconComponents.AttachmentIcon color="#F7374F" />
          <IconComponents.CameraIcon color="#F7374F" />
          <IconComponents.ChatAlertIcon
            color="#F7374F"
            alertCount={10}
            fontSize={12}
          />
          <IconComponents.ChatBoxIcon color="#F7374F" />
          <IconComponents.ChatBubbleIcon color="#F7374F" />
          <IconComponents.CoinIcon color="#F7374F" />
          <IconComponents.HomeIcon color="#F7374F" />
          <IconComponents.MessageIcon color="#F7374F" />
          <IconComponents.NormalPlusIcon color="#F7374F" />
          <IconComponents.UserIcon color="#F7374F" />
          <IconComponents.CloseIcon color="#F7374F" />
        </div>

        <div className="buttons" style={{ width: '375px', margin: '30px 0' }}>
          <InputBox
            placeholder="텍스트를 입력해주세요"
            value=""
            onChange={handleInputChange}
            titleText="타이틀 텍스트"
          />

          <CategoryButton
            buttonText="💼 취업"
            onActiveChange={(isActive) => {
              console.log('버튼 상태 : ', isActive)
            }}
          />

          <CategoryButton
            buttonText="🤯 진로"
            onActiveChange={(isActive) => {
              console.log('버튼 상태 : ', isActive)
            }}
          />

          <CategoryButton
            buttonText="👥 인간관계"
            onActiveChange={(isActive) => {
              console.log('버튼 상태 : ', isActive)
            }}
          />

          <ConfirmButton
            buttonText="인증하기"
            onActiveChange={(isActive) => {
              console.log('버튼 상태 : ', isActive)
            }}
          />

          <div
            className="buttonList__"
            style={{
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap',
              padding: '20px 0',
            }}
          >
            <BrownRoundButton
              buttonText="리스너"
              onActiveChange={(isActive) => {
                console.log('버튼 상태 : ', isActive)
              }}
            />

            <BrownRoundButton
              buttonText="랜덤매칭 허용"
              onActiveChange={(isActive) => {
                console.log('버튼 상태 : ', isActive)
              }}
            />

            <BrownRoundButton
              buttonText="👂🏻 리스너"
              onActiveChange={(isActive) => {
                console.log('버튼 상태 : ', isActive)
              }}
            />

            <YellowRoundButton
              buttonText="스피커"
              onActiveChange={(isActive) => {
                console.log('버튼 상태 : ', isActive)
              }}
            />

            <YellowRoundButton
              buttonText="🗣️ 스피커"
              onActiveChange={(isActive) => {
                console.log('버튼 상태 : ', isActive)
              }}
            />
          </div>

          <div className="filterList" style={{ display: 'flex', gap: '10px' }}>
            <FilterButton
              buttonText="전체"
              onActiveChange={(isActive) => {
                console.log('버튼 상태 : ', isActive)
              }}
            />

            <FilterButton
              buttonText="리스너"
              onActiveChange={(isActive) => {
                console.log('버튼 상태 : ', isActive)
              }}
            />

            <FilterButton
              buttonText="스피커"
              onActiveChange={(isActive) => {
                console.log('버튼 상태 : ', isActive)
              }}
            />

            <FilterButton
              buttonText="완료"
              onActiveChange={(isActive) => {
                console.log('버튼 상태 : ', isActive)
              }}
            />
          </div>

          <div className="floatingList">
            <FloatingButton
              buttonIcon={<IconComponents.NormalPlusIcon color="#ffffff" />}
              buttonText="글쓰기"
              onActiveChange={(isActive) => {
                console.log('버튼 상태 : ', isActive)
              }}
            />
          </div>

          <div
            className="purchaseList"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              padding: '20px 0',
            }}
          >
            <PurchaseButton priceText={2500} />
            <PurchaseButton priceText={1000} />
            <PurchaseButton priceText={4000} />
            <PurchaseButton priceText={12341234} />
          </div>

          <div className="reportList">
            <ReportItem reportText="신고 항목 내용" />
            <ReportButton />
          </div>

          <div
            className="reviewList"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              padding: '20px 0',
            }}
          >
            <ReviewButton reviewText="⚡️ 응답이 빨라요" />
            <ReviewButton reviewText="❤️‍🩹 공감을 잘해줘요" />
            <ReviewButton reviewText="🤝🏻 신뢰할 수 있는 대화였어요" />
          </div>

          <div className="progressBar">
            <ProgressBar
              slides={[
                <div style={{ width: '280px', height: '380px' }}>
                  <Frame
                    title="친구 사이에도 거리두기가 필요해"
                    imageSrc="public/image.png"
                    detail="인간관계 때문에 고민중이라면 필독 👀"
                    currentPage={2}
                    totalPages={25}
                    onClick={() => {}}
                  />
                </div>,

                <div style={{ width: '280px', height: '380px' }}>
                  <Frame
                    title="익명 대화 뜻밖의 현실조언"
                    imageSrc="public/image copy.png"
                    detail="아무 이해관계 없는 사람이라 더 객관적인 조언들이 필요하다."
                    currentPage={25}
                    totalPages={25}
                    onClick={() => {}}
                  />
                </div>,

                <div style={{ width: '280px', height: '380px' }}>
                  <Frame
                    title="작심삼일도 10번 하면 한달이다"
                    imageSrc="public/image copy 2.png"
                    detail="작심삼일하던 사람이 1등한 비법"
                    currentPage={3}
                    totalPages={25}
                    onClick={() => {}}
                  />
                </div>,
              ]}
              onIndexChange={(index) => {
                console.log('현재 슬라이드 : ', index)
              }}
            />
          </div>
        </div>

        <div className="navigation" style={{ width: '50%' }}>
          <Router>
            <div style={{ paddingBottom: '60px' }}>
              <Routes>
                {/* <Route path="/" element={} />
                <Route path="/chat" element={} />
                <Route path="/profile" element={} /> */}
                {/* 위에 path 나중에 정한거 업데이트 하기 */}
              </Routes>
              <NavigationComponent />
            </div>
          </Router>
        </div>
      </div>
    </>
  )
}

export default App
