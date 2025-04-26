/** @jsxImportSource @emotion/react */
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import TopBar from '../../components/topbar/Topbar'
import { css } from '@emotion/react'
import YellowInputBox from '../../components/inputs/yellowInputBox'
import BrownRoundButton from '../../components/buttons/brownRoundButton'
import YellowRoundButton from '../../components/buttons/yellowRoundButton'

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
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const [position, setPosition] = useState<'listener' | 'speaker' | null>(null)

  const [isAnonymous, setIsAnonymous] = useState(false)
  const [isDepartmentHidden, setIsDepartmentHidden] = useState(false)
  const [isRandomMatchingAllowed, setIsRandomMatchingAllowed] = useState(false)
  const [category, setCategory] = useState('진로')

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

  return (
    <RootContainer>
      <TopBar title="매칭방 만들기" showBackButton actionText="등록" />
      <MatchingContainer style={{ paddingTop: '57px' }}>
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
