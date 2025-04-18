/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useState } from 'react'
import MatchType from './matchType'

import Category from './category'

interface MatchItemProps {
  department: string
  title: string
  description: string
  matchType: string
  category: string
  borderSet: boolean
}

const matchItemStyle = {
  container: (borderSet: boolean) => css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
    width: 100%;
    height: 100%;
    padding: 20px 0;
    cursor: pointer;
    border-bottom: ${borderSet ? '1px solid #E6E6E6' : 'none'};
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
  borderSet,
}: MatchItemProps) => {
  return (
    <div className="container" css={matchItemStyle.container(borderSet)}>
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

      <div className="categoryWrapper" css={matchItemStyle.categoryWrapper}>
        <MatchType matchType={matchType} />
        <Category category={category} />
      </div>
    </div>
  )
}

export default MatchItem
