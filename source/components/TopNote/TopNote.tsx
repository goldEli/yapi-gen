import styled from '@emotion/styled'
import { useSelector } from '@store/index'
import React from 'react'
const Wrap = styled.div<{ show?: boolean }>`
  height: 50px;
  width: 100vw;
  background-color: yellow;
  transition: all 1s ease;
  z-index: 199;
  position: fixed;
  top: ${props => (props.show ? '50px' : '0px')};
  left: 0;
  opacity: 0.5;
`

const TopNote = () => {
  const show = useSelector(store => store.siteNotifications.isVisible)
  return <Wrap show={show}>TopNote</Wrap>
}

export default TopNote
