import styled from '@emotion/styled'
import React from 'react'
import IconFont from './IconFont'

const Wrap = styled.div`
  width: 40px;
  height: 40px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  ::before {
    content: '×';
    font-size: 30px;
  }
`

const WhiteCloseButton = () => {
  return <Wrap></Wrap>
}

export default WhiteCloseButton
