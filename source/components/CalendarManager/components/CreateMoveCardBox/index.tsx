import React from 'react'
import styled from '@emotion/styled'
import dayjs from 'dayjs'

interface CreateMoveCardBoxProps {
  width: string | number
  height: number
  left: number
  top: number
  visible: boolean
  timeRange: {
    startTime: string
    endTime: string
  }
}

const CreateMoveCardBoxBox = styled.div<CreateMoveCardBoxProps>`
  width: ${props =>
    typeof props.width === 'string' ? props.width : props.width + 'px'};
  height: ${props => props.height + 'px'};
  top: ${props => props.top + 'px'};
  font-size: 12px;
  line-height: 20px;
  background-color: var(--primary-d1);
  position: absolute;
  left: ${props => props.left + 'px'};
  display: ${(props: { visible: boolean }) =>
    props.visible ? 'block' : 'none'};
  border-radius: 6px;
  .title {
    font-size: 12px;
    line-height: 20px;
    color: var(--neutral-white-d7);
    padding-left: 8px;
  }
  z-index: 3;
`

const CreateMoveCardBox: React.FC<CreateMoveCardBoxProps> = props => {
  return (
    <CreateMoveCardBoxBox {...props}>
      <span className="title">{`${dayjs(props.timeRange.startTime).format(
        'HH:mm',
      )}-${dayjs(props.timeRange.endTime)?.format('HH:mm')}`}</span>
    </CreateMoveCardBoxBox>
  )
}

export default CreateMoveCardBox
