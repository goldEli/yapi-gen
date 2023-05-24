import { type TableColumnProps } from 'antd'
import XTable from './XTable'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import MoreDropdown from '@/components/MoreDropdown'
import { DemandOperationDropdownMenu } from '@/components/TableDropdownMenu/DemandDropdownMenu'
import ChangePriorityPopover from '@/components/ChangePriorityPopover'
import { PriorityWrap } from '@/components/StyleCommon'
import ChangeStatusPopover from '@/components/ChangeStatusPopover/index'
import { useSelector, useDispatch } from '@store/index'
import { setSprintTableData } from '@store/sprint'

const MoveFont = styled(IconFont)`
  fontsize: 16;
  color: var(--neutral-n3);
  &:hover {
    color: var(--primary-d2);
    cursor: move;
  }
  cursor: move;
`

type TableItem = {
  id: string
  name?: string
  sex?: string
  age?: number
  address?: string
}

const DndKitTable = () => {
  const { sprintTableData } = useSelector(state => state.sprint)
  const dispatch = useDispatch()
  const columns: TableColumnProps<TableItem>[] = [
    {
      render: (text: any, record: any) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <MoreDropdown
              menu={
                <DemandOperationDropdownMenu
                  onEditChange={() => {}}
                  onDeleteChange={() => {}}
                  onCreateChild={() => {}}
                  record={record}
                />
              }
            />
          </div>
        )
      },
    },
    {
      dataIndex: 'sort',
      render: () => <MoveFont type="move" />,
    },
    { title: '编号', dataIndex: 'bh' },
    { title: '标题', dataIndex: 'name' },
    { title: '长故事', dataIndex: 'long' },
    { title: '子事务', dataIndex: 'zi' },
    { title: '经办人', dataIndex: 'user' },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 180,
      render: (text: any, record: Record<string, string | number>) => {
        return (
          <ChangePriorityPopover
            isCanOperation
            onChangePriority={item => () => {}}
            record={{ project_id: 1, id: record.id }}
            projectId={1}
          >
            <PriorityWrap>
              {text?.icon ? (
                <IconFont
                  className="priorityIcon"
                  type={text?.icon}
                  style={{
                    fontSize: 20,
                    color: text?.color,
                  }}
                />
              ) : null}
              <span style={{ marginLeft: '5px' }}>
                {!text?.icon && <span>--</span>}
                <IconFont className="icon" type="down-icon" />
              </span>
            </PriorityWrap>
          </ChangePriorityPopover>
        )
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (text: any, record: any) => {
        return (
          <ChangeStatusPopover
            children={<div>11111</div>}
            // onChangeStatus={function (value: any): void {
            //   throw new Error('Function not implemented.')
            // }}
            // record={record}
          />
        )
      },
    },
  ]

  const handleDragEnd = (result: DropResult) => {
    console.log(result)
    if (result.destination?.droppableId === result.source.droppableId) {
      // 同表格换位置
      const data = [...sprintTableData]
      const idx = data.findIndex(k => k.id === result.destination?.droppableId)
      const destList = data[idx]
      const source = [...destList.list]

      const item = destList.list.find((_, i) => i === result.source?.index)
      source.splice(result.source?.index, 1)
      source.splice(result.destination?.index ?? 0, 0, item)
      const res: any = data.map(k => {
        if (k.id === result.destination?.droppableId) {
          return { ...k, list: source }
        }
        return k
      })
      dispatch(setSprintTableData(res))
    } else {
      // 不同表格拖动
      const data = [...sprintTableData]
      const destIdx = data.findIndex(
        k => k.id === result.destination?.droppableId,
      )
      const sourceIdx = data.findIndex(k => k.id === result.source?.droppableId)
      const item = data[sourceIdx].list.find(
        (_, i) => i === result.source?.index,
      )
      const source = [...data[sourceIdx].list]
      source.splice(result.source?.index, 1)
      const dest = [...data[destIdx].list]
      dest.splice(result.destination?.index ?? 0, 0, item)
      const res = data.map(k => {
        if (k.id === result.destination?.droppableId) {
          return { ...k, list: dest }
        }
        if (k.id === result.source?.droppableId) {
          return { ...k, list: source }
        }
        return k
      })
      dispatch(setSprintTableData(res))
    }
  }
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      {sprintTableData?.map(item => {
        return (
          <XTable
            key={item.id}
            id={item.id}
            data={item.list.map(i => {
              return {
                ...i,
                id: `${item.id}-${i.id}`,
              }
            })}
            columns={columns}
          />
        )
      })}
    </DragDropContext>
  )
}

export default DndKitTable
