import { useState } from 'react'
import { type TableColumnProps } from 'antd'
import XTable from './XTable'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'

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
      { id: '1', name: '张三', age: 33, sex: '女' },
      { id: '2', name: '李四', age: 90, sex: '男' },
      { id: '3', name: '王五', age: 17, sex: '女' },
    ],
  },
  {
    id: '2',
    list: [
      { id: '11', name: '孔艳', age: 33, sex: '女' },
      { id: '22', name: '江艳', age: 90, sex: '男' },
      { id: '33', name: '姚娜', age: 17, sex: '女' },
      { id: '44', name: '何洋', age: 77, sex: '女' },
      { id: '55', name: '卢静', age: 47, sex: '男' },
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
      title: '排序',
      dataIndex: 'sort',
      width: 60,
      render: () => <MoveFont type="move" />,
      align: 'center',
    },
    { title: '姓名', dataIndex: 'name' },
    { title: '性别', dataIndex: 'sex' },
    { title: '年龄', dataIndex: 'age' },
    { title: '地址', dataIndex: 'address' },
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
                id: item.id + '-' + i.id,
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
