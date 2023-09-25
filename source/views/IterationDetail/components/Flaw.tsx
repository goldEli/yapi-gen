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
import { useDynamicColumns } from '@/components/TableColumns/ProjectTableColumn'
import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import { getMessage } from '@/components/Message'
import { useTranslation } from 'react-i18next'
import MoreDropdown from '@/components/MoreDropdown'
import useDeleteConfirmModal from '@/hooks/useDeleteConfirmModal'
import CommonButton from '@/components/CommonButton'
import {
  deleteFlaw,
  getFlawList,
  updateFlawPriority,
  updateFlawStatus,
  updateFlawTableParams,
} from '@/services/flaw'
import { DefectDropdownMenu } from '@/components/TableDropdownMenu/DefectDropdownMenu'
import { getIterateInfo } from '@store/iterate/iterate.thunk'

interface FlawProps {
  activeKey: string
  searchGroups: any
  checkList: any
  checkList2: any
  checkList3: any
}

const Flaw = (props: FlawProps) => {
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
  const { userPreferenceConfig } = useSelector(store => store.user)
  const hasCreate = getIsPermission(
    projectInfo?.projectPermissions,
    'b/flaw/save',
  )

  const hasDel = getIsPermission(
    projectInfo?.projectPermissions,
    projectInfo.projectType === 1 ? 'b/flaw/delete' : 'b/transaction/delete',
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
      discovery_version: searchParamsObj?.discovery_version,
      severity: searchParamsObj?.severity,
      solution: searchParamsObj?.solution,
    }
    dispatch(setFilterParams(params))
    const result = await getFlawList(params)
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

  const onChangeState = async (item: any) => {
    try {
      await updateFlawPriority({
        id: item.id,
        priorityId: item.priorityId,
        projectId: getProjectIdByUrl(),
      })
      getMessage({
        msg: t('common.prioritySuccess') as string,
        type: 'success',
      })
      onUpdate()
    } catch (error) {
      //
    }
  }

  const onChangeStatus = async (value: any) => {
    try {
      await updateFlawStatus(value)
      getMessage({ msg: t('common.statusSuccess') as string, type: 'success' })
      onUpdate()
    } catch (error) {
      //
    }
  }

  //  修改严重程度
  const onChangeSeverity = async (item: any) => {
    await updateFlawTableParams({
      id: item.id,
      projectId: getProjectIdByUrl(),
      otherParams: {
        severity: item.severity,
      },
    })
    getMessage({ msg: t('successfullyModified'), type: 'success' })
    onUpdate()
  }

  const onClickItem = (item: any) => {
    const demandIds = dataList?.list?.map((i: any) => i.id)
    openDemandDetail(
      { ...item, ...{ demandIds } },
      getProjectIdByUrl(),
      item.id,
      2,
    )
  }

  //   删除确认事件
  const onDeleteConfirm = async (item: any) => {
    await deleteFlaw({ projectId: getProjectIdByUrl(), id: item.id })
    getMessage({ msg: t('common.deleteSuccess') as string, type: 'success' })
    onUpdate()
  }

  //   删除
  const onDeleteChange = (item: any) => {
    open({
      title: t('deleteConfirmation'),
      text: t('areYouSureToDeleteThis'),
      onConfirm() {
        onDeleteConfirm(item)
        return Promise.resolve()
      },
    })
  }

  //   创建缺陷
  const onCreateFlaw = () => {
    dispatch(setFilterParamsModal(filterParams))
    dispatch(
      setAddWorkItemModal({
        visible: true,
        params: {
          projectId: getProjectIdByUrl(),
          iterateId: iterateInfo?.id,
          type: 2,
          title: t('createDefect'),
        },
      }),
    )
  }

  // 点击编辑
  const onEditChange = (item: any) => {
    dispatch(
      setAddWorkItemModal({
        visible: true,
        params: {
          editId: item.id,
          projectId: getProjectIdByUrl(),
          type: 2,
          title: t('editorialDefect'),
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
    onChangeSeverity,
    onChangeState,
    onClickItem,
    showChildCOntent: true,
    onUpdate,
  })

  const selectColum: any = useMemo(() => {
    const arr = [
      ...(props?.checkList || []),
      ...(props?.checkList2 || []),
      ...(props?.checkList3 || []),
    ]
    const newList = []
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < columns?.length; j++) {
        if (arr[i] === columns[j].key) {
          newList.push(columns[j])
        }
      }
    }

    const arrList = [
      {
        render: (text: any, record: any) => {
          return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {hasDel ? null : (
                <MoreDropdown
                  menu={
                    <DefectDropdownMenu
                      onDeleteChange={onDeleteChange}
                      onEditChange={onEditChange}
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
    if (props.searchGroups && props.activeKey === '3') {
      setDataList({ list: undefined })
      getList(pageObj, order, orderKey, props.searchGroups)
    }
  }, [props.searchGroups])

  useEffect(() => {
    if (props.activeKey === '3') {
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
    if ((isRefresh || isUpdateAddWorkItem) && props.activeKey === '3') {
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
            onClick={onCreateFlaw}
          >
            {t('createDefect')}
          </CommonButton>
        </div>
      )}
      <ResizeTable
        isSpinning={isSpinning}
        dataWrapNormalHeight={
          hasCreate || iterateInfo?.status !== 1 || projectInfo?.status !== 1
            ? 'calc(100% - 48px)'
            : 'calc(100% - 90px)'
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

export default Flaw
