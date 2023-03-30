import styled from '@emotion/styled'
import React from 'react'

interface QuickCreateScheduleModelProps {
  visible: boolean
  pointerPosition: {
    x: number
    y: number
  }
}
interface Props {
  top: number
  left: number
  visible: boolean
}
const DropdownContainer = styled.div`
  width: 528px;
  height: 636px;
  background-color: var(--neutral-white-d1);
  box-shadow: 0px 0px 15px 6px rgba(0, 0, 0, 0.12);
  z-index: 10;
  position: absolute;
  top: ${(props: Props) => props.top + 'px'};
  left: ${(props: Props) => props.left + 'px'};
  display: ${(props: Props) => (props.visible ? 'flex' : 'none')};
`

const QuickCreateScheduleModel: React.FC<
  QuickCreateScheduleModelProps
> = props => {
  return (
    <DropdownContainer
      top={props.pointerPosition.y}
      left={props.pointerPosition.x}
      visible={props.visible}
    >
      QuickCreateScheduleModel
    </DropdownContainer>
  )
}

export default QuickCreateScheduleModel
