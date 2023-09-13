import styled from '@emotion/styled'
import { Rnd } from 'react-rnd'

export const ControlScrollPlaneBox = styled.div`
  width: 124px;
  height: 64px;
  background: var(--neutral-white-d7);
  box-shadow: 0px 0px 15px 6px rgba(0, 0, 0, 0.12);
  border-radius: 6px 6px 6px 6px;
  opacity: 1;
  position: absolute;
  right: 16px;
  bottom: 16px;
  padding: 8px;
  box-sizing: border-box;
`

export const WindowArea = styled(Rnd)`
  border: 2px solid var(--primary-d1);
  box-sizing: border-box;
  position: absolute;
  cursor: pointer;
  &::after {
    width: 100%;
    height: 32px;
    content: '';
    top: -16px;
    left: 0px;
    position: absolute;
  }
`

export const Content = styled.div<{ gap: number }>`
  width: 100%;
  height: 100%;
  display: flex;
  gap: ${props => props.gap + 'px'};
  position: relative;
`

export const Strip = styled.div<{ width: number }>`
  width: ${props => props.width + 'px'};
  height: 100%;
  background-color: var(--neutral-n7);
`
