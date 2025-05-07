import styled from '@emotion/styled'

export const MagazineListContainer = styled.div`
  width: 100%;
  max-width: 884px;
  margin: 0 auto;
  position: relative;

  .magazine-content {
    margin: 0 24px;
    padding-top: 20px;
  }

  @media (max-width: 768px) {
    .magazine-content {
      margin: 0 16px;
    }
  }
`
