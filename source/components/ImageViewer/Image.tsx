import React, { CSSProperties } from 'react'
import styled from '@emotion/styled'
import { useImageViewerStore } from './useImageViewerStore'

interface ImageProps {}

const ImageBox = styled.div`
  width: 100%;
  height: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
`
const Img = styled.img`
  transform-origin: center center;
  transition: 0.2s;
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
    <ImageBox>
      <Img style={style} src={params?.url} />
    </ImageBox>
  )
}

export default Image
