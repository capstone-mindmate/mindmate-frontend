/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/react'
import {
  emoticonContainerStyles,
  emoticonImageStyles,
} from '../../styles/EmoticonStyles'

// 이모티콘 타입 정의
export type EmoticonType =
  | 'normal' // 이미지 1 (고마워)
  | 'love' // 이미지 2 (윙크하트)
  | 'music' // 이미지 3 (음악)
  | 'sad' // 이미지 4 (슬픔)
  | 'angry' // 이미지 5 (화남)
  | 'couple' // 이미지 6 (커플)
  | 'default' // 이미지 7 (기본)
  | 'talking' // 이미지 8 (대화)
  | 'thumbsUp' // 이미지 9 (엄지척)
  | 'student' // 이미지 10 (학생들)
  | 'graduate' // 이미지 11 (졸업)
  | 'hoodie' // 이미지 12 (후드티)
  | 'study' // 이미지 13 (공부)
  | 'thanks' // 이미지 14 (또다른 기본)

interface EmoticonProps {
  type: EmoticonType
  size?: 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge' | 'huge'
  onClick?: () => void
  className?: string
  alt?: string
  inChat?: boolean
}

const Emoticon: React.FC<EmoticonProps> = ({
  type = 'normal',
  size = 'medium',
  onClick,
  className,
  alt = '이모티콘',
  inChat = false,
}) => {
  // 이모티콘 이미지 경로
  const getEmoticonSrc = (): string => {
    // 이미지 경로 매핑
    switch (type) {
      case 'normal':
        return '/emoticons/emoticon_normal.png'
      case 'love':
        return '/emoticons/emoticon_love.png'
      case 'music':
        return '/emoticons/emoticon_music.png'
      case 'sad':
        return '/emoticons/emoticon_sad.png'
      case 'angry':
        return '/emoticons/emoticon_angry.png'
      case 'couple':
        return '/emoticons/emoticon_couple.png'
      case 'default':
        return '/emoticons/emoticon_default.png'
      case 'talking':
        return '/emoticons/emoticon_talking.png'
      case 'thumbsUp':
        return '/emoticons/emoticon_thumbsUp.png'
      case 'student':
        return '/emoticons/emoticon_student.png'
      case 'graduate':
        return '/emoticons/emoticon_graduate.png'
      case 'hoodie':
        return '/emoticons/emoticon_hoodie.png'
      case 'study':
        return '/emoticons/emoticon_study.png'
      case 'thanks':
        return '/emoticons/emoticon_thanks.png'
      default:
        return '/emoticons/emoticon_normal.png'
    }
  }

  // 이모티콘 크기에 따른 스타일 적용
  const getSizeStyles = () => {
    // 채팅에서 사용되는 경우 기본 크기를 더 크게 설정
    const chatMultiplier = inChat ? 1.5 : 1

    switch (size) {
      case 'small':
        return css`
          width: ${40 * chatMultiplier}px;
          height: ${40 * chatMultiplier}px;
        `
      case 'medium':
        return css`
          width: ${70 * chatMultiplier}px;
          height: ${70 * chatMultiplier}px;
        `
      case 'large':
        return css`
          width: ${100 * chatMultiplier}px;
          height: ${100 * chatMultiplier}px;
        `
      case 'xlarge':
        return css`
          width: ${130 * chatMultiplier}px;
          height: ${130 * chatMultiplier}px;
        `
      case 'xxlarge':
        return css`
          width: ${180 * chatMultiplier}px;
          height: ${180 * chatMultiplier}px;
        `
      case 'huge':
        return css`
          width: ${220 * chatMultiplier}px;
          height: ${220 * chatMultiplier}px;
        `
      default:
        return css`
          width: ${70 * chatMultiplier}px;
          height: ${70 * chatMultiplier}px;
        `
    }
  }

  // 이모티콘 이미지 경로
  const emoticonSrc = getEmoticonSrc()

  // 사이즈 스타일
  const sizeStyles = getSizeStyles()

  return (
    <div
      css={[emoticonContainerStyles, sizeStyles]}
      className={className}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <img src={emoticonSrc} alt={alt} css={emoticonImageStyles} />
    </div>
  )
}

export default Emoticon
