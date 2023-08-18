import React from 'react'
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
} from '../style'
import classNames from 'classnames'
interface IProps {}
const WorkHoursPanel: React.FC<IProps> = props => {
  const a = [
    {
      name: '李四',
      workhour: [
        { date: '28', time: '8小时' },
        { date: '29', time: '6小时' },
        { date: '30', time: -2 },
        { date: '31', time: -1 },
        { date: '1', time: '6小时' },
        { date: '2', time: -2 },
        { date: '3', time: -1 },
      ],
    },
    {
      name: '张三',
      workhour: [
        { date: '28', time: -1 },
        { date: '29', time: '12小时' },
        { date: '30', time: -1 },
        { date: '31', time: -2 },
        { date: '1', time: '6小时' },
        { date: '2', time: -2 },
        { date: '3', time: -1 },
      ],
    },
    {
      name: '王五',
      workhour: [
        { date: '28', time: -2 },
        { date: '29', time: -1 },
        { date: '30', time: '20小时' },
        { date: '31', time: '16小时' },
        { date: '1', time: '6小时' },
        { date: '2', time: -2 },
        { date: '3', time: -1 },
      ],
    },
  ]
  const init = (data: any[], array: any[]) => {
    const columns = data.map(item => item.date)
    const map = new Map()
    columns.forEach(item => {
      map.set(item, [])
    })
    array.forEach((ele: any) => {
      ele.workhour.forEach((item: any) => {
        if (map.has(item.date)) {
          let child = map.get(item.date)
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
  const { columns, map } = init(a[0].workhour, a)
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
    <PanelWrap>
      <Header>
        <DateLabel>2023-09-09</DateLabel>
        <TimeLabel>
          {columns.map((item, idx) => {
            return (
              <div key={idx} className="header-td">
                {item}
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
                <Cols key={index}>
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
export default WorkHoursPanel
