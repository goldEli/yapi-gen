import styled from '@emotion/styled'
import Header from './components/Header'
import Main from './components/Main'
import CreateField from './components/CreateField'
const Wrap = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 24px;
  overflow-x: hidden;
`
const DemandSetting = () => {
  return (
    <>
      <Header></Header>
      <Wrap>
        <Main />
        <CreateField />
      </Wrap>
    </>
  )
}
export default DemandSetting
