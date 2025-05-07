/**
 * Quill 에디터용 이모티콘 처리 유틸리티 함수
 */

import { EmoticonType } from '../../components/emoticon/Emoticon'

// 에디터 이모티콘 상태 타입
export interface EmoticonState {
  selectedEmoticonId: string | null
}

/**
 * Quill 에디터에 이모티콘 삽입
 * @param emoticonType 선택된 이모티콘 타입
 * @param quillRef Quill 에디터 참조
 * @param onClose 이모티콘 피커 닫기 함수
 */
export const insertEmoticonToQuill = (
  emoticonType: EmoticonType,
  quillRef: React.RefObject<any>,
  onClose: () => void
): void => {
  // 디버깅 로그 추가
  console.log('이모티콘 삽입 시작:', emoticonType)

  const quillEditor = quillRef.current
  if (!quillEditor) {
    console.error('Quill 에디터 참조를 찾을 수 없습니다')
    return
  }

  // 이모티콘 ID 생성
  const emoticonId = `emoticon_${Date.now()}`

  // 현재 커서 위치 저장
  const range = quillEditor.getEditor().getSelection()
  console.log('현재 커서 위치:', range)

  if (range) {
    // 이모티콘 이미지 경로 가져오기
    const emoticonSrc = getEmoticonSrc(emoticonType)
    console.log('이모티콘 이미지 경로:', emoticonSrc)

    // 이모티콘 클래스와 데이터 속성 추가
    const emoticonHtml = `<img 
      src="${emoticonSrc}" 
      alt="${emoticonType} 이모티콘" 
      class="magazine-emoticon" 
      data-emoticon-type="${emoticonType}"
      data-emoticon-id="${emoticonId}"
      style="display: inline-block; vertical-align: middle; width: 70px; height: 70px;"
    />`

    try {
      // HTML을 에디터에 삽입
      quillEditor
        .getEditor()
        .clipboard.dangerouslyPasteHTML(range.index, emoticonHtml)

      // 이모티콘 뒤로 커서 이동
      quillEditor.getEditor().setSelection(range.index + 1, 0)

      console.log('이모티콘 삽입 성공')
    } catch (error) {
      console.error('이모티콘 삽입 중 오류 발생:', error)
    }

    // 이모티콘 피커 닫기
    onClose()
  } else {
    console.warn('커서 위치를 찾을 수 없습니다. 이모티콘을 삽입할 수 없습니다.')
    // 커서 위치가 없는 경우 에디터 끝에 포커스를 설정
    try {
      const length = quillEditor.getEditor().getLength()
      quillEditor.getEditor().setSelection(length, 0)
      console.log('에디터 끝으로 커서 이동. 다시 시도하세요.')
    } catch (error) {
      console.error('커서 재설정 중 오류:', error)
    }
  }
}

/**
 * 이모티콘 이미지 경로 가져오기
 * @param type 이모티콘 타입
 * @returns 이모티콘 이미지 경로
 */
export const getEmoticonSrc = (type: EmoticonType): string => {
  // 이미지 경로 매핑
  switch (type) {
    case 'normal':
      return '/emoticons/emoticon_normal.png'
    case 'love':
      return '/emoticons/emoticon_love.png'
    case 'music':
      return '/emoticons/emoticon_music.png'
    case 'sad':
      return '/emoticons/emoticon_sad.png'
    case 'angry':
      return '/emoticons/emoticon_angry.png'
    case 'couple':
      return '/emoticons/emoticon_couple.png'
    case 'default':
      return '/emoticons/emoticon_default.png'
    case 'talking':
      return '/emoticons/emoticon_talking.png'
    case 'thumbsUp':
      return '/emoticons/emoticon_thumbsUp.png'
    case 'student':
      return '/emoticons/emoticon_student.png'
    case 'graduate':
      return '/emoticons/emoticon_graduate.png'
    case 'hoodie':
      return '/emoticons/emoticon_hoodie.png'
    case 'study':
      return '/emoticons/emoticon_study.png'
    case 'thanks':
      return '/emoticons/emoticon_thanks.png'
    default:
      return '/emoticons/emoticon_normal.png'
  }
}

/**
 * 스토리지 최적화를 위해 이모티콘 정보를 추출
 * @param htmlContent HTML 내용
 * @returns 이모티콘 ID와 타입 매핑 객체
 */
export const extractEmoticonInfo = (
  htmlContent: string
): Record<string, EmoticonType> => {
  try {
    // DOM 파서를 사용하여 HTML 파싱
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlContent, 'text/html')

    // 이모티콘 정보 추출
    const emoticonElements = doc.querySelectorAll('.magazine-emoticon')
    const emoticonInfo: Record<string, EmoticonType> = {}

    emoticonElements.forEach((element) => {
      const id = element.getAttribute('data-emoticon-id')
      const type = element.getAttribute('data-emoticon-type') as EmoticonType

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

/**
 * API 요청을 위한 이모티콘 매핑
 * @param emoticonType 이모티콘 타입
 * @returns API 이모티콘 ID
 */
export const mapEmoticonTypeToId = (emoticonType: EmoticonType): number => {
  // 실제 API 이모티콘 ID 매핑 (이 매핑은 서버와 일치해야 함)
  const emoticonMap: Record<EmoticonType, number> = {
    normal: 1,
    love: 2,
    music: 3,
    sad: 4,
    angry: 5,
    couple: 6,
    default: 7,
    talking: 8,
    thumbsUp: 9,
    student: 10,
    graduate: 11,
    hoodie: 12,
    study: 13,
    thanks: 14,
  }

  return emoticonMap[emoticonType] || 1
}
