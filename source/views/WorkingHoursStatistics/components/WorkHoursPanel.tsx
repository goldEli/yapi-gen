import React, { useRef, useEffect, useState, forwardRef } from 'react'
import {
  PanelWrap,
  Rows,
  Cols,
  WorkHourLabel,
  Header,
  Working,
  Leave,
  NotWorking,
  DateLabel,
  TimeLabel,
  lastDay,
} from '../style'
import classNames from 'classnames'
import dayjs from 'dayjs'
interface IProps {
  ref: any
}
const WorkHoursPanel = (props: any, ref: any) => {
  const tdRef = useRef<any>()
  const dataSource = [
    {
      name: '李四',
      work_times: [
        { date: '2023-08-28', time: '8小时' },
        { date: '2023-08-29', time: '6小时' },
        { date: '2023-08-30', time: -2 },
        { date: '2023-08-31', time: -1 },
        { date: '2023-09-01', time: '6小时' },
        { date: '2023-09-30', time: -2 },
        { date: '2023-09-04', time: -1 },
      ],
    },
    {
      name: '张三',
      work_times: [
        { date: '2023-08-28', time: -1 },
        { date: '2023-08-29', time: '12小时' },
        { date: '2023-08-30', time: -1 },
        { date: '2023-08-31', time: -2 },
        { date: '2023-09-01', time: '6小时' },
        { date: '2023-09-30', time: -2 },
        { date: '2023-09-04', time: -1 },
      ],
    },
    {
      name: '王五',
      work_times: [
        { date: '2023-08-28', time: -2 },
        { date: '2023-08-29', time: -1 },
        { date: '2023-08-30', time: '20小时' },
        { date: '2023-08-31', time: '16小时' },
        { date: '2023-09-01', time: '6小时' },
        { date: '2023-09-30', time: -2 },
        { date: '2023-09-04', time: -1 },
      ],
    },
  ]
  const getPanelData = (data: any[], array: any[]) => {
    const columns = data.map(item => item.date)
    const map = new Map()
    columns.forEach(item => {
      map.set(item, [])
    })
    array.forEach((ele: any) => {
      ele.work_times.forEach((item: any) => {
        if (map.has(item.date)) {
          const child = map.get(item.date)
          child.push({ name: ele.name, hour: item.hour, time: item.time })
          map.set(item.date, child)
        }
      })
    })
    return {
      columns,
      map,
    }
  }
  const { columns, map } = getPanelData(dataSource[0].work_times, dataSource)
  const rows = map.get(columns[0])

  const label = ({ time }: any) => {
    if (time === -2) {
      return '未上报'
    }
    if (time === -1) {
      return '请假'
    }
    return time
  }
  return (
    <PanelWrap ref={ref}>
      <Header>
        <DateLabel>
          {columns.map((item, idx) => {
            const isLastDay = dayjs(item).endOf('month').format('YYYY-MM-DD')
            const width =
              tdRef.current?.getBoundingClientRect().width * (idx + 1)
            return isLastDay === item ? (
              <div
                className={classNames('month-td', {
                  [lastDay]: isLastDay === item,
                })}
                style={{ width }}
              >
                {item}
              </div>
            ) : null
          })}
        </DateLabel>
      </Header>
      <Header>
        <TimeLabel>
          {columns.map((item, idx) => {
            return (
              <div key={idx} className="header-td">
                {dayjs(item).format('DD')}
              </div>
            )
          })}
        </TimeLabel>
      </Header>
      {rows.map((row: any, rowIndex: any) => {
        return (
          <Rows key={rowIndex} className={rowIndex % 2 ? '' : 'highBackground'}>
            {columns.map((item: any, index: any) => {
              const col = map.get(item)[rowIndex]
              return (
                <Cols key={index} ref={tdRef}>
                  <WorkHourLabel
                    className={classNames({
                      [Working]: col.time !== 1 && col.time !== -2,
                      [Leave]: col.time === -1,
                      [NotWorking]: col.time === -2,
                    })}
                  >
                    {label(col)}
                  </WorkHourLabel>
                </Cols>
              )
            })}
          </Rows>
        )
      })}
    </PanelWrap>
  )
}
export default forwardRef(WorkHoursPanel)
