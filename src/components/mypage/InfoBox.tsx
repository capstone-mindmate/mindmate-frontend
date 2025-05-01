import React from 'react'
import {
  InfoBoxContainer,
  Section,
  Label,
  Value,
  ScoreValue,
  Divider,
  StarIconWrapper,
  ScoreTextWrapper,
} from '../../styles/InfoBoxStyles'

interface InfoBoxProps {
  averageScore: number
  coins: number
  matchCount: number
}

const InfoBox: React.FC<InfoBoxProps> = ({
  averageScore,
  coins,
  matchCount,
}) => {
  return (
    <InfoBoxContainer>
      <Section>
        <Label>평균 점수</Label>
        <ScoreValue>
          <StarIconWrapper>
            <StarIcon />
          </StarIconWrapper>
          <ScoreTextWrapper>
            <Value>{averageScore}</Value>
          </ScoreTextWrapper>
        </ScoreValue>
      </Section>

      <Divider />

      <Section>
        <Label>보유 코인</Label>
        <Value>{coins}개</Value>
      </Section>

      <Divider />

      <Section>
        <Label>매칭 횟수</Label>
        <Value>{matchCount}회</Value>
      </Section>
    </InfoBoxContainer>
  )
}

// Star icon as SVG with gold color
const StarIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
      fill="#F0DAA9"
      stroke="#F0DAA9"
      strokeWidth="1.5"
    />
  </svg>
)

export default InfoBox
