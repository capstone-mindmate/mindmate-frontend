/**
 * 매거진 관련 타입 및 상수 정의
 */

// 카테고리 옵션 타입
export type CategoryOption =
  | 'ACADEMIC'
  | 'CAREER'
  | 'RELATIONSHIP'
  | 'FINANCIAL'
  | 'EMPLOYMENT'
  | 'OTHER'
  | ''

// 정렬 옵션 타입
export type SortOption = 'POPULARITY' | 'LATEST' | 'OLDEST'

// 매거진 상태 타입
export type MagazineStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

// 매거진 콘텐츠 타입
export type ContentType = 'TEXT' | 'IMAGE' | 'EMOTICON'

// 매거진 항목 인터페이스 (UI에 표시되는 형태)
export interface MagazineItem {
  id: string
  title: string
  detail: string
  category: CategoryOption
  imageUrl: string
  description: string
  likeCount: number
  authorName: string
  authorId: number
  updatedAt: Date
}

// API 응답의 매거진 콘텐츠 인터페이스
export interface MagazineContent {
  id: number
  type: ContentType
  text?: string
  imageUrl?: string
  emoticonUrl?: string
  emoticonName?: string
  contentOrder: number
}

// API 응답의 매거진 항목 인터페이스
export interface MagazineApiItem {
  id: number
  title: string
  subtitle?: string
  contents: MagazineContent[]
  authorName: string
  authorId: number
  likeCount: number
  status: MagazineStatus
  category: CategoryOption
  createdAt: string
  updatedAt: string
}

// API 페이지 정보
export interface PageInfo {
  offset: number
  sort: {
    empty: boolean
    sorted: boolean
    unsorted: boolean
  }
  pageNumber: number
  pageSize: number
  paged: boolean
  unpaged: boolean
}

// API 응답 인터페이스
export interface MagazineApiResponse {
  totalPages: number
  totalElements: number
  size: number
  content: MagazineApiItem[]
  number: number
  sort?: {
    empty: boolean
    sorted: boolean
    unsorted: boolean
  }
  numberOfElements: number
  pageable: PageInfo
  first: boolean
  last: boolean
  empty: boolean
}

// 카테고리 선택 옵션 (UI 표시용)
export const categoryOptions = [
  '전체',
  '진로',
  '취업',
  '학업',
  '인간관계',
  '경제',
  '기타',
]

// 카테고리 매핑 (한글 -> API 값)
export const categoryMap: Record<string, CategoryOption> = {
  진로: 'CAREER',
  취업: 'EMPLOYMENT',
  학업: 'ACADEMIC',
  인간관계: 'RELATIONSHIP',
  경제: 'FINANCIAL',
  기타: 'OTHER',
  전체: '',
}

// 카테고리 이름 매핑 (API 값 -> 한글)
export const categoryNames: Record<string, string> = {
  CAREER: '진로',
  EMPLOYMENT: '취업',
  ACADEMIC: '학업',
  RELATIONSHIP: '인간관계',
  FINANCIAL: '경제',
  OTHER: '기타',
  '': '전체',
}

// 정렬 옵션 매핑 (한글 -> API 값)
export const sortMap: Record<string, SortOption> = {
  인기순: 'POPULARITY',
  최신순: 'LATEST',
  오래된순: 'OLDEST',
}

// 정렬 옵션 표시 매핑 (API 값 -> 한글)
export const sortDisplayMap: Record<string, string> = {
  POPULARITY: '인기순',
  LATEST: '최신순',
  OLDEST: '오래된순',
}
