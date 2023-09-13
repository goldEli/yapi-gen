import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from '@store/index'
import { getScheduleSearch } from '@/services/schedule'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import IconFont from '@/components/IconFont'
import { useNavigate } from 'react-router-dom'
import { isDateIntersection } from '@/tools/index'
import NewLoadingTransition from '@/components/NewLoadingTransition'
import {
  setYearViewsList,
  setScheduleList,
  setListViews,
  setScheduleInfo,
} from '@store/schedule'
import { Empty, Spin, Tooltip, Input } from 'antd'
const { Search } = Input
import {
  getColorWithOpacityPointOne,
  getColor,
} from '@/components/CalendarManager/utils'
import {
  ScheduleSearchWrap,
  ScheduleSearchListBox,
  BackBox,
  CalendarListItem,
  DateBox,
  MonthWeekBox,
  LunarDate,
  CalendarListInfo,
  TimeItem,
  Dot,
  CalendarListClass,
  dateClass,
  currentClass,
  contentHigh,
} from './styles'
import InputSearch from '@/components/InputSearch'
import {
  setScheduleInfoDropdown,
  setInitScheduleInfoDropdown,
} from '@store/calendarPanle'
import ScheduleInfoDropdown from '@/components/CalendarManager/components/ScheduleInfoDropdown'
import { mapToArray } from '@/tools'
import NoData from '@/components/NoData'
import { formatYYYYMMDD } from '@/components/CalendarManager/config'
interface CalendarListProps {}
const ScheduleSearch: React.FC<CalendarListProps> = props => {
  const CalendarListBoxRef = useRef<HTMLDivElement>(null)
  const inputRefDom = useRef<HTMLDivElement>(null)
  const { checkedCalendarList } = useSelector(state => state.calendar)
  const [t] = useTranslation()
  const [inputDefaultValue, setInputDefaultValue] = useState<string>()
  const { calenderTypeValue } = useSelector(state => state.calendarPanel)
  const [searchList, setSearchList] = useState<
    Model.Schedule.ScheduleListViewInfo[]
  >([])
  const [loading, setLoading] = useState(false)
  const disPatch = useDispatch()
  const navigate = useNavigate()
  const getSearchList = () => {
    const params = {
      year: parseInt(calenderTypeValue, 10),
      calendar_ids: checkedCalendarList.map(item => item.calendar_id),
      keyword: inputDefaultValue,
    }
    setLoading(true)
    getScheduleSearch(params).then(res => {
      setLoading(false)
      let data = mapToArray(res)
      setSearchList(data)
    })
  }
  useEffect(() => {
    inputRefDom.current?.focus()
  }, [])
  useEffect(() => {
    if (inputDefaultValue === void 0) return
    getSearchList()
  }, [inputDefaultValue])
  return (
    <ScheduleSearchListBox ref={CalendarListBoxRef}>
      <Spin
        spinning={loading}
        size="large"
        indicator={<NewLoadingTransition />}
      >
        <ScheduleSearchWrap>
          <BackBox
            onClick={() => {
              navigate(-1)
              disPatch(
                setInitScheduleInfoDropdown({ schedule_id: 0, visible: false }),
              )
              disPatch(setYearViewsList({}))
              disPatch(setScheduleList({}))
              disPatch(setListViews([]))
            }}
          >
            <IconFont type="left-md"></IconFont>
            {t('calendarManager.calendar_back')}
          </BackBox>
          <Input
            placeholder={t('calendarManager.search_schedule')}
            style={{ height: '100%', width: '100%' }}
            autoFocus
            allowClear
            onPressEnter={e => {
              const value = (e.target as HTMLInputElement).value
              setInputDefaultValue(value)
            }}
          />
        </ScheduleSearchWrap>
        {searchList?.length
          ? searchList?.map((item: any, index: number) => (
              <CalendarListItem
                key={index}
                className={CalendarListClass}
                datatype={item.date}
              >
                <div>
                  <DateBox className={index === 0 ? currentClass : ''}>
                    {dayjs(item.date).date()}
                  </DateBox>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <MonthWeekBox>
                    {item.list[0].month}月 {item.list[0].week_name}
                  </MonthWeekBox>
                  <LunarDate>{item.list[0].lunar_day_chinese} </LunarDate>
                </div>
                <CalendarListInfo>
                  {item.list.map((ele: any, idx: number) => (
                    <TimeItem
                      key={idx}
                      color={getColorWithOpacityPointOne(ele.color)}
                      onClick={() => {
                        disPatch(
                          setInitScheduleInfoDropdown({ schedule_id: 0 }),
                        )
                        setTimeout(() => {
                          disPatch(
                            setScheduleInfoDropdown({
                              visible: true,
                              schedule_id: ele.schedule_id,
                              show_date: dayjs(ele.date).format(formatYYYYMMDD),
                            }),
                          )
                        }, 0)

                        disPatch(setScheduleInfo(void 0))
                      }}
                    >
                      {' '}
                      <Dot color={getColor(ele.color)}></Dot>
                      <span className={dateClass}>
                        {ele.is_all_day === 1
                          ? t('calendarManager.allDay')
                          : ele.start_time + '-' + ele.end_time}
                      </span>
                      <span>
                        <label
                          className={
                            ele.subject.includes(inputDefaultValue)
                              ? contentHigh
                              : ''
                          }
                        >
                          {ele.subject}
                        </label>
                        {dayjs(ele.schedule_end_datetime).diff(
                          dayjs(ele.schedule_start_datetime),
                          'days',
                        ) +
                          1 >
                        1 ? (
                          <label>
                            {t('calendarManager.dayof', {
                              day:
                                dayjs(ele.end_datetime).diff(
                                  dayjs(ele.schedule_start_datetime),
                                  'days',
                                ) + 1,
                              days:
                                dayjs(ele.schedule_end_datetime).diff(
                                  dayjs(ele.schedule_start_datetime),
                                  'days',
                                ) + 1,
                            })}
                          </label>
                        ) : null}
                      </span>
                      {(isDateIntersection(
                        item.list[idx + 1]?.start_datetime,
                        item.list[idx + 1]?.end_datetime,
                        item.list[idx]?.start_datetime,
                        item.list[idx]?.end_datetime,
                      ) ||
                        isDateIntersection(
                          item.list[idx]?.start_datetime,
                          item.list[idx]?.end_datetime,
                          item.list[idx - 1]?.start_datetime,
                          item.list[idx - 1]?.end_datetime,
                        )) &&
                      item.list.length > 1 ? (
                        <Tooltip
                          placement="top"
                          title={t('calendarManager.conflict')}
                        >
                          <span>
                            <IconFont type="warning-02"></IconFont>
                          </span>
                        </Tooltip>
                      ) : null}
                    </TimeItem>
                  ))}
                </CalendarListInfo>
              </CalendarListItem>
            ))
          : inputDefaultValue !== void 0 && (
              // <Empty
              //   description="暂无数据，请重新调整一下筛选参数试试"
              //   image={Empty.PRESENTED_IMAGE_SIMPLE}
              // />
              <NoData></NoData>
            )}
        <ScheduleInfoDropdown></ScheduleInfoDropdown>
      </Spin>
    </ScheduleSearchListBox>
  )
}

export default ScheduleSearch
