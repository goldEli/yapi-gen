/* eslint-disable no-empty-function */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/naming-convention */
import { useState } from 'react'
import { Pagination, Dropdown, Table } from 'antd'
import styled from '@emotion/styled'
import { TableWrap, PaginationWrap } from '@/components/StyleCommon'
import IconFont from '@/components/IconFont'
import { ShapeContent } from '@/components/Shape'
import { LevelContent } from '@/components/Level'
import PopConfirm from '@/components/Popconfirm'
import { useNavigate } from 'react-router-dom'
import { OmitText } from '@star-yun/ui'

const StatusWrap = styled.div<{ color?: string }>(
  {
    height: 22,
    borderRadius: 6,
    padding: '0 8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'fit-content',
    cursor: 'pointer',
  },
  ({ color }) => ({
    color,
    border: `1px solid ${color}`,
  }),
)

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

const RowIconFont = styled(IconFont)({
  visibility: 'hidden',
  fontSize: 16,
  cursor: 'pointer',
  color: '#2877ff',
})

const TableBox = styled(TableWrap)({
  '.ant-table-row:hover': {
    [RowIconFont.toString()]: {
      visibility: 'visible',
    },
  },
})

interface Props {
  menu: React.ReactElement
  data: any
}

const priorityList = [
  { name: '高', type: 'tall', color: '#ff5c5e' },
  { name: '中', type: 'middle', color: '#fa9746' },
  { name: '低', type: 'low', color: '#43ba9a' },
  { name: '极低', type: 'knockdown', color: '#bbbdbf' },
]

const DemandTable = (props: Props) => {
  const navigate = useNavigate()

  const onChangePage = () => {

    //
  }

  const onShowSizeChange = () => {

    //
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
      render: (text: any, record: any) => {
        return (
          <PopConfirm
            content={({ onHide }: { onHide(): void }) => {
              return (
                <ShapeContent tap={() => {}} hide={onHide} record={record} />
              )
            }}
            record={record}
          >
            <StatusWrap color={text.color}>{text.content}</StatusWrap>
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
      render: (text: string) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Dropdown
              overlay={props.menu}
              trigger={['hover']}
              placement="bottomRight"
              getPopupContainer={node => node}
            >
              <RowIconFont type="more" />
            </Dropdown>
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
                  dataSource={props.data?.list}
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
      render: (text: any, record: any) => {
        return (
          <PopConfirm
            content={({ onHide }: { onHide(): void }) => {
              return (
                <LevelContent
                  onTap={() => {}}
                  onHide={onHide}
                  record={record}
                />
              )
            }}
            record={record}
          >
            <PriorityWrap>
              <IconFont
                type={text.icon}
                style={{
                  fontSize: 16,
                  color: text.color,
                }}
              />
              <div>{text.content}</div>
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
      render: (text: any, record: any) => {
        return (
          <PopConfirm
            content={({ onHide }: { onHide(): void }) => {
              return (
                <ShapeContent
                  tap={() => {

                    //
                  }}
                  hide={onHide}
                  record={record}
                />
              )
            }}
            record={record}
          >
            <StatusWrap color={text.color}>{text.content}</StatusWrap>
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
      dataIndex: 'time',
      sorter: {
        compare: (a: any, b: any) => a.progress - b.progress,
      },
    },
    {
      title: '预计开始时间',
      dataIndex: 'expectedStart',
      sorter: {
        compare: (a: any, b: any) => a.progress - b.progress,
      },
    },
    {
      title: '预计结束时间',
      dataIndex: 'expectedEnd',
      sorter: {
        compare: (a: any, b: any) => a.progress - b.progress,
      },
    },
  ]
  return (
    <Content>
      <TableBox
        rowKey="id"
        columns={columns}
        dataSource={props.data?.list}
        pagination={false}
        scroll={{ x: 'max-content' }}
        showSorterTooltip={false}
      />
      <PaginationWrap>
        <Pagination
          defaultCurrent={1}
          current={props.data?.currentPage}
          showSizeChanger
          showQuickJumper
          total={props.data?.total}
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

export default DemandTable
