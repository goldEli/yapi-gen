import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import { Space } from 'antd'
import { colorMap } from '../../config'

const ColorGroups = styled(Space)`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
`

const ColorItem = styled.div<{ color: string }>`
  width: 20px;
  height: 20px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.color};
  cursor: pointer;
  svg {
    color: var(--neutral-white-d1) !important;
  }
`

interface CalendarColorProps {
  onChangeColor(color: number): void
  color: number
}

const CalendarColor = (props: CalendarColorProps) => {
  const onChangeColor = (color: number) => {
    props.onChangeColor(color)
  }

  return (
    <ColorGroups>
      {colorMap?.map((i: string, idx: number) => (
        <ColorItem key={i} color={i} onClick={() => onChangeColor(idx)}>
          {props.color === idx && <IconFont type="check" />}
        </ColorItem>
      ))}
    </ColorGroups>
  )
}

export default CalendarColor
