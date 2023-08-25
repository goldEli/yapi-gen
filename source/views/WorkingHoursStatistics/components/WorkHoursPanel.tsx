import React, { useRef, useEffect, useState, forwardRef } from 'react'
import { Popover, Input, Radio, Space, InputNumber } from 'antd'
import { updateWorkTime } from '@/services/project'
import { useTranslation } from 'react-i18next'
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
import { getMessage } from '@/components/Message'
import { t } from 'i18next'
import { useSelector } from '@store/index'
interface IProps {
  ref: any
  onClick: any
}
const WorkHoursPanel = (props: any, ref: any) => {
  const [t] = useTranslation()
  const tdRef = useRef<any>()
  const timeRef = useRef<any>()
  const [value, setValue] = useState(1)
  const [dayTaskTime, setDayTaskTime] = useState<any>(0)
  const popoverRef = useRef<any>()
  const { dataSource, onClick, direction, type, onConfirm } = props
  const [storyId, setStoryId] = useState('')
  const [record, setRecord] = useState<any>()
  const language = window.localStorage.getItem('language')
  const [weekdayString, setWeekdayString] = useState<any>({})
  const [cacheValue, setCacheValue] = useState<number>()
  const { projectInfo } = useSelector(state => state.project)
  const { projectPermissions } = projectInfo
  const { columns, map, reduceMonth } = usePanelData(
    dataSource[0]?.work_times,
    dataSource,
  )

  useEffect(() => {
    setWeekdayString({
      1: t('onMonday'),
      2: t('tuesday'),
      3: t('wednesday'),
      4: t('thursday'),
      5: t('friday'),
      6: t('saturday'),
      7: t('sunday'),
    })
  }, [language])

  if (!columns) {
    return null
  }
  const rows = map.get(columns[0])
  const monthData = reduceMonth(columns)
  const label = ({ time }: any) => {
    if (time === -2) {
      return t('notReported')
    }
    if (time === -1) {
      return t('askForLeave')
    }
    return `${time / 3600}${t('workingHours')}`
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
    console.log('params', params, value)
    if (value === cacheValue && value !== 2) {
      setStoryId('')
      return
    }
    await updateWorkTime(params)
    getMessage({ type: 'success', msg: t('successfullyModified') })
    popoverRef?.current?.props.onPopupVisibleChange(false)
    setStoryId('')
    onConfirm()
  }
  const Content = () => {
    return (
      <UpdateTask>
        <div className="title">{t('modifyTaskRecord')}</div>
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
                  <span style={{ marginBottom: '8px' }}>
                    {t('adjustWorkingHours')}
                  </span>
                  <InputNumber
                    size="middle"
                    placeholder={t('pleaseEnter')}
                    style={{ width: 160 }}
                    value={dayTaskTime}
                    onChange={e => {
                      setDayTaskTime(e)
                    }}
                  ></InputNumber>
                </div>
              </Radio>
              <Radio value={3}>{t('askForLeave')}</Radio>
              <Radio value={1}>{t('notReported')}</Radio>
            </Space>
          </Radio.Group>
        </div>
        <div className="btn-box">
          <CommonButton
            type="light"
            size="small"
            onClick={() => {
              setStoryId('')
              popoverRef?.current?.props.onPopupVisibleChange(false)
            }}
          >
            {t('cancel')}
          </CommonButton>
          <CommonButton type="primary" size="small" onClick={confirm}>
            {t('confirm')}
          </CommonButton>
        </div>
      </UpdateTask>
    )
  }

  return (
    <PanelWrap>
      <Header>
        <DateLabel>
          {Object.keys(monthData).map(item => {
            const isLastDay = dayjs(item).endOf('month').format('YYYY-MM-DD')
            const data = monthData[item]
            const { length } = data
            const w =
              timeRef?.current?.getBoundingClientRect().width /
              Object.values(monthData).flat().length
            const width = type ? w * length : '100%'
            return (
              <div
                key={item}
                className={classNames('month-td', {
                  [lastDay]: isLastDay === item,
                })}
                style={{ width }}
              >
                <div>
                  {type === 0
                    ? String(data[0])
                    : `${data[0]}${t('to')}${data[data.length - 1]}`}
                </div>
              </div>
            )
          })}
        </DateLabel>
      </Header>
      <Header>
        <TimeLabel ref={timeRef} language={language}>
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
                <Cols key={index} ref={tdRef} language={language}>
                  <Popover
                    title=""
                    content={Content}
                    trigger="click"
                    ref={popoverRef}
                    open={col.story_id === storyId && item === record.date}
                  >
                    <WorkHourLabel
                      className={classNames({
                        [Working]: col.time !== 1 && col.time !== -2,
                        [Leave]: col.time === -1,
                        [NotWorking]: col.time === -2,
                      })}
                      onClick={() => {
                        console.log(rowIndex, index, item)
                        if (
                          !projectPermissions
                            ?.map((item: { identity: any }) => item.identity)
                            ?.includes('b/story/work_time')
                        ) {
                          getMessage({
                            type: 'warning',
                            msg: t('youDoNotHavePermissionToEdit'),
                          })
                          return
                        }

                        // time -1请假 -2 未上报
                        let value = 2
                        const { time, story_id } = col
                        if (time === -1) {
                          value = 3
                        }
                        if (time === -2) {
                          value = 1
                        }
                        setCacheValue(value)
                        setValue(value)
                        setDayTaskTime(time > 0 ? time / 3600 : '')
                        setRecord({ ...row, date: item })
                        setStoryId(story_id)
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
