// 需求主页-需求表格模式
/* eslint-disable no-constant-binary-expression */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react/jsx-no-leaked-render */
import { createRef, useEffect, useMemo, useState } from 'react'
import { Menu, Table } from 'antd'
import { useSearchParams } from 'react-router-dom'
import { useDynamicColumns } from '@/components/TableColumns/ProjectTableColumn'
import { useTranslation } from 'react-i18next'
import NoData from '@/components/NoData'
import { getIsPermission, getParamsData } from '@/tools'
import MoreDropdown from '@/components/MoreDropdown'
import useSetTitle from '@/hooks/useSetTitle'
import { useDispatch, useSelector } from '@store/index'
import { setAddWorkItemModal, setFilterParamsModal } from '@store/project'
import { updateDemandStatus, updatePriority } from '@/services/demand'
import PaginationBox from '@/components/TablePagination'
import { saveSort } from '@store/view'
import useOpenDemandDetail from '@/hooks/useOpenDemandDetail'
import { getMessage } from '@/components/Message'
import { DemandOperationDropdownMenu } from '@/components/TableDropdownMenu/DemandDropdownMenu'
import ResizeTable from '@/components/ResizeTable'
import CommonButton from '@/components/CommonButton'
import FloatBatch from '@/components/BatchOperation/FloatBatch'
import { TableContent } from '../style'

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

const DemandTable = (props: Props) => {
  const asyncSetTtile = useSetTitle()
  const [t] = useTranslation()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
  const { projectInfo, filterKeys, filterParams } = useSelector(
    store => store.project,
  )
  const [order, setOrder] = useState<any>({ value: '', key: '' })
  const [isShowMore, setIsShowMore] = useState(false)
  const batchDom: any = createRef()
  // 勾选的id集合
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([])
  asyncSetTtile(`${t('title.need')}【${projectInfo.name}】`)
  const dispatch = useDispatch()
  const [openDemandDetail] = useOpenDemandDetail()

  useEffect(() => {
    dispatch(
      saveSort({
        [order.key]: order.value,
      }),
    )
  }, [order])

  useEffect(() => {
    setSelectedRowKeys([])
  }, [projectId])

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
    openDemandDetail({ ...item, ...{ demandIds } }, projectId, item.id)
  }

  const onChangeState = async (item: any) => {
    try {
      await updatePriority({
        demandId: item.id,
        priorityId: item.priorityId,
        projectId,
      })
      getMessage({ msg: t('common.prioritySuccess'), type: 'success' })
      props.onChangeRow?.()
    } catch (error) {
      //
    }
  }

  const onChangeStatus = async (value: any) => {
    try {
      await updateDemandStatus(value)
      getMessage({ msg: t('common.statusSuccess'), type: 'success' })
      props.onChangeRow?.()
    } catch (error) {
      //
    }
  }

  const updateOrderkey = (key: any, val: any) => {
    setSelectedRowKeys([])
    onOperationCheckbox('remove')
    setOrder({ value: val, key })
    props.onChangeOrder?.({ value: val === 2 ? 'desc' : 'asc', key })
  }

  // 点击编辑
  const onEditChange = (item: any) => {
    setIsShowMore(false)
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
    setIsShowMore(false)
    props.onDelete(item)
  }

  // 点击创建子需求
  const onCreateChild = (item: any) => {
    setIsShowMore(false)
    dispatch(
      setAddWorkItemModal({
        visible: true,
        params: {
          projectId: item.project_id,
          isChild: true,
          parentId: item.id,
          parentList: item.parent,
          categoryId: item.categoryId,
          type: 1,
          title: t('createSubrequirements'),
        },
      }),
    )
  }

  const columns = useDynamicColumns({
    projectId,
    orderKey: order.key,
    order: order.value,
    updateOrderkey,
    onChangeStatus,
    onChangeState,
    onClickItem,
    showChildCOntent: true,
    onUpdate: props?.onUpdate,
    type: 1,
  })

  const hasCreate = getIsPermission(
    projectInfo?.projectPermissions,
    'b/story/save',
  )

  const hasBatch = getIsPermission(
    projectInfo?.projectPermissions,
    'b/story/batch',
  )

  const hasEdit = getIsPermission(
    projectInfo?.projectPermissions,
    'b/story/update',
  )
  const hasDel = getIsPermission(
    projectInfo?.projectPermissions,
    'b/story/delete',
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
                      <DemandOperationDropdownMenu
                        onEditChange={onEditChange}
                        onDeleteChange={onDeleteChange}
                        onCreateChild={onCreateChild}
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

  const onClick = () => {
    dispatch(
      setAddWorkItemModal({
        visible: true,
        params: {
          noDataCreate: true,
          type: 1,
          title: t('createRequirements'),
        },
      }),
    )
    dispatch(setFilterParamsModal(filterParams))
  }
  useEffect(() => {
    setSelectedRowKeys([])
  }, [props.data?.list])

  return (
    <TableContent>
      <ResizeTable
        isSpinning={props.isSpinning}
        dataWrapNormalHeight="calc(100% - 48px)"
        col={selectColum}
        dataSource={props.data?.list}
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
          <NoData
            subText={hasCreate ? '' : t('version2.noDataCreateDemandList')}
            haveFilter={filterKeys?.length > 0}
          >
            {!hasCreate && (
              <CommonButton
                type="light"
                onClick={onClick}
                style={{ marginTop: 24 }}
              >
                {t('common.createDemand')}
              </CommonButton>
            )}
          </NoData>
        }
      />

      {!hasBatch && (
        <FloatBatch
          isVisible={selectedRowKeys.length > 0}
          onClose={() => onSelectAll(false)}
          selectRows={selectedRowKeys}
          onUpdate={props.onUpdate}
          onRef={batchDom}
          type={1}
        />
      )}

      <PaginationBox
        currentPage={props.data?.currentPage}
        pageSize={props.data?.pageSize}
        total={props.data?.total}
        onChange={onChangePage}
      />
    </TableContent>
  )
}

export default DemandTable
