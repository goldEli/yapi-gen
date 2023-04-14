import React from 'react'
import { getStyleValue } from '../../utils'

const useModalPosition = (props: {
  schedule_id: number
  x: number
  y: number
  visible: boolean
  containerClassName: string
  modalInfo: {
    width: number
    height: number
  }
}) => {
  const [position, setPosition] = React.useState<{ x: number; y: number }>()

  React.useEffect(() => {
    if (!props.visible) {
      setPosition(void 0)
      return
    }
    if (!props.containerClassName) {
      setPosition({
        x: props.x,
        y: props.y,
      })

      return
    }
    const domContainer = document.querySelector(props.containerClassName)
    if (!domContainer) {
      return
    }
    // 浏览器可视宽高
    const totalWidth = window.innerWidth || document.documentElement.clientWidth
    const totalHeight =
      window.innerHeight || document.documentElement.clientHeight
    const { x, y } = domContainer.getBoundingClientRect()
    if (props.modalInfo) {
      // 获取元素的宽度
      const width = props?.modalInfo?.width
      const height = props?.modalInfo?.height

      // 如果元素超出右边浏览器区域，left 向左移动自身宽度
      // 如果元素超出下边浏览器区域，top 向上移动自身高度
      const delta = {
        x: x + props.x + width - totalWidth,
        y: y + props.y + height - totalHeight,
        // y: 0,
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
  }, [props.visible, props.schedule_id])

  return { position }
}

export default useModalPosition
