import { useState } from 'react'
import CommonOperation from './components/CommonOperation'
import styled from '@emotion/styled'

const Wrap = styled.div({
  position: 'sticky',
})

const HeaderWrap = styled.div({
  background: 'white',
})

export default () => {
  const [active, setActive] = useState('demand')
  return (
    <Wrap>
      <HeaderWrap>
        <CommonOperation active={active} onChangeActive={setActive} />
      </HeaderWrap>
    </Wrap>
  )
}
