// 可拖拽列宽的表格

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Table } from 'antd'
import { Resizable } from 'react-resizable'
import './index.css'
import styled from '@emotion/styled'

const TableWrap = styled(Table)`
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
    min-width: 100px;
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
`

const DataWrap = styled.div<{ height: any }>`
  height: ${props => props.height};
  overflow-x: auto;
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
}

// 拖拽调整table
const ResizeTable = (props: ResizeTableProps) => {
  // 表格列
  const [cols, setCols] = useState<any>([])
  const [columns, setColumns] = useState<any>([])
  const [dataWrapHeight, setDataWrapHeight] = useState(0)
  const [tableWrapHeight, setTableWrapHeight] = useState(0)
  const dataWrapRef = useRef<HTMLDivElement>(null)

  // 处理拖拽
  const handleResize =
    (index: any) =>
    (e: any, { size }: any) => {
      const nextColumns = [...cols]
      // 拖拽是调整宽度
      nextColumns[index] = { ...nextColumns[index], width: size.width }
      setCols(nextColumns)
    }

  useEffect(() => {
    setCols(props.col)
  }, [])

  useEffect(() => {
    setColumns(
      (cols || []).map((col: any, index: number) => ({
        ...col,
        onHeaderCell: (column: any) => ({
          width: column.width,
          onResize: handleResize(index),
        }),
      })),
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

  // console.log(columns,'===')

  return (
    <DataWrap height={props.dataWrapNormalHeight} ref={dataWrapRef}>
      <div
        style={{ height: '100%' }}
        className="components-table-resizable-column"
      >
        <TableWrap
          rowKey="id"
          pagination={false}
          components={{
            header: {
              cell: ResizeTitle,
            },
          }}
          columns={columns}
          dataSource={props.dataSource}
          scroll={{
            x: 'max-content',
            y: tableY,
          }}
          tableLayout="auto"
          showSorterTooltip={false}
        />
      </div>
    </DataWrap>
  )
}

export default ResizeTable