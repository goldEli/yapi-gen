import { useState } from 'react'
import Operation from './components/Operation'
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
        <Operation active={active} onChangeActive={setActive} />
      </HeaderWrap>
    </Wrap>
  )
}
