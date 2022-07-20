import CommonOperation from './components/CommonOperation'
import styled from '@emotion/styled'
import { Outlet } from 'react-router-dom'

const Wrap = styled.div({
  height: '100%',
  overflow: 'auto',
})

export default () => {
  return (
    <Wrap>
      <CommonOperation />
      <Outlet></Outlet>
    </Wrap>
  )
}
