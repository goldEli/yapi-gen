/* eslint-disable no-undefined */
import { Tabs, TabsProps } from 'antd'
import { ActivityTabItem, InfoItem, ItemNumber, Label } from '../style'
import { useEffect, useState } from 'react'
import ChangeRecord from './ChangeRecord'
import Circulation from './Circulation'
import CommonComment from '@/components/CommonComment'
import { useSearchParams } from 'react-router-dom'
import { getParamsData } from '@/tools'
import { useDispatch, useSelector } from '@store/index'
import { getSprintCommentList } from '@store/sprint/sprint.thunk'

const ActivitySprint = () => {
  const dispatch = useDispatch()
  const [activeKey, setActiveKey] = useState('1')
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const { id, sprintId } = paramsData
  const { sprintCommentList, sprintInfo } = useSelector(store => store.sprint)
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: (
        <ActivityTabItem>
          <span>评论</span>
          <ItemNumber isActive={activeKey === '1'}>
            {sprintCommentList?.list.length || 0}
          </ItemNumber>
        </ActivityTabItem>
      ),
      children: <CommonComment data={sprintCommentList} />,
    },
    {
      key: '2',
      label: (
        <ActivityTabItem>
          <span>变更记录</span>
          <ItemNumber isActive={activeKey === '2'}>
            {sprintInfo.changeCount}
          </ItemNumber>
        </ActivityTabItem>
      ),
      children: <ChangeRecord activeKey={activeKey} />,
    },
    {
      key: '3',
      label: (
        <ActivityTabItem>
          <span>流转记录</span>
        </ActivityTabItem>
      ),
      children: <Circulation activeKey={activeKey} />,
    },
  ]

  const onChange = (key: string) => {
    setActiveKey(key)
    if (key === '1') {
      dispatch(
        getSprintCommentList({
          projectId: id,
          sprintId,
          page: 1,
          pageSize: 999,
        }),
      )
    }
  }

  return (
    <InfoItem>
      <Label>活动</Label>
      <Tabs defaultActiveKey={activeKey} items={items} onChange={onChange} />
    </InfoItem>
  )
}

export default ActivitySprint
