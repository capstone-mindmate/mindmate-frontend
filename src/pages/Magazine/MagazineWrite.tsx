/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import ReactQuill from 'react-quill'
import { createRoot } from 'react-dom/client'
import 'react-quill/dist/quill.snow.css'
import {
  MagazineWriteContainer,
  QuillEditorContainer,
  ImageInput,
  CategorySelect,
  ReviewNoticeTooltip,
} from './styles/MagazineWriteStyles'
import TopBar from '../../components/topbar/Topbar'
import {
  insertImageToQuill,
  getStorageOptimizedContent,
  ImageState,
} from './MagazineImageHandler'
import { postMagazine } from './MagazineContentParser'
import { EmoticonType } from '../../components/emoticon/Emoticon'
import EmoticonPicker, {
  EmoticonData,
} from '../../components/emoticon/EmoticonPicker'
import { insertEmoticonToEditor, EmoticonState } from './EmoticonService'
import {
  emoticonButtonStyles,
  emoticonPickerOverlayStyles,
} from './styles/EmoticonButtonStyles'
import { SmileIcon } from '../../components/icon/iconComponents'
import { fetchWithRefresh } from '../../utils/fetchWithRefresh'
import { useToast } from '../../components/toast/ToastProvider'

// 제목과 소제목 글자 수 제한 상수
const TITLE_MAX_LENGTH = 18
const SUBTITLE_MAX_LENGTH = 21

// 로컬 스토리지 키
const STORAGE_KEY = 'magazine_draft'

// 이모티콘 버튼 컴포넌트
const EmoticonButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      css={emoticonButtonStyles}
      title="이모티콘 삽입"
    >
      <SmileIcon width={20} height={20} />
    </button>
  )
}

// Quill 에디터 모듈 설정
const quillModules = {
  toolbar: {
    container: [
      ['bold', 'underline'],
      [{ size: ['small', false, 'large', 'huge'] }],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ['image'],
    ],
    handlers: {}, // 핸들러는 컴포넌트 내에서 동적으로 설정
  },
  clipboard: {
    matchVisual: false,
  },
}

// Quill 에디터 포맷 설정
const quillFormats = [
  'bold',
  'underline',
  'size',
  'color',
  'background',
  'align',
  'image',
  'link',
]

const MagazineWrite: React.FC = () => {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [content, setContent] = useState('')
  const [isActive, setIsActive] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [authStatus, setAuthStatus] = useState<boolean | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const quillRef = useRef<ReactQuill>(null)
  const toolbarRef = useRef<HTMLDivElement | null>(null)
  const emoticonPickerRef = useRef<HTMLDivElement>(null)
  const [imageState, setImageState] = useState<ImageState>({
    featuredImageId: null,
  })
  // 이모티콘 관련 상태 추가
  const [emoticonState, setEmoticonState] = useState<EmoticonState>({
    selectedEmoticonId: null,
  })
  const [showEmoticonPicker, setShowEmoticonPicker] = useState(false)

  // 알림 메시지 목록 및 애니메이션 관련 상태 추가
  const noticeMessages = [
    '모든 게시글은 MindMate에서 검토 후 등록돼요!',
    '가장 처음에 등록된 이미지가 대표 이미지가 돼요!',
    '제목, 소제목, 본문, 이미지 모두 입력해야 등록할 수 있어요!',
  ]

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [fadeState, setFadeState] = useState('fade-in')
  // 카테고리 상태 추가
  const [category, setCategory] = useState('진로')

  // 이모티콘 검증을 위한 헬퍼 함수
  const isEmoticonImage = (img: HTMLImageElement): boolean => {
    // 1. 클래스로 확인 (가장 확실한 방법)
    if (img.classList.contains('magazine-emoticon')) {
      return true
    }

    // 2. data 속성으로 확인
    if (
      img.getAttribute('data-emoticon-api-id') ||
      img.getAttribute('data-emoticon-type')
    ) {
      return true
    }

    // 3. URL 경로로 확인 (보조적 방법)
    const src = img.src || img.getAttribute('src') || ''
    if (src.includes('/emoticonImages/') || src.includes('/emoticon/')) {
      return true
    }

    // 4. alt 속성으로 확인 (보조적 방법)
    const alt = img.alt || ''
    if (alt.includes('이모티콘') || alt.includes('emoticon')) {
      return true
    }

    return false
  }

  // 컴포넌트 마운트 시 인증 상태 확인
  useEffect(() => {
    // 토큰 자동 확인 (fetchWithRefresh가 처리)
    fetchWithRefresh('https://mindmate.shop/api/profiles')
      .then((response) => {
        if (response.ok) {
          setAuthStatus(true)
        } else {
          console.error('인증 실패:', response.status)
          setAuthStatus(false)
          if (response.status === 401) {
            showToast('로그인 세션이 만료되었습니다.', 'error')
            navigate('/onboarding')
          }
        }
      })
      .catch((error) => {
        console.error('인증 확인 오류:', error)
        setAuthStatus(false)
      })
  }, [navigate, showToast])

  // 이미지 버튼 클릭 핸들러
  const handleImageClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }, [])

  // 이모티콘 버튼 토글 핸들러
  const handleEmoticonButtonClick = useCallback(() => {
    //console.log('이모티콘 버튼 클릭됨')

    // Quill의 현재 포커스/선택 유지
    const quillEditor = quillRef.current?.getEditor()
    if (quillEditor && !quillEditor.hasFocus()) {
      quillEditor.focus()
    }

    setShowEmoticonPicker((prev) => !prev)
  }, [])

  // 이모티콘 선택 핸들러 - 서버에서 받아온 실제 이모티콘 정보 사용
  const handleEmoticonSelect = useCallback((emoticonData: EmoticonData) => {
    //console.log('이모티콘 선택됨:', emoticonData)

    // 서버에서 받아온 실제 이모티콘 정보 사용
    const { id: emoticonId, type: emoticonName, imageUrl } = emoticonData // name 대신 type 사용

    // 서버에서 받은 실제 이미지 URL 구성
    const fullImageUrl = `https://mindmate.shop/api${imageUrl}`

    // insertEmoticonToEditor 함수를 사용하여 에디터에 삽입
    insertEmoticonToEditor(
      quillRef,
      emoticonId, // 서버에서 받은 실제 이모티콘 ID
      fullImageUrl, // 서버에서 받은 실제 이미지 URL
      emoticonName || 'unknown', // 서버에서 받은 실제 이모티콘 이름 (예: "angry", "happy")
      () => setShowEmoticonPicker(false)
    )

    // 이모티콘 피커 닫기
    setShowEmoticonPicker(false)
  }, [])

  // 이모티콘샵 클릭 핸들러
  const handleEmoticonShopClick = useCallback(() => {
    // 이모티콘샵으로 이동하는 로직 (필요시 구현)
    //console.log('이모티콘샵으로 이동')
    setShowEmoticonPicker(false)
  }, [])

  // 메시지 순환 효과
  useEffect(() => {
    const messageInterval = setInterval(() => {
      // 먼저 fade-out 효과
      setFadeState('fade-out')

      // 0.5초 후에 메시지 변경하고 fade-in 효과
      setTimeout(() => {
        setCurrentMessageIndex(
          (prevIndex) => (prevIndex + 1) % noticeMessages.length
        )
        setFadeState('fade-in')
      }, 500)
    }, 5000) // 5초마다 메시지 변경

    return () => {
      clearInterval(messageInterval)
    }
  }, [noticeMessages.length])

  // 카테고리 변경 핸들러 추가
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value)
  }

  // 컴포넌트 마운트 시 로컬 스토리지에서 드래프트 불러오기
  useEffect(() => {
    const savedDraft = localStorage.getItem(STORAGE_KEY)
    if (savedDraft) {
      try {
        const draftData = JSON.parse(savedDraft)
        setTitle(draftData.title || '')
        setSubtitle(draftData.subtitle || '')
        setContent(draftData.content || '')
        setCategory(draftData.category || '진로')

        if (draftData.imageState) {
          setImageState(draftData.imageState)
        }
      } catch (error) {
        console.error('드래프트 불러오기 실패:', error)
      }
    }
  }, [])

  // 이모티콘 피커 외부 클릭 시 닫기
  useEffect(() => {
    if (!showEmoticonPicker) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      const emoticonButton = document.querySelector(
        'button[title="이모티콘 삽입"]'
      )

      if (
        emoticonPickerRef.current &&
        !emoticonPickerRef.current.contains(target) &&
        emoticonButton &&
        !emoticonButton.contains(target as Node)
      ) {
        setShowEmoticonPicker(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showEmoticonPicker])

  // Quill 에디터 마운트 후 툴바 핸들러 설정
  useEffect(() => {
    if (!quillRef.current) return

    // 에디터가 마운트된 후에 실행할 수 있도록 setTimeout 사용
    const timeoutId = setTimeout(() => {
      // Quill 인스턴스 가져오기
      const quill = quillRef.current?.getEditor()
      if (!quill) return

      // 툴바 모듈 가져오기
      const toolbar = quill.getModule('toolbar')
      if (!toolbar) return

      // 이미지 핸들러 설정
      toolbar.handlers.image = handleImageClick

      // 이모티콘 버튼 추가 (커스텀 버튼 방식)
      const toolbarElement = document.querySelector('.ql-toolbar')
      if (toolbarElement) {
        toolbarRef.current = toolbarElement as HTMLDivElement

        // 이미 있는 툴바 버튼 그룹 가져오기 또는 새로 만들기
        let customGroup = toolbarElement.querySelector('.ql-formats.ql-custom')
        if (!customGroup) {
          customGroup = document.createElement('span')
          customGroup.className = 'ql-formats ql-custom'
          toolbarElement.appendChild(customGroup)
        }

        // 이모티콘 버튼 컨테이너 생성
        const emoticonBtnContainer = document.createElement('span')

        // React 18 방식으로 렌더링
        const root = createRoot(emoticonBtnContainer)
        root.render(<EmoticonButton onClick={handleEmoticonButtonClick} />)

        customGroup.appendChild(emoticonBtnContainer)
      }
    }, 100)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [handleImageClick, handleEmoticonButtonClick])

  // 제목, 소제목, 내용, 이미지가 모두 있을 때 버튼 활성화
  useEffect(() => {
    // HTML 태그를 제거한 순수 텍스트 콘텐츠 추출
    const div = document.createElement('div')
    div.innerHTML = content
    const textContent = div.textContent || ''

    // 본문에 이미지가 포함되어 있는지 확인
    const hasImage = content.includes('<img')

    setIsActive(
      title.trim() !== '' &&
        textContent.trim() !== '' &&
        subtitle.trim() !== '' &&
        hasImage
    )
  }, [title, content, subtitle])

  // 내용 변경 시 로컬 스토리지에 자동 저장
  useEffect(() => {
    if (title || subtitle || content) {
      try {
        // getStorageOptimizedContent 함수를 사용하여 최적화된 내용 저장
        const optimizedContent = imageState.featuredImageId
          ? getStorageOptimizedContent(content)
          : content

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            title,
            subtitle,
            content: optimizedContent,
            imageState: {
              featuredImageId: imageState.featuredImageId,
            },
            category,
          })
        )
      } catch (error) {
        console.warn('로컬 스토리지 저장 실패:', error)
        // 오류 발생 시 사용자에게 알리지는 않고 콘솔에만 기록
      }
    }
  }, [title, subtitle, content, imageState, category])

  // Quill 에디터의 내용 변경 핸들러
  const handleContentChange = (value: string) => {
    setContent(value)
  }

  // 뒤로가기 버튼 핸들러
  const handleBackClick = () => {
    navigate('/magazinelist')
  }

  // 등록 버튼 핸들러 - 개선된 이모티콘 검증
  const handleSubmit = async () => {
    if (!isActive || isSubmitting) return

    try {
      setIsSubmitting(true) // 제출 중 상태 설정

      // 마지막 유효성 검사
      if (!title.trim() || !subtitle.trim() || !content.trim()) {
        showToast('제목, 소제목, 내용은 필수 입력사항입니다.', 'error')
        return
      }

      // HTML에서 이미지 태그 확인 - 개선된 이모티콘 검증
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = content
      const allImages = tempDiv.querySelectorAll('img')

      // 이모티콘과 일반 이미지 구분 (개선된 검증 로직 사용)
      const emoticonImages: HTMLImageElement[] = []
      const actualImages: HTMLImageElement[] = []

      Array.from(allImages).forEach((img: Element) => {
        const htmlImg = img as HTMLImageElement
        if (isEmoticonImage(htmlImg)) {
          emoticonImages.push(htmlImg)
        } else {
          actualImages.push(htmlImg)
        }
      })

      // 실제 이미지가 최소 1개는 있어야 함
      if (actualImages.length === 0) {
        showToast('매거진에는 최소 1개의 이미지가 필요합니다.', 'error')
        return
      }

      // 현재 Quill 에디터의 실제 콘텐츠를 가져와서 사용
      const quill = quillRef.current?.getEditor()
      if (!quill) {
        showToast('에디터를 찾을 수 없습니다.', 'error')
        return
      }

      // 에디터에서 직접 HTML 콘텐츠 가져오기
      const currentContent = quill.root.innerHTML

      // 에디터의 실제 이미지 요소들 확인 (이모티콘 제외)
      const editorImages = Array.from(
        quill.root.querySelectorAll('img')
      ).filter(
        (img: Element): img is HTMLImageElement =>
          img instanceof HTMLImageElement && !isEmoticonImage(img)
      )

      let needsIdFix = false

      // 실제 이미지(이모티콘 제외)에만 ID가 있는지 확인하고 없으면 할당
      editorImages.forEach((img: HTMLImageElement) => {
        const existingId = img.getAttribute('data-image-id')
        if (!existingId) {
          const newId = `img_${Date.now()}_${Math.floor(Math.random() * 10000)}`
          img.setAttribute('data-image-id', newId)
          needsIdFix = true
          //console.log('실제 이미지에 ID 자동 할당:', newId, 'URL:', img.src.substring(0, 50) + '...')
        }
      })

      // 이모티콘은 별도로 검증 (data-emoticon-api-id가 있는지만 확인)
      const editorEmoticons = Array.from(
        quill.root.querySelectorAll('img')
      ).filter(
        (img: Element): img is HTMLImageElement =>
          img instanceof HTMLImageElement && isEmoticonImage(img)
      )

      editorEmoticons.forEach((emoticon: HTMLImageElement) => {
        const apiId = emoticon.getAttribute('data-emoticon-api-id')
        if (!apiId) {
          console.warn('이모티콘에 API ID가 없습니다:', emoticon.src)
          // 이모티콘 클래스가 없는 경우 추가
          if (!emoticon.classList.contains('magazine-emoticon')) {
            emoticon.classList.add('magazine-emoticon')
            //console.log('이모티콘 클래스 추가됨:', emoticon.src)
          }
        } else {
          //console.log('이모티콘 API ID 확인됨:', apiId, 'URL:', emoticon.src)
        }
      })

      // 실제 이미지에만 ID가 할당된 경우 content 상태 업데이트 (한 번만)
      if (needsIdFix) {
        const updatedContent = quill.root.innerHTML
        setContent(updatedContent)
        //console.log('실제 이미지 ID 보정 완료, 콘텐츠 업데이트됨')

        // 상태가 업데이트되면 바로 제출 실행
        setTimeout(() => {
          setIsSubmitting(false)
          submitMagazineDirectly(updatedContent)
        }, 100)
        return
      }

      // 모든 실제 이미지에 ID가 있는 경우 바로 제출
      await submitMagazineDirectly(currentContent)
    } catch (error) {
      // API 호출 오류 처리
      console.error('매거진 등록 실패:', error)
      handleSubmitError(error)
    } finally {
      setIsSubmitting(false) // 제출 중 상태 해제
    }
  }

  // 실제 매거진 제출 함수에서도 개선된 검증 사용
  const submitMagazineDirectly = async (contentToSubmit: string) => {
    try {
      // 최종 검증: 실제 이미지와 이모티콘 분석
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = contentToSubmit
      const allImages = tempDiv.querySelectorAll('img')

      const actualImages: HTMLImageElement[] = []
      const emoticonImages: HTMLImageElement[] = []

      Array.from(allImages).forEach((img: Element) => {
        const htmlImg = img as HTMLImageElement
        if (isEmoticonImage(htmlImg)) {
          emoticonImages.push(htmlImg)
        } else {
          actualImages.push(htmlImg)
        }
      })

      // 매거진 게시 함수 호출
      //console.log('매거진 등록 시도...')
      const result = await postMagazine(
        title,
        subtitle,
        category,
        contentToSubmit
      )
      //console.log('매거진 등록 결과:', result)

      // 성공 시 로컬 스토리지 드래프트 삭제
      localStorage.removeItem(STORAGE_KEY)

      // 등록 성공 알림
      showToast(
        '매거진이 성공적으로 등록되었습니다. 검토 후 게시됩니다.',
        'success'
      )

      // 매거진 목록 페이지로 이동
      navigate('/magazinelist')
    } catch (error) {
      console.error('매거진 제출 실패:', error)
      handleSubmitError(error)
    }
  }

  // 에러 처리 함수 (분리하여 재사용)
  const handleSubmitError = (error: any) => {
    if (error instanceof Error) {
      const errorMessage = error.message || ''

      // 오류 유형별 분류 및 사용자 친화적 메시지 제공
      if (
        errorMessage.includes('401') ||
        errorMessage.includes('인증') ||
        errorMessage.includes('로그인')
      ) {
        showToast('로그인 세션이 만료되었습니다. 다시 로그인해주세요.', 'error')
        navigate('/onboarding')
      } else if (
        errorMessage.includes('MAGAZINE_IMAGE_NOT_FOUND') ||
        errorMessage.includes('해당 매거진 이미지를 찾을 수 없습니다')
      ) {
        showToast(
          '이미지 등록 처리 중 문제가 발생했습니다. 이미지를 모두 삭제하고 다시 추가해 주세요.',
          'error'
        )
      } else if (errorMessage.includes('이미지 업로드 실패')) {
        showToast(
          '이미지 업로드에 실패했습니다. 이미지 크기와 형식을 확인하고 다시 시도해주세요.',
          'error'
        )
      } else if (
        errorMessage.includes('최소 한 개 이상의 이미지가 필요합니다') ||
        errorMessage.includes('유효한 이미지 블록이 없습니다')
      ) {
        showToast(
          '매거진에는 최소 한 개 이상의 이미지가 필요합니다. 이미지를 추가해주세요.',
          'error'
        )
      } else if (
        errorMessage.includes('유효한 이미지 데이터가 아닙니다') ||
        errorMessage.includes('이미지 데이터 처리 중 오류')
      ) {
        showToast(
          '올바르지 않은 이미지 형식입니다. 이미지를 다시 삽입해주세요.',
          'error'
        )
      } else {
        // 기타 오류
        showToast(
          `매거진 등록 중 오류가 발생했습니다. 다시 시도해주세요.`,
          'error'
        )
      }
    } else {
      showToast(
        '매거진 등록 중 오류가 발생했습니다. 다시 시도해주세요.',
        'error'
      )
    }
  }

  // 이미지 선택 핸들러
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()

    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]

    // 이미지 파일 유효성 검사 추가
    if (!file.type.startsWith('image/')) {
      showToast('이미지 파일만 업로드할 수 있습니다.', 'error')
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      return
    }

    // 이미지 크기 제한 (10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      showToast('이미지 크기는 10MB 이하여야 합니다.', 'error')
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      return
    }

    // MagazineImageHandler의 함수를 사용하여 이미지 삽입
    insertImageToQuill(file, quillRef, imageState, setImageState, fileInputRef)
  }

  // 카테고리 선택 컴포넌트
  const categorySelectComponent = (
    <CategorySelect value={category} onChange={handleCategoryChange}>
      <option value="진로">진로</option>
      <option value="취업">취업</option>
      <option value="학업">학업</option>
      <option value="인간관계">인간관계</option>
      <option value="경제">경제</option>
      <option value="기타">기타</option>
    </CategorySelect>
  )

  return (
    <MagazineWriteContainer>
      <TopBar
        title={categorySelectComponent}
        showBackButton
        onBackClick={handleBackClick}
        actionText={isSubmitting ? '등록 중...' : '등록'}
        onActionClick={handleSubmit}
        isActionDisabled={!isActive || isSubmitting}
      />
      <div className="write-content">
        <div className="fixed-area">
          <div className="input-wrapper">
            <input
              type="text"
              className="title-input"
              placeholder="매거진 제목을 입력해주세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={TITLE_MAX_LENGTH}
            />
            <span className="char-count">
              {title.length}/{TITLE_MAX_LENGTH}
            </span>
          </div>

          {/* 소제목 입력 필드 추가 */}
          <div className="input-wrapper">
            <input
              type="text"
              className="subtitle-input"
              placeholder="소제목을 입력해주세요"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              maxLength={SUBTITLE_MAX_LENGTH}
            />
            <span className="char-count">
              {subtitle.length}/{SUBTITLE_MAX_LENGTH}
            </span>
          </div>

          <div className="divider" />
        </div>

        <QuillEditorContainer>
          <ReactQuill
            ref={quillRef}
            theme="snow"
            value={content}
            onChange={handleContentChange}
            modules={quillModules}
            formats={quillFormats}
            placeholder="메이트들에게 들려주고 싶은 이야기를 남겨보세요!"
          />

          {/* 이모티콘 피커 - z-index 및 위치 조정 */}
          {showEmoticonPicker && (
            <div
              ref={emoticonPickerRef}
              css={css`
                ${emoticonPickerOverlayStyles}
                position: absolute;
                z-index: 1000;
                bottom: 0px;
                left: 0;
                width: 100%;
                border-radius: 12px;
                background-color: white;
              `}
            >
              <EmoticonPicker
                onSelectEmoticon={handleEmoticonSelect}
                onShopClick={handleEmoticonShopClick}
                onClose={() => setShowEmoticonPicker(false)}
              />
            </div>
          )}
        </QuillEditorContainer>

        {/* 검토 알림 말풍선 추가 - 에디터 밖으로 이동 */}
        <ReviewNoticeTooltip className={fadeState}>
          {noticeMessages[currentMessageIndex]}
        </ReviewNoticeTooltip>
      </div>

      {/* 이미지 파일 선택을 위한 숨겨진 입력 필드 */}
      <ImageInput
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleImageChange}
      />
    </MagazineWriteContainer>
  )
}

export default MagazineWrite
