import styled from '@emotion/styled'

export const TagReviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 30px;
`

export const TagReviewTitle = styled.h2`
  font-family: 'Pretendard', sans-serif;
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 12px;
`

export const TagListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`

export const TagItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 12px 20px;
`

export const TagLeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const TagText = styled.span`
  font-family: 'Pretendard', sans-serif;
  font-weight: bold;
  padding: 0;
  font-size: 14px;
  color: #393939;
`

export const TagCount = styled.span`
  font-family: 'Pretendard', sans-serif;
  font-weight: bold;
  font-size: 14px;
  color: #393939;
`

export const ExpandButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 12px;
  margin-top: 8px;
  border: none;
  background: none;
  cursor: pointer;
  gap: 5px;
  color: #393939;
  font-family: 'Pretendard', sans-serif;
  font-size: 14px;

  &:active {
    opacity: 0.7;
  }
`

interface ArrowIconProps {
  isExpanded: boolean
}

export const ArrowIcon = styled.div<ArrowIconProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  transform: ${(props) =>
    props.isExpanded ? 'rotate(90deg)' : 'rotate(-90deg)'};
  transition: transform 0.3s ease;
`
