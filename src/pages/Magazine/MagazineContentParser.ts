// 매거진 콘텐츠 파서 - 에디터 내용을 API 형식에 맞게 변환 (서버 기반 이모티콘)
import { fetchWithRefresh } from '../../utils/fetchWithRefresh'

/**
 * 이모티콘 검증을 위한 헬퍼 함수 (MagazineWrite.tsx와 동일한 로직)
 */
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
    // 1. 콘텐츠 파싱
    const { blocks, imagesToUpload } = parseContentBlocks(content)

    if (imagesToUpload.length === 0) {
      console.error('업로드할 이미지가 없습니다. HTML 콘텐츠를 확인하세요.')
      throw new Error('매거진 등록에는 최소 한 개 이상의 이미지가 필요합니다.')
    }

    // 2. 이미지 업로드 (이미지가 있는 경우에만)
    let imageIdMap = new Map<string, number>()
    if (imagesToUpload.length > 0) {
      try {
        const apiUrl = 'https://mindmate.shop/api/magazines/image'
        const formData = new FormData()

        // 이미지 파일 추가 - 'files' 키로 파일 추가
        imagesToUpload.forEach((img, index) => {
          const blob = dataUrlToBlob(img.dataUrl)
          formData.append('files', blob, `image_${index}.jpg`)
        })

        // fetchWithRefresh 사용
        const response = await fetchWithRefresh(apiUrl, {
          method: 'POST',
          body: formData, // FormData는 Content-Type 헤더를 자동으로 설정함
        })

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

        // 이미지 응답이 없거나 비어있는지 확인
        if (!uploadedImages || uploadedImages.length === 0) {
          throw new Error('업로드된 이미지 정보가 없습니다.')
        }

        // 업로드된 이미지 ID와 원본 이미지 ID 매핑
        uploadedImages.forEach((uploadedImg, index) => {
          if (index < imagesToUpload.length) {
            imageIdMap.set(imagesToUpload[index].imageId, uploadedImg.id)
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

    // fetchWithRefresh 사용 (토큰 관리 자동화)
    const response = await fetchWithRefresh(
      'https://mindmate.shop/api/magazines',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Authorization 헤더는 fetchWithRefresh가 자동으로 추가
        },
        body: JSON.stringify(magazineRequest),
      }
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
    경제: 'FINANCIAL',
    기타: 'OTHER',
  }

  return categoryMap[category] || 'OTHER'
}

/**
 * Quill 에디터 내용을 파싱하는 함수 - 서버 기반 이모티콘 처리 (개선됨)
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

      // 이미지나 이모티콘이 있는지 확인
      const hasImageOrEmoticon = childNodes.some(
        (child) => child.nodeName === 'IMG'
      )

      if (hasImageOrEmoticon) {
        // 이미지나 이모티콘이 있는 경우, 이를 텍스트와 분리
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

            // *** 핵심 개선: 이모티콘 검증 로직 사용 ***
            if (isEmoticonImage(imgElement)) {
              // 서버 기반 이모티콘 처리 - 실제 API ID만 사용
              const emoticonApiId = imgElement.getAttribute(
                'data-emoticon-api-id'
              )

              if (
                emoticonApiId &&
                emoticonApiId !== 'null' &&
                emoticonApiId !== ''
              ) {
                // 서버에서 받은 실제 API ID만 사용
                blocks.push({
                  type: 'EMOTICON',
                  emoticonId: parseInt(emoticonApiId),
                })
                //console.log('이모티콘 블록 추가 (실제 API ID):', emoticonApiId)
              } else {
                console.warn(
                  '이모티콘 API ID가 없거나 유효하지 않습니다. 건너뜁니다:',
                  {
                    src: imgElement.src,
                    apiId: emoticonApiId,
                    type: imgElement.getAttribute('data-emoticon-type'),
                  }
                )
                // API ID가 없는 이모티콘은 처리하지 않음 (서버 에러 방지)
              }
            } else {
              // *** 실제 이미지인 경우만 이미지 업로드 목록에 추가 ***
              const imageId = imgElement.getAttribute('data-image-id')

              if (!imageId) {
                console.warn(
                  '이미지에 data-image-id가 없습니다:',
                  imgElement.src
                )
                // ID가 없는 이미지는 임시 ID 생성
                const tempId = `temp_${Date.now()}_${Math.floor(Math.random() * 1000)}`
                imgElement.setAttribute('data-image-id', tempId)
              }

              const finalImageId =
                imgElement.getAttribute('data-image-id') ||
                `temp_${Date.now()}_${Math.floor(Math.random() * 1000)}`
              const src = imgElement.src

              // 실제 이미지만 업로드 목록에 추가
              imagesToUpload.push({
                dataUrl: src,
                imageId: finalImageId,
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

      // *** 핵심 개선: 이모티콘 검증 로직 사용 ***
      if (isEmoticonImage(imgElement)) {
        // 서버 기반 이모티콘 처리 - 실제 API ID만 사용
        const emoticonApiId = imgElement.getAttribute('data-emoticon-api-id')

        if (emoticonApiId && emoticonApiId !== 'null' && emoticonApiId !== '') {
          // 서버에서 받은 실제 API ID만 사용
          blocks.push({
            type: 'EMOTICON',
            emoticonId: parseInt(emoticonApiId),
          })
          //console.log('직접 이모티콘 블록 추가 (실제 API ID):', emoticonApiId)
        } else {
          console.warn(
            '직접 이모티콘 API ID가 없거나 유효하지 않습니다. 건너뜁니다:',
            {
              src: imgElement.src,
              apiId: emoticonApiId,
              type: imgElement.getAttribute('data-emoticon-type'),
            }
          )
          // API ID가 없는 이모티콘은 처리하지 않음 (서버 에러 방지)
        }
      } else {
        // *** 실제 이미지만 업로드 목록에 추가 ***
        const imageId = imgElement.getAttribute('data-image-id')

        if (!imageId) {
          console.warn(
            '직접 이미지에 data-image-id가 없습니다:',
            imgElement.src
          )
        }

        const finalImageId =
          imageId || `temp_${Date.now()}_${Math.floor(Math.random() * 1000)}`
        const src = imgElement.src

        imagesToUpload.push({
          dataUrl: src,
          imageId: finalImageId,
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
