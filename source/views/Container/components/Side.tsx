import styled from '@emotion/styled'
import { useSelector } from '@store/index'

const SideWrap = styled.div<{
  secondaryMenuCollapse: boolean
  firstMenuCollapse: boolean
}>`
  width: ${props => (props.firstMenuCollapse ? 0 : 80)}px;
  height: 100%;
  align-items: center;
  background: #f2f8d2;
  max-width: unset !important;
  min-width: unset !important;
  flex: unset !important;
  transition: 0.2s;
  z-index: 9;
  overflow: hidden;
`

const Side = () => {
  const { firstMenuCollapse, secondaryMenuCollapse } = useSelector(
    state => state.global,
  )

  return (
    <SideWrap
      secondaryMenuCollapse={secondaryMenuCollapse}
      firstMenuCollapse={firstMenuCollapse}
    >
      23232
    </SideWrap>
  )
}

export default Side
