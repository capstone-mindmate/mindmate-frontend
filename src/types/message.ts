export interface BaseMessage {
  id: string
  isMe: boolean
  timestamp: string
  isRead: boolean
  senderId: string | number
}

export interface TextMessage extends BaseMessage {
  type: 'text' | 'TEXT'
  content: string
}

export interface EmoticonMessage extends BaseMessage {
  type: 'emoticon' | 'EMOTICON'
  emoticonType: EmoticonType
  content: string
  emoticonId?: string | number
  emoticonUrl?: string
  emoticonName?: string
  senderName?: string
}

export interface CustomFormItem {
  id?: string | number
  question: string
  answer?: string
  createdAt?: string
}

export interface CustomFormData {
  id: string | number
  items?: CustomFormItem[]
  answered?: boolean
  creatorId?: string | number
  responderId?: string | number
}

export interface CustomFormMessage extends BaseMessage {
  type: 'CUSTOM_FORM' | 'custom_form'
  content: string
  customForm: CustomFormData
  isCustomFormMine?: boolean
  isCustomFormAnswered?: boolean
  isCustomFormResponder?: boolean
}

export type Message = TextMessage | EmoticonMessage | CustomFormMessage

export type EmoticonType = string

// API 응답 타입들
export interface FormDataResult {
  success: boolean
  formData?: any
}
