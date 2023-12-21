import styled from '@emotion/styled'

export const Wrap = styled.div<{ selected?: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  min-width: 20px;
  min-height: 20px;
  transform: scale(1);
  transform-origin: top left;
  pointer-events: none;
`

export const Image = styled.div<{ url?: string }>`
  width: 100%;
  height: 100%;
  background: url(${props => props.url}) center / 100%;
  opacity: 0.4;
`

export type ResizeHandlePlace =
  | 'left-top'
  | 'left-bottom'
  | 'right-top'
  | 'right-bottom'

export const ResizeHandle = styled.div<{
  place: ResizeHandlePlace
}>`
  border-radius: 100%;
  position: absolute;
  width: 10px;
  height: 10px;
  user-select: none;
  border: 1px solid #fff;
  background: lightblue;
  pointer-events: all;
  ${props => props.place.split('-').shift()}: -4px;
  ${props => props.place.split('-').pop()}: -4px;
  cursor: ${props =>
    props.place === 'left-bottom' || props.place === 'right-top'
      ? 'sw'
      : 'se'}-resize;
`
