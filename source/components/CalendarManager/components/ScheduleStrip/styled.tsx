import styled from '@emotion/styled'

export const Dot = styled.div<{ bg: string }>`
  width: 6px;
  height: 6px;
  background: ${props => props.bg};
  border-radius: 2px 2px 2px 2px;
  margin-left: 8px;
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
