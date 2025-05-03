/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useNavigate } from 'react-router-dom'
import TopBar from '../../../components/topbar/Topbar'

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
    font-weight: bold;
    margin-top: 1rem;
    margin-bottom: 1rem;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
  `,
  sectionTitle: css`
    font-size: 1.5em;
    font-weight: bold;
    margin: 0;
  `,
  paragraph: css`
    margin: 0.8em 0;
    font-size: 14px;
  `,
  list: css`
    padding-left: 30px;
    margin: 0.8em 0;
  `,
  listItem: css`
    margin-bottom: 8px;
    font-size: 14px;
  `,
}

const TermsOfUse = () => {
  const navigate = useNavigate()
  const handleClose = () => navigate(-1)

  return (
    <div css={documentStyles.rootContainer}>
      <div css={documentStyles.container}>
        <TopBar
          title="서비스 이용약관"
          showBackButton={true}
          onBackClick={handleClose}
        />

        <div css={documentStyles.body}>
          <h2 css={documentStyles.title}>서비스 이용약관</h2>

          <p css={documentStyles.paragraph}>
            본 약관은 마인드 메이트(이하 "회사")가 제공하는 서비스의 이용과
            관련하여 회사와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한
            사항을 규정함을 목적으로 합니다.
          </p>

          <h3 css={documentStyles.sectionTitle}>제1조 (목적)</h3>
          <p css={documentStyles.paragraph}>
            본 약관은 회사가 제공하는 모든 서비스의 이용과 관련하여 회사와 회원
            간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로
            합니다.
          </p>

          <h3 css={documentStyles.sectionTitle}>제2조 (정의)</h3>
          <ul css={documentStyles.list}>
            <li css={documentStyles.listItem}>
              "서비스"란 회사가 제공하는 심리 상담, 분석 등 관련 제반 서비스를
              의미합니다.
            </li>
            <li css={documentStyles.listItem}>
              "회원"이란 회사와 서비스 이용계약을 체결하고 서비스를 이용하는
              자를 말합니다.
            </li>
          </ul>

          <h3 css={documentStyles.sectionTitle}>제3조 (약관의 게시 및 변경)</h3>
          <p css={documentStyles.paragraph}>
            본 약관은 회사의 웹사이트 및 앱에 게시되며, 회사는 관련 법령을
            위배하지 않는 범위에서 본 약관을 변경할 수 있습니다.
          </p>

          <h3 css={documentStyles.sectionTitle}>
            제4조 (서비스의 제공 및 변경)
          </h3>
          <p css={documentStyles.paragraph}>
            회사는 회원에게 다음과 같은 서비스를 제공합니다.
          </p>
          <ul css={documentStyles.list}>
            <li css={documentStyles.listItem}>상담 및 심리 분석 서비스</li>
            <li css={documentStyles.listItem}>개인 맞춤형 콘텐츠 제공</li>
            <li css={documentStyles.listItem}>기타 회사가 정하는 서비스</li>
          </ul>

          <h3 css={documentStyles.sectionTitle}>제5조 (서비스 이용시간)</h3>
          <p css={documentStyles.paragraph}>
            서비스는 연중무휴, 1일 24시간 제공함을 원칙으로 하나, 시스템 점검 등
            회사가 정한 사유에 따라 제한될 수 있습니다.
          </p>

          <h3 css={documentStyles.sectionTitle}>
            제6조 (회원가입 및 정보관리)
          </h3>
          <p css={documentStyles.paragraph}>
            회원은 회사가 정한 절차에 따라 가입하며, 본인의 정보를 정확하게
            제공해야 합니다. 허위 정보 제공 시 서비스 이용에 제한을 받을 수
            있습니다.
          </p>

          <h3 css={documentStyles.sectionTitle}>제7조 (회원의 의무)</h3>
          <ul css={documentStyles.list}>
            <li css={documentStyles.listItem}>
              타인의 정보를 도용하거나 부정한 행위를 해서는 안 됩니다.
            </li>
            <li css={documentStyles.listItem}>
              서비스 이용과 관련한 모든 법령을 준수해야 합니다.
            </li>
          </ul>

          <h3 css={documentStyles.sectionTitle}>제8조 (개인정보 보호)</h3>
          <p css={documentStyles.paragraph}>
            회사는 「개인정보 보호법」 등 관련 법령에 따라 회원의 개인정보를
            보호하며, 수집 및 이용에 대한 내용은 별도의 「개인정보처리방침」에
            따릅니다.
          </p>

          <h3 css={documentStyles.sectionTitle}>제9조 (계약 해지)</h3>
          <p css={documentStyles.paragraph}>
            회원은 언제든지 서비스 이용을 중단하고 탈퇴할 수 있으며, 회사는 관련
            법령 및 약관에 따라 계정을 삭제할 수 있습니다.
          </p>

          <h3 css={documentStyles.sectionTitle}>제10조 (면책조항)</h3>
          <p css={documentStyles.paragraph}>
            회사는 천재지변, 불가항력적 사유 등으로 인한 서비스 제공의 불가에
            대해 책임을 지지 않습니다.
          </p>

          <h3 css={documentStyles.sectionTitle}>제11조 (관할법원 및 준거법)</h3>
          <p css={documentStyles.paragraph}>
            본 약관은 대한민국 법률에 따라 해석되며, 서비스 이용과 관련된 분쟁은
            회사의 본사 소재지를 관할하는 법원을 제1심 관할법원으로 합니다.
          </p>
        </div>
      </div>
    </div>
  )
}

export default TermsOfUse
