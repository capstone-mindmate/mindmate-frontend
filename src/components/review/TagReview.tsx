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

const tagReMapper = (tag: TagItem) => {
  switch (tag.text) {
    case '응답이 빨라요':
      return {
        icon: '⚡️',
        text: tag.text,
        count: tag.count,
      }
    case '신뢰할 수 있는 대화였어요':
      return {
        icon: '🤝🏻',
        text: tag.text,
        count: tag.count,
      }
    case '공감을 잘해줘요':
      return {
        icon: '❤️‍🩹',
        text: tag.text,
        count: tag.count,
      }
    case '편안한 분위기에서 이야기할 수 있었어요':
      return {
        icon: '☕️️',
        text: tag.text,
        count: tag.count,
      }
    case '솔직하고 현실적인 조언을 해줘요':
      return {
        icon: '🎯️',
        text: tag.text,
        count: tag.count,
      }
    case '새로운 관점을 제시해줘요':
      return {
        icon: '💡️',
        text: tag.text,
        count: tag.count,
      }
    default:
      return {
        icon: tag.icon,
        text: tag.text,
        count: tag.count,
      }
  }
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
  console.log(visibleTags)

  return (
    <TagReviewContainer>
      <TagReviewTitle>받은 평가 및 리뷰</TagReviewTitle>

      <TagListContainer>
        {visibleTags
          .map((tag) => tagReMapper(tag))
          .map((tag, index) => (
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
