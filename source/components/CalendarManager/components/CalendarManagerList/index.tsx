import React, { useState } from 'react'
import { Collapse } from 'antd'
import styled from '@emotion/styled'
import { CloseWrap } from '@/components/StyleCommon'
import IconFont from '@/components/IconFont'
import MoreDropdown from '@/components/MoreDropdown'
import { useDispatch, useSelector } from '@store/index'
import { setCalendarModal, setSubscribeModal } from '@store/calendar'
import CalendarMoreDropdown from './CalendarMoreDropdown'
import { colorMap } from '../../config'
import { userSetupsCalendar } from '@store/calendar/calendar.thunk'
import NoData from '@/components/NoData'
import { refreshCalendarPanelScheduleList } from '@store/schedule/schedule.thunk'

const { Panel } = Collapse

const CollapseWrap = styled(Collapse)`
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
    max-width: 86%;
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
  width: 96%;
`

interface CalendarManagerListProps {
  title: string
  type: 'manager' | 'subscribe'
  searchValue: string
}

const CalendarManagerList: React.FC<CalendarManagerListProps> = props => {
  const dispatch = useDispatch()
  const [isMoreVisible, setIsMoreVisible] = useState(false)
  const { calendarData } = useSelector(store => store.calendar)
  const calendarList = calendarData[props.type as keyof typeof calendarData]

  // 改变日历的选中状态
  const onChangeCheck = async (item: Model.Calendar.Info) => {
    await dispatch(
      userSetupsCalendar({
        is_check: item.is_check === 1 ? 2 : 1,
        id: item.calendar_id,
      }),
    )
    dispatch(refreshCalendarPanelScheduleList())
  }

  const onOpenSub = (e: any) => {
    e.stopPropagation()
    props.type === 'subscribe'
      ? dispatch(setSubscribeModal(true))
      : dispatch(setCalendarModal({ visible: true }))
  }

  return (
    <div style={{ marginBottom: 24 }}>
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
              <CloseWrap width={24} height={24} onClick={e => onOpenSub(e)}>
                <IconFont className="icon" type="plus" />
              </CloseWrap>
            </Title>
          }
          key="1"
        >
          {calendarList
            ?.filter((k: Model.Calendar.Info) =>
              k.name.includes(props.searchValue),
            )
            ?.map((i: Model.Calendar.Info) => (
              <CalendarManagerListItem key={i.id}>
                <ItemBox key={i.id} onClick={() => onChangeCheck(i)}>
                  <IconFont
                    type={i.is_check === 1 ? 'pput-sel' : 'put'}
                    style={{ fontSize: 16, color: colorMap[i.color] }}
                  />
                  <span className="name">
                    {i.is_default === 1 ? i.user.name : i.name}
                  </span>
                </ItemBox>
                <MoreDropdown
                  isMoreVisible={isMoreVisible}
                  menu={
                    <CalendarMoreDropdown
                      item={i}
                      type={props.type}
                      onCancel={() => setIsMoreVisible(false)}
                    />
                  }
                  onChangeVisible={setIsMoreVisible}
                />
              </CalendarManagerListItem>
            ))}
          {calendarList &&
            calendarList?.filter((k: Model.Calendar.Info) =>
              k.name.includes(props.searchValue),
            ).length <= 0 && <NoData size />}
        </Panel>
      </CollapseWrap>
    </div>
  )
}

export default CalendarManagerList
