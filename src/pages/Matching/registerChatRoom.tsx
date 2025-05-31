/** @jsxImportSource @emotion/react */
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import TopBar from '../../components/topbar/Topbar'
import { css } from '@emotion/react'
import YellowInputBox from '../../components/inputs/yellowInputBox'
import BrownRoundButton from '../../components/buttons/brownRoundButton'
import YellowRoundButton from '../../components/buttons/yellowRoundButton'
import { fetchWithRefresh } from '../../utils/fetchWithRefresh'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../components/toast/ToastProvider.tsx'

import { RootContainer, MatchingContainer } from './style'

interface RegisterChatRoomProps {}

const registerStyles = {
  categoryBox: css`
    width: 100%;
    margin-top: 12px;
    padding: 0 24px;
    box-sizing: border-box;
  `,
  inputChatRoomInfo: css`
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: 24px;
    padding: 0 24px;
    box-sizing: border-box;
  `,
  categorySelect: css`
    border: none;
    color: #393939;
    background: #ffffff00;
    font-size: 16px;
    line-height: 1.5;
    font-weight: 400;
  `,
  typeSetting: css`
    display: flex;
    flex-direction: row;
    gap: 8px;
    margin-top: 12px;
    padding: 0 24px;
    box-sizing: border-box;
  `,
  positionSetting: css`
    display: flex;
    flex-direction: row;
    gap: 8px;
    margin-top: 12px;
    padding: 0 24px;
    box-sizing: border-box;
  `,
  titleText: css`
    font-size: 16px;
    line-height: 1.5;
    font-weight: bold;
    color: #393939;
    margin: 0;
    margin-top: 24px;
    padding: 0 24px;
    box-sizing: border-box;
  `,
}

const RegisterChatRoom = ({}: RegisterChatRoomProps) => {
  const navigate = useNavigate()
  const { showToast } = useToast()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const [position, setPosition] = useState<'listener' | 'speaker' | null>(null)

  const [isAnonymous, setIsAnonymous] = useState(false)
  const [isDepartmentHidden, setIsDepartmentHidden] = useState(false)
  const [isRandomMatchingAllowed, setIsRandomMatchingAllowed] = useState(false)
  const [category, setCategory] = useState('진로')

  // 카테고리 한글 → 영문 변환 맵
  const categoryMap: Record<string, string> = {
    학업: 'ACADEMIC',
    진로: 'CAREER',
    인간관계: 'RELATIONSHIP',
    건강: 'MENTAL_HEALTH',
    학교생활: 'CAMPUS_LIFE',
    자기계발: 'PERSONAL_GROWTH',
    경제: 'FINANCIAL',
    취업: 'EMPLOYMENT',
    기타: 'OTHER',
  }

  // 포지션 한글 → 영문 변환
  const getCreatorRole = () => {
    if (position === 'listener') return 'LISTENER'
    if (position === 'speaker') return 'SPEAKER'
    return null
  }

  const handleTitleChange = (value: string) => {
    setTitle(value)
  }

  const handleDescriptionChange = (value: string) => {
    setDescription(value)
  }

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value)
  }

  const handleListenerToggle = (isActive: boolean) => {
    if (isActive) {
      setPosition('listener')
    } else {
      setPosition(null)
    }
  }

  const handleSpeakerToggle = (isActive: boolean) => {
    if (isActive) {
      setPosition('speaker')
    } else {
      setPosition(null)
    }
  }

  const isListenerActive = position === 'listener'
  const isSpeakerActive = position === 'speaker'

  // 등록 버튼 클릭 시 API 호출
  const handleRegister = async () => {
    if (!title || !description || !position) {
      showToast('모든 필드를 입력해주세요.', 'error')
      return
    }
    try {
      const res = await fetchWithRefresh('http://localhost/api/matchings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          category: categoryMap[category] || 'ETC',
          creatorRole: getCreatorRole(),
          showDepartment: !isDepartmentHidden,
          allowRandom: isRandomMatchingAllowed,
          anonymous: isAnonymous,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || res.statusText)
      }
      showToast('매칭방이 성공적으로 생성되었습니다!', 'success')
      navigate('/matching')
      // TODO: 성공 시 이동 처리 (예: 홈/매칭방 목록 등)
    } catch (e: any) {
      showToast(e.message, 'error')
    }
  }

  return (
    <RootContainer>
      <TopBar
        title="매칭방 만들기"
        showBackButton
        actionText="등록"
        onActionClick={handleRegister}
      />
      <MatchingContainer>
        <div className="categoryBox" css={registerStyles.categoryBox}>
          <select
            name="category"
            id="category"
            css={registerStyles.categorySelect}
            value={category}
            onChange={handleCategoryChange}
          >
            <option value="진로">진로</option>
            <option value="취업">취업</option>
            <option value="학업">학업</option>
            <option value="인간관계">인간관계</option>
            <option value="경제">경제</option>
            <option value="기타">기타</option>
          </select>
        </div>

        <div
          className="inputChatRoomInfo"
          css={registerStyles.inputChatRoomInfo}
        >
          <YellowInputBox
            placeholder="매칭방 이름을 입력해주세요"
            value={title}
            onChange={handleTitleChange}
            activeState={true}
            isTitle={false}
          />
          <YellowInputBox
            placeholder="간단한 소개글을 작성해보세요"
            value={description}
            height={80}
            onChange={handleDescriptionChange}
            activeState={true}
            isTitle={false}
          />
        </div>

        <div className="typeSetting">
          <p css={registerStyles.titleText}>
            개인정보 및 매칭 설정을 선택해주세요
          </p>
          <div className="buttonList" css={registerStyles.typeSetting}>
            <BrownRoundButton
              buttonText="익명"
              onActiveChange={(isActive) => {
                setIsAnonymous(isActive)
              }}
            />

            <BrownRoundButton
              buttonText="학과 비공개"
              onActiveChange={(isActive) => {
                setIsDepartmentHidden(isActive)
              }}
            />

            <BrownRoundButton
              buttonText="랜덤매칭 허용"
              onActiveChange={(isActive) => {
                setIsRandomMatchingAllowed(isActive)
              }}
            />
          </div>
        </div>

        <div className="positionSetting">
          <p css={registerStyles.titleText}>포지션을 선택해주세요</p>

          <div className="buttonList" css={registerStyles.positionSetting}>
            <BrownRoundButton
              buttonText="👂🏻 리스너"
              onActiveChange={handleListenerToggle}
              isControlled={true}
              isActive={isListenerActive}
            />

            <YellowRoundButton
              buttonText="🗣️ 스피커"
              onActiveChange={handleSpeakerToggle}
              isControlled={true}
              isActive={isSpeakerActive}
            />
          </div>
        </div>
      </MatchingContainer>
    </RootContainer>
  )
}

export default RegisterChatRoom
