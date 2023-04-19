import DeleteConfirm from '@/components/DeleteConfirm'
import styled from '@emotion/styled'
import { setCalendarModal } from '@store/calendar'
import { useDispatch } from '@store/index'
import { useState } from 'react'
import CalendarColor from '../../CalendarColor'
import { deleteCalendar, unsubscribeCalendar } from '@/services/calendar'
import { message } from 'antd'
import {
  getCalendarList,
  userSetupsCalendar,
} from '@store/calendar/calendar.thunk'
import { useTranslation } from 'react-i18next'

const MoreWrap = styled.div`
  padding: 4px 0 10px;
  display: flex;
  flex-direction: column;
  background: var(--neutral-white-d6);
  border-radius: 6px;
  min-width: 120px;
  box-shadow: 0px 0px 15px 6px rgba(0, 0, 0, 0.12);
`

const Item = styled.div`
  height: 32px;
  padding: 0 16px;
  cursor: pointer;
  color: var(--neutral-n2);
  font-size: 14px;
  line-height: 32px;
  &:hover {
    background: var(--hover-d3);
    color: var(--neutral-n1-d1);
  }
`

const Provider = styled.div`
  height: 1px;
  background: var(--neutral-n6-d1);
  margin: 8px 0;
`

const ColorWrap = styled.div`
  padding: 0 16px;
  width: 192px;
`

interface CalendarMoreDropdownProps {
  item: Model.Calendar.Info
  type: 'manager' | 'subscribe'
  onCancel(): void
}

const CalendarMoreDropdown = (props: CalendarMoreDropdownProps) => {
  const dispatch = useDispatch()
  const [t] = useTranslation()
  const [isDeleteVisible, setIsDeleteVisible] = useState(false)
  const [isUnsubscribeVisible, setIsUnsubscribeVisible] = useState(false)
  const subMenu = [
    { name: t('calendarManager.show_only_this_calendar'), type: 'only' },
    {
      name: t('calendarManager.unsubscribe_from_calendar'),
      type: 'unsubscribe',
    },
  ]
  const manageMenu = [
    { name: t('calendarManager.show_only_this_calendar'), type: 'only' },
    { name: t('calendarManager.editorial_calendar'), type: 'edit' },
    { name: t('calendarManager.delete_calendar'), type: 'delete' },
    {
      name: t('calendarManager.unsubscribe_from_calendar'),
      type: 'unsubscribe',
    },
  ]

  // 仅显示此日历
  const showOnlyCalendar = async () => {
    await dispatch(
      userSetupsCalendar({
        is_check: 1,
        id: props.item.calendar_id,
        is_only_show: 1,
      }),
    )
    props.onCancel()
  }

  // 删除日历确认事件
  const onDeleteConfirm = async () => {
    await deleteCalendar({ id: props.item.calendar_id })
    dispatch(getCalendarList())
    setIsDeleteVisible(false)
    message.success(t('calendarManager.deleteSuccess'))
  }

  // 退订日历确认事件
  const onUnsubscribeConfirm = async () => {
    await unsubscribeCalendar({ id: props.item.calendar_id })
    dispatch(getCalendarList())
    setIsUnsubscribeVisible(false)
    message.success(t('calendarManager.unsubscribed_successfully'))
  }

  // 点击菜单事件
  const onClickMenu = (type: string) => {
    if (type === 'only') {
      showOnlyCalendar()
    } else if (type === 'edit') {
      dispatch(
        setCalendarModal({
          visible: true,
          params: { id: props.item.calendar_id },
        }),
      )
    } else if (type === 'delete') {
      setIsDeleteVisible(true)
    } else {
      setIsUnsubscribeVisible(true)
    }
  }

  // 改变颜色
  const onChangeColor = async (color: number) => {
    await dispatch(
      userSetupsCalendar({
        color,
        id: props.item.calendar_id,
      }),
    )
    props.onCancel()
  }

  // 我管理的日历下拉菜单 -- 根据状态判断
  const getResultManageMenu = () => {
    let resultList: string[] = []
    // 所有者
    if (props.item.is_default === 1) {
      resultList = ['edit', 'only']
    } else if (props.item.is_owner === 1) {
      resultList = ['edit', 'only', 'delete']
    } else if (props.item.user_group_id === 1) {
      resultList = ['edit', 'only', 'unsubscribe', 'delete']
    } else {
      resultList = ['only', 'unsubscribe']
    }
    return manageMenu.filter((i: { name: string; type: string }) =>
      resultList.includes(i.type),
    )
  }

  return (
    <>
      <DeleteConfirm
        isVisible={isDeleteVisible}
        title={t('calendarManager.delete_calendar')}
        text={t('calendarManager.delete_calendar_text')}
        onConfirm={onDeleteConfirm}
        onChangeVisible={() => setIsDeleteVisible(false)}
      />
      <DeleteConfirm
        isVisible={isUnsubscribeVisible}
        title={t('calendarManager.unsubscribe_from_calendar')}
        text={t('calendarManager.unsubscribe_from_calendar_text')}
        onConfirm={onUnsubscribeConfirm}
        onChangeVisible={() => setIsUnsubscribeVisible(false)}
      />
      <MoreWrap>
        {(props.type === 'subscribe' ? subMenu : getResultManageMenu()).map(
          (i: { name: string; type: string }) => (
            <Item key={i.name} onClick={() => onClickMenu(i.type)}>
              {i.name}
            </Item>
          ),
        )}
        <div style={{ padding: '0 16px' }}>
          <Provider />
        </div>
        <ColorWrap>
          <CalendarColor
            color={props.item.color}
            onChangeColor={onChangeColor}
          />
        </ColorWrap>
      </MoreWrap>
    </>
  )
}

export default CalendarMoreDropdown
