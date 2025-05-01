/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { CoinIcon } from '../icon/iconComponents'

interface EmoticonProfileProps {
  profileImage: string
  name: string
  heldCoins: number
}

const styles = {
  container: css`
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    box-sizing: border-box;
    padding: 19px 16px;
    border-radius: 8px;
    background-color: #fffcf5;
    border: 1px solid #f0daa9;
    gap: 12px;
  `,

  profileImgWrapper: css`
    width: 50px;
    height: 50px;
    border-radius: 50%;
    overflow: hidden;
  `,
  profileImg: css`
    width: 100%;
    height: 100%;
    object-fit: cover;
  `,
  profileInfo: css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 2px;
  `,
  profileName: css`
    font-size: 16px;
    line-height: 1.5;
    font-weight: 700;
    color: #000000;
    margin: 0;
  `,

  profileHeldCoins: css`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 4px;
  `,
  profileHeldCoinsText: css`
    font-size: 14px;
    line-height: 1.4;
    font-weight: 400;
    color: #000000;
    margin: 0;
  `,
}

const EmoticonProfile = ({
  profileImage,
  name,
  heldCoins,
}: EmoticonProfileProps) => {
  return (
    <div className="container" css={styles.container}>
      <div className="profileImgWrapper" css={styles.profileImgWrapper}>
        <img src={profileImage} alt={name} css={styles.profileImg} />
      </div>
      <div className="profileInfo" css={styles.profileInfo}>
        <div className="profileName">
          <p css={styles.profileName}>{name}</p>
        </div>
        <div className="profileHeldCoins" css={styles.profileHeldCoins}>
          <CoinIcon color="#392111" width={16} height={16} />
          <p css={styles.profileHeldCoinsText}>보유코인 {heldCoins}개</p>
        </div>
      </div>
    </div>
  )
}

export default EmoticonProfile
