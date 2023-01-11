import React from 'react'
import { AsyncButton } from '@staryuntech/ant-pro'
import _ from 'lodash'

const ThrottleButton = (props: any) => {
  return (
    <AsyncButton onClick={_.throttle(() => props.thClick(), 2000)}>
      {props.children}
    </AsyncButton>
  )
}

export default ThrottleButton
