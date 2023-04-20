import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from '@store/index'
import { getScheduleSearch } from '@/services/schedule'
import dayjs from 'dayjs'
import IconFont from '@/components/IconFont'
import { useNavigate } from 'react-router-dom'
import { isDateIntersection } from '@/tools/index'
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
  CalendarListClass,
  dateClass,
  currentClass,
  contentHigh,
} from './styles'
import { intersection } from 'lodash'
import InputSearch from '@/components/InputSearch'
interface CalendarListProps {}

const ScheduleSearch: React.FC<CalendarListProps> = props => {
  const CalendarListBoxRef = useRef<HTMLDivElement>(null)
  const { checkedCalendarList } = useSelector(state => state.calendar)
  const [inputDefaultValue, setInputDefaultValue] = useState<string>()
  const { calenderYearValue } = useSelector(state => state.calendarPanel)
  const [searchList, setSearchList] = useState([])
  const navigate = useNavigate()
  const getSearchList = () => {
    const params = {
      year: parseInt(calenderYearValue, 10),
      calendar_ids: checkedCalendarList.map(item => item.calendar_id),
      keyword: inputDefaultValue,
    }
    getScheduleSearch(params).then(res => {
      const array: any = []
      Object.keys(res)
        .sort()
        .forEach(key => {
          const item = res[key]
          array.push({ date: key, list: item })
        })
      setSearchList(array)
    })
  }
  useEffect(() => {
    if (inputDefaultValue === void 0) return
    getSearchList()
  }, [inputDefaultValue])
  return (
    <ScheduleSearchListBox ref={CalendarListBoxRef}>
      <ScheduleSearchWrap>
        <BackBox
          onClick={() => {
            navigate(-1)
          }}
        >
          <IconFont type="left-md"></IconFont>返回
        </BackBox>
        <InputSearch
          placeholder="搜索日程"
          defaultValue={inputDefaultValue}
          width={'100%'}
          onChangeSearch={value => {
            console.log(value)
            setInputDefaultValue(value)
          }}
          onFocus={() => {}}
        ></InputSearch>
      </ScheduleSearchWrap>

      {searchList?.map((item: any, index: number) => (
        <CalendarListItem
          key={index}
          className={CalendarListClass}
          datatype={item.date}
        >
          <div style={{ width: '40px' }}>
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
              <TimeItem key={idx}>
                <span className={dateClass}>
                  {ele.is_all_day === 1
                    ? '全天'
                    : ele.start_time + '-' + ele.end_time}
                </span>
                <span>
                  <label
                    className={
                      ele.subject.includes(inputDefaultValue) ? contentHigh : ''
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
                      （第{' '}
                      {dayjs(ele.end_datetime).diff(
                        dayjs(ele.schedule_start_datetime),
                        'days',
                      ) + 1}{' '}
                      天，共{' '}
                      {dayjs(ele.schedule_end_datetime).diff(
                        dayjs(ele.schedule_start_datetime),
                        'days',
                      ) + 1}{' '}
                      天）
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
                  <span>
                    <IconFont type="warning-02"></IconFont>
                  </span>
                ) : null}
              </TimeItem>
            ))}
          </CalendarListInfo>
        </CalendarListItem>
      ))}
    </ScheduleSearchListBox>
  )
}

export default ScheduleSearch
