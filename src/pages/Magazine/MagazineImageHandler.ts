/**
 * Quill 에디터용 매거진 이미지 처리 유틸리티 함수
 */

// 대표 이미지 관련 타입
export interface ImageState {
  featuredImageId: string | null
}

// 최대 이미지 크기 (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024
// 최대 이미지 크기 (픽셀)
const MAX_WIDTH = 1200
const MAX_HEIGHT = 1200

/**
 * 이미지 압축 및 리사이징
 * @param file 원본 이미지 파일
 * @returns 압축된 이미지 데이터 URL을 포함한 Promise
 */
const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target?.result as string

      img.onload = () => {
        // 이미지 크기 계산
        let width = img.width
        let height = img.height

        // 크기 조정 필요한 경우
        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
          if (width > height) {
            height = Math.round((height * MAX_WIDTH) / width)
            width = MAX_WIDTH
          } else {
            width = Math.round((width * MAX_HEIGHT) / height)
            height = MAX_HEIGHT
          }
        }

        // 캔버스에 그려서 압축
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Canvas context not available'))
          return
        }

        ctx.drawImage(img, 0, 0, width, height)

        // JPEG 형식으로 품질 70%로 압축
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7)
        resolve(compressedDataUrl)
      }

      img.onerror = () => {
        reject(new Error('Failed to load image'))
      }
    }

    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }
  })
}

/**
 * Quill 에디터에 이미지 삽입
 * @param file 선택된 이미지 파일
 * @param quillRef Quill 에디터 참조
 * @param imageState 이미지 상태
 * @param setImageState 이미지 상태 변경 함수
 * @param fileInputRef 파일 입력 참조 (초기화용)
 */
export const insertImageToQuill = (
  file: File,
  quillRef: React.RefObject<any>,
  imageState: ImageState,
  setImageState: React.Dispatch<React.SetStateAction<ImageState>>,
  fileInputRef: React.RefObject<HTMLInputElement>
): void => {
  // 파일 크기 확인
  if (file.size > MAX_FILE_SIZE) {
    alert('이미지 크기가 5MB를 초과합니다. 더 작은 이미지를 선택해주세요.')
    // 파일 입력 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    return
  }

  // 이미지 압축 및 리사이징 수행
  compressImage(file)
    .then((compressedImageUrl) => {
      const quillEditor = quillRef.current
      if (!quillEditor) return

      // 이미지 ID 생성
      const imageId = `img_${Date.now()}`

      // 첫 이미지인 경우 자동으로 대표 이미지로 설정
      const isFeatured = !imageState.featuredImageId

      // 현재 커서 위치 저장
      const range = quillEditor.getEditor().getSelection()

      if (range) {
        // 이미지 클래스와 데이터 속성 추가
        const imageHtml = `<img 
          src="${compressedImageUrl}" 
          alt="${file.name}" 
          class="magazine-image ${isFeatured ? 'featured-image' : ''}" 
          data-image-id="${imageId}"
        />`

        // HTML을 에디터에 삽입
        quillEditor
          .getEditor()
          .clipboard.dangerouslyPasteHTML(range.index, imageHtml)

        // 이미지 삽입 후, 이미지 컨트롤 버튼을 추가하는 코드가 있다면 유지
        if (typeof addImageControlButtons === 'function') {
          setTimeout(() => {
            addImageControlButtons(
              quillEditor,
              imageId,
              isFeatured,
              setImageState
            )
          }, 100)
        }

        // 이미지 뒤로 커서 이동
        quillEditor.getEditor().setSelection(range.index + 1, 0)

        // 첫 이미지인 경우 대표 이미지로 설정
        if (isFeatured) {
          setImageState((prev) => ({
            ...prev,
            featuredImageId: imageId,
          }))
        }
      }
    })
    .catch((error) => {
      console.error('이미지 처리 중 오류:', error)
      alert('이미지 처리 중 오류가 발생했습니다.')
    })
    .finally(() => {
      // 파일 입력 초기화 (같은 파일 다시 선택 가능)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    })
}

/**
 * 대표 이미지 URL 가져오기
 * @param htmlContent HTML 내용
 * @param featuredImageId 대표 이미지 ID
 * @returns 대표 이미지 URL
 */
export const getFeaturedImageUrl = (
  htmlContent: string,
  featuredImageId: string | null
): string | null => {
  if (!featuredImageId) return null

  try {
    // DOM 파서를 사용하여 HTML 파싱
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlContent, 'text/html')

    // 대표 이미지 찾기
    const img = doc.querySelector(`[data-image-id="${featuredImageId}"]`)
    return img ? (img as HTMLImageElement).src : null
  } catch (error) {
    console.error('대표 이미지 URL 가져오기 오류:', error)
    return null
  }
}

/**
 * 이미지가 제거된 HTML 콘텐츠 반환 (로컬 스토리지 저장용)
 * @param htmlContent 원본 HTML 콘텐츠
 * @returns 이미지 참조만 포함된 HTML 콘텐츠
 */
export const getStorageOptimizedContent = (htmlContent: string): string => {
  try {
    // 정규식을 사용하여 이미지 src 속성만 교체
    // data-image-id와 같은 다른 속성은 유지
    return htmlContent.replace(
      /<img[^>]*src\s*=\s*["']([^"']+)["'][^>]*>/gi,
      (match) => {
        // 원본 이미지 태그에서 src 속성만 교체
        return match.replace(/src\s*=\s*["'][^"']+["']/gi, 'src="[이미지]"')
      }
    )
  } catch (error) {
    console.error('이미지 최적화 중 오류:', error)
    // 오류 발생 시 원본 콘텐츠 그대로 반환
    return htmlContent
  }
}
