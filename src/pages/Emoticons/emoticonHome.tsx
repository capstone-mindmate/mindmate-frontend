/** @jsxImportSource @emotion/react */
import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { fetchWithRefresh } from '../../utils/fetchWithRefresh'
import { useAuthStore } from '../../stores/userStore'
import { useNavigationStore } from '../../stores/navigationStore'

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
  const location = useLocation()

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
    ? '/api' + profile.profileImage
    : ''
  const defaultProfileImageUrl = '/api/profileImages/default-profile-image.png'
  const {
    previousPath,
    originPath,
    setOriginPath,
    clearPreviousPath,
    clearOriginPath,
  } = useNavigationStore()

  const bottomSheetMenuItems = [
    {
      text: '이모티콘 등록',
      onClick: () => {
        navigate('/emoticons/register')
        setBottomSheetOpen(false)
      },
    },
    {
      text: '코인 구매',
      onClick: () => {
        navigate('/coin')
        setBottomSheetOpen(false)
      },
    },
    {
      text: '코인 사용내역',
      onClick: () => {
        navigate('/coin/history')
        setBottomSheetOpen(false)
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

  const handleBackClick = () => {
    // 문제가 되는 경로들이거나 특정 코인 페이지에서 온 경우
    console.log(previousPath)
    if (
      previousPath === '/coin' ||
      previousPath === '/coin/history' ||
      previousPath?.includes('/fail') ||
      previousPath?.includes('/success') ||
      previousPath === '/emoticons/upload'
    ) {
      // 원래 위치가 있으면 그곳으로, 없으면 홈으로
      if (originPath) {
        navigate(originPath)
      } else {
        navigate('/home')
      }
    }
    // 그 외의 경우 일반적인 뒤로가기
    else {
      navigate('/home')
    }

    // 정리
    clearPreviousPath()
    clearOriginPath()
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedEmoticonType(null)
  }

  const handlePurchase = () => {
    setIsModalOpen(false)
    navigate(`/emoticons/purchase/${selectedEmoticonId}`, { replace: true })
  }

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      try {
        // 프로필 정보
        let profileRes = await fetchWithRefresh('/api/profiles', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
        let profileData = await profileRes.json()
        setProfile(profileData)

        // 포인트 잔액
        let pointRes = await fetchWithRefresh('/api/points/balance', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        })
        let point = await pointRes.json()
        setPointBalance(point)

        // 상점 이모티콘
        let shopRes = await fetchWithRefresh('/api/emoticons/shop', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
        let shopData = await shopRes.json()
        setShopEmoticons(shopData)

        // 내 이모티콘
        let myRes = await fetchWithRefresh('/api/emoticons/my', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
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

  useEffect(() => {
    const problematicPaths = [
      '/emoticons/purchase/fail',
      '/emoticons/purchase/success',
      '/coin/fail',
      '/coin/success',
      '/coin',
      '/coin/history',
      '/emoticons/upload',
    ]

    if (
      !originPath &&
      previousPath &&
      !problematicPaths.includes(previousPath)
    ) {
      setOriginPath(previousPath)
    }
  }, [previousPath, originPath, setOriginPath])

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
          imageUrl: '/api' + selectedEmoticonImageUrl,
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
        onBackClick={handleBackClick}
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
                  emoticonURL={'/api' + emoticon.imageUrl}
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
                  emoticonURL={'/api' + emoticon.imageUrl}
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
