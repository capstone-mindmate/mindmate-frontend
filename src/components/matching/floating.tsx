/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useState } from 'react'
import { SendIcon } from '../icon/iconComponents'

interface RandomMatchingSelectorProps {
  listenerHandler: () => void
  speakerHandler: () => void
}

const floatingStyles = {
  container: css`
    position: fixed;
    bottom: 100px;
    right: 20px;
    z-index: 10;
    display: flex;
    flex-direction: column;
    gap: 10px;
    transition: all 0.5s ease-in-out;
  `,

  selectButton: css`
    background-color: #392111;
    color: #ffffff;
    border: none;
    padding: 10px 14px;
    border-radius: 100px;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.4;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.5s ease;
    gap: 6px;
    &:hover {
      transform: scale(1.03);
    }
  `,

  selectButtonListener: css`
    background-color: #5c351b;
    color: #ffffff;

    border: none;
    padding: 10px 14px;
    border-radius: 100px;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.4;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.5s ease;
    gap: 6px;
    &:hover {
      transform: scale(1.03);
    }
  `,

  selectButtonSpeaker: css`
    background-color: #fff9eb;
    color: #393939;

    border: 1px solid #f0daa9;
    padding: 10px 14px;
    border-radius: 100px;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.4;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.5s ease;
    gap: 6px;
    &:hover {
      transform: scale(1.03);
    }
  `,

  selectButtonContainer: (isVisible: boolean) => css`
    display: flex;
    gap: 10px;
    flex-direction: column;
    gap: 10px;
    transform: translateX(${isVisible ? '0' : '200px'});
    opacity: ${isVisible ? '1' : '0'};
    transition: all 0.5s ease;
  `,
}

const RandomMatchingSelector = ({
  listenerHandler,
  speakerHandler,
}: RandomMatchingSelectorProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleListenerClick = () => {
    listenerHandler()
    setIsMenuOpen(false)
  }

  const handleSpeakerClick = () => {
    speakerHandler()
    setIsMenuOpen(false)
  }

  return (
    <div css={floatingStyles.container}>
      <div css={floatingStyles.selectButtonContainer(isMenuOpen)}>
        <button
          onClick={handleListenerClick}
          css={floatingStyles.selectButtonListener}
        >
          👂🏻 리스너
        </button>
        <button
          onClick={handleSpeakerClick}
          css={floatingStyles.selectButtonSpeaker}
        >
          🗣️ 스피커
        </button>
      </div>

      <button css={floatingStyles.selectButton} onClick={toggleMenu}>
        <SendIcon color="#ffffff" width={16} height={16} />
        랜덤매칭
      </button>
    </div>
  )
}

export default RandomMatchingSelector
