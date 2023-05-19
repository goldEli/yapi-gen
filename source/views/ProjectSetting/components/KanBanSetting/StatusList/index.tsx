import React from 'react'
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'

interface StatusListProps {}

const StatusListBox = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 8px;
`
const StatusListItem = styled.div`
  width: 100%;
  height: 44px;
  background: var(--neutral-white-d1);
  border-radius: 6px 6px 6px 6px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  box-sizing: border-box;
`
const StatusListItemLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const ImageIcon = styled.img`
  width: 20px;
  height: 20px;
`
const Text = styled.div`
  width: 52px;
  height: 22px;
  background: var(--primary-d1);
  border-radius: 6px 6px 6px 6px;
  opacity: 1;
  font-size: 12px;
  color: var(--neutral-white-d7);
  display: flex;
  align-items: center;
  justify-content: center;
`

const Count = styled.div`
  font-size: 12px;
  color: var(--neutral-n3);
`

const IconWarp = styled(IconFont)<{ active: boolean }>`
  font-size: 16px;
  color: ${props => (props.active ? 'var(--primary-d1)' : 'var(--neutral-n3)')};
`

const data: Model.KanbanConfig.Status[] = [
  {
    story_type_id: 571,
    flow_status_id: 1824,
    stories_count: 0,
    attachment_path:
      'https://dev.staryuntech.com/dev-agile/attachment/category_icon/home.png',
    status_name: '已关闭',
  },
  {
    story_type_id: 5711,
    flow_status_id: 18241,
    stories_count: 32,
    attachment_path:
      'https://dev.staryuntech.com/dev-agile/attachment/category_icon/home.png',
    status_name: '已开始',
  },
]

const StatusList: React.FC<StatusListProps> = props => {
  return (
    <StatusListBox>
      {data.map(item => {
        return (
          <StatusListItem key={item.flow_status_id}>
            <StatusListItemLeft>
              <IconWarp active type="move" />
              <ImageIcon src={item.attachment_path} />
              <Text>{item.status_name}</Text>
            </StatusListItemLeft>
            <Count>{`${item.stories_count}个事务`}</Count>
          </StatusListItem>
        )
      })}
    </StatusListBox>
  )
}

export default StatusList
