/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'

interface HomeCategoryButtonProps {
  buttonText: string
  emoji: string
  onClick?: () => void
}

const containerStyle = css`
  width: calc(33.3333% - 10px);
  height: 96px;
`

const buttonStyle = css`
  width: 100%;
  height: 100%;
  background-color: #fff9eb;
  color: #000000;
  border: 1px solid #f0daa9;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  gap: 4px;
`

const topStyle = css`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`

const bottomStyle = css`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`

const textStyle = css`
  font-size: 16px;
  font-weight: bold;
  line-height: 1.5;
  color: #000000;
  margin: 0;
  margin-left: 12px;
`

const emojiStyle = css`
  font-size: 30px;
  font-weight: bold;
  line-height: 1.5;
  margin: 0;
  margin-right: 12px;
`

const HomeCategoryButton = ({
  buttonText,
  emoji,
  onClick,
}: HomeCategoryButtonProps) => {
  const handleClick = () => {
    if (onClick) {
      onClick()
    }
  }

  return (
    <div className="container" css={containerStyle}>
      <button css={buttonStyle} onClick={handleClick}>
        <div className="top" css={topStyle}>
          <p className="text" css={textStyle}>
            {buttonText}
          </p>
        </div>
        <div className="bottom" css={bottomStyle}>
          <p className="emoji" css={emojiStyle}>
            {emoji}
          </p>
        </div>
      </button>
    </div>
  )
}

export default HomeCategoryButton
