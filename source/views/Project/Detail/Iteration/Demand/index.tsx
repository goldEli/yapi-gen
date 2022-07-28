/* eslint-disable camelcase */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-empty-function */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/naming-convention */
import IconFont from '@/components/IconFont'
import { Menu, Dropdown, Pagination, message, Table, Popover } from 'antd'
import styled from '@emotion/styled'
import { TableWrap, PaginationWrap } from '@/components/StyleCommon'
import { useEffect, useState } from 'react'
import { ShapeContent } from '@/components/Shape'
import { LevelContent } from '@/components/Level'
import PopConfirm from '@/components/Popconfirm'
import { useModel } from '@/models'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { OmitText } from '@star-yun/ui'
import EditDemand from '../../Demand/components/EditDemand'
import DeleteConfirm from '@/components/DeleteConfirm'

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

const ChildDemandTable = (props: { value: any; row: any }) => {
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

const DemandWrap = () => {
  const [searchParams] = useSearchParams()
  const projectId = searchParams.get('id')
  const iterateId = searchParams.get('iterateId')
  const { getDemandList, updateDemandStatus, updatePriority, deleteDemand }
    = useModel('demand')
  const [isVisible, setIsVisible] = useState(false)
  const [isDelete, setIsDelete] = useState(false)
  const [dataList, setDataList] = useState<any>([])
  const navigate = useNavigate()
  const [pageObj, setPageObj] = useState<any>({ page: 1, size: 10 })
  const [demandItem, setDemandItem] = useState<any>({})
  const [deleteId, setDeleteId] = useState(0)

  const getList = async (item?: any) => {
    const result = await getDemandList({
      projectId,
      iterateIds: [iterateId],
      page: item ? item.page : 1,
      pageSize: item ? item.size : 10,
    })
    setDataList(result)
  }

  useEffect(() => {
    getList()
  }, [])

  const onChangePage = (page: number, size: number) => {
    setPageObj({ page, size })
    getList({ page, size })
  }

  const onShowSizeChange = (page: number, size: number) => {
    setPageObj({ page, size })
    getList({ page, size })
  }

  const onClickRow = (item: any) => {
    setDemandItem(item)
    setIsVisible(true)
  }

  const onDelete = (item: any) => {
    setDeleteId(item.id)
    setIsDelete(true)
  }

  const menu = (item: any) => (
    <Menu
      items={[
        {
          key: '1',
          label: <div onClick={() => onClickRow(item)}>编辑</div>,
        },
        {
          key: '2',
          label: <div onClick={() => onDelete(item)}>删除</div>,
        },
      ]}
    />
  )

  const onClickItem = (item: any) => {
    navigate(`/Detail/Demand?type=info&id=${projectId}&demandId=${item.id}`)
  }

  const onChangeState = async (item: any) => {
    try {
      await updatePriority({ demandId: item.id, priorityId: item.priorityId })
      message.success('优先级修改成功')
      getList(pageObj)
    } catch (error) {

      //
    }
  }

  const onChangeStatus = async (value: any) => {
    try {
      await updateDemandStatus(value)
      message.success('状态修改成功')
      getList(pageObj)
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
      title: '子需求',
      dataIndex: 'demand',
      render: (text: string, record: any) => {
        return <ChildDemandTable value={text} row={record} />
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

  const onChangeVisible = () => {
    setIsVisible(!isVisible)
    setDemandItem({})
  }

  const onDeleteConfirm = async () => {
    try {
      await deleteDemand({ projectId, id: deleteId })
      message.success('删除成功')
      setIsVisible(false)
      setDeleteId(0)
      getList(pageObj)
    } catch (error) {

      //
    }
  }

  return (
    <div>
      <DeleteConfirm
        text="确认删除该需求？"
        isVisible={isDelete}
        onChangeVisible={() => setIsDelete(!isDelete)}
        onConfirm={onDeleteConfirm}
      />
      <EditDemand
        visible={isVisible}
        onChangeVisible={onChangeVisible}
        id={demandItem?.id}
        onUpdate={() => getList(pageObj)}
        isIterateId={iterateId}
      />
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
