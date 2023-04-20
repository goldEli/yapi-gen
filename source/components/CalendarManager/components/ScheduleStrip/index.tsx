import React, { useState, useMemo } from 'react'
import styled from '@emotion/styled'
import { Dot, Time, Title } from './styled'
import useAllDay from '../../hooks/useAllDay'
import { useTranslation } from 'react-i18next'
import { getColor, getColorWithOpacityPointOne } from '../../utils'
import { css } from '@emotion/css'
import classNames from 'classnames'

interface ScheduleStripProps {
  onDotMouseDown: React.MouseEventHandler<HTMLDivElement>
  onMouseDown: React.MouseEventHandler<HTMLDivElement>
  visible: boolean
  data: Model.Schedule.Info
}

type ScheduleStripHandle = null

const ScheduleStripBox = styled.div<{
  bg?: string
  hoverBg: string
  hoverText: string
  visible: boolean
}>`
  height: 22px;
  background: ${props => props.bg};
  .text {
  }
  &:hover {
    background: ${props => props.hoverBg};
  }
  &:hover .text {
    color: ${props => props.hoverText};
  }
  display: flex;
  visibility: ${props => (props.visible ? 'visible' : 'hidden')};
  gap: 7px;
  cursor: pointer;
  align-items: center;
`

export const marginLeft = css`
  margin-left: 2px;
`

export const marginRight = css`
  margin-right: 2px;
`

const ScheduleStrip: React.ForwardRefRenderFunction<
  ScheduleStripHandle,
  ScheduleStripProps
> = (props, forwardedRef) => {
  const { data } = props
  const { isAllDay, isAcrossDayFirstDay, isAcrossDayButNotFirstDay } =
    useAllDay({ data })
  const [t] = useTranslation()

  // 如果是跨天或者全天任务显示全天
  const time = React.useMemo(() => {
    return isAllDay ? t('calendarManager.allDay') : data.start_time
  }, [isAllDay, data.start_time])

  // 是否展示内容
  // 如果跨天且不是第一天 不展示
  const contentVisible = useMemo(() => {
    return !isAcrossDayButNotFirstDay
  }, [isAcrossDayButNotFirstDay])

  // 内容
  const contentElements = React.useMemo(() => {
    if (!contentVisible) {
      return false
    }
    return (
      <>
        <Dot onMouseDown={props.onDotMouseDown} bg={getColor(data.color)} />
        <Time className="text">{time}</Time>
        <Title className="text">{data.subject}</Title>
      </>
    )
  }, [contentVisible, time, data])

  const bg = useMemo(() => {
    // 日程背景色
    // 非跨天日程 没有背景色
    return isAllDay ? getColorWithOpacityPointOne(data.color) : ''
  }, [isAllDay, data])

  // hover 日程背景色
  const hoverBg = getColorWithOpacityPointOne(data.color)

  // hover 文字颜色
  const hoverText = getColor(data.color)

  // 为了保证跨天日程能够连接起来
  // 跨天非第一没有边距
  // 跨天第一只有左边距
  const classnames = classNames({
    [marginLeft]: !isAcrossDayButNotFirstDay,
    [marginRight]: !(isAcrossDayButNotFirstDay || isAcrossDayFirstDay),
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
    </ScheduleStripBox>
  )
}

export default React.forwardRef(ScheduleStrip)
