import React from 'react'
import styled from '@emotion/styled'
import { useDispatch, useSelector } from '@store/index'
import dayjs from 'dayjs'
import { formatYYYYMMDD } from '@/components/CalendarManager/config'
import {
  onNextDay,
  onPrevDay,
  setToday,
} from '@store/createScheduleVisualization'
import { useTranslation } from 'react-i18next'

interface HeaderProps {}

const HeaderBox = styled.div`
  width: 100%;
  display: flex;
  gap: 24px;
  align-items: center;
`
const Button = styled.div`
  cursor: pointer;
  width: 48px;
  height: 32px;
  border-radius: 4px 4px 4px 4px;
  opacity: 1;
  border: 1px solid var(--neutral-n6-d1);
  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 14px;

  color: var(--neutral-n3);
`

const TimeBox = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 16px;
  color: var(--neutral-n1-d1);
  .icon {
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
`

const Header: React.FC<HeaderProps> = props => {
  const { currentDate } = useSelector(
    store => store.createScheduleVisualization,
  )
  const dispatch = useDispatch()
  const [t] = useTranslation()

  return (
    <HeaderBox>
      <Button
        onClick={() => {
          dispatch(setToday())
        }}
      >
        {t('calendarManager.today')}
      </Button>
      <TimeBox>
        <span
          className="icon"
          onClick={() => {
            dispatch(onPrevDay())
          }}
        >{`<`}</span>
        <span>{`${dayjs(currentDate).format(formatYYYYMMDD)} ${dayjs(
          currentDate,
        ).format('ddd')}`}</span>
        <span
          className="icon"
          onClick={() => {
            dispatch(onNextDay())
          }}
        >{`>`}</span>
      </TimeBox>
    </HeaderBox>
  )
}

export default Header
