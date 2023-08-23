import React, {
  useRef,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react'
import { Form, Popover, Input, Radio, Space, InputNumber } from 'antd'
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
  UpdateTask,
} from '../style'
import classNames from 'classnames'
import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
dayjs.extend(isoWeek)
import CommonButton from '@/components/CommonButton'
import usePanelData from '../hooks/usePanelData'
import CommonIconFont from '@/components/CommonIconFont'
interface IProps {
  ref: any
  onClick: any
}
const weekdayString: any = {
  1: '周一',
  2: '周二',
  3: '周三',
  4: '周四',
  5: '周五',
  6: '周六',
  7: '周日',
}
const WorkHoursPanel = (props: any, ref: any) => {
  const tdRef = useRef<any>()
  const [value, setValue] = useState(1)
  const popoverRef = useRef<any>()
  const { dataSource, onClick, direction } = props
  console.log(props)
  const { columns, map, reduceMonth } = usePanelData(
    dataSource[0]?.work_times,
    dataSource,
  )
  const date = dayjs('2023-08-22')
  const weekday = date.isoWeekday()
  console.log('weekday---', weekday, weekdayString[weekday])

  if (!columns) {
    return null
  }
  const rows = map.get(columns[0])
  const monthData = reduceMonth(columns)
  const label = ({ time }: any) => {
    if (time === -2) {
      return '未上报'
    }
    if (time === -1) {
      return '请假'
    }
    return time
  }
  const Content = () => {
    return (
      <UpdateTask>
        <div className="title">修改任务记录</div>
        <div className="form-box">
          <Radio.Group
            onChange={e => {
              setValue(e.target.value)
            }}
            value={value}
          >
            <Space direction="vertical">
              <Radio value={1}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ marginBottom: '8px' }}>调整工时</span>
                  <InputNumber
                    size="middle"
                    placeholder="请输入"
                    style={{ width: 160 }}
                  ></InputNumber>
                </div>
              </Radio>
              <Radio value={2}>请假</Radio>
              <Radio value={3}>未上报</Radio>
            </Space>
          </Radio.Group>
        </div>
        <div className="btn-box">
          <CommonButton type="light" size="small">
            取消
          </CommonButton>
          <CommonButton
            type="primary"
            size="small"
            onClick={() => {
              popoverRef?.current?.props.onPopupVisibleChange(false)
            }}
          >
            确认
          </CommonButton>
        </div>
      </UpdateTask>
    )
  }

  return (
    <PanelWrap>
      <div className="openIconBox">
        <CommonIconFont
          type={direction ? 'indent' : 'outdent'}
          size={20}
          onClick={() => {
            onClick()
          }}
          color="var(--neutral-n3)"
        />
      </div>
      <Header>
        <DateLabel>
          {columns.map((item, idx) => {
            const isLastDay = dayjs(item).endOf('month').format('YYYY-MM-DD')
            const isFirstDay = dayjs(item).startOf('month').format('YYYY-MM-DD')
            const width =
              tdRef.current?.getBoundingClientRect().width * (idx + 1)
            return isLastDay === item || isFirstDay === item ? (
              <div
                className={classNames('month-td', {
                  [lastDay]: isLastDay === item,
                })}
                style={{ width }}
              >
                {Object.values(monthData).map((ele: any) => {
                  if (ele.includes(item)) {
                    return (
                      <div key={ele}>{`${ele[0]}至${ele[ele.length - 1]}`}</div>
                    )
                  }
                })}
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
                  <Popover
                    title=""
                    content={Content}
                    trigger="click"
                    ref={popoverRef}
                  >
                    <WorkHourLabel
                      className={classNames({
                        [Working]: col.time !== 1 && col.time !== -2,
                        [Leave]: col.time === -1,
                        [NotWorking]: col.time === -2,
                      })}
                    >
                      {label(col)}
                    </WorkHourLabel>
                  </Popover>
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
