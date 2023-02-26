// 迭代详情-需求

/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable camelcase */
/* eslint-disable max-params */
/* eslint-disable no-undefined */
/* eslint-disable @typescript-eslint/naming-convention */
import IconFont from '@/components/IconFont'
import { Menu, Pagination, message, Spin } from 'antd'
import styled from '@emotion/styled'
import { TableStyleBox, SecondButton } from '@/components/StyleCommon'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import DeleteConfirm from '@/components/DeleteConfirm'
import { getIsPermission, getParamsData, openDetail } from '@/tools/index'
import { useTranslation } from 'react-i18next'
import NoData from '@/components/NoData'
import { encryptPhp } from '@/tools/cryptoPhp'
import { useDynamicColumns } from '@/components/CreateProjectTableColum'
import MoreDropdown from '@/components/MoreDropdown'
import { useDispatch, useSelector } from '@store/index'
import { setIsRefresh } from '@store/user'
import { setFilterParamsModal } from '@store/project'
import {
  deleteDemand,
  updateDemandStatus,
  updatePriority,
  getDemandList,
} from '@/services/demand'
import { setFilterParams } from '@store/demand'
import PaginationBox from '@/components/TablePagination'

const RowIconFont = styled(IconFont)({
  visibility: 'hidden',
  fontSize: 16,
  cursor: 'pointer',
  color: '#2877ff',
})

const DataWrap = styled.div<{ hasCreate: boolean }>(
  {
    background: 'white',
    overflowX: 'auto',
    borderRadius: 6,
  },
  ({ hasCreate }) => ({
    height: hasCreate ? 'calc(100% - 64px)' : 'calc(100% - 118px)',
  }),
)

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
  const dispatch = useDispatch()
  const { isRefresh } = useSelector(store => store.user)
  const { projectInfo } = useSelector(store => store.project)
  const { iterateInfo, filterParams } = useSelector(store => store.iterate)
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

  const hasCreate = getIsPermission(
    projectInfo?.projectPermissions,
    'b/story/save',
  )

  const getList = async (
    item?: any,
    orderValue?: any,
    orderKeyValue?: any,
    searchParamsObj?: any,
    updateState?: boolean,
  ) => {
    setDataList({ list: undefined })
    if (!updateState) {
      setIsSpinning(true)
    }
    let params = {
      projectId,
      page: item ? item.page : 1,
      pageSize: item ? item.size : 10,
      order: orderValue,
      orderKey: orderKeyValue,
      searchValue: searchParamsObj?.searchVal,
      statusIds: searchParamsObj?.statusId,
      iterateIds: [iterateId],
      priorityIds: searchParamsObj?.priorityId,
      userId: searchParamsObj?.userId,
      tagIds: searchParamsObj?.tagId,
      startTime: searchParamsObj?.createdAtId,
      expectedStart: searchParamsObj?.expectedStartAtId,
      expectedEnd: searchParamsObj?.expectedendat,
      updatedTime: searchParamsObj?.updatedat,
      endTime: searchParamsObj?.finishAt,
      usersNameId: searchParamsObj?.usersnameId,
      copySendId: searchParamsObj?.usersCopysendNameId,
      class_ids: searchParamsObj?.class_ids,
      category_id: searchParamsObj?.category_id,
      schedule_start: searchParamsObj?.schedule_start,
      schedule_end: searchParamsObj?.schedule_end,
      custom_field: searchParamsObj?.custom_field,
    }
    dispatch(setFilterParams(params))
    const result = await getDemandList(params)
    setDataList(result)
    setIsSpinning(false)
    dispatch(setIsRefresh(false))
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
    openDetail(`/ProjectManagement/Demand?data=${params}`)
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
      setIsDelete(false)
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

  const onCreateDemand = () => {
    dispatch(setFilterParamsModal(filterParams))
    setTimeout(() => {
      setIsVisible(true)
    }, 100)
  }

  return (
    <div style={{ height: 'calc(100% - 50px)', padding: '16px 16px 0' }}>
      <DeleteConfirm
        text={t('mark.del')}
        isVisible={isDelete}
        onChangeVisible={() => setIsDelete(!isDelete)}
        onConfirm={onDeleteConfirm}
      />
      {!hasCreate && iterateInfo?.status === 1 && projectInfo?.status === 1 && (
        <div
          style={{
            padding: '16px 0 4px 16px',
            background: 'white',
            borderRadius: '6px 6px 0 0',
          }}
        >
          <SecondButton onClick={onCreateDemand}>
            <IconFont type="plus" />
            <div>{t('common.createDemand')}</div>
          </SecondButton>
        </div>
      )}
      <DataWrap
        ref={dataWrapRef}
        hasCreate={
          hasCreate || iterateInfo?.status !== 1 || projectInfo?.status !== 1
        }
      >
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
      <PaginationBox
        currentPage={dataList?.currentPage}
        pageSize={dataList?.pageSize}
        total={dataList?.total}
        onChange={onChangePage}
      />
    </div>
  )
}

export default DemandWrap
