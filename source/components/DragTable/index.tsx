/* eslint-disable no-undefined */
import { arrayMoveImmutable } from 'array-move'
import {
  SortableContainer as sortableContainer,
  SortableElement as sortableElement,
  SortableHandle as sortableHandle,
} from 'react-sortable-hoc'
import { Table } from 'antd'
import { DragTableIcon } from '../StyleCommon'
import styled from '@emotion/styled'

const TableWrap = styled(Table)`
  .ant-table-row:hover {
    .dropdownIcon {
      visibility: visible;
    }
  }
  .ant-table-thead > tr > th {
    border-bottom: 0px;
    font-size: var(--font12);
    color: var(--neutral-n3);
    font-family: SiYuanMedium;
  }
`

interface DragTableProps {
  dataSource: any
  onChangeData(arr: any, idx: number): void
  columns: any
  hasOperation?: any
  showHeader?: boolean
  tableY?: number
  // 项目列表判断手柄
  filterParams?: any
  onRow?(row: any): void
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
      props.onChangeData({ list: newData }, newIndex)
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

  // 仅限所有项目，勾选迭代或冲刺下才能有手柄
  const hasHandle =
    props?.filterParams?.status === 0 &&
    !props?.filterParams?.keyword &&
    props?.filterParams?.order?.key?.length <= 0 &&
    props?.filterParams?.time?.length <= 0 &&
    !props?.filterParams?.otherType?.includes(3)

  const dragHandle = {
    width: 30,
    render: () => <DragHandle />,
  }

  const resColumns = hasHandle
    ? [...(props.hasOperation || []), ...[dragHandle], ...props.columns]
    : [...(props.hasOperation || []), ...props.columns]

  return (
    <TableWrap
      pagination={false}
      dataSource={props.dataSource.list}
      columns={resColumns}
      rowKey="index"
      sticky
      showHeader={props.showHeader}
      components={{
        body: {
          wrapper: DraggableContainer,
          row: DraggableBodyRow,
        },
      }}
      scroll={{
        x: 'max-content',
        y: props?.tableY ?? undefined,
      }}
      tableLayout="auto"
      onRow={props.onRow as any}
    />
  )
}

export default DragTable
