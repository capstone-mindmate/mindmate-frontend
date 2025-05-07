/**
 * 이모티콘 처리를 위한 간단한 솔루션
 * Emoticon.tsx의 실제 이모티콘 경로를 활용합니다.
 */

import { EmoticonType } from '../../components/emoticon/Emoticon'
import ReactQuill from 'react-quill'

/**
 * 이모티콘 소스 가져오기 함수
 * Emoticon.tsx의 실제 경로 활용
 */
export const getEmoticonSrc = (type: EmoticonType): string => {
  // Emoticon.tsx의 경로 매핑을 재사용
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

// 이모티콘 상태 타입 정의
export interface EmoticonState {
  selectedEmoticonId: string | null
}

/**
 * 이모티콘을 에디터에 삽입하는 함수
 * 에디터에 맞게 크기를 조정한 인라인 이모티콘 사용
 */
export const insertEmoticonToEditor = (
  quillRef: React.RefObject<ReactQuill>,
  type: EmoticonType
): void => {
  if (!quillRef.current) {
    console.error('Quill 에디터 참조를 찾을 수 없습니다.')
    return
  }

  try {
    const quillEditor = quillRef.current.getEditor()
    const range = quillEditor.getSelection(true)

    if (range) {
      // 이모티콘 소스 URL 가져오기
      const emoticonSrc = getEmoticonSrc(type)

      // 이모티콘 ID 생성
      const emoticonId = `emoticon_${Date.now()}`

      // 이미지 HTML을 직접 삽입
      // 인라인 스타일로 에디터에 맞게 크기 조정
      const emoticonHtml = `<img 
        src="${emoticonSrc}" 
        alt="${type} 이모티콘" 
        class="inline-emoticon" 
        data-emoticon-type="${type}" 
        data-emoticon-id="${emoticonId}" 
        style="width:2px; height:2px; display:inline-block; vertical-align:middle; margin:0 20px;" 
      />`

      // HTML 직접 삽입
      quillEditor.clipboard.dangerouslyPasteHTML(range.index, emoticonHtml)

      // 커서 위치 조정
      quillEditor.setSelection(range.index + 1, 0)

      console.log('이모티콘 삽입 완료:', type)
    } else {
      console.warn('커서 위치를 찾을 수 없습니다')

      // 에디터의 끝에 추가
      const length = quillEditor.getLength()
      quillEditor.setSelection(length, 0)

      // 다시 시도
      const newRange = quillEditor.getSelection()
      if (newRange) {
        const emoticonSrc = getEmoticonSrc(type)
        const emoticonId = `emoticon_${Date.now()}`

        const emoticonHtml = `<img 
          src="${emoticonSrc}" 
          alt="${type} 이모티콘" 
          class="inline-emoticon" 
          data-emoticon-type="${type}" 
          data-emoticon-id="${emoticonId}" 
          style="width:24px; height:24px; display:inline-block; vertical-align:middle; margin:0 2px;" 
        />`

        quillEditor.clipboard.dangerouslyPasteHTML(newRange.index, emoticonHtml)
        quillEditor.setSelection(newRange.index + 1, 0)

        console.log('이모티콘 삽입 완료 (에디터 끝에):', type)
      }
    }
  } catch (error) {
    console.error('이모티콘 삽입 중 오류:', error)
  }
}
