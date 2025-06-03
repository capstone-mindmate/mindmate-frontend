/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { CoinIcon, CloseIcon } from '../icon/iconComponents'
import BrownRectButton from '../buttons/brownRectButton'
import {
  ModalMatchingUserProfile,
  ModalMatchingFailureUserProfile,
} from './modalUserProfile'
import YellowInputBox from '../inputs/yellowInputBox'
import GrayInputBox from '../inputs/grayInputBox'
import { useEffect, useState, useRef } from 'react'
import Emoticon, { EmoticonType } from '../emoticon/Emoticon'

interface ModalComponentProps {
  modalType: string
  buttonText: string
  buttonClick: () => void
  isOpen: boolean
  onClose: () => void
  userProfileProps?: {
    profileImage: string
    name: string
    department: string
    makeDate: string
    userId?: number
  }
  matchingInfoProps?: {
    title: string
    description: string
  }
  messageProps?: {
    onMessageChange: (value: string) => void
    messageValue: string
  }
  emoticon?: {
    type: string
    size: string
    price: number
    imageUrl: string
    id: number
  }
  onProfileClick?: () => void // 프로필 클릭 핸들러
  onAccept?: () => void
  onReject?: () => void
}

const ModalComponent = ({
  modalType = '매칭신청',
  buttonText = '닫기',
  buttonClick = () => {},
  isOpen = false,
  onClose = () => {},
  userProfileProps = {
    profileImage: '',
    name: '',
    department: '',
    makeDate: '',
  },
  matchingInfoProps = {
    title: '',
    description: '',
  },
  messageProps = {
    onMessageChange: () => {},
    messageValue: '',
  },
  emoticon = {
    type: 'normal',
    size: 'xlarge',
    price: 10,
    imageUrl: '',
    id: 0,
  },
  onProfileClick, // 프로필 클릭 핸들러 받기
  onAccept,
  onReject,
}: ModalComponentProps) => {
  const [showDetails, setShowDetails] = useState(false)
  const matchedInfoRef = useRef<HTMLDivElement>(null)
  const [matchedInfoHeight, setMatchedInfoHeight] = useState(0)

  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth

      document.body.style.paddingRight = `${scrollbarWidth}px`
      document.body.style.overflow = 'hidden'
    }

    if (showDetails && matchedInfoRef.current) {
      const height = matchedInfoRef.current.scrollHeight
      setMatchedInfoHeight(height)
    } else {
      setMatchedInfoHeight(0)
    }

    return () => {
      document.body.style.paddingRight = ''
      document.body.style.overflow = ''
    }
  }, [isOpen, showDetails])

  const modalStyles = {
    container: css`
      width: 100%;
      height: 100%;
      position: fixed;
      top: 0;
      left: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgb(0 0 0 / 30%);
      z-index: 1001;
      backdrop-filter: blur(2px);
    `,
    modalContent: css`
      width: 342px;
      height: auto;
      padding: 16px 20px 28px 16px;
      max-height: 90vh;
      background-color: #ffffff;
      border-radius: 12px;
      overflow-y: auto;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    `,

    closeBtn: css`
      width: 100%;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      cursor: pointer;
    `,

    coinWrapper: css`
      width: 22px;
      height: 22px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      background-color: #f5f5f5;
    `,

    coinBox: css`
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 10px;
    `,

    coinText: css`
      font-size: 12px;
      line-height: 1.3;
      color: #000000;
      margin: 0;
    `,

    confirmBtn: css`
      width: 100%;
      margin-top: 12px;
    `,

    modalBody: css`
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin: 12px 0;
    `,

    emoticonContainer: css`
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px 0;
    `,

    emoticonPrice: css`
      margin-top: 16px;
      font-size: 16px;
      font-weight: bold;
      display: flex;
      align-items: center;
      gap: 6px;
    `,

    modalBodyApplication: css`
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin: 32px 0;
    `,

    modalBodyCancel: css`
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin: 32px 0;
    `,

    matchedInfoContainer: css`
      width: 100%;
      height: 0px;
      overflow: hidden;
      max-height: 100%;
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin: 12px 0;
      transition: all 0.3s ease-in-out;
    `,

    modalHeaderText: css`
      font-size: 18px;
      font-weight: bold;
      line-height: 1.4;
      text-align: center;
      color: #000000;
      margin: 0;
    `,

    matchedInfo: css`
      height: 0;
      overflow: hidden;
      transition: all 0.3s ease-in-out;

      &.expanded {
        height: auto;
        min-height: 200px;
      }
    `,
    detailsContent: css`
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin: 12px 0;
      opacity: 0;
      transform: translateY(20px);
      visibility: hidden;
      transition: all 0.3s ease-in-out;
    `,
    visible: css`
      opacity: 1 !important;
      transform: translateY(0) !important;
      visibility: visible !important;
    `,
    profileContent: css`
      opacity: 1;
      transform: translateY(0);
      transition: all 0.3s ease-in-out;

      &.hidden {
        opacity: 0;
        transform: translateY(-20px);
        visibility: hidden;
      }
    `,

    modalFooter: css`
      width: 100%;
      margin-top: 20px;
    `,

    closeChatFooter: css`
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 20px;
    `,

    chatCloseContainer: css`
      display: flex;
      flex-direction: column;
      align-items: center;
    `,

    closeChatBtnContainer: css`
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 12px;
    `,

    deleteModalBody: css`
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px 0;
      text-align: center;
    `,

    deleteModalFooter: css`
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 12px;
    `,
  }

  if (modalType === '매칭신청') {
    return (
      <div
        className="container"
        css={modalStyles.container}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose()
          }
        }}
      >
        <div
          className="modal-content"
          css={modalStyles.modalContent}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="close-btn"
            css={modalStyles.closeBtn}
            onClick={() => onClose()}
            role="button"
            aria-label="닫기"
          >
            <CloseIcon color="#000000" width={24} height={24} />
          </div>
          <div className="modal-header">
            <ModalMatchingUserProfile
              profileImage={userProfileProps.profileImage}
              name={userProfileProps.name}
              department={userProfileProps.department}
              makeDate={userProfileProps.makeDate}
              onClick={onProfileClick}
            />
          </div>
          <div className="modal-body" css={modalStyles.modalBody}>
            <YellowInputBox
              placeholder="메시지를 입력해주세요"
              value={matchingInfoProps.title}
              onChange={() => {}}
              activeState={false}
              isTitle={true}
            />

            <YellowInputBox
              placeholder="메시지를 입력해주세요"
              value={matchingInfoProps.description}
              height={0}
              onChange={() => {}}
              activeState={false}
              isTitle={false}
            />

            <GrayInputBox
              placeholder="상대방에게 전달하고 싶은 메시지를 입력해주세요"
              value={messageProps.messageValue}
              height={100}
              onChange={messageProps.onMessageChange}
              activeState={true}
            />
          </div>
          <div className="modal-footer">
            <div className="coin-box" css={modalStyles.coinBox}>
              <div className="coin" css={modalStyles.coinWrapper}>
                <CoinIcon color="#392111" width={18} height={18} />
              </div>
              <p css={modalStyles.coinText}>매칭 신청 시 50코인이 차감됩니다</p>
            </div>
            <div className="confirm-btn" css={modalStyles.confirmBtn}>
              <BrownRectButton
                buttonText={buttonText}
                onActiveChange={buttonClick}
              />
            </div>
          </div>
        </div>
      </div>
    )
  } else if (modalType === '매칭실패') {
    return (
      <div className="container" css={modalStyles.container}>
        <div className="modal-content" css={modalStyles.modalContent}>
          <div className="modal-header">
            <p css={modalStyles.modalHeaderText}>
              매칭에 실패했어요 🥹
              <br />
              다른 사람과 매칭을 시도해보세요!
            </p>
          </div>

          <div className="modal-body" css={modalStyles.modalBody}>
            <div css={[modalStyles.profileContent]}>
              <ModalMatchingFailureUserProfile
                profileImage={userProfileProps.profileImage}
                name={userProfileProps.name}
                department={userProfileProps.department}
                onBackClick={() => {
                  showDetails ? setShowDetails(false) : setShowDetails(true)
                }}
                showDetails={showDetails}
                onClick={onProfileClick}
              />
            </div>

            <div
              ref={matchedInfoRef}
              css={css`
                ${modalStyles.matchedInfo}
                height: ${matchedInfoHeight}px;
              `}
            >
              <div
                css={[
                  modalStyles.detailsContent,
                  showDetails && modalStyles.visible,
                ]}
              >
                <YellowInputBox
                  placeholder="메시지를 입력해주세요"
                  value={matchingInfoProps.title}
                  onChange={() => {}}
                  activeState={false}
                  isTitle={true}
                />

                <YellowInputBox
                  placeholder="메시지를 입력해주세요"
                  value={matchingInfoProps.description}
                  height={0}
                  onChange={() => {}}
                  activeState={false}
                  isTitle={false}
                />

                <GrayInputBox
                  placeholder="상대방에게 전달하고 싶은 메시지를 입력해주세요"
                  value={messageProps.messageValue}
                  height={100}
                  onChange={() => {}}
                  activeState={false}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <div className="confirm-btn" css={modalStyles.confirmBtn}>
              <BrownRectButton
                buttonText={buttonText}
                onActiveChange={() => onClose()}
              />
            </div>
          </div>
        </div>
      </div>
    )
  } else if (modalType === '매칭하기') {
    return (
      <div className="container" css={modalStyles.container}>
        <div className="modal-content" css={modalStyles.modalContent}>
          <div
            className="close-btn"
            css={modalStyles.closeBtn}
            onClick={() => onClose()}
            role="button"
            aria-label="닫기"
          >
            <CloseIcon color="#000000" width={24} height={24} />
          </div>
          <div className="modal-header">
            <p css={modalStyles.modalHeaderText}>
              해당 신청자와
              <br />
              매칭을 진행하시겠습니까?
            </p>
          </div>

          <div className="modal-body" css={modalStyles.modalBodyApplication}>
            <div css={[modalStyles.profileContent]}>
              <ModalMatchingUserProfile
                profileImage={userProfileProps.profileImage}
                name={userProfileProps.name}
                department={userProfileProps.department}
                makeDate={userProfileProps.makeDate}
                onClick={onProfileClick}
              />
            </div>
          </div>

          <div className="modal-footer">
            <div className="confirm-btn" css={modalStyles.confirmBtn}>
              <BrownRectButton
                buttonText={buttonText}
                onActiveChange={buttonClick}
              />
            </div>
          </div>
        </div>
      </div>
    )
  } else if (modalType === '매칭성사') {
    return (
      <div className="container" css={modalStyles.container}>
        <div className="modal-content" css={modalStyles.modalContent}>
          <div className="modal-header">
            <p css={modalStyles.modalHeaderText}>
              매칭이 성사되었습니다 💌
              <br />
              지금 바로 대화를 시작해보세요
            </p>
          </div>

          <div className="modal-body" css={modalStyles.modalBody}>
            <div css={[modalStyles.profileContent]}>
              <ModalMatchingFailureUserProfile
                profileImage={userProfileProps.profileImage}
                name={userProfileProps.name}
                department={userProfileProps.department}
                onBackClick={() => {
                  showDetails ? setShowDetails(false) : setShowDetails(true)
                }}
                showDetails={showDetails}
                onClick={onProfileClick}
              />
            </div>

            <div
              ref={matchedInfoRef}
              css={css`
                ${modalStyles.matchedInfo}
                height: ${matchedInfoHeight}px;
              `}
            >
              <div
                css={[
                  modalStyles.detailsContent,
                  showDetails && modalStyles.visible,
                ]}
              >
                <YellowInputBox
                  placeholder="메시지를 입력해주세요"
                  value={matchingInfoProps.title}
                  onChange={() => {}}
                  activeState={false}
                  isTitle={true}
                />

                <YellowInputBox
                  placeholder="메시지를 입력해주세요"
                  value={matchingInfoProps.description}
                  height={0}
                  onChange={() => {}}
                  activeState={false}
                  isTitle={false}
                />

                <GrayInputBox
                  placeholder="상대방에게 전달하고 싶은 메시지를 입력해주세요"
                  value={messageProps.messageValue}
                  height={100}
                  onChange={() => {}}
                  activeState={false}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <div className="confirm-btn" css={modalStyles.confirmBtn}>
              <BrownRectButton
                buttonText={buttonText}
                onActiveChange={() => onClose()}
              />
            </div>
          </div>
        </div>
      </div>
    )
  } else if (modalType == '매칭취소') {
    return (
      <div className="container" css={modalStyles.container}>
        <div className="modal-content" css={modalStyles.modalContent}>
          <div
            className="close-btn"
            css={modalStyles.closeBtn}
            onClick={() => onClose()}
            role="button"
            aria-label="닫기"
          >
            <CloseIcon color="#000000" width={24} height={24} />
          </div>
          <div className="modal-header">
            <p css={modalStyles.modalHeaderText}>매칭을 취소하시겠습니까?</p>
          </div>

          <div className="modal-body" css={modalStyles.modalBodyCancel}>
            <div css={[modalStyles.profileContent]}>
              <ModalMatchingFailureUserProfile
                profileImage={userProfileProps.profileImage}
                name={userProfileProps.name}
                department={userProfileProps.department}
                onBackClick={() => {
                  showDetails ? setShowDetails(false) : setShowDetails(true)
                }}
                showDetails={showDetails}
                onClick={onProfileClick}
              />
            </div>

            <div
              ref={matchedInfoRef}
              css={css`
                ${modalStyles.matchedInfo}
                height: ${matchedInfoHeight}px;
              `}
            >
              <div
                css={[
                  modalStyles.detailsContent,
                  showDetails && modalStyles.visible,
                ]}
              >
                <YellowInputBox
                  placeholder="메시지를 입력해주세요"
                  value={matchingInfoProps.title}
                  onChange={() => {}}
                  activeState={false}
                  isTitle={true}
                />

                <YellowInputBox
                  placeholder="메시지를 입력해주세요"
                  value={matchingInfoProps.description}
                  height={0}
                  onChange={() => {}}
                  activeState={false}
                  isTitle={false}
                />

                <GrayInputBox
                  placeholder="상대방에게 전달하고 싶은 메시지를 입력해주세요"
                  value={messageProps.messageValue}
                  height={100}
                  onChange={() => {}}
                  activeState={false}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <div className="confirm-btn" css={modalStyles.confirmBtn}>
              <BrownRectButton
                buttonText={buttonText}
                onActiveChange={buttonClick}
              />
            </div>
          </div>
        </div>
      </div>
    )
  } else if (modalType === '매칭방삭제') {
    return (
      <div
        className="container"
        css={modalStyles.container}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose()
          }
        }}
      >
        <div
          className="modal-content"
          css={modalStyles.modalContent}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="close-btn"
            css={modalStyles.closeBtn}
            onClick={() => onClose()}
            role="button"
            aria-label="닫기"
          >
            <CloseIcon color="#000000" width={24} height={24} />
          </div>
          <div className="modal-header">
            <p css={modalStyles.modalHeaderText}>
              이 매칭방을 삭제하시겠습니까?
            </p>
          </div>

          <div className="modal-body" css={modalStyles.deleteModalBody}>
            <p style={{ fontSize: '14px', color: '#666', margin: '0' }}>
              삭제된 매칭방은 복구할 수 없습니다.
            </p>
          </div>

          <div className="modal-footer" css={modalStyles.deleteModalFooter}>
            <div className="cancel-btn" css={modalStyles.confirmBtn}>
              <BrownRectButton
                buttonText="취소"
                onActiveChange={onReject || onClose}
              />
            </div>
            <div className="confirm-btn" css={modalStyles.confirmBtn}>
              <BrownRectButton
                buttonText={buttonText}
                onActiveChange={buttonClick}
              />
            </div>
          </div>
        </div>
      </div>
    )
  } else if (modalType === '채팅종료신청') {
    return (
      <div className="container" css={modalStyles.container}>
        <div className="modal-content" css={modalStyles.modalContent}>
          <div
            className="close-btn"
            css={modalStyles.closeBtn}
            onClick={() => onClose()}
            role="button"
            aria-label="닫기"
          >
            <CloseIcon color="#000000" width={24} height={24} />
          </div>
          <div className="modal-header">
            <p css={modalStyles.modalHeaderText}>채팅 종료 요청 중입니다..</p>
          </div>
          <div className="modal-body" css={modalStyles.chatCloseContainer}>
            <Emoticon type="love" size="xlarge" />
          </div>
          <div className="modal-footer"></div>
        </div>
      </div>
    )
  } else if (modalType === '채팅종료수락') {
    return (
      <div className="container" css={modalStyles.container}>
        <div className="modal-content" css={modalStyles.modalContent}>
          <div
            className="close-btn"
            css={modalStyles.closeBtn}
            onClick={() => onClose()}
            role="button"
            aria-label="닫기"
          >
            <CloseIcon color="#000000" width={24} height={24} />
          </div>
          <div className="modal-header">
            <p css={modalStyles.modalHeaderText}>채팅을 종료하시겠어요?</p>
          </div>
          <div className="modal-body" css={modalStyles.chatCloseContainer}>
            <Emoticon type="thanks" size="xlarge" />
          </div>
          <div className="modal-footer" css={modalStyles.closeChatFooter}>
            <div className="confirm-btn" css={modalStyles.confirmBtn}>
              <BrownRectButton buttonText="닫기" onActiveChange={onReject} />
            </div>

            <div className="confirm-btn" css={modalStyles.confirmBtn}>
              <BrownRectButton buttonText="수락" onActiveChange={onAccept} />
            </div>
          </div>
        </div>
      </div>
    )
  } else if (modalType === '이모티콘구매') {
    return (
      <div className="container" css={modalStyles.container}>
        <div className="modal-content" css={modalStyles.modalContent}>
          <div
            className="close-btn"
            css={modalStyles.closeBtn}
            onClick={() => onClose()}
            role="button"
            aria-label="닫기"
          >
            <CloseIcon color="#000000" width={24} height={24} />
          </div>
          <div className="modal-header">
            <p css={modalStyles.modalHeaderText}>
              이모티콘을 구매하시겠습니까?
            </p>
          </div>
          <div className="modal-body" css={modalStyles.emoticonContainer}>
            <Emoticon
              emoticonURL={emoticon.imageUrl}
              type={emoticon.type as EmoticonType}
              size={emoticon.size as 'xlarge'}
            />

            <div css={modalStyles.emoticonPrice}>
              <CoinIcon color="#392111" width={20} height={20} />
              <span>{emoticon.price} 코인</span>
            </div>
          </div>
          <div className="modal-footer">
            <div className="confirm-btn" css={modalStyles.confirmBtn}>
              <BrownRectButton
                buttonText={buttonText}
                onActiveChange={buttonClick}
              />
            </div>
          </div>
        </div>
      </div>
    )
  } else if (modalType === '신고완료') {
    return (
      <div
        className="container"
        css={modalStyles.container}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose()
          }
        }}
        data-testid="modal-overlay"
      >
        <div className="modal-content" css={modalStyles.modalContent}>
          <div className="modal-header">
            <p
              css={modalStyles.modalHeaderText}
              style={{
                margin: `var(--modal-header-margin, 20px) 0`,
                fontSize: `var(--modal-font-size, 18px)`,
              }}
            >
              신고가 완료되었습니다
              <br />
              감사합니다
            </p>
          </div>
          <div className="modal-footer">
            <div
              className="confirm-btn"
              css={modalStyles.confirmBtn}
              style={{
                marginTop: `var(--modal-button-margin, 12px)`,
              }}
            >
              <BrownRectButton
                buttonText={buttonText}
                onActiveChange={buttonClick}
              />
            </div>
          </div>
        </div>
      </div>
    )
  } else if (modalType === '채팅방삭제') {
    return (
      <div
        className="container"
        css={modalStyles.container}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose()
          }
        }}
      >
        <div
          className="modal-content"
          css={modalStyles.modalContent}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="close-btn"
            css={modalStyles.closeBtn}
            onClick={() => onClose()}
            role="button"
            aria-label="닫기"
          >
            <CloseIcon color="#000000" width={24} height={24} />
          </div>
          <div className="modal-header">
            <p css={modalStyles.modalHeaderText}>
              이 채팅방을 삭제하시겠습니까?
            </p>
          </div>

          <div className="modal-body" css={modalStyles.deleteModalBody}>
            <p style={{ fontSize: '14px', color: '#666', margin: '0' }}>
              삭제된 채팅방은 복구할 수 없습니다.
            </p>
          </div>

          <div className="modal-footer" css={modalStyles.deleteModalFooter}>
            <div className="cancel-btn" css={modalStyles.confirmBtn}>
              <BrownRectButton
                buttonText="취소"
                onActiveChange={onReject || onClose}
              />
            </div>
            <div className="confirm-btn" css={modalStyles.confirmBtn}>
              <BrownRectButton
                buttonText={buttonText}
                onActiveChange={onAccept || buttonClick}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ModalComponent
