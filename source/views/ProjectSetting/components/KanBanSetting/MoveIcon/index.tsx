import React from 'react'
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'

interface MoveIconProps {
  active: boolean
}

const IconWarp = styled(IconFont)<{ active: boolean }>`
  font-size: 16px;
  color: ${props => (props.active ? 'var(--primary-d1)' : 'var(--neutral-n3)')};
`

const MoveIcon: React.FC<MoveIconProps> = props => {
  return <IconWarp active={props.active} type="move" />
}

export default MoveIcon
