import { Button } from 'antd'
import React, { useState } from 'react'

const AsyncButton = ({ onClick, ...rest }: any) => {
  const [isLoading, setIsLoading] = useState(false)
  const onClickLocal = async () => {
    if (onClick) {
      setIsLoading(true)

      await onClick()

      setIsLoading(false)
    }
  }
  return <Button {...rest} loading={isLoading} onClick={onClickLocal} />
}

export { AsyncButton }
