import React from 'react'
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import StateTag from '@/components/StateTag'
import StatusListItem from '../StatusListItem'

interface StatusListProps {}

const StatusListBox = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 8px;
`

const data: Model.KanbanConfig.Status[] = [
  {
    story_type_id: 571,
    flow_status_id: 1824,
    stories_count: 0,
    attachment_path:
      'https://dev.staryuntech.com/dev-agile/attachment/category_icon/home.png',
    status_name: '已关闭',
    is_end: 1,
    is_start: 2,
  },
  {
    story_type_id: 5711,
    flow_status_id: 18241,
    stories_count: 32,
    attachment_path:
      'https://dev.staryuntech.com/dev-agile/attachment/category_icon/home.png',
    status_name: '已开始',
    is_end: 2,
    is_start: 1,
  },
]

const StatusList: React.FC<StatusListProps> = props => {
  return (
    <StatusListBox>
      {data.map(item => {
        return <StatusListItem key={item.id} data={item} />
      })}
    </StatusListBox>
  )
}

export default StatusList
