import React, { useState } from 'react'
import {
  ChatBarContainer,
  InputContainer,
  StyledInput,
  IconButton,
} from '../../styles/ChatBarStyles'
import { useToast } from '../toast/ToastProvider'
import * as IconComponents from '../../components/icon/iconComponents'

interface ChatBarProps {
  onSendMessage?: (message: string) => void
}

const ChatBar: React.FC<ChatBarProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState<string>('')
  const { showToast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value)
  }

  const handleSendMessage = () => {
    if (message.trim() && onSendMessage) {
      onSendMessage(message)
      setMessage('')
      showToast('메시지가 전송되었습니다', 'success')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && message.trim() && onSendMessage) {
      handleSendMessage()
    }
  }

  const handlePlusClick = () => {
    showToast('추가 버튼이 클릭되었습니다', 'info')
  }

  const handleEmojiClick = () => {
    showToast('이모티콘 버튼이 클릭되었습니다', 'info')
  }

  return (
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
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
          />

          <IconButton
            position="right"
            onClick={message.trim() ? handleSendMessage : undefined}
          >
            <IconComponents.UploadIcon color="#392111" />
          </IconButton>
        </InputContainer>
      </div>
    </ChatBarContainer>
  )
}

export default ChatBar
