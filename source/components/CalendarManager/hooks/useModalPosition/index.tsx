import React from 'react'
import { getStyleValue } from '../../utils'

const useModalPosition = (props: {
  id: number
  x: number
  y: number
  visible: boolean
  containerClassName: string
  modalClassName: string
}) => {
  const [position, setPosition] = React.useState<{ x: number; y: number }>()
  React.useEffect(() => {
    const domModal = document.querySelector(props.modalClassName)
    const domContainer = document.querySelector(props.containerClassName)

    if (props.visible && domModal && domContainer) {
      // 获取元素的宽度
      const width = getStyleValue(domModal, 'width')
      const height = getStyleValue(domModal, 'height')
      // 浏览器可视宽高
      const totalWidth =
        window.innerWidth || document.documentElement.clientWidth
      const totalHeight =
        window.innerHeight || document.documentElement.clientHeight
      const { x, y } = domContainer.getBoundingClientRect()

      //   const beyondOnTheRight = x + props.x + width > totalWidth
      //   const beyondOnTheBottom = y + props.y + height > totalHeight

      // 如果元素超出右边浏览器区域，left 向左移动自身宽度
      // 如果元素超出下边浏览器区域，top 向上移动自身高度
      const delta = {
        x: x + props.x + width - totalWidth,
        y: y + props.y + height - totalHeight,
      }

      const offset = {
        x: delta.x > 0 ? delta.x + 16 : 0,
        y: delta.y > 0 ? delta.y + 16 : 0,
      }

      setPosition({
        x: props.x - offset.x,
        y: props.y - offset.y,
      })
    }
  }, [props.visible, props.id])

  return { position }
}

export default useModalPosition
