import type React from 'react'
import { useState, useCallback } from 'react'
import { Pagination, Dropdown, Table } from 'antd'
import styled from '@emotion/styled'
import { TableWrap, PaginationWrap } from '@/components/StyleCommon'
import IconFont from '@/components/IconFont'
import { ShapeContent } from '@/components/Shape'
import { LevelContent } from '@/components/Level'
import PopConfirm from '@/components/Popconfirm'
import { useNavigate } from 'react-router-dom'
import { OmitText } from '@star-yun/ui'

const StatusWrap = styled.div({
  height: 22,
  borderRadius: 6,
  padding: '0 8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid #2877FF',
  color: '#2877FF',
  width: 'fit-content',
  cursor: 'pointer',
})

const PriorityWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  div: {
    color: '#323233',
    fontSize: 14,
    marginLeft: 8,
  },
  '.anticon': {
    fontSize: 16,
  },
})

const Content = styled.div({
  padding: 24,
  background: '#F5F7FA',
  height: 'auto',
})

interface Props {
  menu: React.ReactElement
  List: any[]
}

const priorityList = [
  { name: '高',
    type: 'tall',
    color: '#ff5c5e' },
  { name: '中',
    type: 'middle',
    color: '#fa9746' },
  { name: '低',
    type: 'low',
    color: '#43ba9a' },
  { name: '极低',
    type: 'knockdown',
    color: '#bbbdbf' },
]

export default (props: Props) => {
  const [rowActiveIndex, setRowActiveIndex] = useState(null)
  const navigate = useNavigate()
  const onTableRow = useCallback(
    (row: any) => {
      return {
        onMouseEnter: () => {
          setRowActiveIndex(row.id)
        },
        onMouseLeave: () => {
          setRowActiveIndex(null)
        },
      }
    },
    [],
  )

  const onChangePage = (page: React.SetStateAction<number>, size: any) => {
    console.log(
      page,
      size,
    )
  }

  const onShowSizeChange = (current: number, pageSize: number) => {
    console.log(
      current,
      pageSize,
    )
  }

  const columnsChild = [
    {
      title: '项目名称',
      dataIndex: 'name',
      render: (text: string) => {
        return <OmitText width={180}>{text}</OmitText>
      },
    },
    {
      title: 'ID',
      dataIndex: 'id',
      sorter: {
        compare: (a: any, b: any) => a.demand - b.demand,
      },
    },
    {
      title: '需求名称',
      dataIndex: 'name',
      render: (text: string) => {
        return <OmitText width={180}>{text}</OmitText>
      },
      sorter: {
        compare: (a: any, b: any) => a.iteration - b.iteration,
      },
    },
    {
      title: '迭代',
      dataIndex: 'iteration',
      sorter: {
        compare: (a: any, b: any) => a.progress - b.progress,
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (text: string, record: any) => {
        return (
          <PopConfirm
            content={({ onHide }: { onHide(): void }) => {
              return (
                <ShapeContent
                  tap={() => {}}
                  hide={onHide}
                  record={record}
                />
              )
            }}
            record={record}
          >
            <StatusWrap>{text}</StatusWrap>
          </PopConfirm>
        )
      },
    },
    {
      title: '创建人',
      dataIndex: 'dealName',
    },
  ]

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (text: string, record: any) => {
        return (
          <div style={{ display: 'flex',
            alignItems: 'center' }}>
            <div
              style={{
                visibility: record.id === rowActiveIndex ? 'visible' : 'hidden',
              }}
            >
              <Dropdown
                overlay={props.menu}
                trigger={['hover']}
                placement="bottomRight"
                getPopupContainer={node => node}
              >
                <IconFont
                  style={{ fontSize: 16,
                    color: '#2877FF',
                    cursor: 'pointer' }}
                  type="more"
                />
              </Dropdown>
            </div>
            <div style={{ marginLeft: 32 }}>{text}</div>
          </div>
        )
      },
    },
    {
      title: '标题',
      dataIndex: 'name',
      render: (text: string) => {
        return (
          <div
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/Detail/Demand?type=info')}
          >
            <OmitText width={200}>{text}</OmitText>
          </div>
        )
      },
    },
    {
      title: '需求数',
      dataIndex: 'demand',
      render: (text: string, record: any) => {
        return (
          <PopConfirm
            content={({ onHide }: { onHide(): void }) => {
              return (
                <Table
                  pagination={false}
                  columns={columnsChild}
                  dataSource={props.List}
                />
              )
            }}
            record={record}
          >
            <div style={{ cursor: 'pointer' }}>{text}</div>
          </PopConfirm>
        )
      },
      sorter: {
        compare: (a: any, b: any) => a.demand - b.demand,
      },
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      render: (text: string, record: any) => {
        return (
          <PopConfirm
            content={({ onHide }: { onHide(): void }) => {
              return (
                <LevelContent
                  tap={() => {}}
                  hide={onHide}
                  record={record}
                />
              )
            }}
            record={record}
          >
            <PriorityWrap>
              <IconFont
                type={priorityList[Number(text)].type}
                style={{
                  fontSize: 16,
                  color: priorityList[Number(text)].color,
                }}
              />
              <div>{priorityList[Number(text)].name}</div>
            </PriorityWrap>
          </PopConfirm>
        )
      },
      sorter: {
        compare: (a: any, b: any) => a.iteration - b.iteration,
      },
    },
    {
      title: '迭代',
      dataIndex: 'iteration',
      sorter: {
        compare: (a: any, b: any) => a.progress - b.progress,
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (text: string, record: any) => {
        return (
          <PopConfirm
            content={({ onHide }: { onHide(): void }) => {
              return (
                <ShapeContent
                  tap={() => {}}
                  hide={onHide}
                  record={record}
                />
              )
            }}
            record={record}
          >
            <StatusWrap>{text}</StatusWrap>
          </PopConfirm>
        )
      },
    },
    {
      title: '处理人',
      dataIndex: 'dealName',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      sorter: {
        compare: (a: any, b: any) => a.progress - b.progress,
      },
    },
    {
      title: '预计开始时间',
      dataIndex: 'startTime',
      sorter: {
        compare: (a: any, b: any) => a.progress - b.progress,
      },
    },
    {
      title: '预计结束时间',
      dataIndex: 'endTime',
      sorter: {
        compare: (a: any, b: any) => a.progress - b.progress,
      },
    },
  ]
  return (
    <Content>
      <TableWrap
        rowKey="key"
        onRow={onTableRow}
        columns={columns}
        dataSource={props.List}
        pagination={false}
        scroll={{ x: 'max-content' }}
        showSorterTooltip={false}
      />
      <PaginationWrap>
        <Pagination
          defaultCurrent={1}
          current={1}
          showSizeChanger
          showQuickJumper
          total={200}
          showTotal={total => `Total ${total} items`}
          pageSizeOptions={['10', '20', '50']}
          onChange={onChangePage}
          onShowSizeChange={onShowSizeChange}
          hideOnSinglePage
        />
      </PaginationWrap>
    </Content>
  )
}
