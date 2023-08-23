import React, {
  useRef,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react'
import { Form, Popover, Input, Radio, Space, InputNumber } from 'antd'
import { updateWorkTime } from '@/services/project'
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
  const [dayTaskTime, setDayTaskTime] = useState<any>(0)
  const popoverRef = useRef<any>()
  const { dataSource, onClick, direction, type, onConfirm } = props
  const [record, setRecord] = useState<any>()
  const { columns, map, reduceMonth } = usePanelData(
    dataSource[0]?.work_times,
    dataSource,
  )
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
    return `${time / 3600}工时`
  }
  const confirm = async () => {
    const params = {
      ...record,
      day_task_time: parseInt(dayTaskTime, 10) * 3600,
      status: value,
    }
    delete params.time
    if (value !== 2) {
      delete params.day_task_time
    }
    console.log('params', params)
    const data = await updateWorkTime(params)
    popoverRef?.current?.props.onPopupVisibleChange(false)
    onConfirm()
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
              <Radio value={2}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ marginBottom: '8px' }}>调整工时</span>
                  <InputNumber
                    size="middle"
                    placeholder="请输入"
                    style={{ width: 160 }}
                    value={dayTaskTime}
                    onChange={e => {
                      console.log(e)
                      setDayTaskTime(e)
                    }}
                  ></InputNumber>
                </div>
              </Radio>
              <Radio value={3}>请假</Radio>
              <Radio value={1}>未上报</Radio>
            </Space>
          </Radio.Group>
        </div>
        <div className="btn-box">
          <CommonButton
            type="light"
            size="small"
            onClick={() => {
              popoverRef?.current?.props.onPopupVisibleChange(false)
            }}
          >
            取消
          </CommonButton>
          <CommonButton type="primary" size="small" onClick={confirm}>
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
          {/* {columns.map((item, idx) => {
            const isLastDay = dayjs(item).endOf('month').format('YYYY-MM-DD')
            const isFirstDay = dayjs(item).startOf('month').format('YYYY-MM-DD')
            const width =
              tdRef.current?.getBoundingClientRect().width * (idx + 1)
            console.log('item------', item, isLastDay, Object.keys(monthData))
            return Object.keys(monthData).map(item => {
              return (
                <div
                  key={item}
                  className={classNames('month-td', {
                    [lastDay]: isLastDay === item,
                  })}
                  style={{ width }}
                >
                  {Object.values(monthData).map((ele: any) => {
                    console.log('ele', ele)
                    if (ele.includes(item)) {
                      return (
                        <div key={ele}>{`${ele[0]}至${
                          ele[ele.length - 1]
                        }`}</div>
                      )
                    }
                  })}
                </div>
              )
            })
            return isLastDay === item || isFirstDay === item ? (
              <div
                className={classNames('month-td', {
                  [lastDay]: isLastDay === item,
                })}
                style={{ width }}
              >
                {Object.values(monthData).map((ele: any) => {
                  console.log('ele', ele)
                  if (ele.includes(item)) {
                    return (
                      <div key={ele}>{`${ele[0]}至${ele[ele.length - 1]}`}</div>
                    )
                  }
                })}
              </div>
            ) : null
          })} */}
          {Object.keys(monthData).map(item => {
            const isLastDay = dayjs(item).endOf('month').format('YYYY-MM-DD')
            const isFirstDay = dayjs(item).startOf('month').format('YYYY-MM-DD')
            const data = monthData[item]
            const index = data.length - 1
            const width = type
              ? tdRef.current?.getBoundingClientRect().width * (index + 1)
              : '100%'
            return (
              <div
                key={item}
                className={classNames('month-td', {
                  [lastDay]: isLastDay === item,
                })}
                style={{ width }}
              >
                {Object.values(monthData).map((ele: any) => {
                  if (ele.includes(isLastDay) || ele.includes(isFirstDay)) {
                    return (
                      <div key={ele}>{`${ele[0]}至${ele[ele.length - 1]}`}</div>
                    )
                  }
                  return (
                    <div key={ele}>
                      {type === 0
                        ? String(ele[0])
                        : `${ele[0]}至${ele[ele.length - 1]}`}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </DateLabel>
      </Header>
      <Header>
        <TimeLabel>
          {columns.map((item, idx) => {
            const date = dayjs(item)
            const weekday = date.isoWeekday()
            return (
              <div key={idx} className="header-td">
                {type === 1 || type === 0
                  ? weekdayString[weekday]
                  : dayjs(item).format('DD')}
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
                      onClick={() => {
                        // time -1请假 -2 未上报
                        let value = 2
                        const { time } = col
                        if (time === -1) {
                          value = 3
                        }
                        if (time === -2) {
                          value = 1
                        }
                        setValue(value)
                        setDayTaskTime(time > 0 ? time / 3600 : '')
                        setRecord({ ...row, date: item })
                      }}
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
