/* eslint-disable max-statements-per-line */
// 节流按钮
import _ from 'lodash'
import { useRef, useCallback, useEffect } from 'react'

export function useThrottle(cb: any, delay: number) {
  const options = { leading: true, trailing: false }
  const cbRef = useRef(cb)

  useEffect(() => {
    cbRef.current = cb
  })

  return useCallback(
    _.throttle((...args) => cbRef.current(...args), delay, options),
    [delay],
  )
}
