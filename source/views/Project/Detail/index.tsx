import CommonOperation from './components/CommonOperation'
import styled from '@emotion/styled'
import { Outlet } from 'react-router-dom'

const Wrap = styled.div({
  height: '100%',
})

export default () => {
  return (
    <Wrap>
      <CommonOperation />
      <Outlet></Outlet>
    </Wrap>
  )
}
