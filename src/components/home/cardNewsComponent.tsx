/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'

interface CardNewsComponentProps {
  imgUrl: string
  title: string
  organization: string
  date: string
}

const containerStyle = css`
  display: flex;
  flex-direction: column;
  width: 250px;
  cursor: pointer;
`

const imgStyles = {
  imgBoxStyle: css`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  `,
  imgStyle: css`
    width: 100%;
    height: 100%;
    border-radius: 4px;
    object-fit: cover;
    user-select: none;
  `,
}

const infoBoxStyles = {
  container: css`
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-top: 8px;
  `,
  dateStyle: css``,
  dateTextStyle: css`
    font-size: 14px;
    line-height: 1.4;
    color: #727272;
    margin: 0;
  `,
  titleStyle: css`
    margin-top: 4px;
  `,
  titleTextStyle: css`
    font-size: 16px;
    line-height: 1.5;
    font-weight: bold;
    color: #000000;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  `,
  organizationStyle: css`
    margin-top: 2px;
  `,
  organizationTextStyle: css`
    font-size: 14px;
    line-height: 1.4;
    color: #393939;
    margin: 0;
  `,
}

const CardNewsComponent = ({
  imgUrl,
  title,
  organization,
  date,
}: CardNewsComponentProps) => {
  const handleClick = () => {}

  return (
    <div css={containerStyle} onClick={handleClick}>
      <div className="imgBox" css={imgStyles.imgBoxStyle}>
        <img src={imgUrl} alt={title} css={imgStyles.imgStyle} />
      </div>

      <div className="infoBox" css={infoBoxStyles.container}>
        <div className="date" css={infoBoxStyles.dateStyle}>
          <p css={infoBoxStyles.dateTextStyle}>{date}</p>
        </div>
        <div className="title" css={infoBoxStyles.titleStyle}>
          <p css={infoBoxStyles.titleTextStyle}>{title}</p>
        </div>
        <div className="organization" css={infoBoxStyles.organizationStyle}>
          <p css={infoBoxStyles.organizationTextStyle}>{organization}</p>
        </div>
      </div>
    </div>
  )
}

export default CardNewsComponent
