import { useState } from 'react'
import { type TableColumnProps } from 'antd'
import XTable from './XTable'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import MoreDropdown from '@/components/MoreDropdown'
import { DemandOperationDropdownMenu } from '@/components/TableDropdownMenu/DemandDropdownMenu'
import ChangePriorityPopover from '@/components/ChangePriorityPopover'
import { PriorityWrap } from '@/components/StyleCommon'

const MoveFont = styled(IconFont)`
  fontsize: 16;
  color: var(--neutral-n3);
  &:hover {
    color: var(--primary-d2);
    cursor: move;
  }
  cursor: move;
`

export const data = [
  {
    id: '1',
    list: [
      {
        id: '1',
        name: '事务标题名称名称...',
        bh: 'DXKJ-22',
        long: '项目管理模块',
        zi: 3,
        user: '李钟硕',
        level: '低',
        status: '进行中',
      },
      {
        id: '2',
        name: '事务标题名称名称...',
        bh: 'DXKJ-22',
        long: '项目管理模块',
        zi: 3,
        user: '李钟硕',
        level: '低',
        status: '进行中',
      },
      {
        id: '3',
        name: '事务标题名称名称...',
        bh: 'DXKJ-22',
        long: '项目管理模块',
        zi: 3,
        user: '李钟硕',
        level: '低',
        status: '进行中',
      },
    ],
  },
  {
    id: '2',
    list: [
      {
        id: '1',
        name: '事务标题名称名称...',
        bh: 'DXKJ-22',
        long: '项目管理模块',
        zi: 3,
        user: '李钟硕',
        level: '低',
        status: '进行中',
      },
      {
        id: '2',
        name: '事务标题名称名称...',
        bh: 'DXKJ-22',
        long: '项目管理模块',
        zi: 3,
        user: '李钟硕',
        level: '低',
        status: '进行中',
      },
    ],
  },
]

type TableItem = {
  id: string
  name?: string
  sex?: string
  age?: number
  address?: string
}

const DndKitTable = () => {
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
    { title: '状态', dataIndex: 'status' },
  ]

  const handleDragEnd = (result: DropResult) => {
    console.log(result)
  }
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      {data.map(item => {
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

  // return (
  //   <DndContext onDragEnd={handleDragEnd}>
  //     <SortableContext
  //       items={[...data1, ...dataSource].map((c) => c.id)}
  //       strategy={verticalListSortingStrategy}
  //     >
  //       <XTable id="1" data={data1} columns={columns} />
  //       <XTable id="2" data={dataSource} columns={columns} />
  //     </SortableContext>
  //   </DndContext>
  // );
}

export default DndKitTable
