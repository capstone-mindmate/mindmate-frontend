/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'

interface MatchTypeProps {
  matchType: string
}

const matchTypeStyle = {
  container: (matchType: string) => css`
    background-color: ${matchType === '리스너' ? '#5C351B' : '#FFF9EB'};
    padding: 6px 10px;
    border-radius: 3px;
  `,

  matchTypeText: (matchType: string) => css`
    margin: 0;
    font-size: 12px;
    font-weight: bold;
    line-height: 1.3;
    color: ${matchType === '리스너' ? '#FFFFFF' : '#393939'};
  `,
}

const MatchType = ({ matchType }: MatchTypeProps) => {
  return (
    <div className="container" css={matchTypeStyle.container(matchType)}>
      <p css={matchTypeStyle.matchTypeText(matchType)}>
        {matchType === '리스너' ? '👂🏻 리스너' : '🗣️ 스피커'}
      </p>
    </div>
  )
}

export default MatchType
