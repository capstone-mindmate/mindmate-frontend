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

const EmoticonHome = () => {
  const navigate = useNavigate()

  return (
    <RootContainer>
      <TopBar title="이모티콘 샵" showBackButton={true} />
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
            <EmotionWrapper>
              <Emoticon type="talking" size="large" />
            </EmotionWrapper>
            <EmotionWrapper>
              <Emoticon type="thumbsUp" size="large" />
            </EmotionWrapper>
            <EmotionWrapper>
              <Emoticon type="student" size="large" />
            </EmotionWrapper>
            <EmotionWrapper>
              <Emoticon type="graduate" size="large" />
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
    </RootContainer>
  )
}

export default EmoticonHome
