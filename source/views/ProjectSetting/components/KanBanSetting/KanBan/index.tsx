import styled from '@emotion/styled'
import KanBanStatusBoard from '../KanBanStatusBoard'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  height: 100%;
  overflow: auto;
  /* height: 0; */
`

const KanBan = () => {
  return (
    <Container>
      <KanBanStatusBoard />
    </Container>
  )
}

export default KanBan
