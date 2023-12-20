import React, { CSSProperties } from 'react'
import styled from '@emotion/styled'
import { useImageViewerStore } from '.'

interface ImageProps {}

const ImageBox = styled.div`
  width: 80%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 66px;
`
const Img = styled.img`
  transform-origin: center top;
  &:hover {
    cursor: pointer;
  }
`

const Image: React.FC<ImageProps> = props => {
  const { scale } = useImageViewerStore()
  const style: CSSProperties = {
    transform: `scale(${scale})`,
    cursor: scale === 3 ? 'zoom-out' : 'zoom-in',
  }
  return (
    <ImageBox>
      <Img
        style={style}
        src="https://oa-1308485183.cos.ap-chengdu.myqcloud.com/oa-dev-img/1535814602086334466/1685932792250114048/2023-08-23/6106f0dd-5a9f-4830-b90c-320bec49f210.png"
      />
    </ImageBox>
  )
}

export default Image
