/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { CloseIcon } from '../../../components/icon/iconComponents'
import { useNavigate } from 'react-router-dom'

const documentStyles = {
  rootContainer: css`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
  container: css`
    width: 478px;
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: #ffffff;
    font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    color: #333333;
    line-height: 1.6;
  `,
  head: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid #eee;
    position: sticky;
    top: 0;
    background-color: #ffffff;
    z-index: 10;
  `,
  closeButton: css`
    cursor: pointer;
  `,
  body: css`
    padding: 24px 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    overflow-y: auto;
    max-width: 768px;
    margin: 0 auto;
  `,
  title: css`
    font-size: 1.75em;
    line-height: 1.225;
    font-weight: bold;
    margin-top: 1rem;
    margin-bottom: 1rem;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
  `,
  paragraph: css`
    margin: 0.8em 0;
    font-size: 14px;
    line-height: 1.6;
  `,
  sectionTitle: css`
    font-size: 1.5em;
    line-height: 1.43;
    font-weight: bold;
    margin: 0;
  `,
  list: css`
    padding-left: 30px;
    margin: 0.8em 0;
  `,
  listItem: css`
    margin-bottom: 8px;
    font-size: 14px;
    line-height: 1.6;
  `,
}

const PersonalInformationDocument = () => {
  const navigate = useNavigate()

  const handleClose = () => {
    // 이전 단계로 돌아가면서 privacy 페이지에서 돌아왔다는 상태를 전달
    navigate('/register', {
      state: { fromPrivacy: true },
      replace: true, // 현재 페이지를 히스토리에서 대체
    })
  }

  return (
    <div className="rootContainer" css={documentStyles.rootContainer}>
      <div css={documentStyles.container}>
        <div css={documentStyles.head}>
          <div css={documentStyles.closeButton} onClick={handleClose}>
            <CloseIcon />
          </div>
        </div>

        <div css={documentStyles.body}>
          <h2 css={documentStyles.title}>개인정보 수집 및 이용동의</h2>

          <p css={documentStyles.paragraph}>
            마인드 메이트(이하 "회사")는 개인정보 보호를 중요하게 생각하며,
            개인정보 보호법 및 관련 법령을 준수하고 있습니다. 본 동의서는 회사가
            제공하는 서비스 이용과 관련하여 이용자의 개인정보를 수집 및 이용하는
            목적, 항목, 보유 및 이용 기간을 안내하고 동의를 얻기 위한 것입니다.
          </p>

          <h3 css={documentStyles.sectionTitle}>
            1. 개인정보 수집 및 이용 목적
          </h3>
          <p css={documentStyles.paragraph}>
            회사는 다음과 같은 목적으로 개인정보를 수집 및 이용합니다.
          </p>
          <ul css={documentStyles.list}>
            <li css={documentStyles.listItem}>
              서비스 제공 및 운영 (회원가입, 본인 확인, 상담 및 심리 분석 서비스
              제공 등)
            </li>
            <li css={documentStyles.listItem}>고객 지원 및 문의 응대</li>
            <li css={documentStyles.listItem}>
              서비스 개선 및 맞춤형 콘텐츠 제공
            </li>
            <li css={documentStyles.listItem}>법적 의무 준수 및 분쟁 해결</li>
          </ul>

          <h3 css={documentStyles.sectionTitle}>2. 수집하는 개인정보 항목</h3>
          <p css={documentStyles.paragraph}>
            서비스 제공을 위해 다음과 같은 개인정보를 수집할 수 있습니다.
          </p>
          <ul css={documentStyles.list}>
            <li css={documentStyles.listItem}>
              필수 정보: 이름, 닉네임, 이메일 주소, 비밀번호
            </li>
            <li css={documentStyles.listItem}>
              선택 정보: 생년월일, 성별, 관심사, 심리 상태 관련 정보(자가 진단
              결과 등)
            </li>
            <li css={documentStyles.listItem}>
              자동 수집 정보: 서비스 이용 기록, 접속 IP, 기기 정보, 쿠키 등
            </li>
          </ul>

          <h3 css={documentStyles.sectionTitle}>
            3. 개인정보 보유 및 이용 기간
          </h3>
          <p css={documentStyles.paragraph}>
            수집된 개인정보는 원칙적으로 이용 목적이 달성된 후 즉시 파기합니다.
            단, 관련 법령에 따라 일정 기간 보관해야 하는 경우에는 해당 기간 동안
            보관합니다.
          </p>
          <ul css={documentStyles.list}>
            <li css={documentStyles.listItem}>
              회원가입 정보: 회원 탈퇴 시 즉시 삭제
            </li>
            <li css={documentStyles.listItem}>
              서비스 이용 기록: 6개월 보관 후 삭제
            </li>
            <li css={documentStyles.listItem}>
              관련 법령에 따른 보관 (전자상거래 등에서의 소비자 보호에 관한 법률
              등)
            </li>
            <li css={documentStyles.listItem}>계약 또는 청약철회 기록: 5년</li>
            <li css={documentStyles.listItem}>
              대금 결제 및 재화 공급 기록: 5년
            </li>
            <li css={documentStyles.listItem}>
              소비자 불만 또는 분쟁 처리 기록: 3년
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default PersonalInformationDocument
