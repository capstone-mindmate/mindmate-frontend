// 매거진 관련 상수 및 데이터

// 타입 정의
export type CategoryOption =
  | 'ACADEMIC'
  | 'CAREER'
  | 'RELATIONSHIP'
  | 'MENTAL_HEALTH'
  | 'CAMPUS_LIFE'
  | 'PERSONAL_GROWTH'
  | 'FINANCIAL'
  | 'EMPLOYMENT'
  | 'OTHER'
  | ''

export type SortOption = 'POPULARITY' | 'LATEST' | 'OLDEST'

// 매거진 아이템 인터페이스
export interface MagazineItem {
  id: string | number
  title: string
  detail: string
  imageSrc: string
  authorName?: string
  authorId?: number
  likeCount?: number
  status?: string
  category?: CategoryOption
  createdAt?: string
  updatedAt?: string
}

// API 응답 인터페이스
export interface MagazineApiResponse {
  totalPages: number
  totalElements: number
  size: number
  content: any[]
  number: number
  first: boolean
  last: boolean
  numberOfElements: number
  empty: boolean
  pageable: {
    offset: number
    pageNumber: number
    pageSize: number
    paged: boolean
    unpaged: boolean
  }
}

// 카테고리 옵션
export const categoryOptions = [
  '진로',
  '취업',
  '학업',
  '인간관계',
  '경제',
  '기타',
]

// API 카테고리와 화면에 표시할 이름 매핑
export const categoryNames: Record<CategoryOption, string> = {
  '': '선택안함',
  ACADEMIC: '학업',
  CAREER: '진로',
  RELATIONSHIP: '인간관계',
  MENTAL_HEALTH: '정신건강',
  CAMPUS_LIFE: '캠퍼스생활',
  PERSONAL_GROWTH: '자기계발',
  FINANCIAL: '경제',
  EMPLOYMENT: '취업',
  OTHER: '기타',
}

// 화면 표시 이름에서 API 카테고리로 변환
export const categoryMap: Record<string, CategoryOption> = {
  선택안함: '',
  학업: 'ACADEMIC',
  진로: 'CAREER',
  인간관계: 'RELATIONSHIP',
  정신건강: 'MENTAL_HEALTH',
  캠퍼스생활: 'CAMPUS_LIFE',
  자기계발: 'PERSONAL_GROWTH',
  경제: 'FINANCIAL',
  취업: 'EMPLOYMENT',
  기타: 'OTHER',
}

// 정렬 옵션 매핑
export const sortMap: Record<string, SortOption> = {
  인기순: 'POPULARITY',
  최신순: 'LATEST',
  오래된순: 'OLDEST',
}

// 역매핑 (API값 -> 표시이름)
export const sortDisplayMap: Record<SortOption, string> = {
  POPULARITY: '인기순',
  LATEST: '최신순',
  OLDEST: '오래된순',
}

// 샘플 매거진 데이터 - 테스트를 위한 확장 데이터
export const dummyMagazineItems: MagazineItem[] = [
  {
    id: 1,
    title: '친구 사이에도 거리두기가 필요해',
    detail: '인간관계 때문에 고민중이라면 읽어보세요 👀',
    imageSrc: '/public/image.png',
    category: 'RELATIONSHIP',
    likeCount: 120,
    createdAt: '2025-05-01T10:30:00Z',
  },
  {
    id: 2,
    title: '익명 대화 뜻밖의 현실조언',
    detail: '인간관계 때문에 고민중이라면 필독👀',
    imageSrc: '/public/image.png',
    category: 'RELATIONSHIP',
    likeCount: 95,
    createdAt: '2025-05-02T14:20:00Z',
  },
  {
    id: 3,
    title: '작심삼일도 10번 하면 한달이다',
    detail: '작심삼일하던 사람이 1등한 비법',
    imageSrc: '/public/image.png',
    category: 'PERSONAL_GROWTH',
    likeCount: 88,
    createdAt: '2025-05-03T09:15:00Z',
  },
  {
    id: 4,
    title: '친구 사이에도 거리두기가 필요해',
    detail: '인간관계 때문에 고민중이라면 필독👀',
    imageSrc: '/public/image.png',
    category: 'RELATIONSHIP',
    likeCount: 76,
    createdAt: '2025-05-04T16:45:00Z',
  },
  {
    id: 5,
    title: '대학생 취업 준비 가이드',
    detail: '취업 준비, 언제부터 시작해야 할까?',
    imageSrc: '/public/image.png',
    category: 'EMPLOYMENT',
    likeCount: 135,
    createdAt: '2025-05-05T11:30:00Z',
  },
  {
    id: 6,
    title: '학업 스트레스 이겨내는 법',
    detail: '시험기간 스트레스 관리 방법',
    imageSrc: '/public/image.png',
    category: 'ACADEMIC',
    likeCount: 67,
    createdAt: '2025-05-06T08:20:00Z',
  },
  {
    id: 7,
    title: '건강한 대학생활을 위한 습관',
    detail: '대학생활에 꼭 필요한 건강 루틴',
    imageSrc: '/public/image.png',
    category: 'CAMPUS_LIFE',
    likeCount: 102,
    createdAt: '2025-05-07T13:10:00Z',
  },
  {
    id: 8,
    title: '진로 고민, 어떻게 해결할까?',
    detail: '진로 결정에 도움이 되는 팁',
    imageSrc: '/public/image.png',
    category: 'CAREER',
    likeCount: 89,
    createdAt: '2025-05-08T15:30:00Z',
  },
  {
    id: 9,
    title: '대학생 재테크의 시작',
    detail: '작은 돈으로 시작하는 투자법',
    imageSrc: '/public/image.png',
    category: 'FINANCIAL',
    likeCount: 115,
    createdAt: '2025-05-09T10:45:00Z',
  },
  {
    id: 10,
    title: '효과적인 팀 프로젝트 협업 방법',
    detail: '팀플 스트레스 줄이는 꿀팁',
    imageSrc: '/public/image.png',
    category: 'ACADEMIC',
    likeCount: 73,
    createdAt: '2025-05-10T09:20:00Z',
  },
  {
    id: 11,
    title: '연애와 학업, 균형 잡는 법',
    detail: '대학 생활 속 연애 조언',
    imageSrc: '/public/image.png',
    category: 'RELATIONSHIP',
    likeCount: 128,
    createdAt: '2025-05-11T14:50:00Z',
  },
]
