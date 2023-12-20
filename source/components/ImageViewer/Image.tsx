import React, { CSSProperties } from 'react'
import styled from '@emotion/styled'
import { useImageViewerStore } from './useImageViewerStore'
import Draggable from './Drag'
// import Draggable from 'react-draggable'
// import Drag from './Drag'

interface ImageProps {}

const ImageBox = styled.div``
const Img = styled.img`
  transform-origin: center center;
  /* transition: 0.2s; */
  &:hover {
    cursor: zoom-out;
  }
`

const Image: React.FC<ImageProps> = props => {
  const { scale, rotate, params } = useImageViewerStore()
  const style: CSSProperties = {
    transform: `scale(${scale}) rotate(${rotate}deg)`,
  }
  return (
    <ImageBox
      onClick={e => {
        e.stopPropagation()
      }}
    >
      <Draggable>
        <Img style={style} src={params?.url} />
      </Draggable>
    </ImageBox>
  )
}

export default Image
