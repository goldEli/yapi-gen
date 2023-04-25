import React, { useState } from 'react'
import { Collapse, Tooltip, message } from 'antd'
import styled from '@emotion/styled'
import { CloseWrap } from '@/components/StyleCommon'
import IconFont from '@/components/IconFont'
import MoreDropdown from '@/components/MoreDropdown'
import { useDispatch, useSelector } from '@store/index'
import { setCalendarModal, setSubscribeModal } from '@store/calendar'
import { colorMap } from '../../config'
import {
  getCalendarList,
  userSetupsCalendar,
} from '@store/calendar/calendar.thunk'
import NoData from '@/components/NoData'
import { useTranslation } from 'react-i18next'
import CalendarColor from '../CalendarColor'
import { deleteCalendar, unsubscribeCalendar } from '@/services/calendar'
import DeleteConfirm from '@/components/DeleteConfirm'

const { Panel } = Collapse

const CollapseWrap = styled(Collapse)`
  .ant-collapse-content-box {
    max-height: inherit;
  }
  .ant-collapse-item > .ant-collapse-header {
    display: flex;
    align-items: center;
    padding: 0;
  }
  .ant-collapse-item > .ant-collapse-header .ant-collapse-arrow {
    margin-right: 8px;
  }
  .ant-collapse-item > .ant-collapse-content > .ant-collapse-content-box {
    padding: 12px 16px 0;
  }
`

const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  .name {
    font-size: 14px;
    color: var(--neutral-n1-d1);
    font-family: SiYuanMedium;
  }
  .icon {
    font-size: 18px;
    color: var(--neutral-n2);
  }
`
const CalendarManagerListItem = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
  height: 32px;
  cursor: pointer;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  .name {
    font-size: 14px;
    color: var(--neutral-n2);
    margin-left: 8px;
    max-width: 90%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  &:hover {
    .name {
      color: var(--primary-d2);
    }
    .dropdownIcon {
      visibility: visible;
    }
  }
`

const ItemBox = styled.div`
  display: flex;
  align-items: center;
  width: 90%;
`

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

interface CalendarManagerListProps {
  title: string
  type: 'manager' | 'subscribe'
  searchValue: string
  path: string
}

const CalendarManagerList: React.FC<CalendarManagerListProps> = props => {
  const dispatch = useDispatch()
  const [t] = useTranslation()
  const [isDeleteVisible, setIsDeleteVisible] = useState(false)
  const [isUnsubscribeVisible, setIsUnsubscribeVisible] = useState(false)
  const [isMoreVisible, setIsMoreVisible] = useState(false)
  const [operationItem, setOperationItem] = useState<Model.Calendar.Info>(
    {} as Model.Calendar.Info,
  )
  const { calendarData } = useSelector(store => store.calendar)
  const { userInfo } = useSelector(store => store.user)
  const calendarList = calendarData[props.type as keyof typeof calendarData]
  const allPermission = userInfo.company_permissions?.map(
    (i: any) => i.identity,
  )

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

  // 改变日历的选中状态
  const onChangeCheck = async (e: any, item: Model.Calendar.Info) => {
    e.stopPropagation()
    await dispatch(
      userSetupsCalendar({
        is_check: item.is_check === 1 ? 2 : 1,
        id: item.calendar_id,
      }),
    )
  }

  const onOpenSub = (e: any) => {
    e.stopPropagation()
    props.type === 'subscribe'
      ? dispatch(setSubscribeModal(true))
      : dispatch(setCalendarModal({ visible: true }))
  }

  // 仅显示此日历
  const showOnlyCalendar = async (i: Model.Calendar.Info) => {
    await dispatch(
      userSetupsCalendar({
        is_check: 1,
        id: i.calendar_id,
        is_only_show: 1,
      }),
    )
    setIsMoreVisible(false)
  }

  // 删除日历确认事件
  const onDeleteConfirm = async () => {
    await deleteCalendar({ id: operationItem.calendar_id })
    dispatch(getCalendarList())
    setIsDeleteVisible(false)
    message.success(t('calendarManager.deleteSuccess'))
    setOperationItem({} as Model.Calendar.Info)
  }

  // 退订日历确认事件
  const onUnsubscribeConfirm = async () => {
    await unsubscribeCalendar({ id: operationItem.calendar_id })
    dispatch(getCalendarList())
    setIsUnsubscribeVisible(false)
    message.success(t('calendarManager.unsubscribed_successfully'))
    setOperationItem({} as Model.Calendar.Info)
  }

  // 点击菜单事件
  const onClickMenu = (type: string, i: Model.Calendar.Info) => {
    if (type === 'only') {
      showOnlyCalendar(i)
    } else if (type === 'edit') {
      dispatch(
        setCalendarModal({
          visible: true,
          params: { id: i.calendar_id },
        }),
      )
    } else if (type === 'delete') {
      setOperationItem(i)
      setIsDeleteVisible(true)
    } else {
      setOperationItem(i)
      setIsUnsubscribeVisible(true)
    }
    setIsMoreVisible(false)
  }

  // 改变颜色
  const onChangeColor = async (color: number, i: Model.Calendar.Info) => {
    await dispatch(
      userSetupsCalendar({
        color,
        id: i.calendar_id,
      }),
    )
    setIsMoreVisible(false)
  }

  // 我管理的日历下拉菜单 -- 根据状态判断
  const getResultManageMenu = (i: Model.Calendar.Info) => {
    let resultList: string[] = []
    // 所有者
    if (i.is_default === 1) {
      resultList = ['edit', 'only']
    } else if (i.is_owner === 1) {
      resultList = ['edit', 'only', 'delete']
    } else if (i.user_group_id === 1) {
      resultList =
        i.origin_is_default === 1
          ? ['edit', 'only', 'unsubscribe']
          : ['edit', 'only', 'unsubscribe', 'delete']
    } else {
      resultList = ['only', 'unsubscribe']
    }
    return manageMenu.filter((i: { name: string; type: string }) =>
      resultList.includes(i.type),
    )
  }

  return (
    <div style={{ marginBottom: 24 }}>
      <DeleteConfirm
        isVisible={isDeleteVisible}
        title={t('calendarManager.delete_calendar')}
        text={t('calendarManager.delete_calendar_text')}
        onConfirm={onDeleteConfirm}
        onChangeVisible={() => {
          setIsDeleteVisible(false)
          setOperationItem({} as Model.Calendar.Info)
        }}
      />
      <DeleteConfirm
        isVisible={isUnsubscribeVisible}
        title={t('calendarManager.unsubscribe_from_calendar')}
        text={t('calendarManager.unsubscribe_from_calendar_text')}
        onConfirm={onUnsubscribeConfirm}
        onChangeVisible={() => {
          setIsUnsubscribeVisible(false)
          setOperationItem({} as Model.Calendar.Info)
        }}
      />
      <CollapseWrap
        defaultActiveKey={['1']}
        ghost
        expandIcon={({ isActive }) => (
          <IconFont
            style={{
              fontSize: 14,
              color: 'var(--neutral-n3)',
            }}
            type="down-icon"
            rotate={isActive ? 0 : -90}
          />
        )}
      >
        <Panel
          header={
            <Title>
              <span className="name">{props.title}</span>
              {allPermission.includes(props.path) && (
                <CloseWrap width={24} height={24} onClick={e => onOpenSub(e)}>
                  <IconFont className="icon" type="plus" />
                </CloseWrap>
              )}
            </Title>
          }
          key="1"
        >
          {calendarList
            ?.filter((k: Model.Calendar.Info) =>
              k?.name?.includes(props.searchValue),
            )
            ?.map((i: Model.Calendar.Info) => (
              <CalendarManagerListItem key={i.id}>
                <ItemBox key={i.id} onClick={e => onChangeCheck(e, i)}>
                  <IconFont
                    type={i.is_check === 1 ? 'pput-sel' : 'put'}
                    style={{ fontSize: 16, color: colorMap[i.color] }}
                  />
                  <Tooltip title={i.is_default === 1 ? i.user.name : i.name}>
                    <span className="name">
                      {i.is_default === 1 ? i.user.name : i.name}
                    </span>
                  </Tooltip>
                </ItemBox>
                <MoreDropdown
                  isMoreVisible={isMoreVisible}
                  menu={
                    <MoreWrap>
                      {(props.type === 'subscribe'
                        ? subMenu
                        : getResultManageMenu(i)
                      ).map((k: { name: string; type: string }) => (
                        <Item
                          key={k.name}
                          onClick={() => onClickMenu(k.type, i)}
                        >
                          {k.name}
                        </Item>
                      ))}
                      <div style={{ padding: '0 16px' }}>
                        <Provider />
                      </div>
                      <ColorWrap>
                        <CalendarColor
                          color={i.color}
                          onChangeColor={value => onChangeColor(value, i)}
                        />
                      </ColorWrap>
                    </MoreWrap>
                  }
                  onChangeVisible={setIsMoreVisible}
                />
              </CalendarManagerListItem>
            ))}
          {calendarList &&
            calendarList?.filter((k: Model.Calendar.Info) =>
              k.name?.includes(props.searchValue),
            ).length <= 0 && <NoData size />}
        </Panel>
      </CollapseWrap>
    </div>
  )
}

export default CalendarManagerList
