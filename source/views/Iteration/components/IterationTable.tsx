// 迭代-表格模式

/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable complexity */
import { Menu, message, Table } from 'antd'
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import { useSearchParams } from 'react-router-dom'
import { createRef, useEffect, useMemo, useState } from 'react'
import type { CheckboxValueType } from 'antd/lib/checkbox/Group'
import { useDynamicColumns } from '@/components/TableColumns/ProjectTableColumn'
import { OptionalFeld } from '@/components/OptionalFeld'
import { useTranslation } from 'react-i18next'
import NoData from '@/components/NoData'
import { getIsPermission, getParamsData } from '@/tools'
import MoreDropdown from '@/components/MoreDropdown'
import useSetTitle from '@/hooks/useSetTitle'
import { useDispatch, useSelector } from '@store/index'
import { setAddWorkItemModal, setFilterParamsModal } from '@store/project'
import { updateDemandStatus, updatePriority } from '@/services/demand'
import PaginationBox from '@/components/TablePagination'
import { DemandOperationDropdownMenu } from '@/components/TableDropdownMenu/DemandDropdownMenu'
import useOpenDemandDetail from '@/hooks/useOpenDemandDetail'
import ResizeTable from '@/components/ResizeTable'
import CreateDemandButton from './CreateDemandButton'
import { getMessage } from '@/components/Message'
import FloatBatch from '@/components/BatchOperation/FloatBatch'
import useShortcutC from '@/hooks/useShortcutC'

const Content = styled.div({
  padding: '8px 12px 0 8px',
  background: 'var(--neutral-white-d1)',
})

const RowIconFont = styled(IconFont)({
  visibility: 'hidden',
  fontSize: 16,
  cursor: 'pointer',
  color: 'var(--primary-d2)',
})
interface Props {
  data: any
  onChangeVisible(e: any, item: any): void
  onDelete(item: any): void
  onChangePageNavigation?(item: any): void
  onChangeRow?(): void
  settingState: boolean
  onChangeSetting(val: boolean): void
  onChangeOrder?(item: any): void
  isSpinning?: boolean
  hasId: any
  onUpdate(updateState?: boolean): void
  iterateId: any
}

const IterationTable = (props: Props) => {
  const asyncSetTtile = useSetTitle()
  const [t] = useTranslation()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
  const { projectInfo, filterParams } = useSelector(store => store.project)
  const [titleList, setTitleList] = useState<any[]>([])
  const [titleList2, setTitleList2] = useState<any[]>([])
  const [titleList3, setTitleList3] = useState<any[]>([])
  const [allTitleList, setAllTitleList] = useState<any[]>([])
  const [plainOptions, setPlainOptions] = useState<any>([])
  const [plainOptions2, setPlainOptions2] = useState<any>([])
  const [plainOptions3, setPlainOptions3] = useState<any>([])
  const [orderKey, setOrderKey] = useState<any>('')
  const [order, setOrder] = useState<any>('')
  const [isShowMore, setIsShowMore] = useState(false)
  const batchDom: any = createRef()
  // 勾选的id集合
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([])
  const [openDemandDetail] = useOpenDemandDetail()

  asyncSetTtile(`${t('title.iteration')}【${projectInfo.name}】`)
  const dispatch = useDispatch()

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

  useEffect(() => {
    if (projectInfo?.id) {
      getShowkey()
    }
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

  const onClickItem = (item: any) => {
    const demandIds = props.data?.list?.map((i: any) => i.id)
    openDemandDetail({ ...item, ...{ demandIds } }, projectId, item.id)
  }

  const onChangePage = (page: number, size: number) => {
    props.onChangePageNavigation?.({ page, size })
    setSelectedRowKeys([])
    onOperationCheckbox('remove')
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
      props.onChangeRow?.()
    } catch (error) {
      //
    }
  }

  const onChangeStatus = async (value: any) => {
    try {
      await updateDemandStatus(value)
      getMessage({ msg: t('common.statusSuccess') as string, type: 'success' })
      props.onChangeRow?.()
    } catch (error) {
      //
    }
  }

  const updateOrderkey = (key: any, val: any) => {
    setOrderKey(key)
    setOrder(val)
    props.onChangeOrder?.({ value: val === 2 ? 'desc' : 'asc', key })
  }

  const onEditChange = (item: any) => {
    setIsShowMore(false)
    dispatch(
      setAddWorkItemModal({
        visible: true,
        params: { editId: item.id, projectId: item.project_id },
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
          iterateId: props.iterateId,
          categoryId: item.categoryId,
        },
      }),
    )
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
    onClickItem,
    rowIconFont,
    showChildCOntent: true,
    onUpdate: props?.onUpdate,
  })

  const hasCreate = getIsPermission(
    projectInfo?.projectPermissions,
    projectInfo.projectType === 1 ? 'b/story/save' : 'b/transaction/save',
  )

  const hasBatch = getIsPermission(
    projectInfo?.projectPermissions,
    projectInfo.projectType === 1 ? 'b/story/batch' : 'b/transaction/batch',
  )

  const hasEdit = getIsPermission(
    projectInfo?.projectPermissions,
    projectInfo.projectType === 1 ? 'b/story/update' : 'b/transaction/update',
  )
  const hasDel = getIsPermission(
    projectInfo?.projectPermissions,
    projectInfo.projectType === 1 ? 'b/story/delete' : 'b/transaction/delete',
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
  }, [titleList, titleList2, titleList3, columns, selectedRowKeys])

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

  const onCreateDemand = () => {
    dispatch(setFilterParamsModal(filterParams))
    dispatch(
      setAddWorkItemModal({
        visible: true,
        params: { projectId, iterateId: props.iterateId },
      }),
    )
  }
  const handleShortcutEvent = () => {
    console.log('C键被按下')
    onCreateDemand()
  }

  useShortcutC(handleShortcutEvent)
  return (
    <Content
      style={{
        height:
          !hasCreate &&
          props.hasId &&
          props.hasId?.status === 1 &&
          projectInfo?.status === 1
            ? 'calc(100% - 64px)'
            : 'calc(100% - 52px)',
      }}
    >
      <CreateDemandButton
        hasCreate={
          !hasCreate &&
          props.hasId &&
          props.hasId?.status === 1 &&
          projectInfo?.status === 1
        }
        onCreateDemand={onCreateDemand}
      />

      <ResizeTable
        isSpinning={props?.isSpinning}
        dataWrapNormalHeight={
          hasCreate || props.hasId?.status !== 1 || projectInfo?.status !== 1
            ? 'calc(100% - 44px)'
            : 'calc(100% - 96px)'
        }
        col={selectColum}
        dataSource={props.data?.list}
        noData={<NoData />}
        rowSelection={
          !hasBatch &&
          ({
            selectedRowKeys: selectedRowKeys?.map((i: any) => i.id),
            onSelect: (record: any, selected: any) =>
              onSelectChange(record, selected),
            onSelectAll,
          } as any)
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
        total={props.data?.total}
        currentPage={props.data?.currentPage}
        pageSize={props.data?.pageSize}
        onChange={onChangePage}
      />
      <OptionalFeld
        allTitleList={allTitleList}
        plainOptions={plainOptions.filter((i: any) => i.is_flaw !== 1)}
        plainOptions2={plainOptions2}
        plainOptions3={plainOptions3}
        checkList={titleList}
        checkList2={titleList2}
        checkList3={titleList3}
        isVisible={props.settingState}
        onClose={() => props.onChangeSetting(false)}
        getCheckList={getCheckList}
      />
    </Content>
  )
}

export default IterationTable
