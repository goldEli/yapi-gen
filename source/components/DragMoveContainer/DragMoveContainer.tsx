import React, { ReactNode } from 'react'
import { ResizeBar, ResizeLine, ResizeWrap } from './style'

interface PropsType {
  children: ReactNode
  height: string
  min: string
  max: string
  width: string
}

const DragMoveContainer = (props: PropsType) => {
  const { children, height } = props
  return (
    <div
      style={{
        position: 'relative',
        height,
      }}
    >
      <ResizeBar {...props} />
      <ResizeLine />
      <ResizeWrap>{children}</ResizeWrap>
    </div>
  )
}

export default DragMoveContainer
