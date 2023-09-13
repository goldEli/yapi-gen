import { css } from '@emotion/css'
import styled from '@emotion/styled'

export const ScheduleListItemBox = styled.div<{
  bg?: string
  hoverBg: string
  color: string
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
    color: ${props => props.color};
  }
  display: flex;
  visibility: ${props => (props.visible ? 'visible' : 'hidden')};
  gap: 7px;
  cursor: pointer;
  align-items: center;
`
export const marginLeft = css`
  margin-left: 2px;
`

export const marginRight = css`
  margin-right: 2px;
`

export const Dot = styled.div<{ bg: string }>`
  width: 6px;
  height: 6px;
  background: ${props => props.bg};
  border-radius: 2px;
  &:hover {
    cursor: col-resize;
  }
`
export const Time = styled.div`
  color: var(--neutral-n4);
`
export const Title = styled.div`
  flex: 1;
  color: var(--neutral-n2);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
