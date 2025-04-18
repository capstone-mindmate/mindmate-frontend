/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useState } from 'react'

import BrownRectButton from '../buttons/brownRectButton'

interface MatchItemProps {
  department: string
  title: string
  description: string
  matchType: string
  category: string
}

const matchItemStyle = {
  container: css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
    width: 100%;
    height: 100%;
    padding: 20px 0;
  `,

  infoWrapper: css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    width: 100%;
  `,

  department: css`
    font-size: 12px;
    font-weight: 400;
    line-height: 1.3;
    margin: 0;
    color: #727272;
  `,

  title: css`
    font-size: 16px;
    font-weight: bold;
    line-height: 1.5;
    margin: 0;
    color: #393939;
  `,

  description: css`
    font-size: 14px;
    font-weight: 400;
    line-height: 1.4;
    margin: 0;
    color: #727272;
  `,

  categoryWrapper: css`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 4px;
  `,
}

const MatchItem = ({
  department,
  title,
  description,
  matchType,
  category,
}: MatchItemProps) => {
  return (
    <div className="container" css={matchItemStyle.container}>
      <div className="infoWrapper" css={matchItemStyle.infoWrapper}>
        <div className="department">
          <p css={matchItemStyle.department}>{department}</p>
        </div>

        <div className="title">
          <p css={matchItemStyle.title}>{title}</p>
        </div>

        <div className="description">
          <p css={matchItemStyle.description}>{description}</p>
        </div>
      </div>

      <div
        className="categoryWrapper"
        css={matchItemStyle.categoryWrapper}
      ></div>
    </div>
  )
}

export default MatchItem
