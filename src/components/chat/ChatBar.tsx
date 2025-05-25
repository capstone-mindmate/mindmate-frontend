import React, { useState } from 'react'
import {
  ChatBarContainer,
  InputContainer,
  StyledInput,
  IconButton,
} from '../../styles/ChatBarStyles'
import { useToast } from '../toast/ToastProvider'
import * as IconComponents from '../../components/icon/iconComponents'
import EmoticonPicker from '../emoticon/EmoticonPicker'
import { EmoticonType } from '../emoticon/Emoticon'
import { useNavigate, useLocation } from 'react-router-dom'

interface ChatBarProps {
  onSendMessage: (message: string) => void
  onSendEmoticon?: (emoticonType: EmoticonType) => void
  onTyping?: (isTyping: boolean) => void
  disabled?: boolean
  chatId?: string | undefined
}

function ChatBar({
  onSendMessage,
  onSendEmoticon,
  onTyping,
  disabled,
  chatId,
}: ChatBarProps) {
  const [message, setMessage] = useState<string>('')
  const [showEmoticonPicker, setShowEmoticonPicker] = useState<boolean>(false)
  const { showToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const otherProfileImage = location.state?.profileImage
  const otherUserName = location.state?.userName

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value)
  }

  const handleSendMessage = () => {
    if (message.trim() && onSendMessage) {
      onSendMessage(message)
      setMessage('')
      // showToast('메시지가 전송되었습니다', 'success')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && message.trim()) {
      handleSendMessage()
    }
  }

  const handlePlusClick = () => {
    navigate(`/chat/custom-form/make/${chatId}`, {
      state: {
        profileImage: otherProfileImage,
        userName: otherUserName,
      },
    })
  }

  const handleEmojiClick = () => {
    setShowEmoticonPicker(!showEmoticonPicker)
  }

  const handleSelectEmoticon = (type: EmoticonType) => {
    if (onSendEmoticon) {
      onSendEmoticon(type)
      // showToast(`${type} 이모티콘을 보냈습니다`, 'success')
    } else {
      // showToast(`이모티콘을 선택했습니다: ${type}`, 'info')
    }
    setShowEmoticonPicker(false)
  }

  const handleEmoticonShopClick = () => {
    // showToast('이모티콘샵으로 이동합니다', 'info')
    navigate('/emoticons')
    setShowEmoticonPicker(false)
  }

  // 채팅바 컨테이너 스타일 (인라인 스타일)
  const wrapperStyle = {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    width: '100%',
    boxSizing: 'border-box' as const,
  }

  return (
    <>
      {showEmoticonPicker && (
        <div onClick={() => setShowEmoticonPicker(false)} />
      )}
      <div style={wrapperStyle}>
        <ChatBarContainer>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              maxWidth: '767px',
              margin: '0 auto',
              gap: '10px',
            }}
          >
            <div onClick={handlePlusClick} style={{ cursor: 'pointer' }}>
              <IconComponents.PlusIcon color="#392111" />
            </div>

            <div onClick={handleEmojiClick} style={{ cursor: 'pointer' }}>
              <IconComponents.SmileIcon color="#392111" />
            </div>

            <InputContainer>
              <StyledInput
                type="text"
                placeholder="메시지를 입력하세요"
                value={message}
                disabled={disabled}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
              />

              <IconButton
                position="right"
                onClick={message.trim() ? handleSendMessage : undefined}
              >
                <IconComponents.UploadIcon
                  color={message.trim() ? '#392111' : '#a3a3a3'}
                />
              </IconButton>
            </InputContainer>
          </div>
        </ChatBarContainer>

        {showEmoticonPicker && (
          <EmoticonPicker
            onSelectEmoticon={handleSelectEmoticon}
            onShopClick={handleEmoticonShopClick}
            onClose={() => setShowEmoticonPicker(false)}
          />
        )}
      </div>
    </>
  )
}

export default ChatBar
