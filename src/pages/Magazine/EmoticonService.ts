/**
 * 통합 이모티콘 서비스
 * 서버 기반 이모티콘 관리
 */

import { EmoticonType } from '../../components/emoticon/Emoticon'
import ReactQuill from 'react-quill'

// 이모티콘 상태 타입
export interface EmoticonState {
  selectedEmoticonId: string | null
}

// 이모티콘 API 응답 타입 (채팅에서 사용하는 형태)
export interface EmoticonApiResponse {
  id: string
  name: string // 이모티콘 타입 (HAPPY, SAD 등)
  imageUrl: string
}

/**
 * 이모티콘을 에디터에 삽입하는 함수 - 서버 기반 이모티콘 사용
 * @param quillRef Quill 에디터 참조
 * @param emoticonId 이모티콘 ID (API에서 받은 ID)
 * @param emoticonUrl 이모티콘 이미지 URL
 * @param emoticonName 이모티콘 이름/타입
 * @param onClose 종료 콜백 (옵션)
 */
export const insertEmoticonToEditor = (
  quillRef: React.RefObject<ReactQuill>,
  emoticonId: string,
  emoticonUrl: string,
  emoticonName: string,
  onClose?: () => void
): void => {
  const quillEditor = quillRef.current
  if (!quillEditor) {
    console.error('Quill 에디터 참조를 찾을 수 없습니다')
    return
  }

  // 현재 커서 위치 저장
  const range = quillEditor.getEditor().getSelection()

  if (range) {
    // 고유한 이모티콘 ID 생성 (매거진 내에서 식별용)
    const uniqueEmoticonId = `emoticon_${Date.now()}_${Math.floor(Math.random() * 1000)}`

    // 이모티콘 이미지 HTML 생성 - API ID를 확실히 설정
    const emoticonHtml = `<img 
      src="${emoticonUrl}" 
      alt="${emoticonName || 'unknown'} 이모티콘" 
      class="magazine-emoticon" 
      data-emoticon-type="${emoticonName || 'unknown'}"
      data-emoticon-id="${uniqueEmoticonId}"
      data-emoticon-api-id="${emoticonId}"
      style="width: 70px; height: 70px; display: inline-block; vertical-align: middle; margin: 0 5px;"
    />`

    //console.log('생성할 이모티콘 HTML:', emoticonHtml)
    //console.log('이모티콘 정보:', { emoticonId, emoticonName, emoticonUrl })

    try {
      // 에디터에 다른 컨텐츠가 있는지 확인하고 줄바꿈 삽입
      if (
        quillEditor.getEditor().getText().trim().length > 0 &&
        range.index > 0
      ) {
        // 커서 위치가 줄의 시작이 아니면 줄바꿈 추가
        const lastChar = quillEditor.getEditor().getText(range.index - 1, 1)
        if (lastChar && lastChar !== '\n') {
          quillEditor.getEditor().insertText(range.index, '\n')
          range.index += 1
        }
      }

      // HTML을 에디터에 삽입
      quillEditor
        .getEditor()
        .clipboard.dangerouslyPasteHTML(range.index, emoticonHtml)

      // 이모티콘 뒤로 커서 이동
      quillEditor.getEditor().setSelection(range.index + 1, 0)

      // 삽입 후 API ID가 제대로 설정되었는지 확인 (더 강력한 검증)
      setTimeout(() => {
        const allImages = quillEditor.getEditor().root.querySelectorAll('img')
        //console.log('에디터의 모든 이미지 수:', allImages.length)

        // 방금 삽입한 이모티콘 찾기
        let targetEmoticon: HTMLImageElement | null = null

        Array.from(allImages).forEach((img, index) => {
          const htmlImg = img as HTMLImageElement

          // URL이 일치하는 이모티콘 찾기
          if (htmlImg.src === emoticonUrl) {
            targetEmoticon = htmlImg
          }
        })

        if (targetEmoticon) {
          const currentApiId = targetEmoticon.getAttribute(
            'data-emoticon-api-id'
          )

          if (!currentApiId || currentApiId !== emoticonId) {
            console.error('❌ API ID 불일치! 강제 수정 시도...')

            // 강제로 속성 재설정
            targetEmoticon.setAttribute('data-emoticon-api-id', emoticonId)
            targetEmoticon.classList.add('magazine-emoticon')

            // 재설정 후 다시 확인
            const finalApiId = targetEmoticon.getAttribute(
              'data-emoticon-api-id'
            )
            //console.log('✅ 재설정 후 API ID:', finalApiId)

            // 부모 요소에도 속성 설정 시도 (혹시 모를 경우를 대비)
            if (targetEmoticon.parentElement) {
              targetEmoticon.parentElement.setAttribute(
                'data-emoticon-info',
                `${emoticonId}|${emoticonName}`
              )
            }
          } else {
            //console.log('✅ API ID 정상 확인:', currentApiId)
          }
        } else {
          console.error('❌ 삽입된 이모티콘을 찾을 수 없습니다!')
        }
      }, 200) // 시간을 더 늘려서 DOM 업데이트 완료 보장
    } catch (error) {
      console.error('이모티콘 삽입 중 오류 발생:', error)
    }

    // 이모티콘 피커 닫기 (전달된 경우)
    if (onClose) onClose()
  } else {
    console.warn('커서 위치를 찾을 수 없습니다. 이모티콘을 삽입할 수 없습니다.')
    // 커서 위치가 없는 경우 에디터 끝에 포커스를 설정
    try {
      const length = quillEditor.getEditor().getLength()
      quillEditor.getEditor().setSelection(length, 0)
      //console.log('에디터 끝으로 커서 이동. 다시 시도하세요.')
    } catch (error) {
      console.error('커서 재설정 중 오류:', error)
    }
  }
}

/**
 * 스토리지 최적화를 위해 이모티콘 정보를 추출
 * @param htmlContent HTML 내용
 * @returns 이모티콘 ID와 타입 매핑 객체
 */
export const extractEmoticonInfo = (
  htmlContent: string
): Record<string, string> => {
  try {
    // DOM 파서를 사용하여 HTML 파싱
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlContent, 'text/html')

    // 이모티콘 정보 추출
    const emoticonElements = doc.querySelectorAll('.magazine-emoticon')
    const emoticonInfo: Record<string, string> = {}

    emoticonElements.forEach((element) => {
      const id = element.getAttribute('data-emoticon-id')
      const type = element.getAttribute('data-emoticon-type')

      if (id && type) {
        emoticonInfo[id] = type
      }
    })

    return emoticonInfo
  } catch (error) {
    console.error('이모티콘 정보 추출 오류:', error)
    return {}
  }
}
