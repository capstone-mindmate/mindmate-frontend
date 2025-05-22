/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'

interface MatchTypeProps {
  matchType: string
}

const matchTypeStyle = {
  container: (matchType: string) => css`
    background-color: ${matchType === 'LISTENER' ? '#5C351B' : '#FFF9EB'};
    padding: 6px 10px;
    border-radius: 3px;
  `,

  matchTypeText: (matchType: string) => css`
    margin: 0;
    font-size: 12px;
    font-weight: bold;
    line-height: 1.3;
    color: ${matchType === 'LISTENER' ? '#FFFFFF' : '#393939'};
  `,
}

const MatchType = ({ matchType }: MatchTypeProps) => {
  return (
    <div className="container" css={matchTypeStyle.container(matchType)}>
      <p css={matchTypeStyle.matchTypeText(matchType)}>
        {matchType === 'LISTENER' ? '👂🏻 리스너' : '🗣️ 스피커'}
      </p>
    </div>
  )
}

export default MatchType
