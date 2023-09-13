import styled from '@emotion/styled'

export const ScheduleStripBox = styled.div<{
  bg?: string
  hoverBg: string
  hoverText: string
  visible: boolean
}>`
  height: 22px;
  background: ${props => props.bg};
  .text {
  }
  &:hover {
    background: ${props => props.hoverBg};
  }
  &:hover .text {
    color: ${props => props.hoverText};
  }

  display: flex;
  visibility: ${props => (props.visible ? 'visible' : 'hidden')};
  /* gap: 7px; */
  cursor: pointer;
  align-items: center;
  position: relative;
`

export const Dot = styled.div<{ bg: string }>`
  width: 6px;
  height: 6px;
  background: ${props => props.bg};
  border-radius: 2px 2px 2px 2px;
  margin-left: 8px;
  margin-right: 8px;
`
export const Time = styled.span<{
  selected?: boolean
  selectedColor: string
}>`
  color: ${props =>
    props.selected ? props.selectedColor : 'var(--neutral-n4)'};
  font-size: 12px;
  margin-right: 8px;
`
export const Title = styled.span<{
  selected?: boolean
  selectedColor: string
}>`
  flex: 1;
  color: ${props =>
    props.selected ? props.selectedColor : 'var(--neutral-n2)'};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
export const ResizeBar = styled.div<{ visible: boolean }>`
  display: ${props => (props.visible ? 'block' : 'none')};
  width: 8px;
  height: 100%;
  &:hover {
    cursor: col-resize;
  }
`

export const ResizeLeftBar = styled(ResizeBar)`
  position: absolute;
  top: 0;
  left: 0;
`
export const ResizeRightBar = styled(ResizeBar)`
  position: absolute;
  top: 0;
  right: 0;
`
