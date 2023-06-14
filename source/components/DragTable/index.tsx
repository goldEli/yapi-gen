import { arrayMoveImmutable } from 'array-move'
import IconFont from '../IconFont'
import {
  SortableContainer as sortableContainer,
  SortableElement as sortableElement,
  SortableHandle as sortableHandle,
} from 'react-sortable-hoc'
import { Table } from 'antd'
import { DragTableIcon } from '../StyleCommon'
import { useState } from 'react'

interface DragTableProps {
  dataSource: any
  onChangeData(arr: any): void
  columns: any
  hasOperation?: any
  showHeader?: boolean
}

const DragTable = (props: DragTableProps) => {
  const DragHandle = sortableHandle(() => <DragTableIcon type="move" />)

  const SortableItem = sortableElement(
    (props: React.HTMLAttributes<HTMLTableRowElement>) => <tr {...props} />,
  )

  const SortableBody = sortableContainer(
    (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
      <tbody {...props} />
    ),
  )

  const onSortEnd = ({ oldIndex, newIndex }: any) => {
    if (oldIndex !== newIndex) {
      const newData = arrayMoveImmutable(
        props.dataSource?.list?.slice(),
        oldIndex,
        newIndex,
      ).filter((el: any) => !!el)
      props.onChangeData({ list: newData })
    }
  }

  const DraggableContainer = (props: any) => (
    <SortableBody
      useDragHandle
      helperClass="row-dragging"
      disableAutoscroll
      onSortEnd={onSortEnd}
      {...props}
    />
  )

  const DraggableBodyRow: React.FC<any> = ({ ...restProps }) => {
    const index = props.dataSource?.list?.findIndex(
      (x: any) => x.index === restProps['data-row-key'],
    )
    return <SortableItem index={index} {...restProps} />
  }

  const dragHandle = {
    width: 30,
    render: () => <DragHandle />,
  }

  return (
    <Table
      pagination={false}
      dataSource={props.dataSource.list}
      columns={[...[dragHandle], ...props.columns]}
      rowKey="index"
      sticky
      showHeader={props.showHeader}
      components={{
        body: {
          wrapper: DraggableContainer,
          row: DraggableBodyRow,
        },
      }}
    />
  )
}

export default DragTable
