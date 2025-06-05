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
  const [selectedEmoticonImageUrl, setSelectedEmoticonImageUrl] = useState<
    string | null
  >(null)
  const [selectedEmoticonPrice, setSelectedEmoticonPrice] = useState<
    number | 0
  >(0)
  const [selectedEmoticonId, setSelectedEmoticonId] = useState<number | null>(
    null
  )
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [pointBalance, setPointBalance] = useState<number | null>(null)
  const [shopEmoticons, setShopEmoticons] = useState<any[]>([])
  const [ownedEmoticons, setOwnedEmoticons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuthStore()
  const [isProfileImageLoaded, setIsProfileImageLoaded] = useState(false)
  const realProfileImageUrl = profile?.profileImage
    ? 'http://lohttps://mindmate.shopcalhost/api' + profile.profileImage
    : ''
  const defaultProfileImageUrl =
    'http://lohttps://mindmate.shopcalhost/api/profileImages/default-profile-image.png'

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

  const handleEmoticonClick = (
    type: string,
    imageUrl: string,
    price: number,
    id: number
  ) => {
    setSelectedEmoticonType(type)
    setSelectedEmoticonImageUrl(imageUrl)
    setSelectedEmoticonPrice(price)
    setSelectedEmoticonId(id)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedEmoticonType(null)
  }

  const handlePurchase = () => {
    setIsModalOpen(false)
    navigate(`/emoticons/purchase/${selectedEmoticonId}`)
  }

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      try {
        // 프로필 정보
        let profileRes = await fetchWithRefresh(
          'http://lohttps://mindmate.shopcalhost/api/profiles',
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        )
        let profileData = await profileRes.json()
        setProfile(profileData)

        // 포인트 잔액
        let pointRes = await fetchWithRefresh(
          'http://lohttps://mindmate.shopcalhost/api/points/balance',
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
          'http://lohttps://mindmate.shopcalhost/api/emoticons/shop',
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        )
        let shopData = await shopRes.json()
        setShopEmoticons(shopData)

        // 내 이모티콘
        let myRes = await fetchWithRefresh(
          'http://lohttps://mindmate.shopcalhost/api/emoticons/my',
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        )
        let myData = await myRes.json()
        setOwnedEmoticons(myData.ownedEmoticons || [])
        setShopEmoticons(myData.notOwnedEmoticons || [])
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
    if (
      !isModalOpen ||
      !selectedEmoticonType ||
      !selectedEmoticonImageUrl ||
      selectedEmoticonPrice === undefined
    )
      return null

    return (
      <ModalComponent
        modalType="이모티콘구매"
        buttonText="구매하기"
        buttonClick={handlePurchase}
        onClose={handleCloseModal}
        isOpen={isModalOpen}
        emoticon={{
          imageUrl:
            'http://lohttps://mindmate.shopcalhost/api' +
            selectedEmoticonImageUrl,
          type: selectedEmoticonType,
          id: selectedEmoticonId ?? 0,
          size: 'xlarge',
          price: selectedEmoticonPrice,
        }}
      />
    )
  }

  if (loading) return <div>.</div>

  return (
    <RootContainer>
      <TopBar
        title="이모티콘 샵"
        showBackButton={true}
        onBackClick={() => navigate(-1)}
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
          {realProfileImageUrl && !isProfileImageLoaded && (
            <img
              src={realProfileImageUrl}
              alt=""
              style={{ display: 'none' }}
              onLoad={() => setIsProfileImageLoaded(true)}
              onError={() => setIsProfileImageLoaded(true)}
            />
          )}
          <EmoticonProfile
            profileImage={
              isProfileImageLoaded
                ? realProfileImageUrl
                : defaultProfileImageUrl
            }
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
                  key={emoticon.id}
                  emoticonURL={
                    'http://lohttps://mindmate.shopcalhost/api' +
                    emoticon.imageUrl
                  }
                  type={emoticon.name as any}
                  size="large"
                  onClick={() =>
                    handleEmoticonClick(
                      emoticon.name,
                      emoticon.imageUrl,
                      emoticon.price,
                      emoticon.id
                    )
                  }
                />
              </EmotionWrapper>
            ))}
          </PurchaseEmoticonList>
        </PurchaseAbleEmoticonContainer>

        <OwnedEmoticonContainer>
          <OwnedEmoticonHeadT>
            {profile?.nickname}님의 이모티콘
          </OwnedEmoticonHeadT>
          <OwnedEmoticonList>
            {ownedEmoticons.map((emoticon) => (
              <EmotionWrapper key={emoticon.id}>
                <Emoticon
                  emoticonURL={
                    'http://lohttps://mindmate.shopcalhost/api' +
                    emoticon.imageUrl
                  }
                  type={emoticon.name as any}
                  size="large"
                />
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
