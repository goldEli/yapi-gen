import styled from '@emotion/styled'

export const ResizeLine = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  border-right: 1px solid var(--neutral-n6-d1);
  border-left: 1px solid var(--neutral-n6-d1);
  pointer-events: none;
`

export const ResizeBar = styled.div<{
  min: string
  max: string
  width: string
}>`
  width: ${props => props.width};
  max-width: ${props => props.max};
  min-width: ${props => props.min};
  height: inherit;
  resize: horizontal;
  cursor: ew-resize;
  cursor: col-resize;
  opacity: 0;
  overflow: scroll;
  :hover ~ ${ResizeLine} {
    border-left: 2px solid var(--primary-d1);
  }
  :active ~ ${ResizeLine} {
    border-left: 2px solid var(--primary-d1);
  }
  ::-webkit-scrollbar {
    width: 200px;
    height: inherit;
  }
`

export const ResizeWrap = styled.div`
  margin-left: -30px;
  position: absolute;
  top: 0;
  right: 5px;
  bottom: 0;
  left: 0;
  padding-left: 30px;
  overflow-x: hidden;
`
