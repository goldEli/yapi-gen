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
import { getAffairsCommentList } from '@store/affairs/affairs.thunk'
import { deleteAffairsComment } from '@/services/affairs'
import { getMessage } from '@/components/Message'

const ActivitySprint = () => {
  const dispatch = useDispatch()
  const [activeKey, setActiveKey] = useState('1')
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const { id, sprintId } = paramsData
  const { affairsCommentList, affairsInfo } = useSelector(
    store => store.affairs,
  )

  // 获取评论列表
  const getList = () => {
    dispatch(
      getAffairsCommentList({
        projectId: id,
        sprintId,
        page: 1,
        pageSize: 999,
      }),
    )
  }

  const onDeleteCommentConfirm = async (commentId: number) => {
    await deleteAffairsComment({ projectId: id, id: commentId })
    getMessage({ type: 'success', msg: '删除成功' })
    getList()
  }

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: (
        <ActivityTabItem>
          <span>评论</span>
          <ItemNumber isActive={activeKey === '1'}>
            {affairsCommentList?.list.length || 0}
          </ItemNumber>
        </ActivityTabItem>
      ),
      children: (
        <CommonComment
          data={affairsCommentList}
          onDeleteConfirm={onDeleteCommentConfirm}
        />
      ),
    },
    {
      key: '2',
      label: (
        <ActivityTabItem>
          <span>变更记录</span>
          <ItemNumber isActive={activeKey === '2'}>
            {affairsInfo.changeCount}
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
      getList()
    }
  }

  return (
    <InfoItem id="sprint-activity" className="info_item_tab">
      <Label>活动</Label>
      <Tabs defaultActiveKey={activeKey} items={items} onChange={onChange} />
    </InfoItem>
  )
}

export default ActivitySprint
