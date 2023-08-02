/* eslint-disable no-undefined */
// 需求详情-子需求

import IconFont from '@/components/IconFont'
import { message } from 'antd'
import styled from '@emotion/styled'
import { useEffect, useMemo, useState } from 'react'
import { OptionalFeld } from '@/components/OptionalFeld'
import { useDynamicColumns } from '@/components/TableColumns/ProjectTableColumn'
import type { CheckboxValueType } from 'antd/lib/checkbox/Group'
import { useSearchParams } from 'react-router-dom'
import DeleteConfirm from '@/components/DeleteConfirm'
import { useTranslation } from 'react-i18next'
import NoData from '@/components/NoData'
import { getIsPermission, getParamsData } from '@/tools'
import MoreDropdown from '@/components/MoreDropdown'
import DropDownMenu from '@/components/DropDownMenu'
import { useDispatch, useSelector } from '@store/index'
import { setIsRefresh } from '@store/user'
import {
  deleteDemand,
  getDemandList,
  updateDemandStatus,
  updatePriority,
} from '@/services/demand'
import PaginationBox from '@/components/TablePagination'
import { DemandOperationDropdownMenu } from '@/components/TableDropdownMenu/DemandDropdownMenu'
import SetShowField from '@/components/SetShowField/indedx'
import useOpenDemandDetail from '@/hooks/useOpenDemandDetail'
import ResizeTable from '@/components/ResizeTable'
import CommonButton from '@/components/CommonButton'
import { getMessage } from '@/components/Message'
import { setAddWorkItemModal } from '@store/project'
import { getDemandInfo } from '@store/demand/demand.thunk'
import { ComputedWrap } from '../style'
import { encryptPhp } from '@/tools/cryptoPhp'

const Operation = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: 52,
  background: 'white',
})

const RowIconFont = styled(IconFont)({
  visibility: 'hidden',
  fontSize: 16,
  cursor: 'pointer',
  color: 'var(--primary-d2)',
})

interface ChildDemandProps {
  activeKey: string
}

const ChildDemand = (props: ChildDemandProps) => {
  const [t] = useTranslation()
  const [deleteId, setDeleteId] = useState(0)
  const [isDelete, setIsDelete] = useState(false)
  const [isSettingState, setIsSettingState] = useState(false)
  const dispatch = useDispatch()
  const { isRefresh } = useSelector(store => store.user)
  const { projectInfo, isUpdateAddWorkItem } = useSelector(
    store => store.project,
  )
  const { demandInfo } = useSelector(store => store.demand)
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
  const [dataList, setDataList] = useState<any>({
    list: undefined,
  })
  const [titleList, setTitleList] = useState<any[]>([])
  const [titleList2, setTitleList2] = useState<any[]>([])
  const [titleList3, setTitleList3] = useState<any[]>([])
  const [allTitleList, setAllTitleList] = useState<any[]>([])
  const [plainOptions, setPlainOptions] = useState<any>([])
  const [plainOptions2, setPlainOptions2] = useState<any>([])
  const [plainOptions3, setPlainOptions3] = useState<any>([])
  const [pageObj, setPageObj] = useState<any>({ page: 1, size: 20 })
  const [isSpinning, setIsSpinning] = useState(false)
  const [orderKey, setOrderKey] = useState<any>('')
  const [order, setOrder] = useState<any>('')
  const [isVisibleFields, setIsVisibleFields] = useState(false)
  const [openDemandDetail] = useOpenDemandDetail()

  const getShowkey = () => {
    setPlainOptions(projectInfo?.plainOptions || [])
    setPlainOptions2(projectInfo?.plainOptions2 || [])
    setPlainOptions3(projectInfo?.plainOptions3 || [])
    setTitleList(projectInfo?.titleList || [])
    setTitleList2(projectInfo?.titleList2 || [])
    setTitleList3(projectInfo?.titleList3 || [])
    setAllTitleList([
      ...(projectInfo.titleList || []),
      ...(projectInfo.titleList2 || []),
      ...(projectInfo.titleList3 || []),
    ])
  }

  const getList = async (
    item?: any,
    orderValue?: any,
    orderKeyValue?: any,
    updateState?: boolean,
  ) => {
    if (!updateState) {
      setIsSpinning(true)
    }
    const result = await getDemandList({
      projectId,
      page: item ? item.page : 1,
      pageSize: item ? item.size : 10,
      order: orderValue,
      orderKey: orderKeyValue,
      parentId: demandInfo.id,
    })
    setDataList(result)
    setIsSpinning(false)
    dispatch(setIsRefresh(false))
  }

  useEffect(() => {
    if (props.activeKey === '2') {
      getList(pageObj, order, orderKey)
    }
  }, [props.activeKey])

  useEffect(() => {
    if (isRefresh) {
      getList({ page: 1, size: pageObj.size }, order, orderKey)
    }
  }, [isRefresh])

  useEffect(() => {
    if (isUpdateAddWorkItem) {
      getList(pageObj, order, orderKey)
      dispatch(getDemandInfo({ projectId, id: demandInfo.id }))
    }
  }, [isUpdateAddWorkItem])

  useEffect(() => {
    getShowkey()
  }, [projectInfo])

  useEffect(() => {
    if (demandInfo?.id) {
      getList(pageObj, order, orderKey)
    }
  }, [demandInfo])

  const getCheckList = (
    list: CheckboxValueType[],
    list2: CheckboxValueType[],
    list3: CheckboxValueType[],
    all: CheckboxValueType[],
  ) => {
    setTitleList(list)
    setTitleList2(list2)
    setTitleList3(list3)
    setAllTitleList(all)
  }

  const onUpdate = async (updateState?: boolean) => {
    dispatch(getDemandInfo({ projectId, id: demandInfo.id }))
    getList(pageObj, order, orderKey, updateState)
  }

  const updateOrderkey = (key: any, val: any) => {
    setOrderKey(key)
    setOrder(val === 2 ? 'desc' : 'asc')
    getList({ page: 1, size: pageObj.size }, val === 2 ? 'desc' : 'asc', key)
  }

  const onClickItem = (item: any) => {
    const demandIds = dataList?.list?.map((i: any) => i.id)
    const params = encryptPhp(
      JSON.stringify({
        id: projectInfo?.id,
        detailId: item.id,
        specialType: 3,
        isOpenScreenDetail: true,
        changeIds: demandIds,
      }),
    )
    const url = `ProjectManagement/Demand?data=${params}`
    window.open(`${window.origin}${import.meta.env.__URL_HASH__}${url}`)
  }

  const onChangePage = (page: number, size: number) => {
    setPageObj({ page, size })
    getList({ page, size }, order, orderKey)
  }

  const onChangeState = async (item: any) => {
    try {
      await updatePriority({
        demandId: item.id,
        priorityId: item.priorityId,
        projectId,
      })
      getMessage({ msg: t('common.prioritySuccess'), type: 'success' })
      onUpdate()
    } catch (error) {
      //
    }
  }

  const onChangeStatus = async (value: any) => {
    try {
      await updateDemandStatus(value)
      getMessage({ msg: t('common.statusSuccess'), type: 'success' })
      onUpdate()
    } catch (error) {
      //
    }
  }

  const onDeleteConfirm = async () => {
    try {
      await deleteDemand({ projectId, id: deleteId })
      getMessage({ msg: t('common.deleteSuccess'), type: 'success' })
      setIsDelete(false)
      setDeleteId(0)
      onUpdate()
    } catch (error) {
      //
    }
  }

  const rowIconFont = () => {
    return <RowIconFont type="more" />
  }

  const columns = useDynamicColumns({
    projectId,
    orderKey,
    order,
    updateOrderkey,
    onChangeStatus,
    onChangeState,
    rowIconFont,
    onClickItem,
    onUpdate,
  })

  const hasEdit = getIsPermission(
    projectInfo?.projectPermissions,
    'b/story/update',
  )
  const hasDel = getIsPermission(
    projectInfo?.projectPermissions,
    'b/story/delete',
  )

  // 点击编辑
  const onEditChange = (item: any) => {
    dispatch(
      setAddWorkItemModal({
        visible: true,
        params: {
          editId: item.id,
          projectId: item.project_id,
          type: 1,
          title: t('editingRequirements'),
        },
      }),
    )
  }

  // 点击删除
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
          projectId: item.project_id ?? item.projectId,
          isChild: true,
          parentId: item.id,
          categoryId: item.categoryId ?? item.category,
          type: 1,
          title: t('createSubrequirements'),
        },
      }),
    )
  }

  const selectColum: any = useMemo(() => {
    const arr = allTitleList
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
  }, [titleList, titleList2, titleList3, columns])

  return (
    <ComputedWrap>
      <DeleteConfirm
        text={t('common.confirmDelChildDemand')}
        isVisible={isDelete}
        onChangeVisible={() => setIsDelete(!isDelete)}
        onConfirm={onDeleteConfirm}
      />
      <Operation>
        {getIsPermission(
          projectInfo?.projectPermissions,
          projectInfo.projectType === 1 ? 'b/story/save' : 'b/transaction/save',
        ) || projectInfo?.status !== 1 ? (
          <div />
        ) : (
          <CommonButton
            type="primaryText"
            onClick={() => onCreateChild(demandInfo)}
            icon="plus"
            iconPlacement="left"
          >
            {t('project.addChildDemand')}
          </CommonButton>
        )}

        <DropDownMenu
          menu={
            <SetShowField
              onChangeFieldVisible={() => {
                setIsSettingState(true)
                setIsVisibleFields(false)
              }}
            />
          }
          icon="settings"
          isVisible={isVisibleFields}
          onChangeVisible={setIsVisibleFields}
          isActive={isSettingState}
        >
          <div>{t('common.tableFieldSet')}</div>
        </DropDownMenu>
      </Operation>
      <ResizeTable
        isSpinning={isSpinning}
        dataWrapNormalHeight="calc(100% - 112px)"
        col={selectColum}
        dataSource={dataList?.list}
        noData={<NoData />}
      />

      <PaginationBox
        currentPage={dataList?.currentPage}
        pageSize={dataList?.pageSize}
        total={dataList?.total}
        onChange={onChangePage}
        hasPadding
      />

      <OptionalFeld
        allTitleList={allTitleList}
        plainOptions={plainOptions.filter((i: any) => i.is_flaw !== 1)}
        plainOptions2={plainOptions2}
        plainOptions3={plainOptions3}
        checkList={titleList}
        checkList2={titleList2}
        checkList3={titleList3}
        isVisible={isSettingState}
        onClose={() => setIsSettingState(false)}
        getCheckList={getCheckList}
      />
    </ComputedWrap>
  )
}

export default ChildDemand
