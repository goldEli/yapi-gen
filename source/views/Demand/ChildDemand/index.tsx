// 需求详情-子需求
/* eslint-disable no-constant-binary-expression */
/* eslint-disable complexity */
/* eslint-disable no-undefined */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-empty-function */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-empty-function */
import IconFont from '@/components/IconFont'
import { Menu, Pagination, message, Spin } from 'antd'
import styled from '@emotion/styled'
import { TableStyleBox, SecondButton } from '@/components/StyleCommon'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { OptionalFeld } from '@/components/OptionalFeld'
import { useDynamicColumns } from '@/components/CreateProjectTableColum'
import type { CheckboxValueType } from 'antd/lib/checkbox/Group'
import { useSearchParams } from 'react-router-dom'
import DeleteConfirm from '@/components/DeleteConfirm'
import { useTranslation } from 'react-i18next'
import NoData from '@/components/NoData'
import { getIsPermission, getParamsData, openDetail } from '@/tools'
import { encryptPhp } from '@/tools/cryptoPhp'
import MoreDropdown from '@/components/MoreDropdown'
import DropDownMenu from '@/components/DropDownMenu'
import { useDispatch, useSelector } from '@store/index'
import { setIsRefresh } from '@store/user'
import {
  deleteDemand,
  getDemandInfo,
  getDemandList,
  updateDemandStatus,
  updatePriority,
} from '@/services/demand'
import { setDemandInfo } from '@store/demand'
import PaginationBox from '@/components/TablePagination'

const Operation = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 24px 0px 12px ',
  height: 52,
  background: 'white',
  borderRadius: '6px 6px 0 0',
})
const RowIconFont = styled(IconFont)({
  visibility: 'hidden',
  fontSize: 16,
  cursor: 'pointer',
  color: '#2877ff',
})

const DataWrap = styled.div({
  height: 'calc(100% - 92px)',
  background: 'white',
  overflowX: 'auto',
  borderRadius: 6,
})

const ChildDemand = () => {
  const [t] = useTranslation()
  const [isVisible, setIsVisible] = useState(false)
  const [deleteId, setDeleteId] = useState(0)
  const [isDelete, setIsDelete] = useState(false)
  const [isSettingState, setIsSettingState] = useState(false)
  const [operationItem, setOperationItem] = useState<any>({})
  const dispatch = useDispatch()
  const { isRefresh } = useSelector(store => store.user)
  const { projectInfo } = useSelector(store => store.project)
  const { demandInfo } = useSelector(store => store.demand)
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
  const { demandId } = paramsData
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
  const [dataWrapHeight, setDataWrapHeight] = useState(0)
  const [tableWrapHeight, setTableWrapHeight] = useState(0)
  const dataWrapRef = useRef<HTMLDivElement>(null)
  const [orderKey, setOrderKey] = useState<any>('')
  const [order, setOrder] = useState<any>('')
  const [isVisibleFields, setIsVisibleFields] = useState(false)

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
      parentId: demandId,
    })
    setDataList(result)
    setIsSpinning(false)
    dispatch(setIsRefresh(false))
  }

  useEffect(() => {
    getList(pageObj, order, orderKey)
  }, [])

  useEffect(() => {
    if (isRefresh) {
      getList({ page: 1, size: pageObj.size }, order, orderKey)
    }
  }, [isRefresh])

  useEffect(() => {
    getShowkey()
  }, [projectInfo])

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

  const onEdit = (e: any, item: any) => {
    setOperationItem(item)
    setIsVisible(true)
  }

  const onUpdate = async (updateState?: boolean) => {
    const result = await getDemandInfo({ projectId, id: demandId })
    dispatch(setDemandInfo(result))
    getList(pageObj, order, orderKey, updateState)
  }

  const updateOrderkey = (key: any, val: any) => {
    setOrderKey(key)
    setOrder(val === 2 ? 'desc' : 'asc')
    getList({ page: 1, size: pageObj.size }, val === 2 ? 'desc' : 'asc', key)
  }

  const setMenu = (
    <Menu
      items={[
        {
          key: '1',
          label: (
            <div
              onClick={() => {
                setIsSettingState(true)
                setIsVisibleFields(false)
              }}
            >
              {t('common.setField')}
            </div>
          ),
        },
      ]}
    />
  )

  const onClickItem = (item: any) => {
    const params = encryptPhp(
      JSON.stringify({ type: 'info', id: projectId, demandId: item.id }),
    )
    openDetail(`/ProjectManagement/Demand?data=${params}`)
  }

  const onChangePage = (page: number, size: number) => {
    setPageObj({ page, size })
    getList({ page, size }, order, orderKey)
  }

  const onShowSizeChange = (page: number, size: number) => {
    setPageObj({ page, size })
    getList({ page, size }, order, orderKey)
  }

  const onChangeVisible = () => {
    setIsVisible(false)
    setOperationItem({})
  }

  const onChangeState = async (item: any) => {
    try {
      await updatePriority({
        demandId: item.id,
        priorityId: item.priorityId,
        projectId,
      })
      message.success(t('common.prioritySuccess'))
      onUpdate()
    } catch (error) {
      //
    }
  }

  const onChangeStatus = async (value: any) => {
    try {
      await updateDemandStatus(value)
      message.success(t('common.statusSuccess'))
      onUpdate()
    } catch (error) {
      //
    }
  }

  const onDelete = (item: any) => {
    setDeleteId(item.id)
    setIsDelete(true)
  }

  const onDeleteConfirm = async () => {
    try {
      await deleteDemand({ projectId, id: deleteId })
      message.success(t('common.deleteSuccess'))
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

  const menu = (item: any) => {
    let menuItems = [
      {
        key: '1',
        label: <div onClick={e => onEdit(e, item)}>{t('common.edit')}</div>,
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
              {hasEdit && hasDel ? null : <MoreDropdown menu={menu(record)} />}
            </div>
          )
        },
      },
    ]
    return [...arrList, ...newList]
  }, [titleList, titleList2, titleList3, columns])

  return (
    <div style={{ height: 'calc(100% - 54px)', padding: '16px 16px 0 16px' }}>
      <DeleteConfirm
        text={t('common.confirmDelChildDemand')}
        isVisible={isDelete}
        onChangeVisible={() => setIsDelete(!isDelete)}
        onConfirm={onDeleteConfirm}
      />
      <Operation>
        {getIsPermission(projectInfo?.projectPermissions, 'b/story/save') ||
        projectInfo?.status !== 1 ? (
          <div />
        ) : (
          <SecondButton
            onClick={() => setIsVisible(true)}
            icon={<IconFont type="plus" />}
          >
            {t('project.addChildDemand')}
          </SecondButton>
        )}

        <DropDownMenu
          menu={setMenu}
          icon="settings"
          isVisible={isVisibleFields}
          onChangeVisible={setIsVisibleFields}
          isActive={isSettingState}
        >
          <div>{t('common.tableFieldSet')}</div>
        </DropDownMenu>
      </Operation>
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
                tableLayout="auto"
                showSorterTooltip={false}
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

      <OptionalFeld
        allTitleList={allTitleList}
        plainOptions={plainOptions}
        plainOptions2={plainOptions2}
        plainOptions3={plainOptions3}
        checkList={titleList}
        checkList2={titleList2}
        checkList3={titleList3}
        isVisible={isSettingState}
        onClose={() => setIsSettingState(false)}
        getCheckList={getCheckList}
      />
    </div>
  )
}

export default ChildDemand