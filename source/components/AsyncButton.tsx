import { Button } from 'antd'
import React, { useState } from 'react'

const AsyncButton = ({ onClick, ...rest }: any) => {
  const [isLoading, setIsLoading] = useState(false)
  const onClickLocal = async () => {
    if (onClick) {
      setIsLoading(true)
      try {
        await onClick()
      } catch (error) {
        console.log(error)
      }
      setIsLoading(false)
    }
  }
  return <Button loading={isLoading} onClick={onClickLocal} {...rest} />
}

export { AsyncButton }
