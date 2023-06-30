import { getMessage } from '@/components/Message'
import { css } from '@emotion/css'
import { DatePicker, Radio, Space, Switch } from 'antd'
import moment from 'moment'

import { useEffect, useState } from 'react'

const { RangePicker } = DatePicker

const customBox = css`
  .switch {
    display: flex;
    align-items: center;
    font-size: 12px;
    font-family: SiYuanRegular;
    font-weight: 400;
    color: var(--neutral-n2);
    margin-bottom: 8px;
    .title {
      margin-right: 8px;
    }
  }
  .radio {
    margin-bottom: 8px;
  }
  .date {
    display: flex;
    align-items: center;
    .line {
      font-size: 14px;
      font-family: SiYuanRegular;
      font-weight: 400;
      color: var(--neutral-n1-d1);
      margin: 0px 16px;
    }
  }
`

const ChooseDate = (props: any) => {
  const { onChange, value, initNumber } = props
  const [params, setParams] = useState<any>({})
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)

  const getDay = (type: number, include: boolean) => {
    // 根据几周来计算结束日期
    switch (type) {
      case 1:
        if (include) {
          return moment(tomorrow).add(6, 'day')
        }
        if (moment(tomorrow).day() === 0) {
          // 星期天
          return moment(tomorrow).add(5, 'day')
        }
        if (moment(tomorrow).day() === 1) {
          // 星期一
          return moment(tomorrow).add(4, 'day')
        }
        return moment(tomorrow).add(6, 'day')
      case 2:
        if (include) {
          return moment(tomorrow).add(13, 'day')
        }
        if (moment(tomorrow).day() === 0) {
          return moment(tomorrow).add(12, 'day')
        }
        if (moment(tomorrow).day() === 1) {
          // 星期一
          return moment(tomorrow).add(11, 'day')
        }
        return moment(tomorrow).add(13, 'day')
      case 3:
        if (include) {
          return moment(tomorrow).add(20, 'day')
        }
        if (moment(tomorrow).day() === 0) {
          return moment(tomorrow).add(19, 'day')
        }
        if (moment(tomorrow).day() === 1) {
          // 星期一
          return moment(tomorrow).add(18, 'day')
        }
        return moment(tomorrow).add(20, 'day')
      case 4:
        if (include) {
          return moment(tomorrow).add(27, 'day')
        }
        if (moment(tomorrow).day() === 0) {
          return moment(tomorrow).add(26, 'day')
        }
        if (moment(tomorrow).day() === 1) {
          // 星期一
          return moment(tomorrow).add(25, 'day')
        }
        return moment(tomorrow).add(27, 'day')
      default:
        return null
    }
  }

  useEffect(() => {
    if (value) {
      const temp = {
        ...value,
        date: value.date ? value.date : null,
      }
      setParams(temp)
      if (initNumber.current === 0) {
        onChange(temp)
        initNumber.current++
      }
    } else {
      setParams({})
    }
  }, [value])
  return (
    <div className={customBox}>
      <div className="switch">
        <span className="title">是否包含周六周日</span>
        <Switch
          size="small"
          checked={params.include}
          onChange={(checked: boolean) => {
            setParams({
              ...params,
              include: checked,
              [params?.radio ? 'date' : '']: [
                moment(tomorrow),
                getDay(params?.radio, checked),
              ],
            })
          }}
        />
      </div>
      <div className="radio">
        <Radio.Group
          onChange={(e: any) => {
            if (e.target.value === 0) {
              setParams({
                ...params,
                radio: e.target.value,
              })
              onChange({
                ...params,
                radio: e.target.value,
              })
            } else {
              setParams({
                ...params,
                radio: e.target.value,
                date: [
                  moment(tomorrow),
                  getDay(e.target.value, params.include),
                ],
              })
              onChange({
                ...params,
                radio: e.target.value,
                date: [
                  moment(tomorrow),
                  getDay(e.target.value, params.include),
                ],
              })
            }
          }}
          value={params.radio}
        >
          <Space size="middle">
            <Radio value={1}>一周</Radio>
            <Radio value={2}>二周</Radio>
            <Radio value={3}>三周</Radio>
            <Radio value={4}>四周</Radio>
            <Radio value={0}>自定义</Radio>
          </Space>
        </Radio.Group>
      </div>
      <div className="date">
        <RangePicker
          value={params.date}
          onChange={date => {
            setParams({
              ...params,
              date,
              radio: 0,
            })
            onChange({
              ...params,
              date,
              radio: 0,
            })
          }}
        />
      </div>
    </div>
  )
}

export default ChooseDate
