import React from 'react'
import { Header } from './style'

export default function header(props: any) {
  return (
    <Header>
      <img
        src="https://mj-system-1308485183.cos.accelerate.myqcloud.com/public/header-bg.jpg"
        alt=""
      />
      <span>更新时间：{props.time}</span>
    </Header>
  )
}
