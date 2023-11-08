import React from 'react'
import SubTitle from './SubTitle'
import { Checkbox, TimePicker } from 'antd'
import styled from '@emotion/styled'
import { useDispatch, useSelector } from '@store/index'
import { setProjectWarning } from '@store/project'
import moment from 'moment'
const PushDateBox = styled.div``
const PushDateContent = styled.div`
  border: 1px solid var(--neutral-n6-d1);
  height: 102px;
  border-radius: 6px;
  padding: 16px 24px;
  box-sizing: border-box;
`
export const PushDateContentDate = styled.div`
  margin-bottom: 20px;
  .label-text {
    color: var(--neutral-n3);
    font-size: var(--font14);
    margin-right: 48px;
  }
`
const PushDate = () => {
  const options = [
    { label: '周一', value: 0 },
    { label: '周二', value: 1 },
    { label: '周三', value: 2 },
    { label: '周四', value: 3 },
    { label: '周五', value: 4 },
    { label: '周六', value: 5 },
    { label: '周日', value: 6 },
    { label: '是否跳过中国节假日', value: -1 },
  ]
  const dispatch = useDispatch()
  const { projectWarning } = useSelector(store => store.project)
  const { push_date } = projectWarning ?? {}

  return (
    <PushDateBox>
      <SubTitle title="推送通知"></SubTitle>
      <PushDateContent>
        <PushDateContentDate>
          <label className="label-text">周期</label>
          <Checkbox.Group
            options={options}
            value={push_date?.day ?? []}
            onChange={value => {
              dispatch(
                setProjectWarning({
                  ...projectWarning,
                  push_date: {
                    ...push_date,
                    day: value,
                    is_holiday: value?.includes(-1) ? 1 : 2,
                  },
                }),
              )
            }}
          />
        </PushDateContentDate>
        <PushDateContentDate>
          <label className="label-text">时间</label>
          <TimePicker.RangePicker
            format="HH:mm"
            allowClear
            value={
              push_date?.time?.begin
                ? [
                    moment(push_date?.time?.begin, 'HH:mm'),
                    moment(push_date?.time?.end, 'HH:mm'),
                  ]
                : [null, null]
            }
            onChange={(e: any) => {
              if (!e) {
                dispatch(
                  setProjectWarning({
                    ...projectWarning,
                    push_date: {
                      ...push_date,
                      time: {
                        begin: '',
                        end: '',
                      },
                    },
                  }),
                )
                return
              }
              const [start_date, end_date] = e
              dispatch(
                setProjectWarning({
                  ...projectWarning,
                  push_date: {
                    ...push_date,
                    time: {
                      begin: moment(start_date).format('HH:mm'),
                      end: moment(end_date).format('HH:mm'),
                    },
                  },
                }),
              )
            }}
          />
        </PushDateContentDate>
      </PushDateContent>
    </PushDateBox>
  )
}
export default PushDate
