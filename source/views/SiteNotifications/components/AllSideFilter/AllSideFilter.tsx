import IconFont from '@/components/IconFont'
import LeftTitle from '@/components/LeftTitle'
import { useDispatch, useSelector } from '@store/index'
import { changeVisibleFilter } from '@store/SiteNotifications'
import { Checkbox, Drawer } from 'antd'
import React, { useState } from 'react'
import { CloseWrap } from '../SiteDrawer/style'
import {
  InfoWrap,
  InfoWrapItem,
  MyHead,
  MyIconMode,
  MyIconModeText,
  MyIconModeTextWrap,
  MyIconModeWrap,
  ResetB,
  Wrap,
} from './style'

const items = [
  {
    id: '1',
    icon: 'package-nor',
    icon2: 'package-sel',
    text: '产品管理',
  },
  {
    id: '2',
    icon: 'folder-open-nor',
    icon2: 'folder-open-sel',
    text: '项目管理',
  },
  {
    id: '3',
    icon: 'bell',
    icon2: 'bell-sel',
    text: '系统通知',
  },
  {
    id: '4',
    icon: 'database',
    icon2: 'calendar-sel',
    text: '日程管理',
  },
  {
    id: '5',
    icon: 'log-nor',
    icon2: 'log-sel',
    text: '工作汇报',
  },
]

const AllSideFilter = () => {
  const [active, setActive] = useState('1')
  const isVisibleFilter = useSelector(
    store => store.siteNotifications.isVisibleFilter,
  )
  const dispatch = useDispatch()
  const onClose = () => {
    dispatch(changeVisibleFilter(false))
  }

  const onChange = (checkedValues: any) => {
    // console.log('checked = ', checkedValues)
  }

  return (
    <Drawer
      bodyStyle={{ padding: 0, paddingBottom: '8px', boxSizing: 'border-box' }}
      width={328}
      zIndex={1}
      closable={false}
      mask={false}
      placement="right"
      onClose={onClose}
      open={isVisibleFilter}
    >
      <Wrap>
        <MyHead>
          <LeftTitle title="筛选通知" />
          <CloseWrap onClick={onClose} width={32} height={32}>
            <IconFont
              style={{ fontSize: 20, color: 'var(--neutral-n2)' }}
              type="close"
            />
          </CloseWrap>
        </MyHead>
        <MyIconModeTextWrap>
          {items.map((i: any) => (
            <MyIconModeWrap onClick={() => setActive(i.id)} key={i.id}>
              <MyIconMode active={active === i.id}>
                <IconFont
                  style={{ fontSize: 20 }}
                  type={active === i.id ? i.icon2 : i.icon}
                />
              </MyIconMode>
              <MyIconModeText>{i.text}</MyIconModeText>
            </MyIconModeWrap>
          ))}
        </MyIconModeTextWrap>
        <MyHead>
          <LeftTitle title="通知事项" />
          <ResetB>重置筛选</ResetB>
        </MyHead>
        <InfoWrap>
          <Checkbox.Group style={{ width: '100%' }} onChange={onChange}>
            <InfoWrapItem>
              <span>分配给我任务</span>
              <Checkbox value="A" />
            </InfoWrapItem>
          </Checkbox.Group>
        </InfoWrap>
      </Wrap>
    </Drawer>
  )
}

export default AllSideFilter
