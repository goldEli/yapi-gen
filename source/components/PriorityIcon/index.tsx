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
}>`
  font-size: 16px;
  color: ${props => props.color};
`

const PriorityIconWrap = styled.div<{
  iconType?: Model.KanBan.StoryConfigPriority['icon']
}>`
  width: 20px;
  height: 20px;
  border-radius: 24px 24px 24px 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${props =>
    props.iconType ? priorityIconBgColor[props.iconType] : ''};
`

const PriorityIcon: React.FC<PriorityIconProps> = props => {
  return (
    <PriorityIconWrap iconType={props.icon}>
      <PriorityIconBox type={props.icon ?? ''} color={props.color} />
    </PriorityIconWrap>
  )
}

export default PriorityIcon
