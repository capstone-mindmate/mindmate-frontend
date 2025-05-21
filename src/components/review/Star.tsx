import React, { useState, useEffect } from 'react'
import { starContainerStyles, StarWrapper } from '../../styles/StarStyles'

interface StarProps {
  별점?: number
  onChange?: (rating: number) => void
  readOnly?: boolean
}

const Star: React.FC<StarProps> = ({
  별점 = 0,
  onChange,
  readOnly = false,
}) => {
  // 내부 상태로 현재 별점 관리 (외부에서 제어하지 않는 경우)
  const [internalRating, setInternalRating] = useState(별점)

  // 외부 별점이 변경되면 내부 상태도 업데이트
  useEffect(() => {
    setInternalRating(별점)
  }, [별점])

  // 실제 표시할 별점 (외부 제어 값 우선)
  const displayRating = 별점 !== undefined ? 별점 : internalRating

  // 별 클릭 핸들러
  const handleStarClick = (position: number) => {
    if (readOnly) return

    if (onChange) {
      // 외부에서 별점 관리하는 경우
      onChange(position)
    } else {
      // 내부에서 별점 관리하는 경우
      setInternalRating(position)
    }
  }

  return (
    <div css={starContainerStyles}>
      {[1, 2, 3, 4, 5].map((position) => (
        <StarWrapper
          key={position}
          isClickable={!readOnly}
          onClick={() => handleStarClick(position)}
        >
          <svg
            width={30}
            height={30}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="https://www.w3.org/2000/svg"
          >
            <path
              d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
              fill={position <= displayRating ? '#F0DAA9' : '#d9d9d9'}
              stroke={position <= displayRating ? '#F0DAA9' : '#d9d9d9'}
              strokeWidth="1.5"
            />
          </svg>
        </StarWrapper>
      ))}
    </div>
  )
}
export default Star
