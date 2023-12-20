import React from 'react'
import styled from '@emotion/styled'

interface GapProps {
  height?: number
  width?: number
  style?: React.CSSProperties
}

const GapBox = styled.div<{ height?: number; width?: number }>`
  width: ${props => (props.width ? props.width + 'px' : '100%')};
  height: ${props => (props.height ? props.height + 'px' : '100%')};
  flex-shrink: 0;
`

const Gap: React.FC<GapProps> = props => {
  if (!props?.width && !props?.height) {
    return <></>
  }
  return (
    <GapBox height={props.height} width={props.width} style={props.style} />
  )
}

export default Gap
