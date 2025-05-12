import React from 'react'
import {
  MatchingGraphContainer,
  Title,
  Description,
  GraphContainer,
  CategoryItem,
  CategoryBar,
  CategoryLabel,
} from '../../styles/MatchingGraphStyles'

// 카테고리 데이터 인터페이스
interface CategoryData {
  진로: number
  취업: number
  학업: number
  인간관계: number
  경제: number
  기타: number
}

interface MatchingGraphProps {
  categoryData: CategoryData
}

const MatchingGraph: React.FC<MatchingGraphProps> = ({ categoryData }) => {
  // 카테고리 데이터를 배열로 변환
  const categories = Object.entries(categoryData).map(([name, value]) => ({
    name,
    value,
  }))

  // 값 기준으로 내림차순 정렬
  const sortedCategories = [...categories].sort((a, b) => b.value - a.value)

  // 값이 0이 아닌 카테고리를 추출하고 내림차순 정렬
  const nonZeroCategories = categories
    .filter((category) => category.value > 0)
    .sort((a, b) => b.value - a.value)

  // 최대값 찾기 (상대적 크기 계산용)
  const maxVal = Math.max(...categories.map((category) => category.value), 1) // 0으로 나누기 방지

  // 상위 3개 카테고리 선택 (0이 아닌 값만 고려)
  const top3Categories = nonZeroCategories
    .slice(0, 3)
    .map((category) => category.name)

  // 모든 값이 0인지 확인
  const isAllZero = categories.every((category) => category.value === 0)

  // 상위 3개 카테고리 이름을 쉼표로 구분하여 표시
  const topCategoriesText = isAllZero ? '' : top3Categories.join(', ')

  // 설명 텍스트
  const descriptionText = isAllZero
    ? '서둘러 대화를 나눠보세요!'
    : `✸ ${topCategoriesText} 카테고리를 가장 많이 이용했어요!`

  return (
    <MatchingGraphContainer>
      <Title>카테고리별 매칭 분포</Title>
      <Description>{descriptionText}</Description>

      {isAllZero ? (
        <div
          style={{
            background: 'whitesmoke',
            borderRadius: 12,
            padding: '24px 0',
            textAlign: 'center',
            color: '#aaa',
            fontSize: 14,
            margin: '16px 0',
          }}
        >
          아직 매칭을 진행하지 않았어요.
        </div>
      ) : (
        <GraphContainer isEmpty={false}>
          {categories.map((category) => (
            <CategoryItem key={category.name}>
              <CategoryBar
                height={`${Math.min((category.value / maxVal) * 90, 90)}%`}
                isTop={
                  top3Categories.includes(category.name) && category.value > 0
                }
              />
              <CategoryLabel isHidden={false}>{category.name}</CategoryLabel>
            </CategoryItem>
          ))}
        </GraphContainer>
      )}
    </MatchingGraphContainer>
  )
}

export default MatchingGraph
