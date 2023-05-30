import React from 'react'
import styled from '@emotion/styled'
import IconFont from '../IconFont'

interface PriorityIconProps {
  icon?: Model.KanBan.StoryConfigPriority['icon']
  color: string
}

const priorityIconBgColor = {
  'extremely-high': 'var(--function-tag3)',
  high: 'var(--function-tag4)',
  middle: 'var(--function-tag5)',
  low: 'var(--function-tag2)',
  'extremely-low': 'var(--function-tag6)',
}

const PriorityIconBox = styled(IconFont)<{
  color: string
  iconType?: Model.KanBan.StoryConfigPriority['icon']
}>`
  font-size: 16px;
  color: ${props => props.color};
  background: ${props =>
    props.iconType ? priorityIconBgColor[props.iconType] : ''};
  border-radius: 50%;
`

const PriorityIcon: React.FC<PriorityIconProps> = props => {
  return (
    <PriorityIconBox
      type={props.icon ?? ''}
      iconType={props.icon}
      color={props.color}
    />
  )
}

export default PriorityIcon
