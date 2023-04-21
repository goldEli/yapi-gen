import styled from '@emotion/styled'
import React, { useMemo, useState } from 'react'
import { Rnd } from 'react-rnd'
import { css } from '@emotion/css'

import { getColorWithOpacityPointOne } from '@/components/CalendarManager/utils'
import useColor from '../../hooks/useColor'

type ScheduleCardProps = {
  data: Model.Schedule.Info | null
  children?: React.ReactNode
  timeRange: {
    start_timestamp: string
    end_timestamp: string
  } | null
} & React.ComponentProps<typeof Rnd>

const Time = styled.span`
  font-size: 12px;
  line-height: 20px;
  /* color: var(--neutral-n4); */
`

const dragBoxClassName = css`
  /* width: calc(100% - 58px); */
  border-radius: 6px 6px 6px 6px;
  /* position: absolute;
  top: 0px;
  left: 58px; */
  font-size: 25;
  min-height: 22px;
  cursor: move;
  box-sizing: border-box;
  padding: 0 4px;
  position: relative;
  z-index: 2;
`
const Content = styled.div`
  width: 100%;
  display: flex;
  gap: 4;
  overflow: hidden;
`

const TimeRange = styled.span`
  font-size: 12px;
  color: var(--neutral-n1-d1);
  margin-right: 4px;
`
const Title = styled.span`
  font-size: 12px;
  color: var(--neutral-n1-d1);
  /* line-height: 20px; */
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  /* text-overflow: ellipsis;
  width: 100%;
  display: inline-block;
  height: 20px; */
`

const MoveCard: React.FC<ScheduleCardProps> = props => {
  const { data, timeRange } = props

  const { is_show_busy } = data || {}

  const { getColorClassName } = useColor()

  const content = useMemo(() => {
    if (is_show_busy) {
      return (
        <>
          <Time className={getColorClassName()}>{data?.start_time}&nbsp;</Time>
          <Title className={getColorClassName()}>{data?.is_busy_text}</Title>
        </>
      )
    }
    return (
      <>
        <TimeRange className={getColorClassName()}>
          {timeRange &&
            `${timeRange?.start_timestamp} - ${timeRange?.end_timestamp}`}
        </TimeRange>

        <Title className={getColorClassName()}>{data?.subject}</Title>
      </>
    )
  }, [is_show_busy, timeRange, data?.subject, data?.start_time])
  const children = props.children || <Content>{content}</Content>
  const { enableResizing, ...otherProps } = props ?? {}

  return (
    <Rnd
      onClick={(e: any) => {
        e.stopPropagation()
      }}
      style={{
        background: getColorWithOpacityPointOne(data?.color ?? 0),
      }}
      className={dragBoxClassName}
      disableDragging={is_show_busy}
      enableResizing={is_show_busy ? false : enableResizing}
      {...otherProps}
    >
      {children}
    </Rnd>
  )
}

export default MoveCard
