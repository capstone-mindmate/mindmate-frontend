/**
 * 매거진 콘텐츠 파서 - 에디터 내용을 API 형식에 맞게 변환
 *
 * 이미지 처리 개선 버전
 */
import { EmoticonType } from '../../components/emoticon/Emoticon'
import { mapEmoticonTypeToId } from './EmoticonService'
import { getTokenCookie } from '../../utils/fetchWithRefresh'

/**
 * 매거진 게시 함수
 * @param title 제목
 * @param subtitle 소제목
 * @param category 카테고리
 * @param content HTML 콘텐츠
 * @returns 게시 결과
 */
export const postMagazine = async (
  title: string,
  subtitle: string,
  category: string,
  content: string
): Promise<any> => {
  try {
    // 토큰 확인
    const accessToken = getTokenCookie('accessToken')
    if (!accessToken) {
      throw new Error('로그인이 필요합니다.')
    }
    console.log('토큰 존재 여부 확인:', !!accessToken)
    console.log('매거진 등록 시도...')

    // 1. 콘텐츠 파싱
    const { blocks, imagesToUpload } = parseContentBlocks(content)

    // 디버깅을 위해 로그 추가
    console.log('파싱된 블록 수:', blocks.length)
    console.log('업로드할 이미지 수:', imagesToUpload.length)

    if (imagesToUpload.length === 0) {
      console.error('업로드할 이미지가 없습니다. HTML 콘텐츠를 확인하세요.')
      throw new Error('매거진 등록에는 최소 한 개 이상의 이미지가 필요합니다.')
    }

    // 2. 이미지 업로드 (이미지가 있는 경우에만)
    let imageIdMap = new Map<string, number>()
    if (imagesToUpload.length > 0) {
      try {
        console.log(`이미지 업로드 시작: ${imagesToUpload.length}개`)
        // 이미지 업로드 API 엔드포인트
        const apiUrl = 'http://localhost/api/magazines/image'
        const formData = new FormData()

        // 이미지 파일 추가 - 'files' 키로 파일 추가
        imagesToUpload.forEach((img, index) => {
          const blob = dataUrlToBlob(img.dataUrl)
          formData.append('files', blob, `image_${index}.jpg`)
        })

        // 직접 fetch 호출
        console.log('이미지 업로드 요청 시작...')
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: 'include',
          body: formData,
        })

        // 응답 상태 로깅
        console.log(
          `이미지 업로드 응답 상태: ${response.status} ${response.statusText}`
        )

        if (!response.ok) {
          // 오류 응답 내용 추출
          let errorText = ''
          try {
            const errorJson = await response.json()
            errorText = JSON.stringify(errorJson)
          } catch {
            errorText = await response.text()
          }

          throw new Error(
            `이미지 업로드 실패 (${response.status}): ${errorText}`
          )
        }

        const uploadedImages: ImageUploadResponse[] = await response.json()
        console.log(
          '업로드된 이미지 정보:',
          JSON.stringify(uploadedImages, null, 2)
        )

        // 이미지 응답이 없거나 비어있는지 확인
        if (!uploadedImages || uploadedImages.length === 0) {
          throw new Error('업로드된 이미지 정보가 없습니다.')
        }

        // 업로드된 이미지 ID와 원본 이미지 ID 매핑
        uploadedImages.forEach((uploadedImg, index) => {
          if (index < imagesToUpload.length) {
            imageIdMap.set(imagesToUpload[index].imageId, uploadedImg.id)
            console.log(
              `이미지 ID 매핑: ${imagesToUpload[index].imageId} -> ${uploadedImg.id}`
            )
          }
        })
      } catch (error) {
        console.error('이미지 업로드 중 오류:', error)
        throw error
      }
    }

    // 3. 블록 업데이트 (실제 이미지 ID 반영)
    let imageIndex = 0
    const updatedBlocks = blocks.map((block) => {
      if (block.type === 'IMAGE') {
        // 이미지 블록인 경우
        if (imageIndex < imagesToUpload.length) {
          const originalImageId = imagesToUpload[imageIndex].imageId
          imageIndex++

          if (imageIdMap.has(originalImageId)) {
            const serverImageId = imageIdMap.get(originalImageId)
            console.log(
              `이미지 블록 업데이트: 임시ID=${originalImageId}, 서버ID=${serverImageId}`
            )

            // IMAGE 타입 블록에는 imageId 속성만 포함
            return {
              type: 'IMAGE',
              imageId: serverImageId,
            }
          } else {
            console.error(
              `이미지 ID "${originalImageId}"에 대한 매핑을 찾을 수 없습니다.`
            )
          }
        }
      } else if (block.type === 'TEXT') {
        // TEXT 타입 블록에는 text 속성만 포함
        return {
          type: 'TEXT',
          text: block.text,
        }
      } else if (block.type === 'EMOTICON') {
        // EMOTICON 타입 블록에는 emoticonId 속성만 포함
        return {
          type: 'EMOTICON',
          emoticonId: block.emoticonId,
        }
      }

      // 기본 반환 - 변경 없음
      return block
    })

    // 이미지 블록 검증
    const imageBlocks = updatedBlocks.filter((block) => block.type === 'IMAGE')
    console.log(`이미지 블록 수: ${imageBlocks.length}`)
    console.log(`이미지 블록 내용: ${JSON.stringify(imageBlocks, null, 2)}`)

    if (imageBlocks.length === 0) {
      throw new Error(
        '유효한 이미지 블록이 없습니다. 이미지 삽입을 확인하세요.'
      )
    }

    // 4. API 요청 생성
    const magazineRequest: MagazinePostRequest = {
      title,
      subtitle,
      category: convertCategoryToApiFormat(category),
      contents: updatedBlocks,
    }

    // 요청 데이터 로깅
    console.log(
      '매거진 게시 요청 데이터:',
      JSON.stringify(magazineRequest, null, 2)
    )

    // 5. 매거진 게시 API 호출
    const response = await fetch('http://localhost/api/magazines', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: 'include',
      body: JSON.stringify(magazineRequest),
    })

    // 응답 로깅
    console.log(
      `매거진 게시 응답 상태: ${response.status} ${response.statusText}`
    )

    if (!response.ok) {
      // 오류 응답 내용 추출
      let errorText = ''
      try {
        const errorJson = await response.json()
        errorText = JSON.stringify(errorJson)
      } catch {
        errorText = await response.text()
      }

      throw new Error(`매거진 게시 실패 (${response.status}): ${errorText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('매거진 게시 중 오류:', error)
    throw error
  }
}

// API에 필요한 타입 정의
export interface ContentBlock {
  type: 'TEXT' | 'IMAGE' | 'EMOTICON'
  text?: string
  imageId?: number
  emoticonId?: number
}

// API 매거진 요청 형식
export interface MagazinePostRequest {
  title: string
  subtitle?: string
  category: string
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
 * Quill 에디터 내용을 파싱하는 함수 - HTML 형식 보존 개선
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

  // 텍스트 노드를 HTML로 변환하는 헬퍼 함수
  const getNodeHTML = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent || ''
    }

    const element = node as HTMLElement
    const temp = document.createElement('div')
    temp.appendChild(element.cloneNode(true))
    return temp.innerHTML
  }

  // 콘텐츠를 순회하며 블록 분할
  bodyContent.childNodes.forEach((node) => {
    if (node.nodeName === 'P' || node.nodeName === 'DIV') {
      // <p> 또는 <div> 내의 콘텐츠 처리
      const childNodes = Array.from(node.childNodes)

      // 이미지가 있는지 확인
      const hasImage = childNodes.some((child) => child.nodeName === 'IMG')

      if (hasImage) {
        // 이미지가 있는 경우, 이미지와 텍스트를 분리
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
                imgElement.getAttribute('data-image-id') ||
                `temp_${Date.now()}_${Math.floor(Math.random() * 1000)}`
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
            // 텍스트 노드는 HTML 형식 그대로 버퍼에 추가
            textBuffer += getNodeHTML(childNode)
          }
        })
      } else {
        // 이미지가 없는 경우, 노드 전체를 HTML로 변환하여 추가
        const nodeHTML = getNodeHTML(node)
        textBuffer += nodeHTML
      }

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
          imgElement.getAttribute('data-image-id') ||
          `temp_${Date.now()}_${Math.floor(Math.random() * 1000)}`
        const src = imgElement.src

        imagesToUpload.push({
          dataUrl: src,
          imageId: imageId,
        })

        blocks.push({
          type: 'IMAGE',
          imageId: 0, // 임시 값
        })
      }
    } else if (node.nodeType === Node.TEXT_NODE) {
      // 직접 텍스트 노드인 경우
      textBuffer += node.textContent || ''
    } else {
      // 기타 노드는 HTML로 변환하여 추가
      textBuffer += getNodeHTML(node)
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
  // dataUrl이 base64 형식인지 확인
  if (!dataUrl.includes('base64')) {
    console.error(
      '유효한 base64 데이터 URL이 아닙니다:',
      dataUrl.substring(0, 30) + '...'
    )
    throw new Error('유효한 이미지 데이터가 아닙니다.')
  }

  try {
    const arr = dataUrl.split(',')
    const mimeMatch = arr[0].match(/:(.*?);/)

    if (!mimeMatch) {
      throw new Error('MIME 타입을 확인할 수 없습니다.')
    }

    const mime = mimeMatch[1]
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }

    return new Blob([u8arr], { type: mime })
  } catch (error) {
    console.error('데이터 URL을 Blob으로 변환 중 오류:', error)
    throw new Error('이미지 데이터 처리 중 오류가 발생했습니다.')
  }
}
