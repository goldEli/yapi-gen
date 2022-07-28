/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-empty-function */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/naming-convention */
import IconFont from '@/components/IconFont'
import { Menu, Dropdown, Pagination } from 'antd'
import styled from '@emotion/styled'
import { TableWrap, PaginationWrap } from '@/components/StyleCommon'
import { useEffect, useState } from 'react'
import { ShapeContent } from '@/components/Shape'
import { LevelContent } from '@/components/Level'
import PopConfirm from '@/components/Popconfirm'
import { useModel } from '@/models'
import { useSearchParams } from 'react-router-dom'

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

const statusList = [
  { id: 0, name: '规划中', color: '#2877ff' },
  { id: 1, name: '实现中', color: '#2877ff' },
  { id: 2, name: '已实现', color: '#2877ff' },
  { id: 3, name: '已关闭', color: '#2877ff' },
]

const priorityList = [
  { name: '高', type: 'tall', color: '#ff5c5e' },
  { name: '中', type: 'middle', color: '#fa9746' },
  { name: '低', type: 'low', color: '#43ba9a' },
  { name: '极低', type: 'knockdown', color: '#bbbdbf' },
]

const DemandWrap = () => {
  const [searchParams] = useSearchParams()
  const projectId = searchParams.get('id')
  const iterateId = searchParams.get('iterateId')
  const { getDemandList } = useModel('demand')
  const [visible, setVisible] = useState(false)
  const [dataList, setDataList] = useState<any>([])

  const getList = async () => {
    const result = await getDemandList({ projectId, iterateIds: [iterateId] })
    setDataList(result)
  }

  useEffect(() => {
    getList()
  }, [])

  const menu = (
    <Menu
      items={[
        {
          key: '1',
          label: <div onClick={() => setVisible(true)}>编辑</div>,
        },
        {
          key: '3',
          label: <div>删除</div>,
        },
      ]}
    />
  )

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (text: string) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Dropdown
              overlay={menu}
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
    },
    {
      title: '子需求',
      dataIndex: 'demand',
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
        compare: (a: any, b: any) => a.priority - b.priority,
      },
    },
    {
      title: '迭代',
      dataIndex: 'iteration',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (text: number, record: any) => {
        return (
          <PopConfirm
            content={({ onHide }: { onHide(): void }) => {
              return (
                <ShapeContent tap={() => {}} hide={onHide} record={record} />
              )
            }}
            record={record}
          >
            <StatusWrap
              style={{
                color: statusList.filter(i => i.id === text)[0].color,
                border: `1px solid ${
                  statusList.filter(i => i.id === text)[0].color
                }`,
              }}
            >
              {statusList.filter(i => i.id === text)[0].name}
            </StatusWrap>
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

  const onChangePage = () => {

    //
  }

  const onShowSizeChange = () => {

    //
  }
  return (
    <div>
      <TableBox
        rowKey="id"
        columns={columns}
        dataSource={dataList?.list}
        pagination={false}
        scroll={{ x: 'max-content' }}
        showSorterTooltip={false}
      />
      <PaginationWrap>
        <Pagination
          defaultCurrent={1}
          current={dataList?.currentPage}
          showSizeChanger
          showQuickJumper
          total={dataList?.total}
          showTotal={total => `Total ${total} items`}
          pageSizeOptions={['10', '20', '50']}
          onChange={onChangePage}
          onShowSizeChange={onShowSizeChange}
          hideOnSinglePage
        />
      </PaginationWrap>
    </div>
  )
}

export default DemandWrap
