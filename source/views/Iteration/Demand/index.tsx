// 迭代详情-需求

/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable camelcase */
/* eslint-disable max-params */
/* eslint-disable no-undefined */
/* eslint-disable @typescript-eslint/naming-convention */
import IconFont from '@/components/IconFont'
import { message } from 'antd'
import styled from '@emotion/styled'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import DeleteConfirm from '@/components/DeleteConfirm'
import { getIsPermission, getParamsData } from '@/tools/index'
import { useTranslation } from 'react-i18next'
import NoData from '@/components/NoData'
import { useDynamicColumns } from '@/components/CreateProjectTableColum'
import MoreDropdown from '@/components/MoreDropdown'
import { useDispatch, useSelector } from '@store/index'
import { setIsRefresh } from '@store/user'
import { setAddWorkItemModal, setFilterParamsModal } from '@store/project'
import {
  deleteDemand,
  updateDemandStatus,
  updatePriority,
  getDemandList,
} from '@/services/demand'
import { setFilterParams, setIsUpdateDemand } from '@store/demand'
import PaginationBox from '@/components/TablePagination'
import { DemandOperationDropdownMenu } from '@/components/DemandComponent/DemandOperationDropdownMenu'
import useOpenDemandDetail from '@/hooks/useOpenDemandDeatil'
import ResizeTable from '@/components/ResizeTable'
import CommonButton from '@/components/CommonButton'
import { getMessage } from '@/components/Message'

const RowIconFont = styled(IconFont)({
  visibility: 'hidden',
  fontSize: 16,
  cursor: 'pointer',
  color: 'var(--primary-d2)',
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
  const dispatch = useDispatch()
  const { isRefresh } = useSelector(store => store.user)
  const { projectInfo } = useSelector(store => store.project)
  const { isUpdateDemand } = useSelector(store => store.demand)
  const { iterateInfo, filterParams } = useSelector(store => store.iterate)
  const [isVisible, setIsVisible] = useState(false)
  const [isDelete, setIsDelete] = useState(false)
  const [dataList, setDataList] = useState<any>({
    list: undefined,
  })
  const [pageObj, setPageObj] = useState<any>({ page: 1, size: 20 })
  const [deleteId, setDeleteId] = useState(0)
  const [orderKey, setOrderKey] = useState<any>('')
  const [order, setOrder] = useState<any>('')
  const [isSpinning, setIsSpinning] = useState(false)
  const [openDemandDetail] = useOpenDemandDetail()

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
    console.log(searchParamsObj, '=searchParamsObjsearchParamsObj')
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
    dispatch(setIsUpdateDemand(false))
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

  useEffect(() => {
    if (isUpdateDemand) {
      getList(pageObj, order, orderKey, props.searchGroups)
    }
  }, [isUpdateDemand])

  const onChangePage = (page: number, size: number) => {
    setPageObj({ page, size })
    getList({ page, size }, order, orderKey, props.searchGroups)
  }

  const onEditChange = (item: any) => {
    dispatch(
      setAddWorkItemModal({
        visible: true,
        params: {
          editId: item.id,
          projectId: item.project_id,
        },
      }),
    )
  }

  const onDeleteChange = (item: any) => {
    setDeleteId(item.id)
    setIsDelete(true)
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
        },
      }),
    )
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
    const demandIds = dataList?.list?.map((i: any) => i.id)
    openDemandDetail({ ...item, ...{ demandIds } }, projectId, item.id)
  }

  const onChangeState = async (item: any) => {
    try {
      await updatePriority({
        demandId: item.id,
        priorityId: item.priorityId,
        projectId,
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

  const onDeleteConfirm = async () => {
    try {
      await deleteDemand({ projectId, id: deleteId })
      getMessage({ msg: t('common.deleteSuccess') as string, type: 'success' })
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

  const onCreateDemand = () => {
    dispatch(setFilterParamsModal(filterParams))
    dispatch(
      setAddWorkItemModal({
        visible: true,
        params: { projectId, iterateId: iterateInfo?.id },
      }),
    )
  }

  return (
    <div style={{ height: 'calc(100% - 53px)' }}>
      <DeleteConfirm
        text={t('mark.del')}
        isVisible={isDelete}
        onChangeVisible={() => setIsDelete(!isDelete)}
        onConfirm={onDeleteConfirm}
      />
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
            ? 'calc(100% - 52px)'
            : 'calc(100% - 104px)'
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
    </div>
  )
}

export default DemandWrap
