import React from 'react'
import { StatusWrap } from './StyleCommon'

const StateTag = (props: any) => {
  const { state } = props

  return (
    <StatusWrap
      onClick={props.onClick}
      isShow={props.isShow}
      state={props.state}
    >
      {state === 1
        ? '待办'
        : state === 2
        ? '已完成'
        : state === 3
        ? '进行中'
        : ''}
    </StatusWrap>
  )
}

export default StateTag
