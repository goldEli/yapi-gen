/**
 * 拖放区域
 */
import {
  useState,
  type PropsWithChildren,
  type ReactElement,
  type DragEvent,
} from 'react'
import styles from './style.module.css'

type Props = PropsWithChildren<{
  className?: string
  hover?: ReactElement
  onDrop?(event: DragEvent): void
  disableFunc?(): boolean
}>

const DropArea = (props: Props) => {
  const { disableFunc = () => false } = props
  const [isHover, setIsHover] = useState(0)

  const onDragEnter = () => {
    if (disableFunc()) {
      setIsHover(0)
      return
    }
    setIsHover(number => number + 1)
  }
  const onDragLeave = () => {
    if (disableFunc()) {
      return
    }
    setIsHover(number => number - 1)
  }
  const onDragOver = (event: DragEvent) => {
    if (disableFunc()) {
      return
    }
    event.preventDefault()
  }

  const onDrop = (event: DragEvent) => {
    if (disableFunc()) {
      return
    }
    event.preventDefault()
    onDragLeave()
    props.onDrop?.(event)
  }
  return (
    <div
      className={[styles.drop_area, props.className].join(' ')}
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {props.children}
      {!!isHover && <div className={styles.drop_area_hover}>{props.hover}</div>}
    </div>
  )
}

export default DropArea
