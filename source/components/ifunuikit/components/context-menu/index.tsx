/**
 * 上下文菜单按钮
 */

import React, {
  type ReactNode,
  type PropsWithChildren,
  type MouseEvent,
  useEffect,
  useRef,
  useMemo,
  useState,
  useLayoutEffect,
} from 'react'
import { createPortal } from 'react-dom'
import styles from './style.module.css'

type Props = PropsWithChildren<{
  key?: string
  menu?: ReactNode | ((key?: string) => ReactNode)
}>

const ContextMenu = (props: Props) => {
  const [wrapElement, setWrapElement] = useState<HTMLDivElement>()
  const menuRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [eventPoint, setEventPoint] = useState<{ x: number; y: number }>()
  const [menuStyle, setMenuStyle] = useState<{
    left?: number
    right?: number
    bottom?: number
    top?: number
  }>()
  const hide = () => setTimeout(() => setVisible(false))

  useLayoutEffect(() => {
    if (!wrapElement) {
      const wrap = document.createElement('div')
      setWrapElement(document.body.appendChild(wrap))
    }
  }, [])

  useEffect(() => {
    if (visible) {
      window.addEventListener('mouseup', hide)
    }
    return () => window.removeEventListener('mouseup', hide)
  }, [visible])

  const menu = wrapElement
    ? createPortal(
        <div
          className={styles.menu}
          style={{ display: visible ? 'block' : 'none', ...menuStyle }}
          ref={menuRef}
        >
          {typeof props.menu === 'function'
            ? props.menu(props.key)
            : props.menu}
        </div>,
        wrapElement,
      )
    : null

  useLayoutEffect(() => {
    if (!eventPoint || !menuRef.current) {
      return
    }
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    const menuWidth = menuRef.current.offsetWidth
    const menuHeight = menuRef.current.offsetHeight
    const right = windowWidth - eventPoint.x > menuWidth
    const bottom = windowHeight - eventPoint.y > menuHeight

    if (right && bottom) {
      return
    }

    const style = {} as Record<string, number>

    if (right) {
      style.left = eventPoint.x
    } else {
      style.right = windowWidth - eventPoint.x
    }

    if (bottom) {
      style.top = eventPoint.y
    } else {
      style.top = windowHeight - eventPoint.y
    }

    setMenuStyle(style)
  }, [eventPoint])

  const onContextMenu = (event: MouseEvent<HTMLSpanElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setEventPoint({
      x: event.clientX,
      y: event.clientY,
    })
    setMenuStyle({ top: event.clientY, left: event.clientX })

    setTimeout(() => setTimeout(() => setVisible(true)))
  }

  return (
    <span className={styles.wrap} onContextMenu={onContextMenu}>
      {props.children}
      {menu}
    </span>
  )
}

export default ContextMenu
