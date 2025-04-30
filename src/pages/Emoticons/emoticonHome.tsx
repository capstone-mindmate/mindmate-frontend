/** @jsxImportSource @emotion/react */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  RootContainer,
  EmoticonsContainer,
  PurchaseAbleEmoticonContainer,
  PurchaseHeadT,
  PurchaseSubT,
  PurchaseEmoticonList,
  OwnedEmoticonContainer,
  OwnedEmoticonHeadT,
  OwnedEmoticonList,
  EmotionWrapper,
  ProfileContainer,
} from './style'
import EmoticonProfile from '../../components/mypage/emoticonProfile'
import TopBar from '../../components/topbar/Topbar'
import Emoticon from '../../components/emoticon/Emoticon'
import ModalComponent from '../../components/modal/modalComponent'

const EmoticonHome = () => {
  const navigate = useNavigate()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedEmoticonType, setSelectedEmoticonType] = useState<
    string | null
  >(null)

  const handleEmoticonClick = (type: string) => {
    setSelectedEmoticonType(type)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedEmoticonType(null)
  }

  const handlePurchase = () => {
    setIsModalOpen(false)
    navigate('/emoticons/success')
  }

  const renderModal = () => {
    if (!isModalOpen || !selectedEmoticonType) return null

    return (
      <ModalComponent
        modalType="이모티콘구매"
        buttonText="구매하기"
        buttonClick={handlePurchase}
        onClose={handleCloseModal}
        isOpen={isModalOpen}
        emoticon={{
          type: selectedEmoticonType,
          size: 'xlarge',
          price: 10,
        }}
      />
    )
  }

  return (
    <RootContainer>
      <TopBar title="이모티콘 샵" showBackButton={true} actionIcon={true} />
      <EmoticonsContainer>
        <ProfileContainer>
          <EmoticonProfile
            profileImage="/public/image.png"
            name="프로필이름"
            heldCoins={100}
          />
        </ProfileContainer>

        <PurchaseAbleEmoticonContainer>
          <PurchaseHeadT>구매 가능한 이모티콘</PurchaseHeadT>
          <PurchaseSubT>
            채팅방에서 사용 가능한 이모티콘을 둘러보세요!
          </PurchaseSubT>
          <PurchaseEmoticonList>
            <EmotionWrapper>
              <Emoticon
                type="normal"
                size="large"
                onClick={() => handleEmoticonClick('normal')}
              />
            </EmotionWrapper>

            <EmotionWrapper>
              <Emoticon
                type="love"
                size="large"
                onClick={() => handleEmoticonClick('love')}
              />
            </EmotionWrapper>
            <EmotionWrapper>
              <Emoticon
                type="music"
                size="large"
                onClick={() => handleEmoticonClick('music')}
              />
            </EmotionWrapper>
            <EmotionWrapper>
              <Emoticon
                type="sad"
                size="large"
                onClick={() => handleEmoticonClick('sad')}
              />
            </EmotionWrapper>
            <EmotionWrapper>
              <Emoticon
                type="angry"
                size="large"
                onClick={() => handleEmoticonClick('angry')}
              />
            </EmotionWrapper>
            <EmotionWrapper>
              <Emoticon
                type="couple"
                size="large"
                onClick={() => handleEmoticonClick('couple')}
              />
            </EmotionWrapper>
            <EmotionWrapper>
              <Emoticon
                type="talking"
                size="large"
                onClick={() => handleEmoticonClick('talking')}
              />
            </EmotionWrapper>
            <EmotionWrapper>
              <Emoticon
                type="thumbsUp"
                size="large"
                onClick={() => handleEmoticonClick('thumbsUp')}
              />
            </EmotionWrapper>
            <EmotionWrapper>
              <Emoticon
                type="student"
                size="large"
                onClick={() => handleEmoticonClick('student')}
              />
            </EmotionWrapper>
            <EmotionWrapper>
              <Emoticon
                type="graduate"
                size="large"
                onClick={() => handleEmoticonClick('graduate')}
              />
            </EmotionWrapper>
          </PurchaseEmoticonList>
        </PurchaseAbleEmoticonContainer>

        <OwnedEmoticonContainer>
          <OwnedEmoticonHeadT>행복한 돌멩이님의 이모티콘</OwnedEmoticonHeadT>
          <OwnedEmoticonList>
            <EmotionWrapper>
              <Emoticon type="normal" size="large" />
            </EmotionWrapper>
            <EmotionWrapper>
              <Emoticon type="love" size="large" />
            </EmotionWrapper>
            <EmotionWrapper>
              <Emoticon type="music" size="large" />
            </EmotionWrapper>
            <EmotionWrapper>
              <Emoticon type="sad" size="large" />
            </EmotionWrapper>
            <EmotionWrapper>
              <Emoticon type="angry" size="large" />
            </EmotionWrapper>
            <EmotionWrapper>
              <Emoticon type="couple" size="large" />
            </EmotionWrapper>
          </OwnedEmoticonList>
        </OwnedEmoticonContainer>
      </EmoticonsContainer>
      {renderModal()}
    </RootContainer>
  )
}

export default EmoticonHome
