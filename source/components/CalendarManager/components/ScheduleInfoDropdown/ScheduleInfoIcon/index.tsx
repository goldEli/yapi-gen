import styled from '@emotion/styled'
import { css } from '@emotion/css'

import React from 'react'
import IconFont from '@/components/IconFont'
interface iProps {
  type: string
}
const ScheduleInfoIconBox = styled.div`
  color: var(--neutral-n3);
`
const iconSize = css`
  font-size: 18px;
`
const ScheduleInfoIcon: React.FC<iProps> = props => {
  return (
    <ScheduleInfoIconBox>
      <IconFont type={props.type} className={iconSize} />
    </ScheduleInfoIconBox>
  )
}

export default ScheduleInfoIcon
