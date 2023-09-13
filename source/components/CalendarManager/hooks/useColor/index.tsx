import { useSelector } from '@store/index'
import React from 'react'
import { getColor, getColorWithOpacityPointOne } from '../../utils'
import { css } from '@emotion/css'

// 现代 经典两种主体  modern classic
const colorModern = css`
  color: var(--neutral-n1-d1);
`

const colorClassic = css`
  color: var(--neutral-white-d7);
`

const secondaryColorModern = css`
  color: var(--neutral-n1-d1);
`

const secondaryColorClassic = css`
  color: var(--neutral-white-d7);
`

const useColor = () => {
  const { calendarConfig } = useSelector(store => store.calendar)
  const schedule_color = React.useMemo(() => {
    return calendarConfig?.schedule_configs?.schedule_color ?? 1
  }, [calendarConfig])

  const getBgColor = (index: number) => {
    return getColorWithOpacityPointOne(index)
  }

  const getColorClassName = () => {
    return colorModern
  }
  const getSecondaryColorClassName = () => {
    return secondaryColorModern
  }

  // const getBgColor = (index: number) => {
  //   if (schedule_color === 1) {
  //     return getColorWithOpacityPointOne(index)
  //   }
  //   return getColor(index)
  // }

  // const getColorClassName = () => {
  //   if (schedule_color === 1) {
  //     return colorModern
  //   }
  //   return colorClassic
  // }
  // const getSecondaryColorClassName = () => {
  //   if (schedule_color === 1) {
  //     return secondaryColorModern
  //   }
  //   return secondaryColorClassic
  // }

  return {
    getBgColor,
    getColorClassName,
    getSecondaryColorClassName,
  }
}

export default useColor
