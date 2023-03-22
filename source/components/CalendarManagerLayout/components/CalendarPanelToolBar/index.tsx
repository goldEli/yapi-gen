import styled from '@emotion/styled'
import React from 'react'

interface CanlendarPanelToolBarProps {
  children?: React.ReactDOM
}

const Box = styled.div`
  width: 100%;
  height: 32px;
`

const CanlendarPanelToolBar: React.FC<CanlendarPanelToolBarProps> = props => {
  return <Box>今天 2023年</Box>
}

export default CanlendarPanelToolBar
