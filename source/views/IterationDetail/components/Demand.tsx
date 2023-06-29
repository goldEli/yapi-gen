/* eslint-disable no-undefined */
import ResizeTable from '@/components/ResizeTable'
import { ComputedWrap } from '../style'
import PaginationBox from '@/components/TablePagination'
import NoData from '@/components/NoData'
import { useDispatch, useSelector } from '@store/index'
import { useEffect, useMemo, useState } from 'react'
import useOpenDemandDetail from '@/hooks/useOpenDemandDetail'
import { getIdByUrl, getIsPermission, getProjectIdByUrl } from '@/tools'
import {
  setAddWorkItemModal,
  setFilterParams,
  setFilterParamsModal,
} from '@store/project'
import { setIsRefresh } from '@store/user'
import {
  deleteDemand,
  updateDemandStatus,
  updatePriority,
  getDemandList,
} from '@/services/demand'
import { useDynamicColumns } from '@/components/TableColumns/ProjectTableColumn'
import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import { getMessage } from '@/components/Message'
import { useTranslation } from 'react-i18next'
import MoreDropdown from '@/components/MoreDropdown'
import { DemandOperationDropdownMenu } from '@/components/TableDropdownMenu/DemandDropdownMenu'
import useDeleteConfirmModal from '@/hooks/useDeleteConfirmModal'
import CommonButton from '@/components/CommonButton'
import { getIterateInfo } from '@store/iterate/iterate.thunk'

const RowIconFont = styled(IconFont)({
  visibility: 'hidden',
  fontSize: 16,
  cursor: 'pointer',
  color: 'var(--primary-d2)',
})
interface DemandProps {
  activeKey: string
  searchGroups: any
  checkList: any
  checkList2: any
  checkList3: any
}

const Demand = (props: DemandProps) => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const { projectInfo, isUpdateAddWorkItem, filterParams } = useSelector(
    store => store.project,
  )
  const { isRefresh } = useSelector(store => store.user)
  const { iterateInfo } = useSelector(store => store.iterate)
  const [dataList, setDataList] = useState<any>({
    list: undefined,
  })
  const [pageObj, setPageObj] = useState<any>({ page: 1, size: 20 })
  const [orderKey, setOrderKey] = useState<any>('')
  const [order, setOrder] = useState<any>('')
  const [isSpinning, setIsSpinning] = useState(false)
  const [openDemandDetail] = useOpenDemandDetail()
  const { open, DeleteConfirmModal } = useDeleteConfirmModal()

  const hasCreate = getIsPermission(
    projectInfo?.projectPermissions,
    'b/story/save',
  )

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
    setDataList({ list: undefined })
    if (!updateState) {
      setIsSpinning(true)
    }
    let params = {
      projectId: getProjectIdByUrl(),
      page: item ? item.page : 1,
      pageSize: item ? item.size : 10,
      order: orderValue,
      orderKey: orderKeyValue,
      searchValue: searchParamsObj?.searchVal,
      statusIds: searchParamsObj?.statusId,
      iterateIds: [getIdByUrl('iterateId')],
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

  const onChangePage = (page: number, size: number) => {
    setPageObj({ page, size })
    getList({ page, size }, order, orderKey, props.searchGroups)
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

  const onUpdate = (updateState?: boolean) => {
    getList(pageObj, order, orderKey, props.searchGroups, updateState)
  }

  const rowIconFont = () => {
    return <RowIconFont type="more" />
  }

  const onChangeState = async (item: any) => {
    try {
      await updatePriority({
        demandId: item.id,
        priorityId: item.priorityId,
        projectId: getProjectIdByUrl(),
      })
      getMessage({
        msg: t('common.prioritySuccess') as string,
        type: 'success',
      })
      getList(pageObj, order, orderKey, props.searchGroups)
    } catch (error) {
      //
    }
  }

  const onChangeStatus = async (value: any) => {
    try {
      await updateDemandStatus(value)
      getMessage({ msg: t('common.statusSuccess') as string, type: 'success' })
      getList(pageObj, order, orderKey, props.searchGroups)
    } catch (error) {
      //
    }
  }

  const onClickItem = (item: any) => {
    const demandIds = dataList?.list?.map((i: any) => i.id)
    openDemandDetail(
      { ...item, ...{ demandIds } },
      getProjectIdByUrl(),
      item.id,
    )
  }

  // 点击创建子需求
  const onCreateChild = (item: any) => {
    dispatch(
      setAddWorkItemModal({
        visible: true,
        params: {
          projectId: item.project_id,
          isChild: true,
          parentId: item.id,
          categoryId: item.categoryId,
          type: 1,
          title: '创建子需求',
        },
      }),
    )
  }

  // 编辑需求
  const onEditChange = (item: any) => {
    dispatch(
      setAddWorkItemModal({
        visible: true,
        params: {
          editId: item.id,
          projectId: item.project_id,
          type: 1,
          title: '编辑需求',
        },
      }),
    )
  }

  //   删除确认事件
  const onDeleteConfirm = async (item: any) => {
    await deleteDemand({ projectId: getProjectIdByUrl(), id: item.id })
    getMessage({ msg: t('common.deleteSuccess') as string, type: 'success' })
    getList(pageObj, order, orderKey, props.searchGroups)
  }

  //   删除
  const onDeleteChange = (item: any) => {
    open({
      title: '删除确认',
      text: '确认删除该子需求？',
      onConfirm() {
        onDeleteConfirm(item)
        return Promise.resolve()
      },
    })
  }

  //   创建需求
  const onCreateDemand = () => {
    dispatch(setFilterParamsModal(filterParams))
    dispatch(
      setAddWorkItemModal({
        visible: true,
        params: {
          projectId: getProjectIdByUrl(),
          iterateId: iterateInfo?.id,
          type: 1,
          title: '创建需求',
        },
      }),
    )
  }

  const columns = useDynamicColumns({
    projectId: getProjectIdByUrl(),
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
              {hasEdit && hasDel ? null : (
                <MoreDropdown
                  menu={
                    <DemandOperationDropdownMenu
                      onEditChange={onEditChange}
                      onDeleteChange={onDeleteChange}
                      onCreateChild={onCreateChild}
                      record={record}
                    />
                  }
                />
              )}
            </div>
          )
        },
      },
    ]
    return [...arrList, ...newList]
  }, [props?.checkList, props?.checkList2, props?.checkList3, columns])

  useEffect(() => {
    if (props.searchGroups && props.activeKey === '2') {
      setDataList({ list: undefined })
      getList(pageObj, order, orderKey, props.searchGroups)
    }
  }, [props.searchGroups])

  useEffect(() => {
    if (props.activeKey === '2') {
      getList(
        { page: 1, size: pageObj.size },
        order,
        orderKey,
        props.searchGroups,
      )
    } else {
      setDataList({ list: undefined })
    }
  }, [props.activeKey])

  useEffect(() => {
    if ((isRefresh || isUpdateAddWorkItem) && props.activeKey === '2') {
      getList(
        { page: 1, size: pageObj.size },
        order,
        orderKey,
        props.searchGroups,
      )
      dispatch(
        getIterateInfo({
          projectId: getProjectIdByUrl(),
          id: getIdByUrl('iterateId'),
        }),
      )
    }
  }, [isRefresh, isUpdateAddWorkItem, props.activeKey])

  return (
    <ComputedWrap>
      <DeleteConfirmModal />
      {!hasCreate && iterateInfo?.status === 1 && projectInfo?.status === 1 && (
        <div
          style={{
            padding: '10px 0 0',
            background: 'white',
            borderRadius: '6px 6px 0 0',
          }}
        >
          <CommonButton
            type="primaryText"
            icon="plus"
            iconPlacement="left"
            onClick={onCreateDemand}
          >
            {t('common.createDemand')}
          </CommonButton>
        </div>
      )}
      <ResizeTable
        isSpinning={isSpinning}
        dataWrapNormalHeight={
          hasCreate || iterateInfo?.status !== 1 || projectInfo?.status !== 1
            ? 'calc(100% - 55px)'
            : 'calc(100% - 97px)'
        }
        col={selectColum}
        dataSource={dataList?.list}
        noData={<NoData />}
      />
      <PaginationBox
        currentPage={dataList?.currentPage}
        pageSize={dataList?.pageSize}
        total={dataList?.total}
        onChange={onChangePage}
      />
    </ComputedWrap>
  )
}

export default Demand
