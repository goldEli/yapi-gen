import React from 'react'
import { Wrap, WrapFirst, WrapSecond } from './style'

const PromiseSelect = (props: any) => {
  return (
    <Wrap>
      <WrapFirst>{props.title}</WrapFirst>
      <WrapSecond>{props.dec}</WrapSecond>
    </Wrap>
  )
}

export default PromiseSelect
