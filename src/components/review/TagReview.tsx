import React, { useState } from 'react'
import {
  TagReviewContainer,
  TagReviewTitle,
  TagListContainer,
  TagItem,
  TagText,
  TagCount,
  ExpandButton,
  ArrowIcon,
  TagLeftSection,
} from '../../styles/TagReviewStyles'

interface TagItem {
  icon: string
  text: string
  count: number
}

interface TagReviewProps {
  tags: TagItem[]
  initialVisibleCount?: number
}

import { BackIcon } from '../icon/iconComponents'

// 화살표 컴포넌트 분리
const ArrowIconComponent: React.FC<{ isExpanded: boolean }> = ({
  isExpanded,
}) => {
  return (
    <ArrowIcon isExpanded={isExpanded}>
      <BackIcon color="#666666" />
    </ArrowIcon>
  )
}

const TagReview: React.FC<TagReviewProps> = ({
  tags,
  initialVisibleCount = 3,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  const visibleTags = isExpanded ? tags : tags.slice(0, initialVisibleCount)

  return (
    <TagReviewContainer>
      <TagReviewTitle>받은 평가 및 리뷰</TagReviewTitle>

      <TagListContainer>
        {visibleTags.map((tag, index) => (
          <TagItem key={index}>
            <TagLeftSection>
              <TagText>{tag.icon}</TagText>
              <TagText>{tag.text}</TagText>
            </TagLeftSection>
            <TagCount>{tag.count}</TagCount>
          </TagItem>
        ))}
      </TagListContainer>

      {tags.length > initialVisibleCount && (
        <ExpandButton onClick={toggleExpand}>
          <ArrowIconComponent isExpanded={isExpanded} />
        </ExpandButton>
      )}
    </TagReviewContainer>
  )
}

export default TagReview
