import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import { setRouterMenu } from '@store/calendar'
import { useDispatch, useSelector } from '@store/index'
import { useTranslation } from 'react-i18next'

const CalendarSetSideTitle = styled.div`
  font-size: 14px;
  color: var(--neutral-n1-d1);
  font-family: SiYuanMedium;
  padding: 0 24px;
`

const BackBox = styled.div`
  padding: 0 24px;
  .box {
    width: 100%;
    height: 48px;
    display: flex;
    align-items: center;
    cursor: pointer;
    border-bottom: 1px solid var(--neutral-n6-d1);
    .icon {
      font-size: 16px;
      color: var(--neutral-n3);
      margin-right: 4px;
    }
    .text {
      font-size: 12px;
      color: var(--neutral-n3);
    }
  }
`

const MenuItems = styled.div`
  margin-top: 16px;
`

const MenuItem = styled.div<{ active: boolean }>`
  height: 44px;
  display: flex;
  align-items: center;
  padding: 0 24px;
  font-size: 14px;
  color: ${props =>
    props.active ? 'var(--primary-d2)' : 'var(--neutral-n1-d2)'};
  background: ${props =>
    props.active ? 'var(--gradient-left)' : 'transparent'};
  font-family: ${props => (props.active ? 'SiYuanMedium' : '')};
  cursor: pointer;
`

const CalendarSetSide = () => {
  const dispatch = useDispatch()
  const [t] = useTranslation()
  const { menuList, routerMenu } = useSelector(store => store.calendar)

  // 改变路由
  const onChangeRouter = (i: Model.Calendar.RouterMenu) => {
    localStorage.setItem('calendarSetKey', i.key)
    dispatch(setRouterMenu(i))
  }

  const onBack = () => {
    localStorage.removeItem('calendarSetKey')
    dispatch(setRouterMenu({ name: '', key: '' }))
  }

  return (
    <>
      <CalendarSetSideTitle>
        {t('calendarManager.schedule_settings')}
      </CalendarSetSideTitle>
      <BackBox>
        <div className="box" onClick={onBack}>
          <IconFont className="icon" type="left-md" />
          <div className="text">{t('calendarManager.calendar_back')}</div>
        </div>
      </BackBox>
      <MenuItems>
        {menuList.map((i: Model.Calendar.RouterMenu) => (
          <MenuItem
            key={i.key}
            onClick={() => onChangeRouter(i)}
            active={routerMenu.key === i.key}
          >
            {t(i.name as any)}
          </MenuItem>
        ))}
      </MenuItems>
    </>
  )
}

export default CalendarSetSide
