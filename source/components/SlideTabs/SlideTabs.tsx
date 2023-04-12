import React, { useRef, useState } from 'react'
import style from './SlideTabs.module.css'

const SlideTabs = () => {
  const timer = useRef<NodeJS.Timeout>()
  const smb = useRef<HTMLDivElement>(null)
  const [arr, setArr] = useState(Array.from({ length: 400 }))
  const [active, setActive] = useState(0)
  console.log(active)

  const changeLeft = (child: any) => {
    console.log(child)

    const { offsetLeft } = child,
      { parentElement } = child,
      { left } = parentElement.getBoundingClientRect(),
      scrollX = parentElement.scrollLeft,
      clientX = parentElement.clientWidth,
      childClientX = child.clientWidth,
      speed = offsetLeft - left - scrollX + childClientX / 2 - clientX / 2,
      s = speed / 30,
      totalX = speed + scrollX
    if (timer.current) {
      clearInterval(timer.current)
    }
    timer.current = setInterval(() => {
      parentElement.scrollLeft += s
      if (
        parentElement.scrollLeft <= 0 ||
        parentElement.scrollLeft >= parentElement.scrollWidth - clientX ||
        (speed > 0 && parentElement.scrollLeft > totalX) ||
        (speed < 0 && parentElement.scrollLeft < totalX)
      ) {
        clearInterval(timer.current)
      }
    }, 10)
  }
  const onHandler = () => {
    const group: any = smb.current
    if (!group) {
      return
    }

    changeLeft(group?.children[active])
  }
  const change = (index: any, e: any) => {
    setActive(index)

    const { target } = e
    changeLeft(target)
  }
  const right = () => {
    if (active >= arr.length - 1) {
      setActive(arr.length - 1)
    } else {
      setActive(e => e + 1)
    }
    onHandler()
  }

  const left = () => {
    if (active <= 0) {
      setActive(0)
    } else {
      setActive(e => e - 1)
    }
    onHandler()
  }
  return (
    <div className={style.box}>
      <span onClick={left} className={`${style.le} ${style.spanx}`}>
        左
      </span>
      <div ref={smb} className={style.box_sm}>
        {arr.map((i: any, index: number) => (
          <span
            onClick={e => change(index, e)}
            className={`${style.spanx} 
              ${active === index ? style.ac : ''}`}
            key={index}
          >
            {index}
          </span>
        ))}
      </div>
      <span onClick={right} className={`${style.ri} ${style.spanx}`}>
        右
      </span>
    </div>
  )
}

export default SlideTabs
