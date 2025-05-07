/** @jsxImportSource @emotion/react */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchWithRefresh } from '../../utils/fetchWithRefresh'
import { useAuthStore } from '../../stores/userStore'

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
import BottomSheet from '../../components/bottomSheet/BottomSheet'
import { KebabIcon } from '../../components/icon/iconComponents'

const EmoticonHome = () => {
  const navigate = useNavigate()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedEmoticonType, setSelectedEmoticonType] = useState<
    string | null
  >(null)
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [pointBalance, setPointBalance] = useState<number | null>(null)
  const [shopEmoticons, setShopEmoticons] = useState<any[]>([])
  const [ownedEmoticons, setOwnedEmoticons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuthStore()

  const bottomSheetMenuItems = [
    {
      text: '코인 구매',
      onClick: () => {
        navigate('/coin')
      },
    },
    {
      text: '코인 사용내역',
      onClick: () => {
        navigate('/coin/history')
      },
    },
  ]

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

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      try {
        // 프로필 정보
        let profileRes = await fetchWithRefresh(
          'http://localhost/api/profiles/me',
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        )
        let profileData = await profileRes.json()
        setProfile(profileData)

        // 포인트 잔액
        let pointRes = await fetchWithRefresh(
          'http://localhost/api/points/balance',
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
          }
        )
        let point = await pointRes.json()
        setPointBalance(point)

        // 상점 이모티콘
        let shopRes = await fetchWithRefresh(
          'http://localhost/api/emoticons/shop',
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        )
        let shopData = await shopRes.json()
        setShopEmoticons(shopData)

        // 내 이모티콘
        let myRes = await fetchWithRefresh(
          'http://localhost/api/emoticons/my',
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        )
        let myData = await myRes.json()
        setOwnedEmoticons(myData.ownedEmoticons || [])
      } catch (e) {
        setProfile(null)
        setPointBalance(null)
        setShopEmoticons([])
        setOwnedEmoticons([])
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

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

  if (loading) return <div>로딩중...</div>

  return (
    <RootContainer>
      <TopBar
        title="이모티콘 샵"
        showBackButton={true}
        onBackClick={() => navigate('/')}
        rightContent={
          <button onClick={() => setBottomSheetOpen(true)}>
            <KebabIcon color="#392111" />
          </button>
        }
      />

      <BottomSheet
        isOpen={bottomSheetOpen}
        onClose={() => setBottomSheetOpen(false)}
        menuItems={bottomSheetMenuItems}
      />

      <EmoticonsContainer>
        <ProfileContainer>
          <EmoticonProfile
            profileImage={profile?.profileImage || '/public/image.png'}
            name={profile?.nickname || '프로필이름'}
            heldCoins={pointBalance ?? 0}
          />
        </ProfileContainer>

        <PurchaseAbleEmoticonContainer>
          <PurchaseHeadT>구매 가능한 이모티콘</PurchaseHeadT>
          <PurchaseSubT>
            채팅방에서 사용 가능한 이모티콘을 둘러보세요!
          </PurchaseSubT>
          <PurchaseEmoticonList>
            {shopEmoticons.map((emoticon) => (
              <EmotionWrapper key={emoticon.id}>
                <Emoticon
                  type={emoticon.name as any}
                  size="large"
                  onClick={() => handleEmoticonClick(emoticon.name)}
                />
              </EmotionWrapper>
            ))}
          </PurchaseEmoticonList>
        </PurchaseAbleEmoticonContainer>

        <OwnedEmoticonContainer>
          <OwnedEmoticonHeadT>행복한 돌멩이님의 이모티콘</OwnedEmoticonHeadT>
          <OwnedEmoticonList>
            {ownedEmoticons.map((emoticon) => (
              <EmotionWrapper key={emoticon.id}>
                <Emoticon type={emoticon.name as any} size="large" />
              </EmotionWrapper>
            ))}
          </OwnedEmoticonList>
        </OwnedEmoticonContainer>
      </EmoticonsContainer>
      {renderModal()}
    </RootContainer>
  )
}

export default EmoticonHome
