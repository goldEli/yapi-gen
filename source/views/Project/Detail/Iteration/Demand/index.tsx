/* eslint-disable camelcase */
/* eslint-disable max-params */
/* eslint-disable no-undefined */
/* eslint-disable @typescript-eslint/naming-convention */
import IconFont from '@/components/IconFont'
import { Menu, Dropdown, Pagination, message, Spin } from 'antd'
import styled from '@emotion/styled'
import { TableStyleBox, PaginationWrap } from '@/components/StyleCommon'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useModel } from '@/models'
import { useSearchParams } from 'react-router-dom'
import EditDemand from '@/components/EditDemand'
import DeleteConfirm from '@/components/DeleteConfirm'
import { getIsPermission, getParamsData, openDetail } from '@/tools/index'
import { useTranslation } from 'react-i18next'
import NoData from '@/components/NoData'
import { encryptPhp } from '@/tools/cryptoPhp'
import { useDynamicColumns } from '@/components/CreateProjectTableColum'
import MoreDropdown from '@/components/MoreDropdown'

const RowIconFont = styled(IconFont)({
  visibility: 'hidden',
  fontSize: 16,
  cursor: 'pointer',
  color: '#2877ff',
})

const DataWrap = styled.div({
  height: 'calc(100% - 64px)',
  background: 'white',
  overflowX: 'auto',
  borderRadius: 6,
})

interface Props {
  searchGroups: any
  checkList: any
  checkList2: any
  checkList3: any
}

const DemandWrap = (props: Props) => {
  const [t] = useTranslation()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
  const { iterateId } = paramsData
  const { projectInfo } = useModel('project')
  const { getDemandList, updateDemandStatus, updatePriority, deleteDemand } =
    useModel('demand')
  const { isRefresh, setIsRefresh } = useModel('user')
  const [isVisible, setIsVisible] = useState(false)
  const [isDelete, setIsDelete] = useState(false)
  const [dataList, setDataList] = useState<any>({
    list: undefined,
  })
  const [pageObj, setPageObj] = useState<any>({ page: 1, size: 20 })
  const [demandItem, setDemandItem] = useState<any>({})
  const [deleteId, setDeleteId] = useState(0)
  const [orderKey, setOrderKey] = useState<any>('')
  const [order, setOrder] = useState<any>('')
  const [isSpinning, setIsSpinning] = useState(false)
  const [dataWrapHeight, setDataWrapHeight] = useState(0)
  const [tableWrapHeight, setTableWrapHeight] = useState(0)
  const dataWrapRef = useRef<HTMLDivElement>(null)

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
  }, [dataList])

  const tableY =
    tableWrapHeight > dataWrapHeight - 52 ? dataWrapHeight - 52 : void 0

  const hasEdit = getIsPermission(
    projectInfo?.projectPermissions,
    'b/story/update',
  )
  const hasDel = getIsPermission(
    projectInfo?.projectPermissions,
    'b/story/delete',
  )

  const getList = async (
    item?: any,
    orderValue?: any,
    orderKeyValue?: any,
    searchParamsObj?: any,
    updateState?: boolean,
  ) => {
    if (!updateState) {
      setIsSpinning(true)
    }
    let params = {
      projectId,
      page: item ? item.page : 1,
      pageSize: item ? item.size : 10,
      order: orderValue,
      orderKey: orderKeyValue,
      searchValue: searchParamsObj.searchVal,
      statusIds: searchParamsObj.statusId,
      iterateIds: [iterateId],
      priorityIds: searchParamsObj.priorityId,
      userId: searchParamsObj.userId,
      tagIds: searchParamsObj.tagId,
      startTime: searchParamsObj.createdAtId,
      expectedStart: searchParamsObj.expectedStartAtId,
      expectedEnd: searchParamsObj.expectedendat,
      updatedTime: searchParamsObj.updatedat,
      endTime: searchParamsObj.finishAt,
      usersNameId: searchParamsObj.usersnameId,
      copySendId: searchParamsObj.usersCopysendNameId,
      class_ids: searchParamsObj.class_ids,
      category_id: searchParamsObj.category_id,
      schedule_start: searchParamsObj.schedule_start,
      schedule_end: searchParamsObj.schedule_end,
      custom_field: searchParamsObj?.custom_field,
    }

    const result = await getDemandList(params)
    setDataList(result)
    setIsSpinning(false)
    setIsRefresh(false)
  }

  useEffect(() => {
    getList(pageObj, order, orderKey, props.searchGroups)
  }, [props.searchGroups])

  useEffect(() => {
    if (isRefresh) {
      getList(
        { page: 1, size: pageObj.size },
        order,
        orderKey,
        props.searchGroups,
      )
    }
  }, [isRefresh])

  const onChangePage = (page: number, size: number) => {
    setPageObj({ page, size })
    getList({ page, size }, order, orderKey, props.searchGroups)
  }

  const onShowSizeChange = (page: number, size: number) => {
    setPageObj({ page, size })
    getList({ page, size }, order, orderKey, props.searchGroups)
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

    return <Menu style={{ minWidth: 56 }} items={menuItems} />
  }

  const updateOrderkey = (key: any, val: any) => {
    setOrderKey(key)
    setOrder(val === 2 ? 'desc' : 'asc')
    getList(
      { page: 1, size: pageObj.size },
      val === 2 ? 'desc' : 'asc',
      key,
      props.searchGroups,
    )
  }

  const onClickItem = (item: any) => {
    const params = encryptPhp(
      JSON.stringify({ type: 'info', id: projectId, demandId: item.id }),
    )
    openDetail(`/Detail/Demand?data=${params}`)
  }

  const onChangeState = async (item: any) => {
    try {
      await updatePriority({
        demandId: item.id,
        priorityId: item.priorityId,
        projectId,
      })
      message.success(t('common.prioritySuccess'))
      getList(pageObj, order, orderKey, props.searchGroups)
    } catch (error) {
      //
    }
  }

  const onChangeStatus = async (value: any) => {
    try {
      await updateDemandStatus(value)
      message.success(t('common.statusSuccess'))
      getList(pageObj, order, orderKey, props.searchGroups)
    } catch (error) {
      //
    }
  }

  const rowIconFont = () => {
    return <RowIconFont type="more" />
  }

  const onUpdate = (updateState?: boolean) => {
    getList(pageObj, order, orderKey, props.searchGroups, updateState)
  }

  const columns = useDynamicColumns({
    projectId,
    orderKey,
    order,
    updateOrderkey,
    onChangeStatus,
    onChangeState,
    onClickItem,
    rowIconFont,
    showChildCOntent: true,
    onUpdate,
  })

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
      getList(pageObj, order, orderKey, props.searchGroups)
    } catch (error) {
      //
    }
  }

  const selectColum: any = useMemo(() => {
    const arr: any = [
      ...(props?.checkList || []),
      ...(props?.checkList2 || []),
      ...(props?.checkList3 || []),
    ]
    const newList = []
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < columns.length; j++) {
        if (arr[i] === columns[j].key) {
          newList.push(columns[j])
        }
      }
    }
    const arrList = [
      {
        width: 40,
        render: (text: any, record: any) => {
          return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {hasEdit && hasDel ? null : <MoreDropdown menu={menu(record)} />}
            </div>
          )
        },
      },
    ]
    return [...arrList, ...newList]
  }, [props?.checkList, props?.checkList2, props?.checkList3, columns])

  return (
    <div style={{ height: 'calc(100% - 50px)', padding: '16px 16px 0' }}>
      <DeleteConfirm
        text={t('mark.del')}
        isVisible={isDelete}
        onChangeVisible={() => setIsDelete(!isDelete)}
        onConfirm={onDeleteConfirm}
      />
      {isVisible ? (
        <EditDemand
          visible={isVisible}
          onChangeVisible={onChangeVisible}
          demandId={demandItem?.id}
          onUpdate={() => getList(pageObj)}
          iterateId={iterateId}
        />
      ) : null}
      <DataWrap ref={dataWrapRef}>
        <Spin spinning={isSpinning}>
          {!!dataList?.list &&
            (dataList?.list?.length > 0 ? (
              <TableStyleBox
                rowKey="id"
                columns={selectColum}
                dataSource={dataList?.list}
                pagination={false}
                scroll={{
                  x: 'max-content',
                  y: tableY,
                }}
                showSorterTooltip={false}
                tableLayout="auto"
              />
            ) : (
              <NoData />
            ))}
        </Spin>
      </DataWrap>

      <PaginationWrap>
        <Pagination
          defaultCurrent={1}
          current={dataList?.currentPage}
          pageSize={dataList?.pageSize || 20}
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
