/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'

interface AnswerProps {
  title: string
  answer: string
}

const askInputStyles = {
  container: css`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
  `,
  input: css`
    width: calc(100% - 32px);
    height: 48px;
    padding: 0 16px;
    border-radius: 8px;
    border: 1px solid #f0daa9;
    background-color: #fff9eb;
    font-size: 14px;
    line-height: 1.4;
    color: #150c06;
    transition: all 0.3s ease;
  `,
  title: css`
    font-size: 16px;
    line-height: 1.5;
    font-weight: bold;
    color: #150c06;
    margin: 0;
  `,
}

const Answer = ({ title, answer }: AnswerProps) => {
  return (
    <div className="answer-input" css={askInputStyles.container}>
      <p css={askInputStyles.title}>{title}</p>
      <input
        type="text"
        placeholder="답변을 입력해주세요"
        value={answer}
        css={askInputStyles.input}
        readOnly
      />
    </div>
  )
}

export default Answer
