/* eslint-disable no-undefined */
/* eslint-disable max-lines */
/* eslint-disable camelcase */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-empty-function */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/naming-convention */
import IconFont from '@/components/IconFont'
import { Menu, Dropdown, Pagination, message, Table, Popover, Spin } from 'antd'
import styled from '@emotion/styled'
import { TableWrap, PaginationWrap, ClickWrap } from '@/components/StyleCommon'
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
import { getIsPermission, openDetail } from '@/tools/index'
import { useTranslation } from 'react-i18next'
import NoData from '@/components/NoData'

const StatusWrap = styled.div<{ isShow?: boolean }>(
  {
    height: 22,
    borderRadius: 6,
    padding: '0 8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #2877FF',
    color: '#2877FF',
    width: 'fit-content',
  },
  ({ isShow }) => ({
    cursor: isShow ? 'pointer' : 'inherit',
  }),
)

const PriorityWrap = styled.div<{ isShow?: boolean }>(
  {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    height: 26,
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
  },
  ({ isShow }) => ({
    cursor: isShow ? 'pointer' : 'inherit',
    '&: hover': {
      '.icon': {
        visibility: isShow ? 'visible' : 'hidden',
      },
    },
  }),
)

const RowIconFont = styled(IconFont)({
  visibility: 'hidden',
  fontSize: 16,
  cursor: 'pointer',
  color: '#2877ff',
})

const TableBox = styled(TableWrap)({
  '.ant-table-thead > tr > th:nth-child(1)': {
    paddingLeft: 64,
  },
  '.ant-table-row:hover': {
    [RowIconFont.toString()]: {
      visibility: 'visible',
    },
  },
})

const DataWrap = styled.div({
  height: 'calc(100% - 40px)',
  background: 'white',
  overflowX: 'auto',
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
  const [dataList, setDataList] = useState<any>({
    list: undefined,
  })
  const { getDemandList, updateDemandStatus } = useModel('demand')
  const [order, setOrder] = useState<any>({ value: '', key: '' })
  const { projectInfo } = useModel('project')
  const isCanEdit
    = projectInfo.projectPermissions?.length > 0
    || projectInfo.projectPermissions?.filter((i: any) => i.name === '编辑需求')
      ?.length > 0

  const getList = async (item: any) => {
    const result = await getDemandList({
      projectId,
      all: true,
      parentId: props.row.id,
      order: item.value,
      orderKey: item.key,
    })
    setDataList({ list: result })
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

  const onToDetail = (item: any) => {
    openDetail(`/Detail/Demand?type=info&id=${projectId}&demandId=${item.id}`)
  }

  const columnsChild = [
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
          <ClickWrap
            onClick={() => onToDetail(record)}
            isClose={record.status?.content === '已关闭'}
          >
            {text}
          </ClickWrap>
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
          {t('common.demandName')}
        </NewSort>
      ),
      dataIndex: 'name',
      render: (text: string, record: any) => {
        return (
          <OmitText width={180}>
            <ClickWrap
              onClick={() => onToDetail(record)}
              isName
              isClose={record.status?.content === '已关闭'}
            >
              {text}
            </ClickWrap>
          </OmitText>
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
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
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
              return isCanEdit
                ? (
                    <ShapeContent
                      tap={value => onChangeStatus(value)}
                      hide={onHide}
                      row={record}
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
                : null
            }}
            record={record}
          >
            <StatusWrap
              isShow={isCanEdit}
              style={{ color: text.color, border: `1px solid ${text.color}` }}
            >
              {text.content_txt}
            </StatusWrap>
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
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
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
        <div style={{ minWidth: 500, maxHeight: 400 }}>
          {!!dataList?.list && dataList?.list.length
            ? (
                <Table
                  rowKey="id"
                  pagination={false}
                  columns={columnsChild}
                  dataSource={dataList?.list}
                />
              )
            : <NoData />
          }
        </div>
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
        <ClickWrap style={{ fontSize: 16 }}>{props.value}</ClickWrap>
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
  const { isRefresh, setIsRefresh } = useModel('user')
  const [isVisible, setIsVisible] = useState(false)
  const [isDelete, setIsDelete] = useState(false)
  const [dataList, setDataList] = useState<any>({
    list: undefined,
  })
  const navigate = useNavigate()
  const [pageObj, setPageObj] = useState<any>({ page: 1, size: 10 })
  const [demandItem, setDemandItem] = useState<any>({})
  const [deleteId, setDeleteId] = useState(0)
  const [order, setOrder] = useState<any>({ value: '', key: '' })
  const [isSpinning, setIsSpinning] = useState(false)
  const hasEdit = getIsPermission(
    projectInfo?.projectPermissions,
    'b/story/update',
  )
  const hasDel = getIsPermission(
    projectInfo?.projectPermissions,
    'b/story/delete',
  )
  const isCanEdit
    = projectInfo.projectPermissions?.length > 0
    || projectInfo.projectPermissions?.filter((i: any) => i.name === '编辑需求')
      ?.length > 0

  const getList = async (item?: any, orderVal?: any) => {
    setIsSpinning(true)
    const result = await getDemandList({
      projectId,
      iterateIds: [iterateId],
      page: item ? item.page : 1,
      pageSize: item ? item.size : 10,
      order: orderVal.value,
      orderKey: orderVal.key,
    })
    setDataList(result)
    setIsSpinning(false)
    setIsRefresh(false)
  }

  useEffect(() => {
    getList(pageObj, order)
  }, [])

  useEffect(() => {
    if (isRefresh) {
      getList({ page: 1, size: pageObj.size }, order)
    }
  }, [isRefresh])

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
    getList(
      { page: 1, size: pageObj.size },
      { value: val === 2 ? 'desc' : 'asc', key },
    )
  }

  const onClickItem = (item: any) => {
    openDetail(`/Detail/Demand?type=info&id=${projectId}&demandId=${item.id}`)
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
              ? <div style={{ width: 16 }} />
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

            <ClickWrap
              onClick={() => onClickItem(record)}
              isClose={record.status?.content === '已关闭'}
              style={{ marginLeft: 32 }}
            >
              {text}
            </ClickWrap>
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
      render: (text: string | number, record: any) => {
        return (
          <ClickWrap
            isName
            isClose={record.status?.content === '已关闭'}
            onClick={() => onClickItem(record)}
          >
            <OmitText width={200}>{text}</OmitText>
          </ClickWrap>
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
              return isCanEdit
                ? (
                    <LevelContent
                      onTap={item => onChangeState(item)}
                      onHide={onHide}
                      record={{ project_id: projectId, id: record.id }}
                    />
                  )
                : null
            }}
            record={record}
          >
            <PriorityWrap isShow={isCanEdit}>
              <IconFont
                type={text.icon}
                style={{
                  fontSize: 16,
                  color: text.color,
                }}
              />
              <div>
                <span>{text.content_txt || '--'}</span>
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
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
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
              return isCanEdit
                ? (
                    <ShapeContent
                      tap={value => onChangeStatus(value)}
                      hide={onHide}
                      row={record}
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
                : null
            }}
            record={record}
          >
            <StatusWrap
              isShow={isCanEdit}
              style={{ color: text.color, border: `1px solid ${text.color}` }}
            >
              {text.content_txt}
            </StatusWrap>
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
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
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
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
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
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
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
      render: (text: string) => {
        return <span>{text || '--'}</span>
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
      message.success(t('common.deleteSuccess'))
      setIsVisible(false)
      setDeleteId(0)
      getList(pageObj, order)
    } catch (error) {

      //
    }
  }

  return (
    <div style={{ height: '100%' }}>
      <DeleteConfirm
        text={t('mark.del')}
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
      <DataWrap>
        <Spin spinning={isSpinning}>
          {!!dataList?.list
            && (dataList?.list?.length > 0
              ? (
                  <TableBox
                    rowKey="id"
                    columns={columns}
                    dataSource={dataList?.list}
                    pagination={false}
                    scroll={{ x: 'max-content' }}
                    showSorterTooltip={false}
                  />
                )
              : <NoData />
            )}
        </Spin>
      </DataWrap>

      <PaginationWrap>
        <Pagination
          defaultCurrent={1}
          current={dataList?.currentPage}
          showSizeChanger
          showQuickJumper
          total={dataList?.total}
          showTotal={total => t('common.tableTotal', { count: total })}
          pageSizeOptions={['10', '20', '50']}
          onChange={onChangePage}
          onShowSizeChange={onShowSizeChange}
        />
      </PaginationWrap>
    </div>
  )
}

export default DemandWrap
