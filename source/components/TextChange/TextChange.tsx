/* eslint-disable react/jsx-handler-names */
import React, { useEffect, useRef } from 'react'
import CommonIconFont from '../CommonIconFont'
import { message } from 'antd'

export const TextChange = (props: any) => {
  const e1 = useRef<HTMLDivElement>(null)
  const e2 = useRef<HTMLDivElement>(null)
  const e3 = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    function checkTextOverflow() {
      if (e3.current!.offsetWidth > e1.current!.offsetWidth) {
        e2.current!.classList.add('marquee')
      } else {
        e2.current!.classList.remove('text-container_for_loop')
      }
    }

    // 监听窗口大小变化事件，重新检查文字长度是否超过容器宽度
    window.addEventListener('resize', checkTextOverflow)

    // 初始化时检查文字长度是否超过容器宽度
    checkTextOverflow()
  }, [])

  return (
    <div
      style={{
        position: 'relative',
        padding: '0px 45px 0px 24px',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: '-3px',
        }}
      >
        <CommonIconFont color="var(--function-warning)" size={18} type="bell" />
      </div>
      <div
        style={{
          position: 'absolute',
          right: '-5px',
          top: '0px',
        }}
      >
        <CommonIconFont
          size={18}
          // eslint-disable-next-line react/jsx-handler-names

          type="close-solid"
        />
      </div>
      <div
        ref={e1}
        style={{
          maxWidth: '640px',
          overflow: 'hidden',
        }}
      >
        <div className="text-container_for_loop" ref={e2}>
          <span
            ref={e3}
            style={{
              height: '22px',
              fontSize: '14px',

              color: 'var(--neutral-n2)',
              lineHeight: '22px',
            }}
          >
            {props.text}
          </span>
        </div>
      </div>
    </div>
  )
}
