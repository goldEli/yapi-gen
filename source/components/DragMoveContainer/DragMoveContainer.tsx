import React, { ReactNode } from 'react'
import { ResizeBar, ResizeLine, ResizeWrap } from './style'

interface PropsType {
  children: ReactNode
}

const DragMoveContainer = (props: PropsType) => {
  return (
    <div
      style={{
        position: 'relative',
        height: 'calc(100vh - 150px)',
      }}
    >
      <ResizeBar />
      <ResizeLine />
      <ResizeWrap>{props.children}</ResizeWrap>
    </div>
  )
}

export default DragMoveContainer
