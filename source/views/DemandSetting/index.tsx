import styled from '@emotion/styled'
import Header from './components/Header'
import Main from './components/Main'
import CreateField from './components/CreateField'
const Wrap = styled.div`
  display: flex;
  padding: 0 24px;
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
