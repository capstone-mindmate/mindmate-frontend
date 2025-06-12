/** @jsxImportSource @emotion/react */
import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { css } from '@emotion/react'
import { fetchWithRefresh } from '../../utils/fetchWithRefresh'
import { useToast } from '../../components/toast/ToastProvider'
import { RootContainer, EmoticonsContainer } from './style'
import TopBar from '../../components/topbar/Topbar'
import { useNavigationStore } from '../../stores/navigationStore'

const EmoticonRegister = () => {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { setPreviousPath } = useNavigationStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [emoticonName, setEmoticonName] = useState('')
  const [emoticonPrice, setEmoticonPrice] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(false)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // 이미지 파일인지 확인
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.')
        return
      }

      // 파일 크기 제한 (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('파일 크기는 5MB 이하여야 합니다.')
        return
      }

      setSelectedFile(file)

      // 미리보기 URL 생성
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!selectedFile) {
      showToast('이미지 파일을 선택해주세요.', 'error')
      return
    }
    if (!emoticonName.trim()) {
      showToast('이모티콘 이름을 입력해주세요.', 'error')
      return
    }
    if (emoticonPrice <= -1) {
      showToast('가격을 올바르게 입력해주세요.', 'error')
      return
    }

    setIsLoading(true)

    const uploadData = {
      name: emoticonName.trim(),
      price: emoticonPrice,
    }

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append(
        'request',
        new Blob([JSON.stringify(uploadData)], { type: 'application/json' })
      )

      await fetchWithRefresh('https://mindmate.shop/api/emoticons/upload', {
        method: 'POST',
        body: formData,
      })

      // 성공 시 폼 초기화
      setSelectedFile(null)
      setPreviewUrl('')
      setEmoticonName('')
      setEmoticonPrice(0)

      // 성공 토스트 표시
      showToast(
        '이모티콘 등록 신청이 완료되었습니다. 관리자 승인 후 판매가 시작됩니다.',
        'success',
        true,
        4000
      )

      setTimeout(() => {
        navigate('/emoticons')
      }, 2000)
    } catch (error) {
      console.error('이모티콘 업로드 실패:', error)
      showToast('등록 중 오류가 발생했습니다.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const goToEmoticonHome = () => {
    // 현재 페이지를 이전 페이지로 설정
    setPreviousPath('/emoticons/upload')
  }

  const handleBackClick = () => {
    navigate('/emoticons')
    goToEmoticonHome()
  }

  return (
    <RootContainer>
      <TopBar
        title="이모티콘 등록"
        showBackButton={true}
        onBackClick={handleBackClick}
      />

      <EmoticonsContainer>
        <form css={formContainer} onSubmit={handleSubmit}>
          {/* 이미지 업로드 섹션 */}
          <div css={uploadSection}>
            <h3 css={sectionTitle}>이모티콘 이미지</h3>
            <div css={imageUploadContainer} onClick={handleImageClick}>
              {previewUrl ? (
                <img src={previewUrl} alt="미리보기" css={previewImage} />
              ) : (
                <div css={uploadPlaceholder}>
                  <div css={uploadIcon}>📷</div>
                  <p css={uploadText}>이미지를 선택하세요</p>
                  <p css={uploadSubText}>JPG, PNG 파일 (최대 5MB)</p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              css={hiddenInput}
            />
          </div>

          {/* 이름 입력 섹션 */}
          <div css={inputSection}>
            <h3 css={sectionTitle}>이모티콘 이름</h3>
            <input
              type="text"
              value={emoticonName}
              onChange={(e) => setEmoticonName(e.target.value)}
              placeholder="이모티콘 이름을 입력하세요"
              css={textInput}
              maxLength={20}
            />
          </div>

          {/* 가격 입력 섹션 */}
          <div css={inputSection}>
            <h3 css={sectionTitle}>판매 가격</h3>
            <input
              type="number"
              value={emoticonPrice}
              onChange={(e) =>
                setEmoticonPrice(Math.max(0, parseInt(e.target.value) || 0))
              }
              placeholder="가격을 입력하세요"
              css={textInput}
              min="0"
            />
            <p css={priceNote}>* 0원으로 설정하면 무료 이모티콘이 됩니다.</p>
          </div>

          {/* 등록 안내 */}
          <div css={infoSection}>
            <p css={infoText}>
              📋 등록된 이모티콘은 관리자 승인 후 판매가 시작됩니다.
            </p>
          </div>

          {/* 등록 버튼 */}
          <button
            type="submit"
            disabled={!selectedFile || !emoticonName.trim() || isLoading}
            css={submitButton}
          >
            {isLoading ? '등록 중...' : '이모티콘 등록'}
          </button>
        </form>
      </EmoticonsContainer>
    </RootContainer>
  )
}

const formContainer = css`
  padding: 20px 0;
  width: 100%;
  box-sizing: border-box;
`

const uploadSection = css`
  margin-bottom: 32px;
`

const sectionTitle = css`
  color: #000000;
  font-size: 18px;
  font-weight: bold;
  line-height: 1.55;
  margin: 0 0 16px 0;
`

const imageUploadContainer = css`
  width: 100%;
  height: 200px;
  border: 2px dashed #ddd;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color 0.3s;
  box-sizing: border-box;

  &:hover {
    border-color: #392111;
  }
`

const previewImage = css`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
`

const uploadPlaceholder = css`
  text-align: center;
  color: #666;
`

const uploadIcon = css`
  font-size: 48px;
  margin-bottom: 16px;
`

const uploadText = css`
  font-size: 16px;
  font-weight: 500;
  margin: 0 0 8px 0;
  color: #333;
`

const uploadSubText = css`
  font-size: 14px;
  margin: 0;
  color: #666;
`

const hiddenInput = css`
  display: none;
`

const inputSection = css`
  margin-bottom: 32px;
`

const textInput = css`
  width: 100%;
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  box-sizing: border-box;
  transition: border-color 0.3s;
  min-width: 0; /* flexbox 오버플로우 방지 */

  &:focus {
    outline: none;
    border-color: #392111;
  }

  &::placeholder {
    color: #999;
  }
`

const priceNote = css`
  font-size: 12px;
  color: #666;
  margin: 8px 0 0 0;
  line-height: 1.4;
`

const submitButton = css`
  width: 100%;
  padding: 16px;
  background-color: #392111;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 20px;
  box-sizing: border-box;

  &:hover:not(:disabled) {
    background-color: #503018;
  }

  &:active:not(:disabled) {
    background-color: #2a180d;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`

const infoSection = css`
  margin-bottom: 24px;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #392111;
  box-sizing: border-box;
  width: 100%;
`

const infoText = css`
  margin: 0;
  font-size: 14px;
  color: #555;
  line-height: 1.5;
`

export default EmoticonRegister
