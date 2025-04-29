import styled from '@emotion/styled'

interface BubbleContainerProps {
  isMe: boolean
  isEmoticon?: boolean
}

export const BubbleContainer = styled.div<BubbleContainerProps>`
  display: inline-block;
  max-width: ${(props) => (props.isEmoticon ? 'none' : '64.2%')};
  padding: ${(props) => (props.isEmoticon ? '0px' : '10px 18px')};
  margin: 0;
  border-radius: ${(props) =>
    props.isMe ? '15px 15px 0 15px' : '15px 15px 15px 0'};
  font-family: 'Pretendard', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 1.2;
  color: #000000;
  background-color: ${(props) =>
    props.isEmoticon ? 'none' : props.isMe ? '#FEECC4' : '#E8E8E8'};
  position: relative;
  word-break: break-word;
`

export const BubbleWrapper = styled.div<{
  isMe: boolean
  isContinuous?: boolean
  isEmoticon?: boolean
}>`
  display: flex;
  width: 100%;
  justify-content: ${(props) => (props.isMe ? 'flex-end' : 'flex-start')};
  margin: ${(props) => {
    if (props.isContinuous) {
      // 이모티콘이면서 연속된 메시지인 경우 위쪽 마진 줄이기
      return props.isEmoticon ? '0px 0px 10px 0px' : '0px 0px 10px 0px'
    }
    // 일반 메시지일 경우 기본 마진 유지
    return '10px 0px'
  }};
  align-items: flex-start;
`

export const ProfileImage = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin-right: 10px;
  object-fit: cover;
`

// 프로필 이미지 공간을 확보하는 컨테이너
export const ProfileContainer = styled.div`
  width: 36px;
  height: 36px;
  margin-right: 10px;
  flex-shrink: 0;
`

export const TimeInfo = styled.span`
  font-size: 10px;
  color: #999999;
  align-self: flex-end;
  margin: 0 5px;
  margin-bottom: 4px;
`

export const ReadStatus = styled.span`
  font-size: 10px;
  color: #727272;
  font-family: 'Pretendard', sans-serif;
  font-weight: 600;
  align-self: flex-end;
  margin: 0 4px;
`

export const MessageContainer = styled.div<{
  isMe: boolean
  isEmoticon?: boolean
}>`
  display: flex;
  flex-direction: ${(props) => (props.isMe ? 'row-reverse' : 'row')};
  align-items: flex-end;
  width: ${(props) => {
    if (props.isEmoticon) return 'auto'
    return props.isMe ? '100%' : 'calc(100% - 44px)'
  }};
`
