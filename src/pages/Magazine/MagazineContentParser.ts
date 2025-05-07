/**
 * 매거진 콘텐츠 파서 - 에디터 내용을 API 형식에 맞게 변환
 */
import { EmoticonType } from '../../components/emoticon/Emoticon'

/**
 * 매거진 게시 함수
 * @param title 제목
 * @param subtitle 소제목
 * @param category 카테고리
 * @param content HTML 콘텐츠
 * @returns 게시 결과
 */

import { mapEmoticonTypeToId } from './EmoticonService'

export const postMagazine = async (
  title: string,
  subtitle: string,
  category: string,
  content: string
): Promise<any> => {
  try {
    // 1. 콘텐츠 파싱
    const { blocks, imagesToUpload } = parseContentBlocks(content)

    // 2. 이미지 업로드
    const imageIdMap = await uploadImages(imagesToUpload)

    // 3. 블록 업데이트 (실제 이미지 ID 반영)
    const updatedBlocks = blocks.map((block) => {
      if (block.type === 'IMAGE') {
        // 이미지 ID 업데이트
        const imageIndex = blocks.indexOf(block)
        const originalImageId = imagesToUpload[imageIndex]?.imageId

        if (originalImageId && imageIdMap.has(originalImageId)) {
          return {
            ...block,
            imageId: imageIdMap.get(originalImageId),
          }
        }
      }

      return block
    })

    // 4. 소제목을 첫 TEXT 블록으로 추가
    const finalBlocks = [
      {
        type: 'TEXT' as const,
        text: subtitle,
      },
      ...updatedBlocks,
    ]

    // 5. API 요청 생성
    const magazineRequest: MagazinePostRequest = {
      title,
      category: convertCategoryToApiFormat(category),
      contents: finalBlocks,
    }

    // 6. 매거진 게시 API 호출
    const response = await fetch('/api/magazine', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(magazineRequest),
    })

    if (!response.ok) {
      throw new Error('매거진 게시 실패')
    }

    return await response.json()
  } catch (error) {
    console.error('매거진 게시 중 오류:', error)
    throw error
  }
}

// API에 필요한 타입 정의
export interface ContentBlock {
  type: 'TEXT' | 'IMAGE' | 'EMOTICON' // 콘텐츠 타입
  text?: string // TEXT 타입일 경우 내용
  imageId?: number // IMAGE 타입일 경우 이미지 ID
  emoticonId?: number // EMOTICON 타입일 경우 이모티콘 ID
}

// API 매거진 요청 형식
export interface MagazinePostRequest {
  title: string
  category: string // API 문서에 따라 'ACADEMIC' 등의 값으로 변환 필요
  contents: ContentBlock[]
}

// 이미지 업로드 응답 타입
export interface ImageUploadResponse {
  id: number
  imageUrl: string
}

/**
 * 카테고리 문자열을 API 요구 형식으로 변환
 * @param category 카테고리 한글명
 * @returns API 요구 형식의 카테고리명
 */
export const convertCategoryToApiFormat = (category: string): string => {
  // 카테고리 매핑
  const categoryMap: { [key: string]: string } = {
    진로: 'CAREER',
    취업: 'EMPLOYMENT',
    학업: 'ACADEMIC',
    인간관계: 'RELATIONSHIP',
    경제: 'ECONOMIC',
    기타: 'OTHER',
  }

  return categoryMap[category] || 'OTHER'
}

/**
 * Quill 에디터 콘텐츠를 블록 단위로 파싱
 * @param htmlContent 에디터 HTML 콘텐츠
 * @returns 텍스트와 이미지/이모티콘 블록 배열
 */
export const parseContentBlocks = (
  htmlContent: string
): {
  blocks: ContentBlock[]
  imagesToUpload: { dataUrl: string; imageId: string }[]
} => {
  // DOM 파서를 사용하여 HTML 파싱
  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlContent, 'text/html')
  const bodyContent = doc.body

  const blocks: ContentBlock[] = []
  const imagesToUpload: { dataUrl: string; imageId: string }[] = []

  // 임시 텍스트 블록을 위한 버퍼
  let textBuffer = ''

  // 콘텐츠를 순회하며 블록 분할
  bodyContent.childNodes.forEach((node) => {
    if (node.nodeName === 'P' || node.nodeName === 'DIV') {
      // <p> 또는 <div> 내의 콘텐츠 처리
      const childNodes = Array.from(node.childNodes)

      childNodes.forEach((childNode) => {
        if (childNode.nodeName === 'IMG') {
          // 이미지가 발견되면 우선 기존 텍스트 버퍼를 저장
          if (textBuffer.trim()) {
            blocks.push({
              type: 'TEXT',
              text: textBuffer.trim(),
            })
            textBuffer = ''
          }

          // 이미지 요소
          const imgElement = childNode as HTMLImageElement

          // 이모티콘인지 확인 (magazine-emoticon 클래스가 있는 경우)
          if (imgElement.classList.contains('magazine-emoticon')) {
            // 이모티콘 타입 추출
            const emoticonType = imgElement.getAttribute(
              'data-emoticon-type'
            ) as EmoticonType

            if (emoticonType) {
              // 이모티콘 블록 추가
              blocks.push({
                type: 'EMOTICON',
                emoticonId: mapEmoticonTypeToId(emoticonType),
              })
            }
          } else {
            // 일반 이미지인 경우
            const imageId =
              imgElement.getAttribute('data-image-id') || `temp_${Date.now()}`
            const src = imgElement.src

            // 이미지 업로드를 위해 목록에 추가
            imagesToUpload.push({
              dataUrl: src,
              imageId: imageId,
            })

            // 이미지 블록 추가 (이미지 ID는 나중에 업로드 후 업데이트)
            blocks.push({
              type: 'IMAGE',
              imageId: 0, // 임시 값 (업로드 후 실제 ID로 업데이트)
            })
          }
        } else {
          // 텍스트 노드는 버퍼에 추가
          textBuffer += childNode.textContent || ''
        }
      })

      // 단락 변경 시 줄바꿈 추가
      textBuffer += '\n'
    } else if (node.nodeName === 'IMG') {
      // 직접 이미지인 경우 (p나 div로 감싸지지 않은)
      if (textBuffer.trim()) {
        blocks.push({
          type: 'TEXT',
          text: textBuffer.trim(),
        })
        textBuffer = ''
      }

      const imgElement = node as HTMLImageElement

      // 이모티콘인지 확인
      if (imgElement.classList.contains('magazine-emoticon')) {
        const emoticonType = imgElement.getAttribute(
          'data-emoticon-type'
        ) as EmoticonType

        if (emoticonType) {
          blocks.push({
            type: 'EMOTICON',
            emoticonId: mapEmoticonTypeToId(emoticonType),
          })
        }
      } else {
        // 일반 이미지
        const imageId =
          imgElement.getAttribute('data-image-id') || `temp_${Date.now()}`
        const src = imgElement.src

        imagesToUpload.push({
          dataUrl: src,
          imageId: imageId,
        })

        blocks.push({
          type: 'IMAGE',
          imageId: 0,
        })
      }
    } else if (node.nodeType === Node.TEXT_NODE) {
      // 직접 텍스트 노드인 경우
      textBuffer += node.textContent || ''
    }
  })

  // 마지막 텍스트 버퍼가 있으면 추가
  if (textBuffer.trim()) {
    blocks.push({
      type: 'TEXT',
      text: textBuffer.trim(),
    })
  }

  return { blocks, imagesToUpload }
}

/**
 * Base64 데이터 URL을 Blob으로 변환
 * @param dataUrl 데이터 URL
 * @returns Blob 객체
 */
export const dataUrlToBlob = (dataUrl: string): Blob => {
  const arr = dataUrl.split(',')
  const mime = arr[0].match(/:(.*?);/)![1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }

  return new Blob([u8arr], { type: mime })
}

/**
 * 이미지 업로드 함수
 * @param images 업로드할 이미지 배열
 * @returns 업로드된 이미지 정보
 */
export const uploadImages = async (
  images: { dataUrl: string; imageId: string }[]
): Promise<Map<string, number>> => {
  if (images.length === 0) {
    return new Map<string, number>()
  }

  const apiUrl = '/api/magazine/image'
  const formData = new FormData()

  // 이미지 파일 추가
  images.forEach((img, index) => {
    const blob = dataUrlToBlob(img.dataUrl)
    formData.append('files', blob, `image_${index}.jpg`)
  })

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('이미지 업로드 실패')
    }

    const uploadedImages: ImageUploadResponse[] = await response.json()

    // 업로드된 이미지 ID와 원본 이미지 ID 매핑
    const imageIdMap = new Map<string, number>()
    uploadedImages.forEach((uploadedImg, index) => {
      if (images[index]) {
        imageIdMap.set(images[index].imageId, uploadedImg.id)
      }
    })

    return imageIdMap
  } catch (error) {
    console.error('이미지 업로드 중 오류:', error)
    throw error
  }
}
