import { colorMap } from '@/components/CalendarManager/config'
import DeleteConfirm from '@/components/DeleteConfirm'
import styled from '@emotion/styled'
import { setCalendarData, setCheckedCalendarList } from '@store/calendar'
import { useDispatch, useSelector } from '@store/index'
import { useState } from 'react'
import CalendarColor from '../../CalendarColor'

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
  type: string
  onCancel(): void
}

const CalendarMoreDropdown = (props: CalendarMoreDropdownProps) => {
  const dispatch = useDispatch()
  const { calendarData } = useSelector(store => store.calendar)
  const [isDeleteVisible, setIsDeleteVisible] = useState(false)
  const [isUnsubscribeVisible, setIsUnsubscribeVisible] = useState(false)
  const calendarList = calendarData[props.type as keyof typeof calendarData]
  const subMenu = [
    { name: '仅显示此日历', type: 'only' },
    { name: '退订日历', type: 'unsubscribe' },
  ]
  const manageMenu = [
    { name: '仅显示此日历', type: 'only' },
    { name: '编辑日历', type: 'edit' },
    { name: '删除日历', type: 'delete' },
    { name: '退订日历', type: 'unsubscribe' },
  ]

  // 仅显示此日历
  const showOnlyCalendar = () => {
    // 还缺少一个修改保存选中数据的接口
    // 保存接口后，更新列表
    const resultItem: Model.Calendar.Info = { ...props.item, is_check: 1 }
    dispatch(setCheckedCalendarList([resultItem]))
  }

  // 删除日历确认事件
  const onDeleteConfirm = () => {
    //
  }

  // 退订日历确认事件
  const onUnsubscribeConfirm = () => {
    //
  }

  // 点击菜单事件
  const onClickMenu = (type: string) => {
    if (type === 'only') {
      showOnlyCalendar()
    } else if (type === 'edit') {
      setIsUnsubscribeVisible(true)
    } else if (type === 'delete') {
      setIsDeleteVisible(true)
    } else {
      setIsUnsubscribeVisible(true)
    }
  }

  // 改变颜色
  const onChangeColor = (color: number) => {
    // 走编辑接口

    // 改变原始数据
    const newCalendarData = calendarList?.map((i: Model.Calendar.Info) => ({
      ...i,
      color: i.id === props.item.id ? colorMap[color] : colorMap[i.color],
    }))
    dispatch(
      setCalendarData({
        ...calendarData,
        ...{ [props.type]: newCalendarData },
      }),
    )
    props.onCancel()
  }

  return (
    <>
      <DeleteConfirm
        isVisible={isDeleteVisible}
        title="删除日历"
        text="您即将永久删除该日历，所有日历成员都将无法再使用，要继续吗？"
        onConfirm={onDeleteConfirm}
        onChangeVisible={() => setIsDeleteVisible(false)}
      />
      <DeleteConfirm
        isVisible={isUnsubscribeVisible}
        title="退订日历"
        text="确认退订该日历，退订后将无法访问该日历的日程"
        onConfirm={onUnsubscribeConfirm}
        onChangeVisible={() => setIsUnsubscribeVisible(false)}
      />
      <MoreWrap>
        {(props.type === 'sub' ? subMenu : manageMenu).map(
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
