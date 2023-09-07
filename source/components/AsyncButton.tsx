import { Button, ButtonProps } from 'antd'
import React, { MouseEventHandler, useState } from 'react'

interface LoadingButtonProps extends Omit<ButtonProps, 'loading'> {
  duration?: number
  isUseDuration?: boolean
}
const AsyncButton = (props: LoadingButtonProps) => {
  const { onClick, isUseDuration, duration, ...rest } = props
  const [loading, setLoading] = useState(false)
  const onClickHandler: MouseEventHandler<HTMLElement> = async e => {
    if (onClick) {
      setLoading(true)
      if (isUseDuration) {
        onClick(e)
        setTimeout(() => {
          setLoading(false)
        }, Math.min(10000, duration || 1000))
      } else {
        try {
          await onClick(e)
        } finally {
          setLoading(false)
        }
      }
    }
  }
  return <Button {...rest} onClick={onClickHandler} loading={loading}></Button>
}

export { AsyncButton }
