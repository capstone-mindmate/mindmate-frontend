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

interface ModalComponentProps {
  modalType: string
  buttonText: string
  buttonClick: () => void
  isOpen: boolean
  onClose: () => void
}

const ModalComponent = ({
  modalType = '매칭신청',
  buttonText = '닫기',
  buttonClick = () => {},
  isOpen = false,
  onClose = () => {},
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
              profileImage=""
              name="건드리면 짖는댕"
              department="소프트웨어학과"
              makeDate="03월 24일 18:52"
            />
          </div>
          <div className="modal-body" css={modalStyles.modalBody}>
            <YellowInputBox
              placeholder="메시지를 입력해주세요"
              value="진로 고민 들어주세요"
              onChange={() => {}}
              activeState={false}
              isTitle={true}
            />

            <YellowInputBox
              placeholder="메시지를 입력해주세요"
              value="저 아주대 앞에서 붕어빵 팔아도 될까요? 친구들이 저 알아보면 어떻게 하죠???? 그건 두려운데 ㅠㅠ"
              height={0}
              onChange={() => {}}
              activeState={false}
              isTitle={false}
            />

            <GrayInputBox
              placeholder="상대방에게 전달하고 싶은 메시지를 입력해주세요"
              value=""
              height={100}
              onChange={() => {}}
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
                profileImage=""
                name="건드리면 짖는댕"
                department="소프트웨어학과"
                onBackClick={() => {
                  showDetails ? setShowDetails(false) : setShowDetails(true)
                }}
                showDetails={showDetails}
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
                  value="진로 고민 들어주세요"
                  onChange={() => {}}
                  activeState={false}
                  isTitle={true}
                />

                <YellowInputBox
                  placeholder="메시지를 입력해주세요"
                  value="저 아주대 앞에서 붕어빵 팔아도 될까요? 친구들이 저 알아보면 어떻게 하죠???? 그건 두려운데 ㅠㅠ"
                  height={0}
                  onChange={() => {}}
                  activeState={false}
                  isTitle={false}
                />

                <GrayInputBox
                  placeholder="상대방에게 전달하고 싶은 메시지를 입력해주세요"
                  value=""
                  height={100}
                  onChange={() => {}}
                  activeState={true}
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
  } else if (modalType === '채팅종료') {
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
          <div className="modal-header"></div>
          <div className="modal-body"></div>
          <div className="modal-footer"></div>
        </div>
      </div>
    )
  }
}

export default ModalComponent
