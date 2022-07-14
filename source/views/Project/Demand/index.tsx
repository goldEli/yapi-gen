import { useState } from 'react'
import Operation from './components/Operation'
import styled from '@emotion/styled'

const HeaderWrap = styled.div({
  position: 'sticky',
  padding: '0 24px',
})

export default () => {
  const [active, setActive] = useState('demand')
  return (
    <div>
      <HeaderWrap>
        <Operation active={active} onChangeActive={setActive} />
      </HeaderWrap>
    </div>
  )
}
