// 需求主页-需求树形模式
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable no-constant-binary-expression */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/naming-convention */
import {
  createRef,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { message, Menu, Table } from 'antd'
import styled from '@emotion/styled'
import { ExpendedWrap } from '@/components/StyleCommon'
import { useSearchParams } from 'react-router-dom'
import type { CheckboxValueType } from 'antd/lib/checkbox/Group'
import { OptionalFeld } from '@/components/OptionalFeld'
import { useDynamicColumns } from '@/components/TableColumns/ProjectTableColumn'
import { useTranslation } from 'react-i18next'
import NoData from '@/components/NoData'
import { getIsPermission, getParamsData, onComputedFindChild } from '@/tools'
import MoreDropdown from '@/components/MoreDropdown'
import useSetTitle from '@/hooks/useSetTitle'
import { useDispatch, useSelector } from '@store/index'
import {
  getDemandList,
  updateDemandStatus,
  updatePriority,
} from '@/services/demand'
import PaginationBox from '@/components/TablePagination'
import { DemandOperationDropdownMenu } from '@/components/TableDropdownMenu/DemandDropdownMenu'
import useOpenDemandDetail from '@/hooks/useOpenDemandDetail'
import ResizeTable from '@/components/ResizeTable'
import CreateDemandButton from './CreateDemandButton'
import { setAddWorkItemModal, setFilterParamsModal } from '@store/project'
import { getMessage } from '@/components/Message'
import FloatBatch from '@/components/BatchOperation/FloatBatch'

const Content = styled.div({
  padding: '8px 12px 0 8px',
  background: 'var(--neutral-white-d1)',
})

interface Props {
  data: any
  onChangeVisible(e: any, item: any): void
  onDelete(item: any): void
  onChangePageNavigation?(item: any): void
  onChangeRow?(topId?: any): void
  settingState: boolean
  onChangeSetting(val: boolean): void
  onChangeOrder?(item: any): void
  isSpinning?: boolean
  onUpdate(updateState?: boolean, topId?: any): void
  filterParams: any
  isUpdated?: boolean
  iterateId: any
  onUpdateTopId?(value: any): void
  hasId?: any
}

interface TreeIconProps {
  row: any
  onGetChildList(): void
}

// 返回标题获取子需求列表icon
const GetTreeIcon = (props: TreeIconProps) => {
  const onChangeData = async () => {
    // 未展开并且是最顶级
    await props.onGetChildList()
  }
  return (
    <div
      style={{ display: 'flex', alignItems: 'center', position: 'relative' }}
    >
      {props.row.allChildrenCount > 0 && (
        <ExpendedWrap
          onClick={onChangeData}
          type={props.row.isExpended ? 'add-subtract' : 'add-square-big'}
        />
      )}
      {props.row.allChildrenCount <= 0 && (
        <ExpendedWrap type="add-subtract" style={{ visibility: 'hidden' }} />
      )}
    </div>
  )
}

const DemandTree = (props: Props) => {
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
  const dataWrapRef = useRef<HTMLDivElement>(null)
  const [data, setData] = useState<any>({})
  // 展开的id集合
  const [expandedRowKeys, setExpandedRowKeys] = useState<any>([])
  // 勾选的id集合
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([])
  const [isVisible, setIsVisible] = useState(false)
  // 创建子需求数据
  const [isCreateChild, setIsCreateChild] = useState<any>({})
  const batchDom: any = createRef()
  // 用于获取数据更新后的展开key
  const [computedTopId, setComputedTopId] = useState(0)
  const [delayChild, setDelayChild] = useState<any>({})
  const dispatch = useDispatch()
  const [openDemandDetail] = useOpenDemandDetail()

  asyncSetTtile(`${t('title.need')}【${projectInfo.name}】`)
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

  const onChangePage = (page: number, size: number) => {
    props.onChangePageNavigation?.({ page, size })
    setSelectedRowKeys([])
    onOperationCheckbox('remove')
  }

  // 点击跳转需求详情
  const onClickItem = (item: any) => {
    let demandIds: any
    if (item.parentId) {
      const currentDemandTop = props.data?.list?.filter(
        (i: any) => i.id === item.topId,
      )?.[0]
      // 查找列表下与之父级匹配的数组
      let resultData = onComputedFindChild(currentDemandTop, item.parentId)
      demandIds = resultData.children?.map((k: any) => k.id)
    } else {
      demandIds = props.data?.list?.map((i: any) => i.id)
    }
    openDemandDetail({ ...item, ...{ demandIds } }, projectId, item.id)
  }

  // 修改优先级
  const onChangeState = async (item: any, row?: any) => {
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
      props.onChangeRow?.(row?.topId)
    } catch (error) {
      //
    }
  }

  // 修改状态
  const onChangeStatus = async (value: any, row?: any) => {
    try {
      await updateDemandStatus(value)
      getMessage({ msg: t('common.statusSuccess') as string, type: 'success' })
      props.onChangeRow?.(row?.topId)
    } catch (error) {
      //
    }
  }

  // 点击排序
  const updateOrderkey = (key: any, val: any) => {
    setOrderKey(key)
    setOrder(val)
    setExpandedRowKeys([])
    props.onChangeOrder?.({ value: val === 2 ? 'desc' : 'asc', key })
  }

  const onEditChange = (item?: any) => {
    setIsShowMore(false)
    setComputedTopId(item?.topId)
    props.onUpdateTopId?.(item.topId)
    dispatch(
      setAddWorkItemModal({
        visible: true,
        params: { projectId, editId: item.id, type: 1, title: '编辑需求' },
      }),
    )
  }

  const onDeleteChange = (item: any) => {
    setIsShowMore(false)
    props.onDelete(item)
    setComputedTopId(item?.topId)
    props.onUpdateTopId?.(item.topId)
  }

  // 点击创建子需求
  const onCreateChild = (item: any) => {
    setComputedTopId(item?.topId)
    props.onUpdateTopId?.(item.topId)
    setIsShowMore(false)
    dispatch(
      setAddWorkItemModal({
        visible: true,
        params: {
          projectId,
          isChild: true,
          parentId: item.id,
          categoryId: item.categoryId,
          iterateId: item.iterateId,
          type: 1,
          title: '创建子需求',
        },
      }),
    )
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

  // 计算当前child
  const onComputedChild = (list: any, row: any) => {
    list.forEach((element: any) => {
      if (element.id === row.id) {
        element.isExpended = !element.isExpended
        // 如果父级展开，子级也展开
        if (!element.isExpended) {
          element.children?.forEach((k: any) => {
            k.isExpended = true
          })
        }
      } else {
        // 判断全部子级与当前点击的匹配
        if (
          (element.allChildrenIds?.map((i: any) => i.id) || []).includes(row.id)
        ) {
          onComputedChild(element.children, row)
        }
      }
    })
  }

  // 计算当前是否折叠
  const onComputedExpended = (row: any, item: any, list: any) => {
    let state: any = item
    if (row.id === item.id) {
      state.isExpended = !item.isExpended
      state.children = row.parentId ? item.children : list
    } else {
      let topChildList: any = []
      if (item.id === row.topId) {
        topChildList = item.children
        state = { ...item, ...{ list: onComputedChild(topChildList, row) } }
      } else {
        state = item
      }
    }
    return state
  }

  // 获取子级下所有的id
  const getForAllId = (childrenList: any = [], arr: any = []) => {
    childrenList?.forEach((element: any) => {
      arr.push(element.id)
      if (element.children && element.children.length)
        getForAllId(element.children, arr)
    })
    return arr
  }

  // 点击获取子需求
  const onGetChildList = async (row: any) => {
    // 如果查询列表未执行完，不执行获取子需求
    let resultData: any = data
    if (props.isUpdated) {
      setDelayChild(row)
      return
    }

    let dataChildren: any
    let resultList: any
    // 第一级调用接口获取子级， 并且全部展开子级
    if (!row.isExpended && !row.parentId) {
      dataChildren = await getDemandList({
        tree: 1,
        ...props.filterParams,
        all: false,
        parentId: row.id,
        // 标识子需求
        isChildren: true,
      })
    }
    setDelayChild({})

    // 如果折叠起来，则在已勾选的数组中删掉，反之合并
    if (row.isExpended) {
      const lists = [...[row.id], ...(getForAllId(dataChildren?.list) || [])]
      resultList = expandedRowKeys?.filter(
        (i: any) => !lists.some((k: any) => k === i),
      )
    } else {
      const lists = [...[row.id], ...(getForAllId(dataChildren?.list) || [])]
      resultList = [...expandedRowKeys, ...lists]
    }
    setExpandedRowKeys([...new Set(resultList)])

    // 折叠时，判断参数错误，顶级折叠使用了子级折叠
    const resultArr = resultData?.list?.map((i: any) =>
      onComputedExpended(row, i, dataChildren?.list),
    )

    setData({ ...resultData, list: resultArr })
    setTimeout(() => {
      setData({ ...resultData, list: resultArr })
    }, 0)
  }

  // 返回 点击展开子需求图标
  const getTreeIcon = (row: any) => {
    return (
      <>
        {(row.allChildrenCount > 0 || row.parentId > 0) && (
          <GetTreeIcon row={row} onGetChildList={() => onGetChildList(row)} />
        )}
        {!(row.allChildrenCount > 0 || row.parentId > 0) && (
          <ExpendedWrap type="add-subtract" style={{ visibility: 'hidden' }} />
        )}
      </>
    )
  }

  const columns = useDynamicColumns({
    projectId,
    orderKey,
    order,
    updateOrderkey,
    onChangeStatus,
    onChangeState,
    onClickItem,
    showChildCOntent: true,
    onUpdate: props?.onUpdate,
    isTree: true,
    onChangeTree: getTreeIcon,
  })

  const hasCreate =
    !getIsPermission(projectInfo?.projectPermissions, 'b/story/save') &&
    props.hasId &&
    props.hasId?.status === 1 &&
    projectInfo?.status === 1

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
    const arr = allTitleList
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

  useEffect(() => {
    setData(props.data)
    // 如果有顶层id，则更新展开的key数组
    if (computedTopId) {
      if (
        props.data?.list?.filter((i: any) => i.id === computedTopId)?.length > 0
      ) {
        const list = props.data?.list?.filter(
          (i: any) => i.id === computedTopId,
        )
        setExpandedRowKeys([
          ...[list[0]?.id],
          ...(getForAllId(list[0]?.children) || []),
        ])
      } else {
        setComputedTopId(0)
      }
    }
  }, [props.data?.list])

  useLayoutEffect(() => {
    // 判断列表数据更新完成并且有延时id则调用获取子需求列表
    if (!props.isUpdated && delayChild?.id) {
      onGetChildList(delayChild)
    }
  }, [data?.list])

  // 获取所有的子级
  const getAllItems = (childrenList: any = [], arr: any = []) => {
    childrenList?.forEach((element: any) => {
      arr.push(element)
      if (element.children && element.children.length)
        getAllItems(element.children, arr)
    })
    return arr
  }

  // 需求勾选
  const onSelectChange = (record: any, selected: any) => {
    let resultList: any = []
    if (record.parentId) {
      resultList = getAllItems(
        data?.list?.filter((i: any) => i.id === record.topId)[0]?.children,
      )?.filter((i: any) => i.id === record.id)[0]?.children
    } else {
      resultList = data?.list?.filter((i: any) => i.id === record.topId)
    }

    const resultKeys = selected
      ? [...selectedRowKeys, ...[record], ...getAllItems(resultList || [])]
      : selectedRowKeys?.filter((i: any) => i.id !== record.id)
    const map = new Map()
    const newArr = resultKeys.filter(
      (v: any) => !map.has(v.id) && map.set(v.id, 1),
    )
    setSelectedRowKeys([...new Set(newArr)])
    onOperationCheckbox('add', [...new Set(newArr)])
  }

  // 全选
  const onSelectAll = (selected: any) => {
    if (selected) {
      const childKeys: any = getAllItems(data?.list || [])
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
        params: {
          projectId,
          iterateId: props.iterateId,
          type: 1,
          title: '创建需求',
        },
      }),
    )
  }

  return (
    <>
      <CreateDemandButton
        hasCreate={hasCreate}
        onCreateDemand={onCreateDemand}
      />
      <Content
        style={{
          height: hasCreate ? 'calc(100% - 96px)' : 'calc(100% - 32px)',
        }}
      >
        <ResizeTable
          isTree
          isSpinning={props?.isSpinning}
          col={selectColum}
          dataSource={data?.list}
          dataWrapNormalHeight="calc(100% - 64px)"
          expandable={{
            showExpandColumn: false,
            expandedRowKeys,
          }}
          rowSelection={
            !hasBatch &&
            ({
              selectedRowKeys: selectedRowKeys?.map((i: any) => i.id),
              onSelect: (record: any, selected: any) =>
                onSelectChange(record, selected),
              onSelectAll,
            } as any)
          }
          noData={<NoData />}
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
          currentPage={data?.currentPage}
          pageSize={data?.pageSize}
          total={data?.total}
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
    </>
  )
}

export default DemandTree
