import CommonOperation from './components/CommonOperation'
import styled from '@emotion/styled'
import { Outlet } from 'react-router-dom'

const Wrap = styled.div({
  height: '100%',
  overflow: 'auto',
})

const Detail = () => {
  return (
    <Wrap>
      <CommonOperation />
      <Outlet />
    </Wrap>
  )
}

export default Detail
