import { useRef, useEffect, useState, forwardRef, useLayoutEffect } from 'react'
import { Popover, Radio, Space, InputNumber, Tooltip } from 'antd'
import { updateWorkTime, getWorkTimeInfo } from '@/services/project'
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
  HeaderWrap,
  MemberTipBOX,
} from '../style'
import classNames from 'classnames'
import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
dayjs.extend(isoWeek)
import CommonButton from '@/components/CommonButton'
import usePanelData from '../hooks/usePanelData'
import { getMessage } from '@/components/Message'
import { t } from 'i18next'
import { useDispatch, useSelector } from '@store/index'
interface IProps {
  ref: any
  onClick: any
}
const WorkHoursPanel = (props: any, ref: any) => {
  const [t] = useTranslation()
  const tdRef = useRef<any>()
  const timeRef = useRef<any>()
  const modalRef = useRef<any>()
  const [value, setValue] = useState(1)
  const [dayTaskTime, setDayTaskTime] = useState<any>(0)
  const popoverRef = useRef<any>()
  const { dataSource, type, onConfirm } = props
  const [id, setId] = useState('')
  const [record, setRecord] = useState<any>()
  const language = window.localStorage.getItem('language')
  const [weekdayString, setWeekdayString] = useState<any>({})
  const [cacheValue, setCacheValue] = useState<number>()
  const [w, setW] = useState(0)
  const [scrollWidth, setScrollWidth] = useState(0)
  const { projectInfo } = useSelector(state => state.project)
  const { projectPermissions } = projectInfo
  const { columns, map, reduceMonth, projectId } = usePanelData(
    dataSource[0]?.work_times,
    dataSource,
  )
  const [memberToolTip, setMemberToolTip] = useState(<div></div>)
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

  const handleClickOutside = (e: { target: any }) => {
    const { className } = e.target
    const split = className?.split(' ')
    if (
      split.includes('ant-spin-container') ||
      split.includes('ant-pagination')
    ) {
      setId('')
    }
  }
  useEffect(() => {
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])
  useLayoutEffect(() => {
    const w = document
      .getElementsByClassName('header-td')[0]
      ?.getBoundingClientRect().width
    setW(w)
    setId('')
    setScrollWidth(0)
  }, [props])

  if (!columns) {
    return null
  }
  const rows = map.get(columns[0])
  const monthData = reduceMonth(columns)
  const confirm = async () => {
    const params = {
      ...record,
      day_task_time: parseFloat(dayTaskTime) * 3600,
      status: value,
    }
    delete params.time
    if (value !== 2) {
      delete params.day_task_time
    }
    if (!dayTaskTime && value === 2) {
      getMessage({
        type: 'error',
        msg: t('pleaseEnterTheCorrectWorkingHoursFormat'),
      })
      return
    }
    if (value === cacheValue && value !== 2) {
      setId('')
      return
    }
    await updateWorkTime(params)
    getMessage({ type: 'success', msg: t('successfullyModified') })
    popoverRef?.current?.props.onPopupVisibleChange(false)
    setId('')
    onConfirm()
  }
  const Content = () => {
    return (
      <UpdateTask ref={modalRef} data-type="updateTask">
        <div className="title">{t('modifyTaskRecord')}</div>
        <div className="form-box">
          <Radio.Group
            onChange={e => {
              e.stopPropagation()
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
                    onFocus={() => {
                      setValue(2)
                    }}
                    precision={2}
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
              setId('')
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
  const onScrollCapture = (event: any) => {
    if (document.getElementsByClassName('ant-table-body')[0]) {
      document.getElementsByClassName('ant-table-body')[0].scrollTop =
        event.target.scrollTop
    }
    setScrollWidth(event?.target?.scrollLeft)
    if (document.getElementsByClassName('ant-table-body')[0]) {
      document.getElementsByClassName('ant-table-body')[0].scrollTop =
        event.target.scrollTop
    }
  }
  return (
    <PanelWrap onScrollCapture={onScrollCapture} className="rightScroll">
      <HeaderWrap scrollWidth={scrollWidth}>
        <Header>
          <DateLabel>
            {Object.keys(monthData).map(item => {
              const isLastDay = dayjs(item).endOf('month').format('YYYY-MM-DD')
              const data = monthData[item]
              const { length } = data

              const width = type ? w * length : '100%'
              return (
                <div
                  key={item}
                  className={classNames('month-td', {
                    [lastDay]: isLastDay === item,
                  })}
                  style={{ width }}
                >
                  <div
                    title={
                      type === 0
                        ? String(data[0])
                        : `${data[0]}${t('to')}${data[data.length - 1]}`
                    }
                  >
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
      </HeaderWrap>
      {rows.map((row: any, rowIndex: any) => {
        return (
          <Rows
            key={rowIndex}
            className={rowIndex % 2 ? '' : 'highBackground'}
            scrollWidth={scrollWidth}
          >
            {columns.map((item: any, index: any) => {
              const col = map.get(item)[rowIndex]
              return (
                <Cols
                  key={index}
                  ref={tdRef}
                  language={language}
                  className="custom-col"
                >
                  {props.status === 'member' && col.time > 0 && (
                    <Tooltip
                      open={col.id === id && item === record.date}
                      placement="bottom"
                      title={memberToolTip}
                      trigger={['click']}
                      color="#585859"
                      onOpenChange={async open => {
                        if (col.time < 0) {
                          return
                        }
                        if (open) {
                          const res = await getWorkTimeInfo({
                            project_id: projectId,
                            date: item,
                            user_id: col.id,
                            is_overdue: props.is_overdue,
                          })
                          const { list } = res
                          if (list?.length === 0) {
                            setId('')
                            setMemberToolTip(<div></div>)
                            return
                          }
                          const box = list.map((item: any, index: number) => (
                            <MemberTipBOX key={item.id}>
                              {index + 1}. {item.story?.name}(
                              {item.schedule?.schedule}%{' '}
                              {item.total_time / 3600}h)
                            </MemberTipBOX>
                          ))
                          setMemberToolTip(box)
                          console.log(res, box)
                        }
                      }}
                    >
                      <WorkHourLabel
                        data-type={record?.date}
                        className={classNames({
                          [Working]: col.time !== 1 && col.time !== -2,
                          [Leave]: col.time === -1,
                          [NotWorking]: col.time === -2,
                          'custom-col': true,
                        })}
                        onClick={() => {
                          const { id } = col
                          setId(id)
                          setRecord({ ...row, date: item })
                        }}
                      >
                        <div>
                          {col.time === -2
                            ? '--'
                            : col.time === -1
                            ? t('askForLeave')
                            : col.time === -3
                            ? '节假日'
                            : `${col.time / 3600}${t('workingHours')}`}
                        </div>
                      </WorkHourLabel>
                    </Tooltip>
                  )}
                  {props.status === 'member' && col.time < 0 && (
                    <WorkHourLabel
                      data-type={record?.date}
                      className={classNames({
                        [Working]: col.time !== 1 && col.time !== -2,
                        [Leave]: col.time === -1,
                        [NotWorking]: col.time === -2,
                        'custom-col': true,
                      })}
                      onClick={() => {
                        const { id } = col
                        setId(id)
                        setRecord({ ...row, date: item })
                      }}
                    >
                      <div>
                        {col.time === -2
                          ? '--'
                          : col.time === -1
                          ? t('askForLeave')
                          : col.time === -3
                          ? '节假日'
                          : `${col.time / 3600}${t('workingHours')}`}
                      </div>
                    </WorkHourLabel>
                  )}
                  {props.status === 'story' && (
                    <Popover
                      title=""
                      content={Content}
                      trigger="click"
                      ref={popoverRef}
                      open={col.id === id && item === record.date}
                      getPopupContainer={node => node}
                    >
                      <WorkHourLabel
                        data-type={record?.date}
                        className={classNames({
                          [Working]: col.time !== 1 && col.time !== -2,
                          [Leave]: col.time === -1,
                          [NotWorking]: col.time === -2,
                          'custom-col': true,
                        })}
                        onClick={() => {
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

                          // time -1请假 -2 未上报 -3节假日
                          let value = 2
                          const { time, id } = col
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
                          setId(id)
                        }}
                      >
                        <div>
                          {col.time === -2
                            ? '--'
                            : col.time === -1
                            ? t('askForLeave')
                            : col.time === -3
                            ? '节假日'
                            : `${col.time / 3600}${t('workingHours')}`}
                        </div>
                      </WorkHourLabel>
                    </Popover>
                  )}
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
