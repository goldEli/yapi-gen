import React from 'react'
import styled from '@emotion/styled'

interface MoreScheduleButtonProps {
  hiddenNum: number
}

const MoreScheduleButtonBox = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: var(--neutral-n3);
  display: flex;
  height: 20px;
  overflow: hidden;
  cursor: pointer;
`

const MoreScheduleButton: React.FC<MoreScheduleButtonProps> = props => {
  if (!props.hiddenNum) {
    return <></>
  }
  return (
    <MoreScheduleButtonBox>{`还有${props.hiddenNum}项...`}</MoreScheduleButtonBox>
  )
}

export default MoreScheduleButton
