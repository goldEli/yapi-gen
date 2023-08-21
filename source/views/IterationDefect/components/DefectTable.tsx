/* eslint-disable react/jsx-no-useless-fragment */
// 缺陷主页-缺陷表格模式

import { createRef, useEffect, useMemo, useState } from 'react'
import { Menu, Table } from 'antd'
import styled from '@emotion/styled'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useDynamicColumns } from '@/components/TableColumns/ProjectTableColumn'
import { useTranslation } from 'react-i18next'
import NoData from '@/components/NoData'
import { getIsPermission, getParamsData, removeNull } from '@/tools'
import MoreDropdown from '@/components/MoreDropdown'
import useSetTitle from '@/hooks/useSetTitle'
import { useDispatch, useSelector } from '@store/index'
import { setAddWorkItemModal, setFilterParamsModal } from '@store/project'
import PaginationBox from '@/components/TablePagination'
import { saveSort } from '@store/view'
import useOpenDemandDetail from '@/hooks/useOpenDemandDetail'
import { getMessage } from '@/components/Message'
import ResizeTable from '@/components/ResizeTable'
import CommonButton from '@/components/CommonButton'
import FloatBatch from '@/components/BatchOperation/FloatBatch'
import { DefectDropdownMenu } from '@/components/TableDropdownMenu/DefectDropdownMenu'
import {
  updateFlawPriority,
  updateFlawStatus,
  updateFlawTableParams,
} from '@/services/flaw'
import { setActiveCategory } from '@store/category'
import { encryptPhp } from '@/tools/cryptoPhp'

const Content = styled.div`
  background: var(--neutral-white-d1);
  height: 100%;
`

interface Props {
  data: any
  onDelete(item: any): void
  onChangePageNavigation?(item: any): void
  onChangeRow?(): void
  onChangeOrder?(item: any): void
  isSpinning?: boolean
  onUpdate(updateState?: boolean): void
  titleList?: any
  titleList2?: any
  titleList3?: any
  allTitleList?: any
}

const DefectTable = (props: Props) => {
  const asyncSetTtile = useSetTitle()
  const [t] = useTranslation()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
  const { projectInfo, filterKeys, filterParams, projectInfoValues } =
    useSelector(store => store.project)
  const tapSort = useSelector(store => store.view.tapSort)
  const [orderKey, setOrderKey] = useState<any>('')
  const [order, setOrder] = useState<any>('')
  const [isShowMore, setIsShowMore] = useState(false)
  // 该项目是否存在缺陷类别
  const [hasCategory, setHasCategory] = useState(false)
  const batchDom: any = createRef()
  // 勾选的id集合
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([])
  asyncSetTtile(`${t('defect1')}【${projectInfo.name}】`)
  const dispatch = useDispatch()
  const [openDemandDetail] = useOpenDemandDetail()
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(
      saveSort({
        [orderKey]: order,
      }),
    )
  }, [orderKey, order])

  useEffect(() => {
    if (tapSort) {
      const key = Object.keys(tapSort)
      const value = Object.values(tapSort)

      if (tapSort) {
        setOrderKey(key[0])
        setOrder(value[0])
      }
    }
  }, [tapSort])

  useEffect(() => {
    setSelectedRowKeys([])
  }, [projectId, props.data.list])

  // 勾选或者取消勾选，显示数量 keys: 所有选择的数量，type： 添加还是移除
  const onOperationCheckbox = (type: any, keys?: any) => {
    const redClassElements = document.getElementsByClassName(
      'ant-checkbox-wrapper',
    )
    for (const i of redClassElements) {
      if (i.getElementsByClassName('tagLength')[0]) {
        i.removeChild(i.getElementsByClassName('tagLength')[0])
      }
      if (type === 'add' && keys?.length > 0) {
        const div2 = document.createElement('div')
        div2.innerText = String(keys.length)
        div2.className = 'tagLength'
        i.appendChild(div2)
      }
    }
  }

  const onChangePage = (page: number, size: number) => {
    props.onChangePageNavigation?.({ page, size })
    setSelectedRowKeys([])
    onOperationCheckbox('remove')
  }

  // 点击打开详情并组装当前平级的需求id列表
  const onClickItem = (item: any) => {
    const demandIds = props.data?.list?.map((i: any) => i.id)
    openDemandDetail({ ...item, ...{ demandIds } }, projectId, item.id, 2)
  }

  // 修改优先级
  const onChangeState = async (item: any) => {
    await updateFlawPriority({
      id: item.id,
      priorityId: item.priorityId,
      projectId,
    })
    getMessage({ msg: t('common.prioritySuccess'), type: 'success' })
    props.onChangeRow?.()
  }

  //  修改状态
  const onChangeStatus = async (value: any) => {
    await updateFlawStatus(value)
    getMessage({ msg: t('common.statusSuccess'), type: 'success' })
    props.onChangeRow?.()
  }

  //  修改严重程度
  const onChangeSeverity = async (item: any) => {
    await updateFlawTableParams({
      id: item.id,
      projectId,
      otherParams: {
        severity: item.severity,
      },
    })
    getMessage({ msg: t('successfullyModified'), type: 'success' })
    props.onChangeRow?.()
  }

  const updateOrderkey = (key: any, val: any) => {
    setSelectedRowKeys([])
    onOperationCheckbox('remove')
    setOrderKey(key)
    setOrder(val)
    props.onChangeOrder?.({ value: val === 2 ? 'desc' : 'asc', key })
  }

  // 点击删除
  const onDeleteChange = (item: any) => {
    setIsShowMore(false)
    props.onDelete(item)
  }

  // 点击编辑
  const onEditChange = (item: any) => {
    setIsShowMore(false)
    dispatch(
      setAddWorkItemModal({
        visible: true,
        params: {
          editId: item.id,
          projectId,
          type: 2,
          title: t('editorialDefect'),
        },
      }),
    )
  }

  const columns = useDynamicColumns({
    projectId,
    orderKey,
    order,
    updateOrderkey,
    onChangeStatus,
    onChangeSeverity,
    onChangeState,
    onClickItem,
    showChildCOntent: true,
    onUpdate: props?.onUpdate,
    type: 2,
  })

  //  是否可创建
  const hasCreate = getIsPermission(
    projectInfo?.projectPermissions,
    'b/flaw/save',
  )

  const hasBatch = getIsPermission(
    projectInfo?.projectPermissions,
    'b/flaw/batch',
  )

  const hasEdit = getIsPermission(
    projectInfo?.projectPermissions,
    'b/flaw/update',
  )
  const hasDel = getIsPermission(
    projectInfo?.projectPermissions,
    'b/flaw/delete',
  )

  //  点击批量
  const onClickBatch = (e: any, type: any) => {
    setIsShowMore(false)
    e.stopPropagation()
    if (type === 'copy') {
      batchDom.current?.copy()
    } else {
      batchDom.current?.clickMenu(type)
    }
  }

  const menuBatch = () => {
    const batchItems = [
      {
        key: '0',
        disabled: true,
        label: (
          <div>
            {t('version2.checked', {
              count: selectedRowKeys?.map((i: any) => i.id)?.length,
            })}
          </div>
        ),
      },
      {
        key: '1',
        label: (
          <div onClick={e => onClickBatch(e, 'edit')}>
            {t('version2.batchEdit')}
          </div>
        ),
      },
      {
        key: '2',
        label: (
          <div onClick={e => onClickBatch(e, 'delete')}>
            {t('version2.batchDelete')}
          </div>
        ),
      },
      {
        key: '3',
        label: (
          <div onClick={e => onClickBatch(e, 'copy')}>
            {t('version2.batchCopyLink')}
          </div>
        ),
      },
    ]
    return <Menu style={{ minWidth: 56 }} items={batchItems} />
  }

  const selectColum: any = useMemo(() => {
    const arr = props.allTitleList
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
              {hasEdit && hasDel && hasCreate ? null : (
                <MoreDropdown
                  isMoreVisible={isShowMore}
                  menu={
                    selectedRowKeys
                      ?.map((i: any) => i.id)
                      .includes(record.id) ? (
                      menuBatch()
                    ) : (
                      <DefectDropdownMenu
                        onDeleteChange={onDeleteChange}
                        onEditChange={onEditChange}
                        record={record}
                      />
                    )
                  }
                  onChangeVisible={setIsShowMore}
                />
              )}
            </div>
          )
        },
      },
    ]
    if (!hasBatch) {
      arrList.push(Table.SELECTION_COLUMN as any)
    }
    return [...arrList, ...newList]
  }, [
    props.titleList,
    props.titleList2,
    props.titleList3,
    columns,
    selectedRowKeys,
  ])

  // 需求勾选
  const onSelectChange = (record: any, selected: any) => {
    const resultKeys = selected
      ? [...selectedRowKeys, ...[record], ...(record.allChildrenIds || [])]
      : selectedRowKeys?.filter((i: any) => i.id !== record.id)
    setSelectedRowKeys([...new Set(resultKeys)])
    onOperationCheckbox('add', [...new Set(resultKeys)])
  }

  // 全选
  const onSelectAll = (selected: any) => {
    if (selected) {
      let childKeys: any = []
      props.data?.list?.forEach((element: any) => {
        childKeys = [...childKeys, ...[element]]
      })
      setSelectedRowKeys([...new Set(childKeys)])
      onOperationCheckbox('add', [...new Set(childKeys)])
    } else {
      setSelectedRowKeys([])
      onOperationCheckbox('remove')
    }
  }

  // 点击创建缺陷
  const onClick = () => {
    dispatch(
      setAddWorkItemModal({
        visible: true,
        params: { noDataCreate: true, type: 2, title: t('createDefect') },
      }),
    )
    dispatch(setFilterParamsModal(filterParams))
  }

  // 点击去创建-缺陷类别
  const onNotCategoryClick = () => {
    dispatch(setActiveCategory({}))
    const resultParams = encryptPhp(
      JSON.stringify({
        type: 4,
        id: projectId,
        pageIdx: 'DemandDetail',
      }),
    )
    navigate(`/ProjectManagement/ProjectSetting?data=${resultParams}`)
  }

  useEffect(() => {
    setHasCategory(
      (removeNull(projectInfoValues, 'category') || []).filter(
        (i: any) => i.work_type === 2,
      )?.length <= 0,
    )
  }, [projectInfoValues])

  return (
    <Content>
      <ResizeTable
        isSpinning={props.isSpinning}
        dataWrapNormalHeight="calc(100% - 48px)"
        col={selectColum}
        dataSource={props.data.list}
        rowSelection={
          !hasBatch &&
          ({
            selectedRowKeys: selectedRowKeys?.map((i: any) => i.id),
            onSelect: (record: any, selected: any) =>
              onSelectChange(record, selected),
            onSelectAll,
          } as any)
        }
        noData={
          <>
            {hasCategory ? (
              <NoData
                subText={t('thisDefectHasNotYetCreatedACreateItQuickly')}
                haveFilter={filterKeys?.length > 0}
              >
                {!hasCreate && (
                  <CommonButton
                    type="light"
                    onClick={onNotCategoryClick}
                    style={{ marginTop: 24 }}
                  >
                    {t('toCreate')}
                  </CommonButton>
                )}
              </NoData>
            ) : (
              <NoData
                subText={
                  hasCreate
                    ? ''
                    : t('theCurrentProjectHasNotCreatedADefectCreate')
                }
                haveFilter={filterKeys?.length > 0}
              >
                {!hasCreate && (
                  <CommonButton
                    type="light"
                    onClick={onClick}
                    style={{ marginTop: 24 }}
                  >
                    {t('createDefect')}
                  </CommonButton>
                )}
              </NoData>
            )}
          </>
        }
      />

      {!hasBatch && (
        <FloatBatch
          isVisible={selectedRowKeys.length > 0}
          onClose={() => onSelectAll(false)}
          selectRows={selectedRowKeys}
          onUpdate={props.onUpdate}
          onRef={batchDom}
          type={2}
        />
      )}

      <PaginationBox
        currentPage={props.data?.currentPage}
        pageSize={props.data?.pageSize}
        total={props.data?.total}
        onChange={onChangePage}
        hasPadding
      />
    </Content>
  )
}

export default DefectTable
