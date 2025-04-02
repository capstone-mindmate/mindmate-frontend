/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { CoinIcon, CloseIcon } from '../icon/iconComponents'
import BrownRectButton from '../buttons/brownRectButton'
import { ModalMatchingUserProfile } from './modalUserProfile'
import YellowInputBox from '../inputs/yellowInputBox'
import GrayInputBox from '../inputs/grayInputBox'
interface ModalComponentProps {
  modalType: string
  buttonText: string
  buttonClick: () => void
}

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
  `,
  modalContent: css`
    width: 342px;
    height: auto;
    padding: 16px 20px;
    max-height: 500px;
    background-color: #ffffff;
    border-radius: 12px;
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
}

const ModalComponent = ({
  modalType = '매칭신청',
  buttonText = '닫기',
  buttonClick = () => {},
}: ModalComponentProps) => {
  if (modalType === '매칭신청') {
    return (
      <div className="container" css={modalStyles.container}>
        <div className="modal-content" css={modalStyles.modalContent}>
          <div className="close-btn" css={modalStyles.closeBtn}>
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
              <BrownRectButton buttonText="매칭신청" buttonClick={() => {}} />
            </div>
          </div>
        </div>
      </div>
    )
  } else if (modalType === '매칭실패') {
    return (
      <div className="container" css={modalStyles.container}>
        <div className="modal-content" css={modalStyles.modalContent}>
          <div className="modal-header"></div>
          <div className="modal-body"></div>
          <div className="modal-footer"></div>
        </div>
      </div>
    )
  } else if (modalType === '채팅종료') {
    return (
      <div className="container" css={modalStyles.container}>
        <div className="modal-content" css={modalStyles.modalContent}>
          <div className="modal-header"></div>
          <div className="modal-body"></div>
          <div className="modal-footer"></div>
        </div>
      </div>
    )
  }
}

export default ModalComponent
