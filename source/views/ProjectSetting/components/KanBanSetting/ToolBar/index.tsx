import React from 'react'
import styled from '@emotion/styled'

interface ToolBarProps {}

const ToolBarBox = styled.div`
  width: 100%;
`

const ToolBar: React.FC<ToolBarProps> = props => {
  return <ToolBarBox>ToolBar</ToolBarBox>
}

export default ToolBar
