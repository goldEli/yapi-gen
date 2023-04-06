import {
  CalendarSetBox,
  CreateScheduleBtn,
  ManagerListBox,
} from '@/components/CalendarManager/styles'
import CommonButton from '@/components/CommonButton'
import IconFont from '@/components/IconFont'
import InputSearch from '@/components/InputSearch'
import { setRouterMenu } from '@store/calendar'
import { useDispatch } from '@store/index'
import CalendarManagerList from '../../CalendarManagerList'
import DXCalendar from '../../DXCalendar'

const CalendarMainSide = () => {
  const dispatch = useDispatch()

  // 改变路由
  const onChangeRouter = () => {
    localStorage.setItem('calendarSetKey', 'view')
    dispatch(setRouterMenu({ name: '视图选项', key: 'view' }))
  }

  return (
    <>
      <CommonButton type="primary" style={{ width: '100%', marginBottom: 24 }}>
        <CreateScheduleBtn>
          <IconFont type="plus" style={{ fontSize: 16 }} />
          <span className="btnText">创建日程</span>
        </CreateScheduleBtn>
      </CommonButton>
      <DXCalendar />
      <div style={{ width: '100%', margin: '24px 0' }}>
        <InputSearch placeholder={'搜索日历'} width={210} autoFocus leftIcon />
      </div>
      <ManagerListBox>
        <CalendarManagerList title="我管理的" type="manage" />
        <CalendarManagerList title="我订阅的" type="sub" />
      </ManagerListBox>
      <CalendarSetBox onClick={onChangeRouter}>
        <div className="box">
          <IconFont
            type="settings"
            style={{ fontSize: 18, color: 'var(--neutral-n3)' }}
          />
          <div>日历设置</div>
        </div>
      </CalendarSetBox>
    </>
  )
}

export default CalendarMainSide
