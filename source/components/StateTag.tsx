import React from 'react'
import { StatusWrap } from './StyleCommon'

const StateTag = (props: any) => {
  const { state, name } = props
  return (
    <StatusWrap
      onClick={props.onClick}
      isShow={props.isShow}
      state={props.state}
    >
      {name}
    </StatusWrap>
  )
}

export default StateTag
