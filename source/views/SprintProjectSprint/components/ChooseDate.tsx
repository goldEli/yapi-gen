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
    font-family: MiSans-Regular, MiSans;
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
      font-family: MiSans-Regular, MiSans;
      font-weight: 400;
      color: var(--neutral-n1-d1);
      margin: 0px 16px;
    }
  }
`

const ChooseDate = (props: any) => {
  const { onChange, value } = props
  const [params, setParams] = useState<any>({
    include: true,
    radio: 1,
    date: [],
  })

  const getDay = (type: number) => {
    // 根据几周来计算结束日期
    switch (type) {
      case 1:
        if (params.include) {
          return moment(new Date()).add(6, 'day')
        }
        if (moment(new Date()).day() === 0) {
          return moment(new Date()).add(4, 'day')
        }
        if (moment(new Date()).day() === 6) {
          return moment(new Date()).add(5, 'day')
        }
        return moment(new Date()).add(6, 'day')
      case 2:
        if (params.include) {
          return moment(new Date()).add(13, 'day')
        }
        if (moment(new Date()).day() === 0) {
          return moment(new Date()).add(11, 'day')
        }
        if (moment(new Date()).day() === 6) {
          return moment(new Date()).add(12, 'day')
        }
        return moment(new Date()).add(13, 'day')
      case 3:
        if (params.include) {
          return moment(new Date()).add(20, 'day')
        }
        if (moment(new Date()).day() === 0) {
          return moment(new Date()).add(18, 'day')
        }
        if (moment(new Date()).day() === 6) {
          return moment(new Date()).add(19, 'day')
        }
        return moment(new Date()).add(20, 'day')
      case 4:
        if (params.include) {
          return moment(new Date()).add(27, 'day')
        }
        if (moment(new Date()).day() === 0) {
          return moment(new Date()).add(25, 'day')
        }
        if (moment(new Date()).day() === 6) {
          return moment(new Date()).add(26, 'day')
        }
        return moment(new Date()).add(27, 'day')
      default:
        return null
    }
  }

  useEffect(() => {
    if (value) {
      setParams({
        ...value,
        date:
          value.radio === 5
            ? value.date
            : [moment(new Date()), getDay(value?.radio)],
      })
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
            })
            onChange({
              ...params,
              include: checked,
            })
          }}
        />
      </div>
      <div className="radio">
        <Radio.Group
          onChange={(e: any) => {
            if (e.target.value === 5) {
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
                date: [moment(new Date()), getDay(e.target.value)],
              })
              onChange({
                ...params,
                radio: e.target.value,
                date: [moment(new Date()), getDay(e.target.value)],
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
            <Radio value={5}>自定义</Radio>
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
              radio: 5,
            })
            onChange({
              ...params,
              date,
              radio: 5,
            })
          }}
        />
      </div>
    </div>
  )
}

export default ChooseDate