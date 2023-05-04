import React, { useMemo } from 'react'
import { ResizeLeftBar, ScheduleStripBox } from './styled'
import useAllDay from '../../hooks/useAllDay'
import { getColor, getColorWithOpacityPointOne } from '../../utils'
import { css } from '@emotion/css'
import classNames from 'classnames'
import ScheduleStripContent from './ScheduleStripContent'
import { useSelector } from '@store/index'

interface ScheduleStripProps {
  onDotMouseDown: React.MouseEventHandler<HTMLDivElement>
  onMouseDown: React.MouseEventHandler<HTMLDivElement>
  visible: boolean
  data: Model.Schedule.Info
}

type ScheduleStripHandle = null

export const marginLeft = css`
  margin-left: 2px;
`

export const marginRight = css`
  margin-right: 2px;
`

export const borderRadiusLeft = css`
  border-bottom-left-radius: 6px;
  border-top-left-radius: 6px;
`
export const borderRadiusRight = css`
  border-bottom-right-radius: 6px;
  border-top-right-radius: 6px;
`

const ScheduleStrip: React.ForwardRefRenderFunction<
  ScheduleStripHandle,
  ScheduleStripProps
> = (props, forwardedRef) => {
  const { data } = props
  const {
    isAllDay,
    isAcrossDayButNotFirstDay,
    isAcrossDay,
    isAcrossDayAndLastDay,
  } = useAllDay({ data })
  const { calendarPanelType } = useSelector(store => store.calendarPanel)
  const { selectedMonth, selectedWeek } = useSelector(store => store.calendar)

  /**
   * 是否展示内容
   * 如果跨天且不是第一天 不展示, but 月视图面板第一天 要展示 周视图面板第一天要展示
   */
  const contentVisible = useMemo(() => {
    if (isAcrossDayButNotFirstDay && calendarPanelType === 'month') {
      const firstDay = selectedMonth?.[0]
      return firstDay?.date === data.date
    }
    if (isAcrossDayButNotFirstDay && calendarPanelType === 'week') {
      const firstDay = selectedWeek?.[0]
      return firstDay?.date === data.date
    }
    return !isAcrossDayButNotFirstDay
  }, [isAcrossDayButNotFirstDay, data, selectedMonth, selectedWeek])

  // 内容
  const contentElements = React.useMemo(() => {
    if (!contentVisible) {
      return false
    }
    return <ScheduleStripContent data={data} />
  }, [contentVisible, data])

  const bg = useMemo(() => {
    // 日程背景色
    // 非跨天日程 没有背景色
    return isAllDay ? getColorWithOpacityPointOne(data.color) : ''
  }, [isAllDay, data])

  // hover 日程背景色
  const hoverBg = useMemo(() => {
    return getColorWithOpacityPointOne(data.color)
  }, [data.color])

  // hover 文字颜色
  const hoverText = useMemo(() => {
    return getColor(data.color)
  }, [data.color])

  /**
   * 默认左右右边距且有圆角
   * 跨天日程需要视觉上需要连接起来
   * 1. 跨天第一天没有左边距
   * 2. 跨天最后一天有右边距
   */
  // 为了保证跨天日程能够连接起来
  // 跨天非第一没有边距
  // 跨天第一只有左边距
  const classnames = classNames({
    [marginLeft]: !isAcrossDayButNotFirstDay,
    [borderRadiusLeft]: !isAcrossDayButNotFirstDay,
    [marginRight]: !isAcrossDay || isAcrossDayAndLastDay,
    [borderRadiusRight]: !isAcrossDay || isAcrossDayAndLastDay,
  })

  return (
    <ScheduleStripBox
      id={props.data.id ? String(props.data.id) : ''}
      hoverBg={hoverBg}
      className={classnames}
      bg={bg}
      hoverText={hoverText}
      visible={props.visible}
      onMouseDown={props.onMouseDown}
      onClick={e => {
        e.stopPropagation()
      }}
    >
      {contentElements}
      <ResizeLeftBar visible={!isAcrossDayButNotFirstDay} />
      {/**
       * 跨天  只有最后一天才能展示
       * 非跨天可暂时
       */}
      {/* <ResizeRightBar
        visible={(isAcrossDay && isAcrossDayAndLastDay) || !isAcrossDay}
      /> */}
    </ScheduleStripBox>
  )
}

export default React.forwardRef(ScheduleStrip)
