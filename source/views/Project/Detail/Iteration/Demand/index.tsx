/* eslint-disable max-lines */
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
import Sort from '@/components/Sort'
import { getIsPermission } from '@/tools/index'
import { useTranslation } from 'react-i18next'

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
  height: 26,
  padding: '0 6px',
  width: 'fit-content',
  borderRadius: 6,
  div: {
    color: '#323233',
    fontSize: 14,
    marginLeft: 8,
  },
  '.icon': {
    marginLeft: 8,
    visibility: 'hidden',
    fontSize: 16,
    color: '#2877ff',
  },
  '.priorityIcon': {
    fontSize: 16,
    svg: {
      margin: '0!important',
    },
  },
  '&: hover': {
    background: 'rgba(240, 244, 250, 1)',
    '.icon': {
      visibility: 'visible',
    },
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

const NewSort = (sortProps: any) => {
  return (
    <Sort
      fixedKey={sortProps.fixedKey}
      onChangeKey={sortProps.onUpdateOrderKey}
      nowKey={sortProps.nowKey}
      order={sortProps.order === 'asc' ? 1 : 2}
    >
      {sortProps.children}
    </Sort>
  )
}

export const ChildDemandTable = (props: { value: any; row: any; id?: any }) => {
  const [t] = useTranslation()
  const [searchParams] = useSearchParams()
  const projectId = searchParams.get('id') || props.id
  const [isVisible, setIsVisible] = useState(false)
  const [dataList, setDataList] = useState<any>([])
  const { getDemandList, updateDemandStatus } = useModel('demand')
  const [order, setOrder] = useState<any>({ value: '', key: '' })

  const getList = async (item: any) => {
    const result = await getDemandList({
      projectId,
      all: true,
      parentId: props.row.id,
      order: item.value,
      orderKey: item.key,
    })
    setDataList(result)
  }

  const onChildClick = async () => {
    getList(order)
    setIsVisible(!isVisible)
  }

  const onUpdateOrderKey = (key: any, val: any) => {
    setOrder({ value: val === 2 ? 'desc' : 'asc', key })
    getList({ value: val === 2 ? 'desc' : 'asc', key })
  }

  const onChangeStatus = async (value: any) => {
    try {
      await updateDemandStatus(value)
      message.success(t('common.statusSuccess'))
      getList(order)
    } catch (error) {

      //
    }
  }

  const columnsChild = [
    {
      title: t('common.projectName'),
      dataIndex: 'name',
      render: (text: string) => {
        return <OmitText width={180}>{text}</OmitText>
      },
    },
    {
      title: (
        <NewSort
          fixedKey="id"
          nowKey={order.key}
          order={order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('project.projectId')}
        </NewSort>
      ),
      dataIndex: 'id',
    },
    {
      title: (
        <NewSort
          fixedKey="name"
          nowKey={order.key}
          order={order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('common.demandName')}
        </NewSort>
      ),
      dataIndex: 'name',
      render: (text: string) => {
        return <OmitText width={180}>{text}</OmitText>
      },
    },
    {
      title: (
        <NewSort
          fixedKey="iterate_name"
          nowKey={order.key}
          order={order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('common.iterate')}
        </NewSort>
      ),
      dataIndex: 'iteration',
    },
    {
      title: (
        <NewSort
          fixedKey="status"
          nowKey={order.key}
          order={order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('common.status')}
        </NewSort>
      ),
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
      title: (
        <NewSort
          fixedKey="user_name"
          nowKey={order.key}
          order={order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('common.createName')}
        </NewSort>
      ),
      dataIndex: 'dealName',
    },
  ]

  const onVisibleChange = (visible: any) => {
    setIsVisible(visible)
  }

  return (
    <Popover
      key={isVisible.toString()}
      visible={isVisible}
      placement="bottom"
      trigger="click"
      onVisibleChange={onVisibleChange}
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
  const [t] = useTranslation()
  const [searchParams] = useSearchParams()
  const projectId = searchParams.get('id')
  const iterateId = searchParams.get('iterateId')
  const { projectInfo } = useModel('project')
  const { getDemandList, updateDemandStatus, updatePriority, deleteDemand }
    = useModel('demand')
  const [isVisible, setIsVisible] = useState(false)
  const [isDelete, setIsDelete] = useState(false)
  const [dataList, setDataList] = useState<any>([])
  const navigate = useNavigate()
  const [pageObj, setPageObj] = useState<any>({ page: 1, size: 10 })
  const [demandItem, setDemandItem] = useState<any>({})
  const [deleteId, setDeleteId] = useState(0)
  const [order, setOrder] = useState<any>({ value: '', key: '' })
  const hasEdit = getIsPermission(
    projectInfo?.projectPermissions,
    'b/story/update',
  )
  const hasDel = getIsPermission(
    projectInfo?.projectPermissions,
    'b/story/delete',
  )

  const getList = async (item?: any, orderVal?: any) => {
    const result = await getDemandList({
      projectId,
      iterateIds: [iterateId],
      page: item ? item.page : 1,
      pageSize: item ? item.size : 10,
      order: orderVal.value,
      orderKey: orderVal.key,
    })
    setDataList(result)
  }

  useEffect(() => {
    getList(pageObj, order)
  }, [])

  const onChangePage = (page: number, size: number) => {
    setPageObj({ page, size })
    getList({ page, size }, order)
  }

  const onShowSizeChange = (page: number, size: number) => {
    setPageObj({ page, size })
    getList({ page, size }, order)
  }

  const onClickRow = (item: any) => {
    setDemandItem(item)
    setIsVisible(true)
  }

  const onDelete = (item: any) => {
    setDeleteId(item.id)
    setIsDelete(true)
  }

  const menu = (item: any) => {
    let menuItems = [
      {
        key: '1',
        label: <div onClick={() => onClickRow(item)}>{t('common.edit')}</div>,
      },
      {
        key: '2',
        label: <div onClick={() => onDelete(item)}>{t('common.del')}</div>,
      },
    ]

    if (hasEdit) {
      menuItems = menuItems.filter((i: any) => i.key !== '1')
    }

    if (hasDel) {
      menuItems = menuItems.filter((i: any) => i.key !== '2')
    }

    return <Menu items={menuItems} />
  }

  const onUpdateOrderKey = (key: any, val: any) => {
    setOrder({ value: val === 2 ? 'desc' : 'asc', key })
    getList(pageObj, { value: val === 2 ? 'desc' : 'asc', key })
  }

  const onClickItem = (item: any) => {
    navigate(`/Detail/Demand?type=info&id=${projectId}&demandId=${item.id}`)
  }

  const onChangeState = async (item: any) => {
    try {
      await updatePriority({ demandId: item.id, priorityId: item.priorityId })
      message.success(t('common.prioritySuccess'))
      getList(pageObj, order)
    } catch (error) {

      //
    }
  }

  const onChangeStatus = async (value: any) => {
    try {
      await updateDemandStatus(value)
      message.success(t('common.statusSuccess'))
      getList(pageObj, order)
    } catch (error) {

      //
    }
  }

  const columns = [
    {
      title: (
        <NewSort
          fixedKey="id"
          nowKey={order.key}
          order={order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          ID
        </NewSort>
      ),
      dataIndex: 'id',
      render: (text: string, record: any) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {hasDel && hasEdit
              ? null
              : (
                  <Dropdown
                    overlay={menu(record)}
                    trigger={['hover']}
                    placement="bottomRight"
                    getPopupContainer={node => node}
                  >
                    <RowIconFont type="more" />
                  </Dropdown>
                )}
            <div style={{ marginLeft: 32 }}>{text}</div>
          </div>
        )
      },
    },
    {
      title: (
        <NewSort
          fixedKey="name"
          nowKey={order.key}
          order={order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('common.title')}
        </NewSort>
      ),
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
      title: (
        <NewSort
          fixedKey="child_story_count"
          nowKey={order.key}
          order={order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('common.childDemand')}
        </NewSort>
      ),
      dataIndex: 'demand',
      render: (text: string, record: any) => {
        return <ChildDemandTable value={text} row={record} />
      },
    },
    {
      title: (
        <NewSort
          fixedKey="priority"
          nowKey={order.key}
          order={order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('common.priority')}
        </NewSort>
      ),
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
              <div>
                <span>{text.content || '--'}</span>
                <IconFont className="icon" type="down-icon" />
              </div>
            </PriorityWrap>
          </PopConfirm>
        )
      },
    },
    {
      title: (
        <NewSort
          fixedKey="iterate_name"
          nowKey={order.key}
          order={order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('common.iterate')}
        </NewSort>
      ),
      dataIndex: 'iteration',
    },
    {
      title: (
        <NewSort
          fixedKey="status"
          nowKey={order.key}
          order={order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('common.status')}
        </NewSort>
      ),
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
      title: (
        <NewSort
          fixedKey="users_name"
          nowKey={order.key}
          order={order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('common.dealName')}
        </NewSort>
      ),
      dataIndex: 'dealName',
    },
    {
      title: (
        <NewSort
          fixedKey="created_at"
          nowKey={order.key}
          order={order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('common.createTime')}
        </NewSort>
      ),
      dataIndex: 'time',
    },
    {
      title: (
        <NewSort
          fixedKey="expected_start_at"
          nowKey={order.key}
          order={order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('common.expectedStart')}
        </NewSort>
      ),
      dataIndex: 'expectedStart',
    },
    {
      title: (
        <NewSort
          fixedKey="expected_end_at"
          nowKey={order.key}
          order={order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('common.expectedEnd')}
        </NewSort>
      ),
      dataIndex: 'expectedEnd',
    },
  ]

  const onChangeVisible = () => {
    setIsVisible(!isVisible)
    setDemandItem({})
  }

  const onDeleteConfirm = async () => {
    try {
      await deleteDemand({ projectId, id: deleteId })
      message.success(t('common.deleteSuccess'))
      setIsVisible(false)
      setDeleteId(0)
      getList(pageObj, order)
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
        />
      </PaginationWrap>
    </div>
  )
}

export default DemandWrap
