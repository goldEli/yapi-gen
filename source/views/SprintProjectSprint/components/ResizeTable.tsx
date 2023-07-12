// 可拖拽列宽的表格

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Spin, Table } from 'antd'
import { Resizable, ResizeCallbackData } from 'react-resizable'
import styled from '@emotion/styled'
import { useSelector } from '@store/index'
import NewLoadingTransition from '@/components/NewLoadingTransition'

const TableWrap = styled(Table)`
  user-select: none;
  height: 100%;
  .ant-table-wrapper,
  .ant-table,
  .ant-table-container,
  .ant-table-content {
    height: 100%;
  }
  .ant-table-tbody .tagLength {
    visibility: hidden;
  }
  .tagLength {
    margin-left: 8px;
    font-size: 12px;
    color: var(--neutral-n3);
  }
  .ant-table-selection {
    flex-direction: inherit;
  }
  .ant-table-selection-column {
    text-align: left;
    width: 50px;
  }
  .ant-table-thead > tr {
    height: 44px;
  }
  .ant-table-thead > tr > th {
    border-bottom: 0;
    font-size: var(--font12);
    color: var(--neutral-n3);
    font-family: SiYuanMedium;
  }
  .ant-table-cell {
    /* min-width: 80px; */
    padding: 0 0 0 16px;
  }
  .ant-table-row {
    height: 52px;
  }

  .ant-table-row-selected {
    background: var(--hover-d2);
    > td.ant-table-cell-fix-right {
      background: var(--hover-d2);
    }
    &:hover {
      background: var(--selected);
      > td.ant-table-cell-fix-right {
        background: var(--selected);
      }
    }
  }
  .ant-table-row:hover {
    .dropdownIcon {
      visibility: visible;
    }
  }
  .ant-table-row:not(.ant-table-row-selected) {
    &:hover {
      background: var(--hover-d2);
      > td.ant-table-cell-fix-right {
        background: var(--hover-d2);
      }
    }
  }
  .activeListItem {
    background: var(--hover-d2);
  }
  //去掉表格颜色过度
  .ant-table-tbody > tr > td {
    transition: none;
  }
  .ant-table-tbody > tr.ant-table-row-selected {
    > td:not(.ant-table-cell-fix-right) {
      background: transparent;
    }
  }
  .ant-table-tbody > tr.ant-table-row:hover > td:not(.ant-table-cell-fix-right),
  .ant-table-tbody
    > tr
    > td.ant-table-cell-row-hover:not(.ant-table-cell-fix-right) {
    background: transparent;
  }
`

const DataWrap = styled.div<{ height?: any }>`
  height: ${props => props.height};
  overflow-x: auto;
  min-height: 100px;
`

// 调整table表头
const ResizeTitle = (props: any) => {
  const { onResize, width, ...restProps } = props

  if (!width) {
    return <th {...restProps} />
  }

  return (
    <Resizable
      width={width}
      height={0}
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
      minConstraints={[200, 200]}
      handle={
        <span
          className="react-resizable-handle"
          onClick={e => {
            e.stopPropagation()
          }}
        />
      }
    >
      <th {...restProps} />
    </Resizable>
  )
}

interface ResizeTableProps {
  col: any
  dataSource: any
  dataWrapNormalHeight: any
  noData?: any
  isSpinning?: boolean
  rowSelection?: any
  onRow?(
    record: any,
    index: number,
  ): {
    onMouseEnter?(): void
    onMouseLeave?(): void
    onClick?(): void
    onDoubleClick?(): void
  }
  expandable?: any
  isTree?: boolean
  rowClassName?: any
  className?: any
  components?: any
  footer?: any
  pagination: any
  height?: any
}
// 拖拽调整table
const ResizeTable = (props: ResizeTableProps) => {
  const { listActiveId } = useSelector(store => store.global)
  // 表格列
  const [columns, setColumns] = useState<any>([])
  const [dataWrapHeight, setDataWrapHeight] = useState(0)
  const [tableWrapHeight, setTableWrapHeight] = useState(0)
  const dataWrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setColumns(props.col)
  }, [props.col])

  const handleResize =
    (index: number) =>
    (_: React.SyntheticEvent<Element>, { size }: ResizeCallbackData) => {
      const newColumns = [...columns]
      newColumns[index] = {
        ...newColumns[index],
        width: size.width,
      }
      setColumns(newColumns)
    }

  useLayoutEffect(() => {
    if (dataWrapRef.current) {
      const currentHeight = dataWrapRef.current.clientHeight
      if (currentHeight !== dataWrapHeight) {
        setDataWrapHeight(currentHeight)
      }

      const tableBody = dataWrapRef.current.querySelector('.ant-table-tbody')
      if (tableBody && tableBody.clientHeight !== tableWrapHeight) {
        setTableWrapHeight(tableBody.clientHeight)
      }
    }
  }, [props.dataSource])

  const tableY =
    tableWrapHeight > dataWrapHeight - 52 ? dataWrapHeight - 52 : void 0

  const mergeColumns = columns?.map((col: any, index: number) => {
    if (col === Table.SELECTION_COLUMN) {
      return col
    }
    if (!col.width) {
      return {
        ...col,
        width: 100,
      }
    }
    return {
      ...col,
      onHeaderCell: (column: any) => {
        if (column.key === 'name') {
          const doms =
            document.querySelectorAll<HTMLSpanElement>('.controlMaxWidth')

          if (doms) {
            doms.forEach(dom => {
              const level = Number(dom.className.split('level')[1])
              dom.style.maxWidth = props.isTree
                ? `${column.width - level * 24}px`
                : `${column.width}px`
            })
          }
        }
        return {
          width: column.width,
          onResize: handleResize(index) as React.ReactEventHandler<any>,
        }
      },
    }
  })

  return (
    <DataWrap height={props.dataWrapNormalHeight} ref={dataWrapRef}>
      <div
        style={{ height: '100%' }}
        className="components-table-resizable-column"
      >
        <Spin indicator={<NewLoadingTransition />} spinning={props.isSpinning}>
          {!!props.dataSource && props.dataSource?.length > 0 && (
            <TableWrap
              style={{ height: props?.height }}
              className={props?.className}
              rowKey="id"
              columns={mergeColumns}
              dataSource={props.dataSource}
              pagination={props?.pagination}
              components={{
                header: {
                  cell: ResizeTitle,
                },
                ...(props?.components || {}),
              }}
              scroll={{
                x: 'max-content',
              }}
              tableLayout="auto"
              showSorterTooltip={false}
              rowSelection={props?.rowSelection}
              expandable={props?.expandable}
              onRow={props.onRow as any}
              rowClassName={(row: any) =>
                row.id === listActiveId ? 'activeListItem' : props.rowClassName
              }
              footer={props?.footer}
            />
          )}
          {props.dataSource && props.dataSource?.length <= 0 ? (
            <div style={{ height: '100%' }}>{props.noData}</div>
          ) : null}
        </Spin>
      </div>
    </DataWrap>
  )
}

export default ResizeTable
