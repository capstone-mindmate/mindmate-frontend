import { useState, useCallback, useMemo } from 'react'
import { fetchWithRefresh } from '../utils/fetchWithRefresh'
import { CustomFormMessage, Message, FormDataResult } from '../types/message'

interface UseCustomFormProps {
  chatId: string
  myUserId: string | number
  parseMessage: (msg: any) => Message
  addMessage: (
    message: Message,
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    markAsRead: () => void
  ) => void
}

export const useCustomForm = ({
  chatId,
  myUserId,
  parseMessage,
  addMessage,
}: UseCustomFormProps) => {
  const [customForms, setCustomForms] = useState<any[]>([])
  const [processedMessageIds, setProcessedMessageIds] = useState<Set<string>>(
    new Set()
  ) // 처리된 메시지 ID 추적

  // API 호출 함수들 - 메모이제이션으로 최적화
  const loadFormsByChatRoomId = useCallback(
    async (data: any): Promise<FormDataResult> => {
      if (!chatId) return { success: false }

      try {
        const response = await fetchWithRefresh(
          `http://lohttps://mindmate.shopcalhost/api/custom-forms/chat-room/${chatId}`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        )

        if (response.ok) {
          const allForms = await response.json()

          if (Array.isArray(allForms) && allForms.length > 0) {
            const messageTimestamp = new Date(
              data.timestamp || data.createdAt || Date.now()
            ).getTime()

            const matchedForm = allForms.reduce((closest, form) => {
              if (!closest) return form

              const formTime = new Date(form.createdAt || 0).getTime()
              const closestTime = new Date(closest.createdAt || 0).getTime()

              return Math.abs(formTime - messageTimestamp) <
                Math.abs(closestTime - messageTimestamp)
                ? form
                : closest
            }, null)

            if (matchedForm) {
              setCustomForms((prev) => {
                const existingIndex = prev.findIndex(
                  (f) => f.id === matchedForm.id
                )
                if (existingIndex >= 0) {
                  const updated = [...prev]
                  updated[existingIndex] = matchedForm
                  return updated
                }
                return [...prev, matchedForm]
              })

              return { success: true, formData: matchedForm }
            }
          }
        }
        return { success: false }
      } catch (error) {
        console.error('채팅방 커스텀폼 조회 실패:', error)
        return { success: false }
      }
    },
    [chatId]
  )

  const loadSingleFormData = useCallback(
    async (formId: string): Promise<FormDataResult> => {
      try {
        const response = await fetchWithRefresh(
          `http://lohttps://mindmate.shopcalhost/api/custom-forms/${formId}`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        )

        if (response.ok) {
          const formData = await response.json()
          return { success: true, formData }
        }

        return { success: false }
      } catch (error) {
        console.error('폼 데이터 조회 실패:', error)
        return { success: false }
      }
    },
    []
  )

  // 답변 완료 시 기존 질문 메시지 제거 함수
  const removeQuestionMessage = useCallback(
    (
      formId: string | number,
      setMessages: React.Dispatch<React.SetStateAction<Message[]>>
    ) => {
      //console.log('기존 질문 메시지 제거 시도:', formId)
      setMessages((prev) => {
        const filtered = prev.filter((message) => {
          if (message.type === 'CUSTOM_FORM') {
            const customFormMessage = message as CustomFormMessage
            const messageFormId = customFormMessage.customForm?.id

            // 같은 폼 ID이고, 답변되지 않은 질문 메시지라면 제거
            if (
              String(messageFormId) === String(formId) &&
              !customFormMessage.customForm?.answered
            ) {
              //console.log('질문 메시지 제거됨:', messageFormId)
              return false
            }
          }
          return true
        })

        //console.log('메시지 필터링 완료, 제거 전:', prev.length, '제거 후:', filtered.length)
        return filtered
      })
    },
    []
  )

  // 커스텀폼 메시지 처리 - 로직 단순화 및 디버깅 강화
  const processCustomFormMessage = useCallback(
    async (
      data: any,
      setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
      markAsRead: () => void
    ) => {
      //console.log('=== 커스텀폼 메시지 처리 시작 ===', data)

      // 데이터가 직접 폼 정보를 포함하는 경우 (웹소켓에서 받은 경우)
      const isDirectFormData = data.id && data.chatRoomId && data.creatorId

      let formData = data
      let messageId = `custom-form-${data.id || Date.now()}-${Math.random()}`

      // 직접 폼 데이터가 아닌 경우 (메시지 형태)
      if (!isDirectFormData) {
        messageId = data.id || data.messageId || messageId

        // 이미 처리된 메시지인지 확인
        if (processedMessageIds.has(messageId)) {
          //console.log('이미 처리된 커스텀폼 메시지 무시:', messageId)
          return false
        }

        const formId = data.formId || data.customForm?.id
        if (formId) {
          try {
            const result = await loadSingleFormData(formId)
            if (result.success && result.formData) {
              formData = result.formData
            }
          } catch (error) {
            console.error('폼 데이터 로드 실패:', error)
          }
        }
      }

      // 처리된 메시지로 추가
      setProcessedMessageIds((prev) => new Set([...prev, messageId]))

      // 폼 데이터 정규화
      const normalizedFormData = {
        id: formData.id,
        chatRoomId: formData.chatRoomId,
        creatorId: formData.creatorId,
        creatorName: formData.creatorName,
        responderId: formData.responderId,
        responderName: formData.responderName,
        items: formData.items || [],
        answered: formData.answered || false,
        createdAt: formData.createdAt,
        respondedAt: formData.respondedAt,
      }

      //console.log('정규화된 폼 데이터:', normalizedFormData)
      //console.log('내 사용자 ID:', myUserId)
      //console.log('작성자 ID:', normalizedFormData.creatorId)
      //console.log('답변자 ID:', normalizedFormData.responderId)
      //console.log('답변 완료:', normalizedFormData.answered)

      const isAnswered = normalizedFormData.answered
      const isMyQuestion =
        String(normalizedFormData.creatorId) === String(myUserId)
      const isMyAnswer =
        String(normalizedFormData.responderId) === String(myUserId)

      //console.log('역할 분석:')
      //console.log('- 내가 질문 작성자:', isMyQuestion)
      //console.log('- 내가 답변자:', isMyAnswer)

      // 답변 완료 시 기존 질문 메시지 제거
      if (isAnswered && isMyAnswer) {
        //console.log('답변 완료, 기존 질문 메시지 제거')
        removeQuestionMessage(normalizedFormData.id, setMessages)
      }

      // 메시지 표시 여부 결정 - 더 엄격한 조건
      let shouldShowMessage = false
      let messageContent = '커스텀 폼'

      if (isAnswered) {
        // 답변 완료된 경우: 오직 답변자에게만 "답변이 도착했어요!" 표시
        if (isMyAnswer && !isMyQuestion) {
          shouldShowMessage = true
          messageContent = '답변이 도착했어요!'
          //console.log('답변 완료된 폼, 답변자에게만 표시')
        } else if (isMyQuestion) {
          //console.log('답변 완료된 폼, 작성자이므로 표시하지 않음')
        } else {
          //console.log('답변 완료된 폼, 관련 없는 사용자이므로 표시하지 않음')
        }
      } else {
        // 질문인 경우: 오직 작성자에게만 "질문이 도착했어요 📝" 표시
        if (isMyQuestion && !isMyAnswer) {
          shouldShowMessage = true
          messageContent = '질문이 도착했어요 📝'
          //console.log('질문 폼, 작성자에게만 표시')
        } else if (isMyAnswer) {
          //console.log('질문 폼, 답변자이므로 표시하지 않음 (CustomFormView에서 처리)')
        } else {
          //console.log('질문 폼, 관련 없는 사용자이므로 표시하지 않음')
        }
      }

      //console.log('메시지 표시 여부:', shouldShowMessage)
      //console.log('메시지 내용:', messageContent)

      if (shouldShowMessage) {
        // 중복 메시지 체크 - 같은 폼에 대한 기존 메시지가 있는지 확인
        let hasDuplicateMessage = false

        setMessages((prev) => {
          const existingMessage = prev.find((m) => {
            if (m.type === 'CUSTOM_FORM') {
              const existingCustomForm = m as CustomFormMessage
              const sameFormId =
                String(existingCustomForm.customForm?.id) ===
                String(normalizedFormData.id)
              const sameAnsweredStatus =
                existingCustomForm.customForm?.answered ===
                normalizedFormData.answered
              const sameRole =
                existingCustomForm.isCustomFormMine === isMyQuestion &&
                existingCustomForm.isCustomFormResponder === isMyAnswer

              if (sameFormId && sameAnsweredStatus && sameRole) {
                return true
              }
            }
            return false
          })

          if (existingMessage) {
            hasDuplicateMessage = true
            //console.log('중복 메시지로 인해 추가하지 않음')
            return prev
          }

          return prev
        })

        if (!hasDuplicateMessage) {
          // 커스텀폼 상태 업데이트
          setCustomForms((prev) => {
            const existingIndex = prev.findIndex(
              (f) => f.id === normalizedFormData.id
            )
            if (existingIndex >= 0) {
              const updated = [...prev]
              updated[existingIndex] = normalizedFormData
              return updated
            }
            return [...prev, normalizedFormData]
          })

          // 메시지 생성
          const messageData = {
            id: messageId,
            senderId: normalizedFormData.creatorId,
            timestamp: normalizedFormData.createdAt || new Date().toISOString(),
            type: 'CUSTOM_FORM',
            content: messageContent,
            customForm: normalizedFormData,
            isRead: false,
          }

          const newMessage: CustomFormMessage = {
            ...parseMessage(messageData),
            type: 'CUSTOM_FORM',
            customForm: normalizedFormData,
            content: messageContent,
            isCustomFormMine: isMyQuestion,
            isCustomFormAnswered: isAnswered,
            isCustomFormResponder: isMyAnswer,
          } as CustomFormMessage

          //console.log('생성된 메시지:', newMessage)

          addMessage(newMessage, setMessages, markAsRead)
          //console.log('메시지 추가 완료')
        }
      }

      //console.log('=== 커스텀폼 메시지 처리 완료 ===')
      return true
    },
    [
      myUserId,
      parseMessage,
      addMessage,
      loadSingleFormData,
      removeQuestionMessage,
      processedMessageIds,
    ]
  )

  // 메모이제이션된 반환값
  return useMemo(
    () => ({
      customForms,
      setCustomForms,
      processCustomFormMessage,
    }),
    [customForms, processCustomFormMessage]
  )
}
