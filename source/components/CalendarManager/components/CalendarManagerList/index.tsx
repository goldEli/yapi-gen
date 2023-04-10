import React, { useEffect, useState } from 'react'
import { Collapse } from 'antd'
import styled from '@emotion/styled'
import { CloseWrap } from '@/components/StyleCommon'
import IconFont from '@/components/IconFont'
import MoreDropdown from '@/components/MoreDropdown'
import { useDispatch, useSelector } from '@store/index'
import { getCalendarList } from '@store/calendar/calendar.thunk'
import {
  setCalendarData,
  setCheckedCalendarList,
  setIsShowCalendarVisible,
  setIsShowSubscribeVisible,
} from '@store/calendar'
import CalendarMoreDropdown from './CalendarMoreDropdown'
import CalendarSubscribe from './CalendarSubscribe'
import CalendarFormModal from './CalendarFormModal'
import { colorMap } from '../../config'

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
  type: string
}

const CalendarManagerList: React.FC<CalendarManagerListProps> = props => {
  const dispatch = useDispatch()
  const [isMoreVisible, setIsMoreVisible] = useState(false)
  const { calendarData, checkedCalendarList } = useSelector(
    store => store.calendar,
  )

  // console.log(calendarData, '=calendarData')
  const calendarList = calendarData[props.type as keyof typeof calendarData]

  // 改变日历的选中状态
  const onChangeCheck = (item: Model.Calendar.Info) => {
    // 还缺少一个修改保存选中数据的接口

    // 改变原始数据
    const newCalendarData = calendarList?.map((i: Model.Calendar.Info) => ({
      ...i,
      is_check: i.id === item.id ? (i.is_check ? 0 : 1) : i.is_check,
    }))
    let resultCheck: Model.Calendar.Info[]
    // 如果当前是选中，则选中数组过滤
    if (item.is_check) {
      resultCheck = checkedCalendarList?.filter(
        (i: Model.Calendar.Info) => i.id !== item.id,
      )
    } else {
      resultCheck = [...checkedCalendarList, ...[item]]
    }
    dispatch(setCheckedCalendarList(resultCheck))
    dispatch(
      setCalendarData({
        ...calendarData,
        ...{ [props.type]: newCalendarData },
      }),
    )
  }

  const onOpenSub = (e: any) => {
    e.stopPropagation()
    props.type === 'subscribe'
      ? dispatch(setIsShowSubscribeVisible(true))
      : dispatch(setIsShowCalendarVisible(true))
  }

  useEffect(() => {
    dispatch(getCalendarList())
  }, [])

  return (
    <div style={{ marginBottom: 24 }}>
      <CalendarSubscribe />
      <CalendarFormModal />
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
          {calendarList?.map((i: any) => (
            <CalendarManagerListItem key={i.id}>
              <ItemBox key={i.id} onClick={() => onChangeCheck(i)}>
                <IconFont
                  type={i.is_check ? 'pput-sel' : 'put'}
                  style={{ fontSize: 16, color: colorMap[i.color] }}
                />
                <span className="name">{i.name}</span>
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
        </Panel>
      </CollapseWrap>
    </div>
  )
}

export default CalendarManagerList
