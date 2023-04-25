import React from 'react'
import styled from '@emotion/styled'
import { useSelector } from '@store/index'
import classNames from 'classnames'
import dayjs from 'dayjs'
import useCurrentTime from '@/components/CalendarManager/hooks/useCurrentTime'
import ScheduleStripList from '../../../ScheduleStripList'
import useAllDayGrid from '@/components/CalendarManager/hooks/useAllDayGrid'
import {
  CreateScheduleText,
  DayItemBox,
} from '@/components/CalendarManager/styles'
import { useTranslation } from 'react-i18next'
import useShowLunar from '@/components/CalendarManager/hooks/useShowLunar'

interface DayItemProps {
  idx: number
  list?: (Model.Schedule.Info | undefined)[]
}

const DayBox = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
  padding: 12px;
  box-sizing: border-box;
  .day {
    font-size: 18px;
    font-family: SiYuanMedium;
    color: var(--neutral-n1-d1);
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .currentDay {
    border: 1px solid var(--primary-d1);
    color: var(--primary-d1);
  }
  .dayActive {
    color: var(--neutral-white-d7);
    background: var(--primary-d1);
  }
  .daySecondaryColor {
    color: var(--neutral-n3);
  }
  .lunar {
    font-size: 12px;

    color: var(--neutral-n4);
  }
`

const DayItem: React.FC<DayItemProps> = props => {
  const { checkedTime, selectedMonth } = useSelector(store => store.calendar)
  const { selectedDayInMonth } = useSelector(store => store.calendarPanel)
  const { idx } = props
  const info = selectedMonth?.[props.idx]
  const { showLunar } = useShowLunar()

  const day = dayjs(info?.date).format('DD')
  const isSelected = dayjs(checkedTime).isSame(dayjs(info?.date), 'day')
  const isSelectedForCreate = selectedDayInMonth === info?.datetime
  const { currentTime } = useCurrentTime()
  const isCurrent = currentTime.isSame(dayjs(info?.datetime), 'day')
  const len = selectedMonth?.length ?? 0
  const { classnames, onClick, onMouseEnter } = useAllDayGrid({
    info,
    idx,
    showSelectedBg: isCurrent || isSelectedForCreate,
    showBorderRight: (idx + 1) % 7 === 0,
    // showBorderBottom: idx > 27,
    showBorderBottom: idx > len - 8,
  })
  const [t] = useTranslation()

  const { scheduleList } = useSelector(store => store.schedule)

  if (!info) {
    return <></>
  }

  const key = info.date
  return (
    <DayItemBox
      className={classnames}
      key={idx}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
    >
      <DayBox>
        <span
          className={classNames('day', {
            dayActive: isSelected,
            daySecondaryColor: !info?.is_current_month && !isSelected,
            currentDay: isCurrent,
          })}
        >
          {day}
        </span>
        {showLunar && <span className="lunar">{info?.lunar_day_chinese}</span>}
      </DayBox>
      <ScheduleStripList
        containerClassName=".calendar-month-content-box"
        data={info}
        idx={idx}
        list={props.list}
        allList={scheduleList[key]}
      />
      <CreateScheduleText top={54} visible={isSelectedForCreate}>
        {t('calendarManager.create_schedule')}
      </CreateScheduleText>
    </DayItemBox>
  )
}

export default DayItem
