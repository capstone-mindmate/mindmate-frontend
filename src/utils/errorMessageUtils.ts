// 에러 메시지 매핑 테이블
const ERROR_MESSAGE_MAP: Record<string, string> = {
  // 네트워크 관련 에러
  'Failed to fetch':
    '서버에 연결할 수 없습니다. \n네트워크 연결을 확인해주세요.',
  'Network Error': '네트워크 오류가 발생했습니다. \n잠시 후 다시 시도해주세요.',
  Timeout: '요청 시간이 초과되었습니다. \n다시 시도해주세요.',
  'Request timeout': '요청 시간이 초과되었습니다. \n다시 시도해주세요.',

  // HTTP 상태 에러
  'API 호출 실패: 400': '잘못된 요청입니다.',
  'API 호출 실패: 401': '인증이 필요합니다. \n다시 로그인해주세요.',
  'API 호출 실패: 403': '접근 권한이 없습니다.',
  'API 호출 실패: 404': '요청한 정보를 찾을 수 없습니다.',
  'API 호출 실패: 500':
    '서버 오류가 발생했습니다. \n잠시 후 다시 시도해주세요.',
  'API 호출 실패: 502': '서버 연결 오류가 발생했습니다.',
  'API 호출 실패: 503': '서비스를 일시적으로 사용할 수 없습니다.',

  // 일반적인 영어 에러 메시지
  'Internal Server Error': '서버 내부 오류가 발생했습니다.',
  'Bad Request': '잘못된 요청입니다.',
  Unauthorized: '인증이 필요합니다.',
  Forbidden: '접근 권한이 없습니다.',
  'Not Found': '요청한 정보를 찾을 수 없습니다.',
  'Service Unavailable': '서비스를 일시적으로 사용할 수 없습니다.',

  // 매거진 관련
  'Magazine not found': '매거진을 찾을 수 없습니다.',
  'Failed to load magazines': '매거진 목록을 불러올 수 없습니다.',

  // 이모티콘 관련
  'Emoticon not found': '이모티콘을 찾을 수 없습니다.',
  'Failed to load emoticons': '이모티콘 목록을 불러올 수 없습니다.',

  // 인증 관련
  'Token expired': '로그인이 만료되었습니다. 다시 로그인해주세요.',
  'Invalid token': '인증 정보가 올바르지 않습니다.',
  'Login required': '로그인이 필요합니다.',

  // 파일 업로드 관련
  'File too large': '파일 크기가 너무 큽니다.',
  'Invalid file type': '지원하지 않는 파일 형식입니다.',
  'Upload failed': '파일 업로드에 실패했습니다.',
}

// 기본 에러 메시지 (카테고리별)
const DEFAULT_ERROR_MESSAGES = {
  magazine: '매거진을 불러오는 중 오류가 발생했습니다.',
  emoticon: '이모티콘을 불러오는 중 오류가 발생했습니다.',
  news: '학생소식을 불러오는 중 오류가 발생했습니다.',
  auth: '인증 처리 중 오류가 발생했습니다.',
  upload: '파일 업로드 중 오류가 발생했습니다.',
  network: '네트워크 오류가 발생했습니다.',
  general: '요청 처리 중 오류가 발생했습니다.',
}

/**
 * 에러 메시지를 한국어로 변환
 * @param error - Error 객체 또는 문자열
 * @param category - 에러 카테고리 (기본 메시지 선택용)
 * @returns 한국어 에러 메시지
 */
export const getKoreanErrorMessage = (
  error: unknown,
  category: keyof typeof DEFAULT_ERROR_MESSAGES = 'general'
): string => {
  let errorMessage = ''

  // Error 객체에서 메시지 추출
  if (error instanceof Error) {
    errorMessage = error.message
  } else if (typeof error === 'string') {
    errorMessage = error
  } else {
    return DEFAULT_ERROR_MESSAGES[category]
  }

  // 정확히 일치하는 메시지 찾기
  if (ERROR_MESSAGE_MAP[errorMessage]) {
    return ERROR_MESSAGE_MAP[errorMessage]
  }

  // HTTP 상태 코드 패턴 매칭
  const httpStatusMatch = errorMessage.match(/api 호출 실패: (\d+)/)
  if (httpStatusMatch) {
    const statusCode = httpStatusMatch[1]
    const statusMessage = ERROR_MESSAGE_MAP[`API 호출 실패: ${statusCode}`]
    if (statusMessage) {
      return statusMessage
    }
  }

  // 부분 일치 검사 (키워드 포함)
  for (const [englishMsg, koreanMsg] of Object.entries(ERROR_MESSAGE_MAP)) {
    if (errorMessage.toLowerCase().includes(englishMsg.toLowerCase())) {
      return koreanMsg
    }
  }

  // 영어 메시지인지 확인 (간단한 휴리스틱)
  const isEnglishMessage = /^[a-zA-Z0-9\s.,!?:;-]+$/.test(errorMessage.trim())

  if (isEnglishMessage) {
    // 영어 메시지인 경우 카테고리별 기본 메시지 반환
    return DEFAULT_ERROR_MESSAGES[category]
  }

  // 이미 한국어이거나 번역할 수 없는 경우 원본 반환
  return errorMessage
}

/**
 * 간편한 에러 처리 헬퍼 함수
 * @param error - 에러 객체
 * @param category - 에러 카테고리
 * @param showToastFn - 토스트 표시 함수
 * @param setErrorFn - 에러 상태 설정 함수 (선택사항)
 */
export const handleApiError = (
  error: unknown,
  category: keyof typeof DEFAULT_ERROR_MESSAGES,
  showToastFn: (message: string, type: 'error') => void,
  setErrorFn?: (error: string) => void
) => {
  const koreanMessage = getKoreanErrorMessage(error, category)

  console.error(`${category} 오류:`, error)

  if (setErrorFn) {
    setErrorFn(koreanMessage)
  }

  showToastFn(koreanMessage, 'error')
}
