import React from 'react'
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import StateTag from '@/components/StateTag'
import StatusListItem from '../StatusListItem'
import { Droppable } from 'react-beautiful-dnd'
import { useSelector } from '@store/index'

interface StatusListProps {}

const StatusListBox = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  overflow: auto;
  height: 0;
`

// const data: Model.KanbanConfig.Status[] = [
//   {
//     story_type_id: 571,
//     flow_status_id: 1824,
//     stories_count: 0,
//     attachment_path:
//       'https://dev.staryuntech.com/dev-agile/attachment/category_icon/home.png',
//     status_name: '已关闭',
//     is_end: 1,
//     is_start: 2,
//   },
//   {
//     story_type_id: 5711,
//     flow_status_id: 18241,
//     stories_count: 32,
//     attachment_path:
//       'https://dev.staryuntech.com/dev-agile/attachment/category_icon/home.png',
//     status_name: '已开始',
//     is_end: 2, //     is_start: 1,
//   },
// ]
// const data: Model.KanbanConfig.Status[] = Array(60)
//   .fill(0)
//   .map((_, idx) => {
//     return {
//       story_type_id: 571,
//       flow_status_id: idx,
//       stories_count: idx + 1,
//       attachment_path:
//         'https://dev.staryuntech.com/dev-agile/attachment/category_icon/home.png',
//       status_name: '已关闭',
//       is_end: 1,
//       is_start: 2,
//     }
//   })
const StatusList: React.FC<StatusListProps> = props => {
  const { unassignStatusList } = useSelector(store => store.KanbanConfig)
  return (
    <Droppable droppableId="UNASSIGNED-STATUS" type="STATUS">
      {(provided, snapshot) => {
        return (
          <StatusListBox ref={provided.innerRef} {...provided.droppableProps}>
            {unassignStatusList?.map?.((item, index) => {
              return (
                <StatusListItem
                  index={index}
                  key={item.flow_status_id}
                  data={item}
                />
              )
            })}
          </StatusListBox>
        )
      }}
    </Droppable>
  )
}

export default StatusList
