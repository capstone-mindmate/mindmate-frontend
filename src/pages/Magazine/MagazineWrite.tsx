import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import {
  MagazineWriteContainer,
  QuillEditorContainer,
  ImageInput,
  CategorySelect,
  ReviewNoticeTooltip,
} from './MagazineWriteStyles'
import TopBar from '../../components/topbar/Topbar'
import {
  insertImageToQuill,
  getFeaturedImageUrl,
  getStorageOptimizedContent,
  ImageState,
} from './MagazineImageHandler'

// 제목과 소제목 글자 수 제한 상수
const TITLE_MAX_LENGTH = 18
const SUBTITLE_MAX_LENGTH = 21

// 로컬 스토리지 키
const STORAGE_KEY = 'magazine_draft'

// Quill 에디터 모듈 설정
const quillModules = {
  toolbar: [
    ['bold', 'underline'],
    [{ size: ['small', false, 'large', 'huge'] }],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    ['image'],
  ],
  clipboard: {
    matchVisual: false, // findDOMNode 관련 경고를 줄이기 위한 설정
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
]

const MagazineWrite: React.FC = () => {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [content, setContent] = useState('')
  const [isActive, setIsActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const quillRef = useRef<ReactQuill>(null)
  const [imageState, setImageState] = useState<ImageState>({
    featuredImageId: null,
  })
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

  // 이미지 버튼 클릭 핸들러
  const handleImageClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }, [])

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

  // Quill 에디터에 이미지 버튼 클릭 핸들러 등록
  useEffect(() => {
    // 이미지 버튼 클릭 시 파일 선택 창 열기
    const toolbar = document.querySelector('.ql-toolbar')
    if (toolbar) {
      const imageButton = toolbar.querySelector('.ql-image')
      if (imageButton) {
        imageButton.addEventListener('click', handleImageClick)
      }
    }

    return () => {
      const toolbar = document.querySelector('.ql-toolbar')
      if (toolbar) {
        const imageButton = toolbar.querySelector('.ql-image')
        if (imageButton) {
          imageButton.removeEventListener('click', handleImageClick)
        }
      }
    }
  }, [handleImageClick])

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
    navigate(-1)
  }

  // 등록 버튼 핸들러
  const handleSubmit = () => {
    if (!isActive) return

    // MagazineImageHandler에서 가져온 함수 사용
    const featuredImageUrl = getFeaturedImageUrl(
      content,
      imageState.featuredImageId
    )

    // 이미지와 함께 매거진 등록 로직 구현
    console.log('매거진 등록:', {
      title,
      subtitle,
      content, // 원본 콘텐츠 그대로 사용 (이미지 데이터 포함)
      featuredImageUrl,
      category,
    })

    // API 호출 로직 (예시)
    // 여기서는 HTML 내용 자체를 서버로 전송하므로 별도의 이미지 파일 전송은 생략

    // 등록 성공 후 로컬 스토리지 드래프트 삭제
    localStorage.removeItem(STORAGE_KEY)

    // 등록 후 매거진 목록 페이지로 이동
    navigate('/magazine')
  }

  // 이미지 선택 핸들러
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()

    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]

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
        actionText="등록"
        onActionClick={handleSubmit}
        isActionDisabled={!isActive}
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
