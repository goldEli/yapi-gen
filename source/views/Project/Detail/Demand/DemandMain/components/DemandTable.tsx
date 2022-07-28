/* eslint-disable camelcase */
/* eslint-disable no-empty-function */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/naming-convention */
import { useState } from 'react'
import { Pagination, Dropdown, Table, Menu, Popover, message } from 'antd'
import styled from '@emotion/styled'
import { TableWrap, PaginationWrap } from '@/components/StyleCommon'
import IconFont from '@/components/IconFont'
import { ShapeContent } from '@/components/Shape'
import { LevelContent } from '@/components/Level'
import PopConfirm from '@/components/Popconfirm'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { OmitText } from '@star-yun/ui'
import { useModel } from '@/models'

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
  data: any
  onChangeVisible(e: any, item: any): void
  onDelete(item: any): void
  onChangePageNavigation?(item: any): void
  onChangeRow?(): void
}

interface ChildeProps {
  value: any
  row: any
}

const ChildDemandTable = (props: ChildeProps) => {
  const [searchParams] = useSearchParams()
  const projectId = searchParams.get('id')
  const [isVisible, setIsVisible] = useState(false)
  const [dataList, setDataList] = useState<any>([])
  const { getDemandList, updateDemandStatus } = useModel('demand')

  const getList = async () => {
    const result = await getDemandList({
      projectId,
      all: true,
      parentId: props.row.id,
    })
    setDataList(result)
  }

  const onChildClick = async () => {
    getList()
    setIsVisible(!isVisible)
  }

  const onChangeStatus = async (value: any) => {
    try {
      await updateDemandStatus(value)
      message.success('状态修改成功')
      getList()
    } catch (error) {

      //
    }
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
                <ShapeContent
                  tap={value => onChangeStatus(value)}
                  hide={onHide}
                  record={{
                    id: record.id,
                    project_id: projectId,
                    status: {
                      id: record.status.id,
                      can_changes: record.status.can_changes,
                    },
                  }}
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
      title: '创建人',
      dataIndex: 'dealName',
    },
  ]

  return (
    <Popover
      visible={isVisible}
      placement="bottom"
      trigger="click"
      content={
        <Table
          rowKey="id"
          pagination={false}
          columns={columnsChild}
          dataSource={dataList}
        />
      }
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
        }}
        onClick={onChildClick}
      >
        <IconFont
          type="apartment"
          style={{ color: '#969799', fontSize: 16, marginRight: 8 }}
        />
        <span style={{ color: '#323233', fontSize: 16 }}>{props.value}</span>
      </div>
    </Popover>
  )
}

const DemandTable = (props: Props) => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const projectId = searchParams.get('id')
  const { updatePriority, updateDemandStatus } = useModel('demand')

  const onChangePage = (page: number, size: number) => {
    props.onChangePageNavigation?.({ page, size })
  }

  const onShowSizeChange = (page: number, size: number) => {
    props.onChangePageNavigation?.({ page, size })
  }

  const onClickItem = (item: any) => {
    navigate(`/Detail/Demand?type=info&id=${projectId}&demandId=${item.id}`)
  }

  const menu = (item: any) => (
    <Menu
      items={[
        {
          key: '1',
          label: <div onClick={e => props.onChangeVisible(e, item)}>编辑</div>,
        },
        {
          key: '2',
          label: <div onClick={() => props.onDelete(item)}>删除</div>,
        },
      ]}
    />
  )

  const onChangeState = async (item: any) => {
    try {
      await updatePriority({ demandId: item.id, priorityId: item.priorityId })
      message.success('优先级修改成功')
      props.onChangeRow?.()
    } catch (error) {

      //
    }
  }

  const onChangeStatus = async (value: any) => {
    try {
      await updateDemandStatus(value)
      message.success('状态修改成功')
      props.onChangeRow?.()
    } catch (error) {

      //
    }
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (text: string, record: any) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Dropdown
              overlay={menu(record)}
              trigger={['click']}
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
      render: (text: string, record: any) => {
        return (
          <div
            style={{ cursor: 'pointer' }}
            onClick={() => onClickItem(record)}
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
        return <ChildDemandTable value={text} row={record} />
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
                  onTap={item => onChangeState(item)}
                  onHide={onHide}
                  record={{ project_id: projectId, id: record.id }}
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
                  tap={value => onChangeStatus(value)}
                  hide={onHide}
                  record={{
                    id: record.id,
                    project_id: projectId,
                    status: {
                      id: record.status.id,
                      can_changes: record.status.can_changes,
                    },
                  }}
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
