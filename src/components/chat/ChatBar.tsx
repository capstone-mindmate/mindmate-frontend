import React, {
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
  useEffect,
} from 'react'
import {
  WrapperStyle,
  ChatBarContainer,
  ControlsContainer,
  InputContainer,
  IconWrapper,
  IconButton,
} from '../../styles/ChatBarStyles'
import { useToast } from '../toast/ToastProvider'
import * as IconComponents from '../../components/icon/iconComponents'
import EmoticonPicker from '../emoticon/EmoticonPicker'
import { EmoticonType } from '../emoticon/Emoticon'
import { useNavigate, useLocation } from 'react-router-dom'
import styled from '@emotion/styled'
import { useNavigationStore } from '../../stores/navigationStore'

// 기존 StyledInput 대신 사용할 StyledTextarea
const StyledTextarea = styled.textarea<{ disabled?: boolean }>`
  width: 100%;
  min-height: 20px;
  max-height: 120px;
  padding: 12px 45px 12px 15px;
  border: 1px solid #eeeeee;
  border-radius: 24px;
  font-family: 'Pretendard', sans-serif;
  font-weight: 400;
  font-size: 14px;
  color: #333333;
  outline: none;
  background-color: #f5f5f5;
  text-align: left;
  line-height: 1.4;
  resize: none;
  overflow-y: auto;
  box-sizing: border-box;
  cursor: ${(props) => (props.disabled ? 'default' : 'text')};

  &::placeholder {
    color: ${(props) => (props.disabled ? '#dadada' : '#a3a3a3')};
    text-align: left;
  }

  /* 스크롤바 완전히 숨기기 */
  &::-webkit-scrollbar {
    display: none;
  }

  /* Firefox용 스크롤바 숨기기 */
  scrollbar-width: none;

  /* IE/Edge용 스크롤바 숨기기 */
  -ms-overflow-style: none;
`

interface ChatBarProps {
  onSendMessage: (message: string, onError?: () => void) => void
  onSendEmoticon?: (emoticonId: string) => void
  onTyping?: (isTyping: boolean) => void
  onEmoticonPickerToggle?: (isOpen: boolean) => void
  onInputFocus?: () => void // 새로 추가
  disabled?: boolean
  chatId?: string | undefined
}

export interface ChatBarRef {
  restoreMessage: (message: string) => void
  focusInput: () => void
  handleFilteredMessage: () => void
  handleMessageSent: () => void
}

const ChatBar = forwardRef<ChatBarRef, ChatBarProps>(
  (
    {
      onSendMessage,
      onSendEmoticon,
      onEmoticonPickerToggle,
      onInputFocus,
      disabled,
      chatId,
    },
    ref
  ) => {
    const [message, setMessage] = useState<string>('')
    const [showEmoticonPicker, setShowEmoticonPicker] = useState<boolean>(false)
    const [lastSentMessage, setLastSentMessage] = useState<string>('') // 마지막 전송 메시지
    const [isWaitingResponse, setIsWaitingResponse] = useState<boolean>(false) // 응답 대기 상태
    const { showToast } = useToast()
    const navigate = useNavigate()
    const location = useLocation()
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const { setPreviousPath } = useNavigationStore()

    const otherProfileImage = location.state?.profileImage
    const otherUserName = location.state?.userName

    // 텍스트 영역 높이 자동 조절
    const adjustTextareaHeight = () => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
      }
    }

    // 4. disabled 상태 변경 시 이모티콘 피커 닫기
    useEffect(() => {
      if (disabled && showEmoticonPicker) {
        setShowEmoticonPicker(false)
      }
    }, [disabled, showEmoticonPicker])

    // 이모티콘 피커 상태 변경 시 부모에게 알림
    useEffect(() => {
      if (onEmoticonPickerToggle) {
        onEmoticonPickerToggle(showEmoticonPicker)
      }
    }, [showEmoticonPicker, onEmoticonPickerToggle])

    // 메시지 변경 시 높이 조절
    useEffect(() => {
      adjustTextareaHeight()
    }, [message])

    // 외부에서 메시지 복원 및 포커스 기능을 사용할 수 있도록 ref 노출
    useImperativeHandle(
      ref,
      () => ({
        restoreMessage: (restoredMessage: string) => {
          setMessage(restoredMessage)
          setTimeout(() => {
            if (textareaRef.current) {
              textareaRef.current.focus()
              textareaRef.current.setSelectionRange(
                restoredMessage.length,
                restoredMessage.length
              )
              adjustTextareaHeight()
            }
          }, 100)
        },
        focusInput: () => {
          if (textareaRef.current) {
            textareaRef.current.focus()
          }
        },
        // 필터링된 메시지 처리 (현재 입력된 메시지를 복원)
        handleFilteredMessage: () => {
          if (lastSentMessage) {
            setMessage(lastSentMessage)
            setIsWaitingResponse(false)
            setTimeout(() => {
              if (textareaRef.current) {
                textareaRef.current.focus()
                textareaRef.current.setSelectionRange(
                  lastSentMessage.length,
                  lastSentMessage.length
                )
                adjustTextareaHeight()
              }
            }, 100)
          }
        },
        // 메시지 전송 완료 처리
        handleMessageSent: () => {
          setMessage('')
          setLastSentMessage('')
          setIsWaitingResponse(false)
        },
      }),
      [lastSentMessage]
    )

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setMessage(e.target.value)
    }

    const handleSendMessage = () => {
      if (message.trim() && onSendMessage && !isWaitingResponse) {
        const messageToSend = message.trim()

        // 현재 메시지를 lastSentMessage에 저장
        setLastSentMessage(messageToSend)
        setIsWaitingResponse(true)

        // 메시지 전송 실패 시 호출될 에러 콜백
        const onError = () => {
          // 전송 실패 시 메시지 복원
          setMessage(messageToSend)
          setIsWaitingResponse(false)
          setTimeout(() => {
            if (textareaRef.current) {
              textareaRef.current.focus()
              textareaRef.current.setSelectionRange(
                messageToSend.length,
                messageToSend.length
              )
              adjustTextareaHeight()
            }
          }, 100)
        }

        // 메시지 전송 (에러 콜백과 함께)
        onSendMessage(messageToSend, onError)

        // 입력창은 즉시 비우기 (성공/실패 응답에 따라 복원될 수 있음)
        setMessage('')
      }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        if (message.trim() && !isWaitingResponse) {
          handleSendMessage()
        }
      }
    }

    const handlePlusClick = () => {
      if (disabled) return

      navigate(`/chat/custom-form/make/${chatId}`, {
        state: {
          profileImage: otherProfileImage,
          userName: otherUserName,
        },
      })
    }

    const handleEmojiClick = () => {
      if (disabled) return

      setShowEmoticonPicker(!showEmoticonPicker)
    }

    const handleSelectEmoticon = (emoticonData: {
      id: string
      imageUrl: string
      type: string
    }) => {
      if (disabled) return
      //console.log('이모티콘 선택됨:', emoticonData) // 디버깅용
      if (onSendEmoticon) {
        onSendEmoticon(emoticonData.id)
      }
      setShowEmoticonPicker(false)
    }

    // 텍스트 입력 포커스 핸들러
    const handleTextareaFocus = () => {
      if (onInputFocus) {
        onInputFocus() // 부모에게 포커스 알림 (이모티콘 피커 닫기)
      }
    }

    const handleEmoticonShopClick = () => {
      navigate('/emoticons')
      setShowEmoticonPicker(false)
      setPreviousPath('/chat')
    }

    const handleEmoticonPickerClose = () => {
      setShowEmoticonPicker(false) // 피커 닫기
    }

    return (
      <>
        {showEmoticonPicker && <div onClick={handleEmoticonPickerClose} />}
        <WrapperStyle>
          <ChatBarContainer>
            <ControlsContainer style={{ alignItems: 'flex-end' }}>
              <IconWrapper
                onClick={handlePlusClick}
                style={{
                  opacity: disabled ? 0.5 : 1,
                  cursor: disabled ? 'not-allowed' : 'pointer',
                }}
              >
                <IconComponents.PlusIcon
                  color={disabled ? '#a3a3a3' : '#392111'}
                />
              </IconWrapper>

              <IconWrapper
                onClick={handleEmojiClick}
                style={{
                  opacity: disabled ? 0.5 : 1,
                  cursor: disabled ? 'not-allowed' : 'pointer',
                }}
              >
                <IconComponents.SmileIcon
                  color={disabled ? '#a3a3a3' : '#392111'}
                />
              </IconWrapper>

              <InputContainer>
                <StyledTextarea
                  ref={textareaRef}
                  placeholder="메시지를 입력하세요"
                  value={message}
                  disabled={disabled || isWaitingResponse}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  onFocus={handleTextareaFocus} // 포커스 이벤트 추가
                  rows={1}
                />

                <IconButton
                  position="right"
                  onClick={
                    message.trim() && !isWaitingResponse
                      ? handleSendMessage
                      : undefined
                  }
                  disabled={!message.trim() || isWaitingResponse}
                >
                  <IconComponents.UploadIcon
                    color={
                      message.trim() && !isWaitingResponse
                        ? '#392111'
                        : '#a3a3a3'
                    }
                  />
                </IconButton>
              </InputContainer>
            </ControlsContainer>
          </ChatBarContainer>

          {showEmoticonPicker && (
            <EmoticonPicker
              onSelectEmoticon={handleSelectEmoticon}
              onShopClick={handleEmoticonShopClick}
              onClose={() => setShowEmoticonPicker(false)}
            />
          )}
        </WrapperStyle>
      </>
    )
  }
)

ChatBar.displayName = 'ChatBar'

export default ChatBar
