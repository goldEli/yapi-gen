import React from 'react'
import styled from '@emotion/styled'
import { useSelector } from '@store/index'
import ScheduleStripList from '../../../ScheduleStripList'
import useAllDayGrid from '@/components/CalendarManager/hooks/useAllDayGrid'
import {
  CreateScheduleText,
  DayItemBox,
} from '@/components/CalendarManager/styles'
import { useTranslation } from 'react-i18next'

interface DayItemProps {
  idx: number
  list?: (Model.Schedule.Info | undefined)[]
}

const DayItem: React.FC<DayItemProps> = props => {
  const { selectedWeek } = useSelector(store => store.calendar)
  const { selectedDayInMonth } = useSelector(store => store.calendarPanel)
  const { idx } = props
  const info = selectedWeek?.[props.idx]
  const isSelected = selectedDayInMonth === info?.datetime
  const [t] = useTranslation()

  const { classnames, onClick, onMouseEnter } = useAllDayGrid({
    info,
    idx,
    showSelectedBg: isSelected,
    showBorderRight: (idx + 1) % 7 === 0,
    showBorderBottom: true,
  })

  if (!info) {
    return <></>
  }

  return (
    <DayItemBox
      className={classnames}
      key={idx}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
    >
      <ScheduleStripList
        containerClassName=".calendar-week-all-day-box"
        data={info}
        idx={idx}
        list={props.list}
      />
      <CreateScheduleText visible={isSelected}>
        {t('calendarManager.create_schedule')}
      </CreateScheduleText>
    </DayItemBox>
  )
}

export default DayItem
