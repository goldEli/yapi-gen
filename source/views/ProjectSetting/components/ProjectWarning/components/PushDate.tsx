import React from 'react'
import SubTitle from './SubTitle'
import { Checkbox, TimePicker } from 'antd'
import styled from '@emotion/styled'
import { useDispatch, useSelector } from '@store/index'
import { setProjectWarning } from '@store/project'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
const PushDateBox = styled.div`
  .cus {
    .ant-picker-time-panel-column
      > li.ant-picker-time-panel-cell-selected
      .ant-picker-time-panel-cell-inner {
      background: var(--hover-d3);
    }
  }
`
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

  .ant-picker-time-panel-column
    > li.ant-picker-time-panel-cell-selected
    .ant-picker-time-panel-cell-inner {
    background: var(--hover-d3);
    color: var(--primary-d1);
  }
  .ant-picker-time-panel-column
    > li.ant-picker-time-panel-cell
    .ant-picker-time-panel-cell-inner:hover {
    background: var(--hover-d3);
  }
  .ant-checkbox-group-item {
    margin-right: 16px;
  }
`
const PushDate = () => {
  const [t] = useTranslation()
  const options = [
    { label: t('onMonday'), value: 0 },
    { label: t('tuesday'), value: 1 },
    { label: t('wednesday'), value: 2 },
    { label: t('thursday'), value: 3 },
    { label: t('friday'), value: 4 },
    { label: t('saturday'), value: 5 },
    { label: t('sunday'), value: 6 },
    { label: t('whetherToSkipChineseHolidays'), value: -1 },
  ]
  const dispatch = useDispatch()
  const { projectWarning } = useSelector(store => store.project)
  const { push_date } = projectWarning ?? {}

  return (
    <PushDateBox>
      <SubTitle title={t('pushNotification')}></SubTitle>
      <PushDateContent>
        <PushDateContentDate>
          <label className="label-text">{t('cycle')}</label>
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
          <label className="label-text">{t('time')}</label>
          <TimePicker.RangePicker
            format="HH:mm"
            allowClear
            getPopupContainer={node => node}
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
