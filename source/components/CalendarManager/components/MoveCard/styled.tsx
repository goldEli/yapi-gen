import styled from '@emotion/styled'
import { Rnd } from 'react-rnd'

export const Time = styled.span`
  font-size: 14px;
  line-height: 20px;
`

export const Content = styled.div`
  width: 100%;
  display: flex;
  gap: 4;
  overflow: hidden;
`

export const TimeRange = styled.span`
  font-size: 14px;
  color: var(--neutral-n1-d1);
  margin-right: 4px;
`
export const Title = styled.span`
  font-size: 14px;
  color: var(--neutral-n1-d1);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`
export const MoveCardBox = styled(Rnd)<{ hoverTextColor: string; bg: string }>`
  border-radius: 6px 6px 6px 6px;
  min-height: 22px;
  cursor: move;
  box-sizing: border-box;
  padding: 0 4px;
  position: relative;
  z-index: 2;
  background-color: ${props => props.bg};
  &:hover span {
    color: ${props => props.hoverTextColor};
  }
`
