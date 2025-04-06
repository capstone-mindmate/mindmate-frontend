import '../../App.css'
import * as IconComponents from '../../components/icon/iconComponents'
import NavigationComponent from '../../components/navigation/navigationComponent'
import { useToast } from '../../components/toast/ToastProvider.tsx'
import TopBar from '../../components/topbar/Topbar.tsx'
import Frame from '../../components/frame/Frame'
import TitleInputBox from '../../components/inputs/titleInputBox.tsx'
import CategoryButton from '../../components/buttons/categoryButton'
import ConfirmButton from '../../components/buttons/confirmButton'
import BrownRoundButton from '../../components/buttons/brownRoundButton'
import YellowRoundButton from '../../components/buttons/yellowRoundButton'
import FilterButton from '../../components/buttons/filterButton'
import FloatingButton from '../../components/buttons/floatingButton'
import PurchaseButton from '../../components/buttons/purchaseButton'
import { ReportButton, ReportItem } from '../../components/buttons/reportButton'
import ReviewButton from '../../components/buttons/reviewButton'
import ProgressBar from '../../components/buttons/progressBar'
import BrownRectButton from '../../components/buttons/brownRectButton'
import CardNewsComponent from '../../components/home/cardNewsComponent'
import HomeCategoryButton from '../../components/home/homeCategoryButton.tsx'
import ModalComponent from '../../components/modal/modalComponent'
import InfoBox from '../../components/mypage/InfoBox'
import MatchingGraph from '../../components/mypage/MatchingGraph'
import PointHistory from '../../components/point/pointHistory'
import Bubble from '../../components/chat/Bubble'
import CustomFormBubbleSend from '../../components/chat/CustomFormBubbleSend'
import CustomFormBubbleReceive from '../../components/chat/CustomFormBubbleReceive'
import ChatBar from '../../components/chat/ChatBar'
import AskInput from '../../components/customForm/AskInput'
import AnswerInput from '../../components/customForm/AnswerInput'
import TagReview from '../../components/review/TagReview.tsx'
import DetailReview from '../../components/review/DetailReview'
import Star from '../../components/review/Star.tsx'
import StudentSupportLink from '../../components/home/StudentSupportLink'
import EmoticonComponent, {
  EmoticonType,
} from '../../components/emoticon/Emoticon.tsx'
import React, { useState } from 'react'

/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'

// styles 경로 변환
import { GlobalStyles } from '../../../styles/GlobalStyles'
const iconListStyles = css`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
`

const bubbleContainerStyles = css`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 375px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  margin: 20px 0;
`

// TagReview 테스트 데이터
const reviewTags = [
  { icon: '⚡', text: '응답이 빨라요', count: 12 },
  { icon: '🤝', text: '신뢰할 수 있는 대화였어요', count: 9 },
  { icon: '❤️', text: '공감을 잘해줘요', count: 8 },
  { icon: '☕', text: '편안한 분위기에서 이야기할 수 있었어요', count: 6 },
  { icon: '🎯', text: '솔직하고 현실적인 조언을 해줘요', count: 3 },
  { icon: '💡', text: '새로운 관점을 제시해줘요', count: 1 },
]

const handleInputChange = (value: string) => {
  console.log('input 박스 값 변경되는가?? : ', value)
}

function App() {
  const [count, setCount] = useState(0)
  const { showToast } = useToast()
  const [selectedEmoticon, setSelectedEmoticon] =
    useState<EmoticonType>('normal')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState<
    '매칭신청' | '매칭실패' | '채팅종료'
  >('매칭신청')

  // 별점 상태
  const [selectedRating, setSelectedRating] = useState(4)

  const handleBackClick = () => {
    showToast('뒤로가기 버튼이 클릭되었습니다', 'info')
  }

  const handleAction = () => {
    showToast('액션 버튼이 클릭되었습니다', 'success')
  }

  const handleFrameClick = () => {
    showToast('프레임이 클릭되었습니다', 'info')
  }

  // 모달 닫기 전용 핸들러
  const handleModalClose = () => {
    setIsModalOpen(false)
  }

  // 매칭 신청 버튼 클릭 핸들러
  const handleMatchingRequest = () => {
    // 매칭 신청 처리 로직
    console.log('매칭 신청 처리')
  }

  // 모달 열기 핸들러
  const handleOpenModal = (type: '매칭신청' | '매칭실패' | '채팅종료') => {
    setModalType(type)
    setIsModalOpen(true)
  }

  // 이모티콘 클릭 핸들러
  const handleEmoticonClick = (type: EmoticonType) => {
    setSelectedEmoticon(type)
    showToast(`${type} 이모티콘 선택됨`, 'success')
  }

  // 별점 변경 핸들러
  const handleRatingChange = (rating: number) => {
    setSelectedRating(rating)
    showToast(`${rating}점을 선택하셨습니다`, 'info')
  }

  // 모든 이모티콘 타입 배열
  const allEmoticonTypes: EmoticonType[] = [
    'normal',
    'love',
    'music',
    'sad',
    'angry',
    'couple',
    'default',
    'talking',
    'thumbsUp',
    'student',
    'graduate',
    'hoodie',
    'study',
    'thanks',
  ]

  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '767px' }}>
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
            padding: '70px 20px 50px',
          }}
        >
          <div>
            <StudentSupportLink />
          </div>
          {/* Star 컴포넌트 테스트 */}
          <div
            style={{ width: '100%', maxWidth: '480px', marginBottom: '30px' }}
          >
            <h2
              style={{
                fontFamily: 'Pretendard, sans-serif',
                fontWeight: 'bold',
                fontSize: '18px',
                marginBottom: '20px',
              }}
            >
              별점 컴포넌트
            </h2>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '15px',
              }}
            >
              <Star 별점={selectedRating} onChange={handleRatingChange} />
            </div>
          </div>
          {/* TagReview 컴포넌트 테스트 */}
          <div
            style={{ width: '100%', maxWidth: '480px', marginBottom: '30px' }}
          >
            <TagReview tags={reviewTags} />
          </div>

          {/* DetailReview 컴포넌트 테스트 */}
          <div
            style={{ width: '100%', maxWidth: '480px', marginBottom: '30px' }}
          >
            <DetailReview
              reviews={[
                {
                  profileImage: '/public/image.png',
                  username: '건들면 짖는댕',
                  rating: 4.0,
                  date: '25.03.28',
                  content: '응답이 엄청 빨랐어요! 대화 재밌었어요 ㅎ ㅎ',
                },
                {
                  profileImage: '/public/image copy.png',
                  username: '말하고 싶어라',
                  rating: 3.5,
                  date: '25.03.28',
                  content: '공감 천재세요',
                },
              ]}
              onViewAllClick={() => console.log('전체보기 클릭됨')}
            />
          </div>
          {/* 이모티콘 테스트 섹션 */}
          <div
            style={{
              width: '100%',
              maxWidth: '480px',
              padding: '20px',
              backgroundColor: '#fff',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              marginBottom: '30px',
            }}
          >
            {/* 이모티콘 그리드 */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '15px',
                justifyContent: 'center',
                marginBottom: '20px',
              }}
            >
              {allEmoticonTypes.map((type) => (
                <div key={type} style={{ textAlign: 'center' }}>
                  <EmoticonComponent
                    type={type}
                    size="small"
                    onClick={() => handleEmoticonClick(type)}
                    alt={`${type} 이모티콘`}
                  />
                  <div style={{ fontSize: '12px', marginTop: '5px' }}>
                    {type}
                  </div>
                </div>
              ))}
            </div>

            {/* 선택된 이모티콘 */}
            <div
              style={{
                marginTop: '20px',
                padding: '15px',
                borderTop: '1px solid #eee',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <p style={{ marginBottom: '10px', fontWeight: 'bold' }}>
                선택된 이모티콘:
              </p>
              <EmoticonComponent
                type={selectedEmoticon}
                size="large"
                alt={`선택된 ${selectedEmoticon} 이모티콘`}
              />
              <p style={{ marginTop: '10px' }}>{selectedEmoticon}</p>
            </div>
          </div>

          {/* 기존 버블 컨테이너 */}
          <div css={bubbleContainerStyles}>
            <Bubble
              isMe={false}
              profileImage="public/image.png"
              timestamp="오후 3:42"
              showTime={true}
            >
              이모티콘을 보내드릴게요!
            </Bubble>

            <Bubble
              isMe={false}
              profileImage="public/image.png"
              timestamp="오후 3:42"
              showTime={false}
              isContinuous={true}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  padding: '5px',
                }}
              >
                <EmoticonComponent
                  type={selectedEmoticon}
                  size="large"
                  inChat={true}
                  alt={`${selectedEmoticon} 이모티콘`}
                />
              </div>
            </Bubble>

            <Bubble isMe={true} timestamp="오후 3:43" showTime={true}>
              감사합니다!
            </Bubble>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'c햣enter',
            paddingTop: '70px', // TopBar 높이만큼 여백 추가
          }}
        >
          <div css={bubbleContainerStyles}>
            <Bubble
              isMe={false}
              profileImage="public/image.png"
              timestamp="오후 3:42"
              showTime={true}
            >
              아주대 앞에서 붕어빵 팔면 부자될까요?
            </Bubble>

            <Bubble isMe={true} timestamp="오후 3:43" showTime={true}>
              저는 주로 한번에 5개는 먹어요
            </Bubble>

            <Bubble
              isMe={false}
              profileImage="public/image.png"
              timestamp="오후 3:44"
              showTime={true}
            >
              진짜 괜찮겠죠?,,ㅜ
            </Bubble>

            <Bubble isMe={true} timestamp="오후 3:45" showTime={true}>
              최대 가로 길이는 이 말풍선 길이입니다
            </Bubble>

            <Bubble
              isMe={false}
              profileImage="public/image.png"
              timestamp="오후 3:46"
              showTime={true}
            >
              최대 가로 길이는 이 말풍선 길이입니다
            </Bubble>

            <Bubble
              isMe={false}
              timestamp="오후 3:46"
              showTime={true}
              isContinuous={true}
            >
              혹시 실례가 안된다면 한번에 붕어빵 몇개나 드시는지 궁금해요 꼭..
            </Bubble>

            <Bubble
              isMe={true}
              isLastMessage={true}
              isRead={true}
              isContinuous={false}
            >
              읽지 않음 상태도 표시됩니다
            </Bubble>

            <CustomFormBubbleSend
              isMe={true}
              isLastMessage={true}
              isRead={true}
              isContinuous={false}
            />

            <CustomFormBubbleReceive
              isMe={false}
              isLastMessage={true}
              isRead={true}
              isContinuous={false}
            />
          </div>

          {/* InfoBox 컴포넌트 테스트 */}
          <div>
            <InfoBox averageScore={4.6} coins={500} matchCount={3} />
          </div>

          {/* MatchingGraph 컴포넌트 테스트 */}
          <div style={{ marginTop: '20px' }}>
            <MatchingGraph
              categoryData={{
                진로: 3,
                취업: 7,
                학업: 1,
                인간관계: 6,
                경제: 4,
                기타: 1,
              }}
            />
          </div>

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

          {/* Rest of your component code remains unchanged */}
          <div className="buttons" style={{ width: '375px', margin: '30px 0' }}>
            <TitleInputBox
              placeholder="텍스트를 입력해주세요"
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

            <div
              className="filterList"
              style={{ display: 'flex', gap: '10px' }}
            >
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

            <div className="progressBar" style={{ padding: '30px 0' }}>
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
                  //console.log('현재 슬라이드 : ', index)
                }}
              />
            </div>

            <div className="brownRectButton" style={{ padding: '30px 0' }}>
              <BrownRectButton buttonText="매칭 신청하기" />
            </div>
          </div>

          <div
            className="homeComponent"
            style={{ width: '375px', margin: '30px 0' }}
          >
            <CardNewsComponent
              imgUrl="https://ascc.ajou.ac.kr/_attach/ajou/editor-image/2024/12/JdgawSPIUDxxxGOibddSJULmkn.jpg"
              title="슬기로운 방학생활 넘어가나 넘어가나 넘어가나 넘어가나 넘어가나"
              organization="인권센터 학생상담소"
              date="2025-01-16"
            />

            <div
              className="homeCategory"
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px',
                padding: '30px 0',
              }}
            >
              <HomeCategoryButton buttonText="진로고민" emoji="🤯" />

              <HomeCategoryButton buttonText="취업고민" emoji="💼" />

              <HomeCategoryButton buttonText="학업고민" emoji="📚" />

              <HomeCategoryButton buttonText="인간관계" emoji="👥" />

              <HomeCategoryButton buttonText="건강고민" emoji="💪🏻" />

              <HomeCategoryButton buttonText="경제고민" emoji="💰" />
            </div>
          </div>

          <div className="modalComponetLine" style={{ padding: '50px 0' }}>
            <div
              className="modalOpener"
              style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}
            >
              <BrownRoundButton
                buttonText="매칭방 모달 열기"
                onActiveChange={() => {
                  handleOpenModal('매칭신청')
                }}
              />

              <BrownRoundButton
                buttonText="매칭 실패 모달 열기"
                onActiveChange={() => {
                  handleOpenModal('매칭실패')
                }}
              />

              <BrownRoundButton
                buttonText="채팅종료 모달 열기 (디자인 필요)"
                onActiveChange={() => {
                  handleOpenModal('채팅종료')
                }}
              />

              <BrownRoundButton
                buttonText="랜덤매칭 실패 (디자인 필요)"
                onActiveChange={() => {
                  handleOpenModal('채팅종료')
                }}
              />
            </div>

            {isModalOpen && (
              <ModalComponent
                modalType={modalType}
                buttonText={
                  modalType === '매칭신청'
                    ? '매칭 신청하기'
                    : modalType === '매칭실패'
                      ? '닫기'
                      : '리뷰 쓰기'
                }
                buttonClick={handleMatchingRequest}
                onClose={handleModalClose}
                isOpen={isModalOpen}
              />
            )}
          </div>

          <div
            className="pointHistory"
            style={{ width: '375px', margin: '10px 0 100px 0' }}
          >
            <PointHistory
              historyName="포인트 충전"
              historyDate="2025-01-17"
              historyPoint={1000}
              historyBalance={1000}
              historyType="earn"
              borderTop={false}
              borderBottom={false}
            />

            <PointHistory
              historyName="포인트 사용"
              historyDate="2025-01-16"
              historyPoint={1000}
              historyBalance={0}
              historyType="use"
            />
          </div>

          <div
            className="customFormContent"
            style={{
              width: '375px',
              padding: '30px 0',
              marginBottom: '100px',
              display: 'flex',
              flexDirection: 'column',
              gap: '3rem',
            }}
          >
            <AskInput
              placeHolder="질문을 입력해주세요"
              onCloseBtnClick={() => {}}
            />
            <AnswerInput title="한 직업을 평생 할 수 있다고 생각하시나요?" />
          </div>
          <ChatBar onSendMessage={(msg) => console.log('보낸 메시지:', msg)} />
          <div className="navigation" style={{ width: '50%' }}>
            <div style={{ paddingBottom: '60px' }}>
              <NavigationComponent />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
