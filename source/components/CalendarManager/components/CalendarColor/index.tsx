import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import { Space } from 'antd'

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
  svg {
    color: var(--neutral-white-d1) !important;
  }
`

interface CalendarColorProps {
  onChangeColor(color: string): void
  color: string
}

const calendarColorList = [
  '#FF5C5E',
  '#FA9746',
  '#43BA9A',
  '#6688FF',
  '#A176FB',
  '#FA89EA',
  '#FF8B8B',
  '#269758',
  '#3AA7FF',
  '#00ADD2',
  '#ED7303',
  '#4D5EFF',
]

const CalendarColor = (props: CalendarColorProps) => {
  const onChangeColor = (color: string) => {
    props.onChangeColor(color)
  }

  return (
    <ColorGroups>
      {calendarColorList?.map((i: string) => (
        <ColorItem key={i} color={i} onClick={() => onChangeColor(i)}>
          {props.color === i && <IconFont type="check" />}
        </ColorItem>
      ))}
    </ColorGroups>
  )
}

export default CalendarColor
