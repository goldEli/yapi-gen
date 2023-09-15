import React from 'react'
import { Header } from './style'

export default function header(props: any) {
  return (
    <Header>
      <img src="../../../public/videoImage/header-bg.jpg" alt="" />
      <span>更新时间：{props.time}</span>
    </Header>
  )
}
