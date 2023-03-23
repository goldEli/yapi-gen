// 可拖拽列宽的表格

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Spin, Table } from 'antd'
import { Resizable } from 'react-resizable'
import './index.css'
import styled from '@emotion/styled'
import NewLoadingTransition from '../NewLoadingTransition'

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
    width: 70px;
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
  .ant-table-tbody > tr.ant-table-row:hover > td,
  .ant-table-tbody > tr > td.ant-table-cell-row-hover {
    background: var(--hover-d2);
  }
  .ant-table-row-selected {
    background: var(--selected);
  }
  .ant-table-row:hover {
    .dropdownIcon {
      visibility: visible;
    }
  }
`

const DataWrap = styled.div<{ height?: any }>`
  height: ${props => props.height};
  overflow-x: auto;
  margin-left: 24px;
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
  onRow?(): void
  expandable?: any
}
// 拖拽调整table
const ResizeTable = (props: ResizeTableProps) => {
  // 表格列
  const [cols, setCols] = useState<any>([])
  const [columns, setColumns] = useState<any>([])
  const [dataWrapHeight, setDataWrapHeight] = useState(0)
  const [tableWrapHeight, setTableWrapHeight] = useState(0)
  const dataWrapRef = useRef<HTMLDivElement>(null)
  const canRun = useRef(true)

  // 处理拖拽
  const handleResize =
    (index: any) =>
    (e: any, { size }: any) => {
      if (!canRun.current) {
        return
      }
      setTimeout(() => {
        canRun.current = true
      }, 1000 / 70)
      canRun.current = false
      const nextColumns = [...cols]
      // 拖拽是调整宽度
      nextColumns[index] = { ...nextColumns[index], width: size.width }
      setCols(nextColumns)
    }

  useEffect(() => {
    setCols(props.col)
  }, [props.col])

  useEffect(() => {
    setColumns(
      (cols || []).map((col: any, index: number) => {
        if (col === Table.SELECTION_COLUMN) {
          return col
        }
        return {
          ...col,
          onHeaderCell: (column: any) => ({
            width: column.width,
            onResize: handleResize(index),
          }),
        }
      }),
    )
  }, [cols])

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

  return (
    <DataWrap height={props.dataWrapNormalHeight} ref={dataWrapRef}>
      <div
        style={{ height: '100%' }}
        className="components-table-resizable-column"
      >
        <Spin indicator={<NewLoadingTransition />} spinning={props.isSpinning}>
          {!!props.dataSource && props.dataSource?.length > 0 && (
            <TableWrap
              rowKey="id"
              columns={columns}
              dataSource={props.dataSource}
              pagination={false}
              components={{
                header: {
                  cell: ResizeTitle,
                },
              }}
              scroll={{
                x: 'max-content',
                y: tableY,
              }}
              tableLayout="auto"
              showSorterTooltip={false}
              rowSelection={props?.rowSelection}
              expandable={props?.expandable}
              onRow={props.onRow as any}
            />
          )}
          {props.dataSource && props.dataSource?.length <= 0 && (
            <div style={{ height: '100%' }}>{props.noData}</div>
          )}
        </Spin>
      </div>
    </DataWrap>
  )
}

export default ResizeTable
