import React from 'react'
import {
  StudentSupportContainer,
  Title,
  LinksContainer,
  LinkCard,
  Image,
} from '../../styles/StudentSupportLinkStyle'

interface SupportLink {
  id: string
  imageUrl: string
  linkUrl: string
}

interface StudentSupportLinkProps {
  links?: SupportLink[]
}

// 기본 링크 데이터
const defaultLinks: SupportLink[] = [
  {
    id: '1',
    imageUrl: '/support/career_center.png',
    linkUrl: 'http://job.ajou.ac.kr/',
  },
  {
    id: '2',
    imageUrl: '/support/counseling_center.png',
    linkUrl: 'http://ascc.ajou.ac.kr/ascc/index.do',
  },
  {
    id: '3',
    imageUrl: 'public/support/innovation_center.png',
    linkUrl: 'http://ajou.ac.kr/ace/index.do',
  },
  {
    id: '4',
    imageUrl: 'public/support/global_center.png',
    linkUrl: 'http://cll.ajou.ac.kr/cll/index.do',
  },
]

const StudentSupportLink: React.FC<StudentSupportLinkProps> = ({
  links = defaultLinks,
}) => {
  return (
    <StudentSupportContainer>
      <Title>학생 지원 센터 바로가기</Title>
      <LinksContainer>
        {links.map((link) => (
          <LinkCard key={link.id} href={link.linkUrl}>
            <Image src={link.imageUrl} alt="학생 지원 서비스" />
          </LinkCard>
        ))}
      </LinksContainer>
    </StudentSupportContainer>
  )
}

export default StudentSupportLink
