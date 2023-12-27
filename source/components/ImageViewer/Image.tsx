import React, { CSSProperties, useEffect, useRef, useState } from 'react'
import styled from '@emotion/styled'
import { useImageViewerStore } from './useImageViewerStore'
import { Rnd } from 'react-rnd'
import { closeImageViewer } from '.'

interface ImageProps {}

const ImageBox = styled.div`
  position: relative;
`
const Img = styled.img`
  transform-origin: center center;
`

const Image: React.FC<ImageProps> = props => {
  const {
    scale,
    rotate,
    params,
    isDrag,
    open,
    setImageSize,
    imageSize,
    setIsDrag,
    setScale,
  } = useImageViewerStore()

  const imageRef = useRef<HTMLImageElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (open) {
      setVisible(false)
      const dom = imageRef.current as HTMLImageElement
      dom.onload = () => {
        const rect = dom.getBoundingClientRect()
        console.log(rect)
        setImageSize({
          w: rect.width,
          h: rect.height,
        })
        setTimeout(() => {
          // 当图片尺寸大于屏幕时自动缩放
          const { bHeight, bWidth } = getSize()
          let scale = 1
          while (
            bWidth - 100 < scale * rect.width ||
            bHeight - 100 < scale * rect.height
          ) {
            if (scale <= 0.1) {
              break
            }
            scale -= 0.1
          }
          console.log(scale)
          setScale(scale)
          setTimeout(() => {
            setVisible(true)
          })
        })
      }
    }
  }, [open])

  const getSize = () => {
    const bWidth =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth
    const bHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight
    return {
      bWidth,
      bHeight,
    }
  }

  /**
   * 当图片放大到一定程度才能拖动
   */
  useEffect(() => {
    if (!open || !imageSize) {
      return
    }

    const { bWidth, bHeight } = getSize()
    const { w, h } = imageSize
    if (w * scale > bWidth - 100) {
      setIsDrag(true)
      return
    }
    if (h * scale > bHeight - 100) {
      setIsDrag(true)
      return
    }
    setIsDrag(false)
  }, [open, scale, imageSize])

  const imageBoxStyle: CSSProperties = {
    width: imageSize?.w,
    height: imageSize?.h,
    flexShrink: 0,
  }

  const style: CSSProperties = {
    cursor: isDrag ? 'move' : 'zoom-out',
    transform: `scale(${scale}) rotate(${rotate}deg)`,
    transformOrigin: 'center center',
    visibility: visible ? 'visible' : 'hidden',
  }
  return (
    <ImageBox
      onClick={e => {
        closeImageViewer()
      }}
      onMouseDown={e => {
        e.stopPropagation()
      }}
      style={imageBoxStyle}
    >
      <Rnd
        style={{ flexShrink: 0, cursor: 'default' }}
        key={params?.url}
        disableDragging={!isDrag}
      >
        <Img
          onClick={e => {
            e.stopPropagation()
            if (!isDrag) {
              closeImageViewer()
            }
          }}
          ref={imageRef}
          style={style}
          draggable={false}
          src={params?.url}
        />
      </Rnd>
    </ImageBox>
  )
}

export default Image
