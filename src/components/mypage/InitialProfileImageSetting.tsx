/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useState, useRef, ChangeEvent } from 'react'
import { CameraIcon } from '../../components/icon/iconComponents'

interface InitialProfileImageSettingProps {
  onImageChange?: (file: File) => void
}

const styles = {
  container: css`
    display: flex;
    flex-direction: column;
    gap: 16px;
  `,
  imageContainer: css`
    width: 110px;
    height: 110px;
    position: relative;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    overflow: hidden;
    cursor: pointer;
  `,
  profileImage: css`
    width: calc(100% - 10px);
    height: calc(100% - 10px);
    object-fit: cover;
    border-radius: 50%;
  `,
  cameraIconContainer: css`
    position: absolute;
    bottom: 0px;
    right: 10px;
    width: 30px;
    height: 30px;
    background-color: #d9d9d9;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border: 4px solid #ffffff;
  `,
  imageInput: css`
    display: none;
  `,
  defaultProfile: css`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
  defaultProfileIcon: css`
    width: 100%;
    height: 100%;
  `,
}

const DefaultProfileIcon = () => (
  <svg
    width="100"
    height="100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    css={styles.defaultProfileIcon}
  >
    <circle cx="50" cy="50" r="50" fill="#D9D9D9" />
    <mask
      id="mask0_2288_5749"
      maskUnits="userSpaceOnUse"
      x="0"
      y="0"
      width="100"
      height="100"
    >
      <circle cx="50" cy="50" r="50" fill="#D9D9D9" />
    </mask>
    <g mask="url(#mask0_2288_5749)">
      <circle cx="50.3585" cy="38.9289" r="16.0714" fill="#A3A3A3" />
      <circle cx="50.358" cy="98.9283" r="36.7857" fill="#A3A3A3" />
    </g>
  </svg>
)

const InitialProfileImageSetting = ({
  onImageChange,
}: InitialProfileImageSettingProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const file = files[0]
      const reader = new FileReader()

      reader.onload = () => {
        setImagePreview(reader.result as string)
        onImageChange?.(file)
      }

      reader.readAsDataURL(file)
    }
  }

  return (
    <div css={styles.container}>
      <div css={styles.imageContainer} onClick={handleImageClick}>
        {imagePreview ? (
          <img src={imagePreview} css={styles.profileImage} />
        ) : (
          <div css={styles.defaultProfile}>
            <DefaultProfileIcon />
          </div>
        )}

        <div css={styles.cameraIconContainer}>
          <CameraIcon width={24} strokeWidth={1.5} />
        </div>

        <input
          type="file"
          ref={fileInputRef}
          css={styles.imageInput}
          onChange={handleFileChange}
          accept="image/*"
        />
      </div>
    </div>
  )
}

export default InitialProfileImageSetting
