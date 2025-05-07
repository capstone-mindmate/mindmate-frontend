import React from 'react'
import { MagazineListContainer } from './MagazineListStyles'
import TopBar from '../../components/topbar/Topbar'
import Magazine from '../../components/magazine/Magazine'
import { useNavigate } from 'react-router-dom'

// 매거진 아이템 인터페이스
interface MagazineItem {
  id: string | number
  title: string
  detail: string
  imageSrc: string
}

const MagazineList: React.FC = () => {
  const navigate = useNavigate()

  // 뒤로가기 버튼 핸들러
  const handleBackClick = () => {
    navigate(-1)
  }

  // 매거진 아이템 클릭 핸들러
  const handleMagazineItemClick = (item: MagazineItem) => {
    console.log('클릭된 매거진 아이템:', item)
    // Todo : 상세 페이지로 이동하는 로직 구현
    // navigate(`/magazine/${item.id}`)
  }

  // 샘플 매거진 데이터
  const magazineItems: MagazineItem[] = [
    {
      id: 1,
      title: '친구 사이에도 거리두기가 필요해',
      detail: '인간관계 때문에 고민중이라면 읽어보세요 👀',
      imageSrc: '/public/image.png',
    },
    {
      id: 2,
      title: '익명 대화 뜻밖의 현실조언',
      detail: '인간관계 때문에 고민중이라면 필독👀',
      imageSrc: '/public/image.png',
    },
    {
      id: 3,
      title: '작심삼일도 10번 하면 한달이다',
      detail: '작심삼일하던 사람이 1등한 비법',
      imageSrc: '/public/image.png',
    },
    {
      id: 4,
      title: '친구 사이에도 거리두기가 필요해',
      detail: '인간관계 때문에 고민중이라면 필독👀',
      imageSrc: '/public/image.png',
    },
    {
      id: 5,
      title: '대학생 취업 준비 가이드',
      detail: '취업 준비, 언제부터 시작해야 할까?',
      imageSrc: '/public/image.png',
    },
    {
      id: 6,
      title: '학업 스트레스 이겨내는 법',
      detail: '시험기간 스트레스 관리 방법',
      imageSrc: '/public/image.png',
    },
    {
      id: 7,
      title: '건강한 대학생활을 위한 습관',
      detail: '대학생활에 꼭 필요한 건강 루틴',
      imageSrc: '/public/image.png',
    },
  ]

  return (
    <MagazineListContainer>
      <TopBar title="전체보기" showBackButton onBackClick={handleBackClick} />

      <div className="magazine-content">
        <Magazine
          items={magazineItems}
          onItemClick={handleMagazineItemClick}
          onBackClick={handleBackClick}
        />
      </div>
    </MagazineListContainer>
  )
}

export default MagazineList
