import React from 'react'
import { Header } from './style'

export default function header(props: any) {
  return (
    <Header>
      <img
        src="http://oa-1308485183.cos.ap-chengdu.myqcloud.com/system/system-test/2023-09-21header.svg/file/1695278840884/header.svg"
        alt=""
      />
      <span>更新时间：{props.time}</span>
    </Header>
  )
}
