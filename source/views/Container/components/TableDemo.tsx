import React, { useEffect, useState } from 'react'
import { Table } from 'antd'
import { Resizable } from 'react-resizable'
import './index.css'

// 调整table表头
const ResizeableTitle = (props: any) => {
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

// 拖拽调整table
const ResizeTable = () => {
  // table 数据
  const dataSource = () => {
    const data = []
    for (let i = 0; i <= 500; i++) {
      data.push({
        key: i,
        name: '胡彦斌',
        age: 32,
        address: '西湖区湖底公园1号',
      })
    }
    return data
  }

  // 表格列
  const [cols, setCols] = useState([
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 100,
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      width: 100,
    },
    {
      title: '住址',
      dataIndex: 'address',
      key: 'address',
    },
  ])
  const [columns, setColumns] = useState<any>([])

  // 定义头部组件
  const components = {
    header: {
      cell: ResizeableTitle,
    },
  }

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
    setColumns(
      (cols || []).map((col, index) => ({
        ...col,
        onHeaderCell: (column: any) => ({
          width: column.width,
          onResize: handleResize(index),
        }),
      })),
    )
  }, [cols])

  return (
    <div className="components-table-resizable-column">
      <Table
        size="small"
        bordered
        components={components}
        columns={columns}
        dataSource={dataSource()}
      />
    </div>
  )
}

export default ResizeTable
