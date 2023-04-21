import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from '@store/index'
import { getScheduleSearch } from '@/services/schedule'
import dayjs from 'dayjs'
import IconFont from '@/components/IconFont'
import { useNavigate } from 'react-router-dom'
import { isDateIntersection } from '@/tools/index'
import { Empty, Spin } from 'antd'
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
import InputSearch from '@/components/InputSearch'
import { setScheduleInfo } from '@store/schedule'
import {
  setScheduleInfoDropdown,
  setInitScheduleInfoDropdown,
} from '@store/calendarPanle'
import ScheduleInfoDropdown from '@/components/CalendarManager/components/ScheduleInfoDropdown'
import { mapToArray } from '@/tools'
interface CalendarListProps {}
const ScheduleSearch: React.FC<CalendarListProps> = props => {
  const CalendarListBoxRef = useRef<HTMLDivElement>(null)
  const { checkedCalendarList } = useSelector(state => state.calendar)
  const [inputDefaultValue, setInputDefaultValue] = useState<string>()
  const { calenderYearValue } = useSelector(state => state.calendarPanel)
  const [searchList, setSearchList] = useState<
    Model.Schedule.ScheduleListViewInfo[]
  >([])
  const [loading, setLoading] = useState(false)
  const disPatch = useDispatch()
  const navigate = useNavigate()
  const getSearchList = () => {
    const params = {
      year: parseInt(calenderYearValue, 10),
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
    if (inputDefaultValue === void 0) return
    getSearchList()
  }, [inputDefaultValue])
  return (
    <ScheduleSearchListBox ref={CalendarListBoxRef}>
      <Spin spinning={loading} size="large" tip="Loading">
        <ScheduleSearchWrap>
          <BackBox
            onClick={() => {
              navigate(-1)
              disPatch(
                setInitScheduleInfoDropdown({ schedule_id: 0, visible: false }),
              )
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
        {searchList?.length
          ? searchList?.map((item: any, index: number) => (
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
                    <TimeItem
                      key={idx}
                      onClick={() => {
                        console.log('ele.schedule_id----', ele.schedule_id)
                        disPatch(
                          setInitScheduleInfoDropdown({ schedule_id: 0 }),
                        )
                        setTimeout(() => {
                          disPatch(
                            setScheduleInfoDropdown({
                              visible: true,
                              schedule_id: ele.schedule_id,
                            }),
                          )
                        }, 0)

                        disPatch(setScheduleInfo(void 0))
                      }}
                    >
                      <span className={dateClass}>
                        {ele.is_all_day === 1
                          ? '全天'
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
            ))
          : inputDefaultValue !== void 0 && (
              <Empty
                description="暂无数据，请重新调整一下筛选参数试试"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
        <ScheduleInfoDropdown></ScheduleInfoDropdown>
      </Spin>
    </ScheduleSearchListBox>
  )
}

export default ScheduleSearch
