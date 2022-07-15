import { Divider } from 'antd'
import styled from '@emotion/styled'
import WrapRight from './components/WrapRight'
import WrapLeft from './components/WrapLeft'

const DividerWrap = styled(Divider)({
  margin: '0 24px',
  height: 'inherit',
})

export default () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0 24px',
        background: 'white',
      }}
    >
      <WrapLeft />
      <DividerWrap type="vertical" />
      <WrapRight />
    </div>
  )
}
