import {
  CalendarSetBox,
  CreateScheduleBtn,
  ManagerListBox,
} from '@/components/CalendarManager/styles'
import CommonButton from '@/components/CommonButton'
import IconFont from '@/components/IconFont'
import InputSearch from '@/components/InputSearch'
import { setScheduleModal, setRouterMenu } from '@store/calendar'
import { useDispatch, useSelector } from '@store/index'
import CalendarManagerList from '../../CalendarManagerList'
import DXCalendar from '../../DXCalendar'
import { getCalendarList } from '@store/calendar/calendar.thunk'
import { useEffect, useState } from 'react'
import CalendarSubscribe from '../CalendarSubscribe'
import CalendarFormModal from '../CalendarFormModal'
import { useTranslation } from 'react-i18next'

const CalendarMainSide = () => {
  const dispatch = useDispatch()
  const [t] = useTranslation()
  const [value, setValue] = useState('')
  const { checkedTime } = useSelector(store => store.calendar)

  // 改变路由
  const onChangeRouter = () => {
    localStorage.setItem('calendarSetKey', 'view')
    dispatch(
      setRouterMenu({ name: t('calendarManager.view_options'), key: 'view' }),
    )
  }

  // 创建日程
  const onCreate = () => {
    const params = {
      isAll: true,
      startTime: checkedTime,
      endTime: checkedTime,
    }
    dispatch(setScheduleModal({ visible: true, params }))
  }

  useEffect(() => {
    dispatch(getCalendarList())
  }, [])

  return (
    <>
      <CalendarSubscribe />
      <CalendarFormModal />
      <div style={{ paddingRight: 20 }}>
        <CommonButton
          type="primary"
          style={{ width: '100%', marginBottom: 24 }}
        >
          <CreateScheduleBtn onClick={onCreate}>
            <IconFont type="plus" style={{ fontSize: 16 }} />
            <span className="btnText">
              {t('calendarManager.create_schedule')}
            </span>
          </CreateScheduleBtn>
        </CommonButton>
        <DXCalendar />
        <div style={{ width: '100%', margin: '24px 0' }}>
          <InputSearch
            onChangeSearch={setValue}
            placeholder={t('calendarManager.search_calendar')}
            width="100%"
            autoFocus
            leftIcon
          />
        </div>
      </div>
      <ManagerListBox>
        <CalendarManagerList
          title={t('calendarManager.manage_calendar')}
          type="manager"
          searchValue={value}
          path="b/calendar"
        />
        <CalendarManagerList
          title={t('calendarManager.subscribed_calendar')}
          type="subscribe"
          searchValue={value}
          path="b/calendar/subscribe"
        />
      </ManagerListBox>
      <CalendarSetBox onClick={onChangeRouter}>
        <div className="box">
          <IconFont
            type="settings"
            style={{ fontSize: 18, color: 'var(--neutral-n3)' }}
          />
          <div>{t('calendarManager.calendar_settings')}</div>
        </div>
      </CalendarSetBox>
    </>
  )
}

export default CalendarMainSide
