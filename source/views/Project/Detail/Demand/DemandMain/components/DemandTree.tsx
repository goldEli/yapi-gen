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
import { Pagination, message, Spin, Menu, Table } from 'antd'
import styled from '@emotion/styled'
import {
  TableStyleBox,
  PaginationWrap,
  ExpendedWrap,
  SecondButton,
} from '@/components/StyleCommon'
import { useSearchParams } from 'react-router-dom'
import { useModel } from '@/models'
import type { CheckboxValueType } from 'antd/lib/checkbox/Group'
import { OptionalFeld } from '@/components/OptionalFeld'
import { useDynamicColumns } from '@/components/CreateProjectTableColum'
import { useTranslation } from 'react-i18next'
import NoData from '@/components/NoData'
import { getIsPermission, getParamsData, openDetail } from '@/tools'
import { encryptPhp } from '@/tools/cryptoPhp'
import MoreDropdown from '@/components/MoreDropdown'
import useSetTitle from '@/hooks/useSetTitle'
import EditDemand from '@/components/EditDemandNew/index'
import FloatBatch from '@/components/FloatBatch'
import { useSelector } from '@store/index'

const Content = styled.div({
  padding: '16px 16px 0 16px',
  background: '#F5F7FA',
  height: 'auto',
})

const DataWrap = styled.div({
  background: 'white',
  overflowX: 'auto',
  height: 'calc(100% - 64px)',
  width: '100%',
  position: 'relative',
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
  const { updatePriority, updateDemandStatus, getDemandList } =
    useModel('demand')
  const { projectInfo } = useSelector(
    (store: { project: any }) => store.project,
  )
  const { filterKeys } = useModel('project')
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
  const [isAddVisible, setIsAddVisible] = useState(false)
  const batchDom: any = createRef()
  // 用于获取数据更新后的展开key
  const [computedTopId, setComputedTopId] = useState(0)
  const [delayChild, setDelayChild] = useState<any>({})

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

  const onShowSizeChange = (page: number, size: number) => {
    props.onChangePageNavigation?.({ page, size })
    setSelectedRowKeys([])
    onOperationCheckbox('remove')
  }

  // 点击跳转需求详情
  const onClickItem = (item: any) => {
    const params = encryptPhp(
      JSON.stringify({ type: 'info', id: projectId, demandId: item.id }),
    )
    openDetail(`/Detail/Demand?data=${params}`)
  }

  // 修改优先级
  const onChangeState = async (item: any, row?: any) => {
    try {
      await updatePriority({
        demandId: item.id,
        priorityId: item.priorityId,
        projectId,
      })
      message.success(t('common.prioritySuccess'))
      props.onChangeRow?.(row?.topId)
    } catch (error) {
      //
    }
  }

  // 修改状态
  const onChangeStatus = async (value: any, row?: any) => {
    try {
      await updateDemandStatus(value)
      message.success(t('common.statusSuccess'))
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

  const onPropsChangeVisible = (e: any, item?: any) => {
    setIsShowMore(false)
    props.onChangeVisible(e, item)
    setComputedTopId(item?.topId)
  }

  const onPropsChangeDelete = (item: any) => {
    setIsShowMore(false)
    props.onDelete(item)
    setComputedTopId(item?.topId)
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
      const lists = [
        ...[row.id],
        ...(row.allChildrenIds?.map((i: any) => i.id) || []),
      ]
      resultList = expandedRowKeys?.filter(
        (i: any) => !lists.some((k: any) => k === i),
      )
    } else {
      const lists = [
        ...[row.id],
        ...(row.allChildrenIds?.map((i: any) => i.id) || []),
      ]
      resultList = [...expandedRowKeys, ...lists]
    }

    setExpandedRowKeys([...new Set(resultList)])
    const resultArr = resultData?.list?.map((i: any) => ({
      ...i,
      children: row.parentId ? row.children : dataChildren?.list,
      isExpended: row.id === i.id ? !row.isExpended : false,
    }))
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

  const hasBatch = getIsPermission(
    projectInfo?.projectPermissions,
    'b/story/batch',
  )

  // 点击创建子需求
  const onChangeCreateChild = (item: any) => {
    setIsShowMore(false)
    setIsVisible(true)
    setIsCreateChild(item)
    setComputedTopId(item?.topId)
  }

  const menu = (item: any) => {
    let menuItems = [
      {
        key: '1',
        label: (
          <div onClick={e => onPropsChangeVisible(e, item)}>
            {t('common.edit')}
          </div>
        ),
      },
      {
        key: '2',
        label: (
          <div onClick={() => onPropsChangeDelete(item)}>{t('common.del')}</div>
        ),
      },
      {
        key: '3',
        label: (
          <div onClick={() => onChangeCreateChild(item)}>
            {t('common.createChildDemand')}
          </div>
        ),
      },
    ]

    if (hasEdit) {
      menuItems = menuItems.filter((i: any) => i.key !== '1')
    }

    if (hasDel) {
      menuItems = menuItems.filter((i: any) => i.key !== '2')
    }

    if (hasCreate || projectInfo?.status !== 1) {
      menuItems = menuItems.filter((i: any) => i.key !== '3')
    }

    return <Menu style={{ minWidth: 56 }} items={menuItems} />
  }

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
              {hasEdit && hasDel ? null : (
                <MoreDropdown
                  isMoreVisible={isShowMore}
                  menu={
                    selectedRowKeys?.map((i: any) => i.id).includes(record.id)
                      ? menuBatch()
                      : menu(record)
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

  const [dataWrapHeight, setDataWrapHeight] = useState(0)
  const [tableWrapHeight, setTableWrapHeight] = useState(0)

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
          ...(list[0]?.allChildrenIds?.map((i: any) => i.id) || []),
        ])
      } else {
        setComputedTopId(0)
      }
    }
  }, [props.data?.list])

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
    // 判断列表数据更新完成并且有延时id则调用获取子需求列表
    if (!props.isUpdated && delayChild?.id) {
      onGetChildList(delayChild)
    }
  }, [data?.list])

  const tableY: any =
    tableWrapHeight > dataWrapHeight - 52 ? dataWrapHeight - 52 : void 0

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
      data?.list?.forEach((element: any) => {
        childKeys = [...childKeys, ...[element], ...element.allChildrenIds]
      })
      setSelectedRowKeys([...new Set(childKeys)])
      onOperationCheckbox('add', [...new Set(childKeys)])
    } else {
      setSelectedRowKeys([])
      onOperationCheckbox('remove')
    }
  }

  // 关闭创建子需求
  const onCloseCreateChild = () => {
    setIsVisible(!isVisible)
    setIsCreateChild({})
  }

  // 关闭创建需求-暂无数据
  const onClose = () => {
    setIsAddVisible(!isAddVisible)
  }

  const onTest = () => {
    props.onUpdate(true, isCreateChild?.topId)
  }

  return (
    <Content style={{ height: 'calc(100% - 52px)' }}>
      {/* 暂无数据创建 */}
      <EditDemand
        visible={isAddVisible}
        noDataCreate
        onChangeVisible={onClose}
        onUpdate={() => props.onUpdate(true)}
      />

      <EditDemand
        visible={isVisible}
        onChangeVisible={onCloseCreateChild}
        onUpdate={onTest}
        isChild
        categoryId={isCreateChild?.categoryId}
        parentId={isCreateChild?.id}
      />

      <DataWrap ref={dataWrapRef}>
        <Spin spinning={props?.isSpinning}>
          {!!data?.list &&
            (data?.list?.length > 0 ? (
              <TableStyleBox
                rowKey="id"
                columns={selectColum}
                dataSource={data?.list}
                pagination={false}
                scroll={{
                  x: 'max-content',
                  y: tableY,
                }}
                showSorterTooltip={false}
                tableLayout="auto"
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
              />
            ) : (
              <NoData
                subText={hasCreate ? '' : t('version2.noDataCreateDemandList')}
                haveFilter={filterKeys?.length > 0}
              >
                {!hasCreate && (
                  <SecondButton
                    onClick={() => setIsAddVisible(true)}
                    style={{ marginTop: 24 }}
                  >
                    {t('common.createDemand')}
                  </SecondButton>
                )}
              </NoData>
            ))}
        </Spin>
        {!hasBatch && (
          <FloatBatch
            isVisible={selectedRowKeys.length > 0}
            onClose={() => onSelectAll(false)}
            selectRows={selectedRowKeys}
            onUpdate={props.onUpdate}
            onRef={batchDom}
          />
        )}
      </DataWrap>

      <PaginationWrap>
        <Pagination
          defaultCurrent={1}
          current={data?.currentPage}
          pageSize={data?.pageSize || 20}
          showSizeChanger
          showQuickJumper
          total={data?.total}
          showTotal={total => t('common.tableTotal', { count: total })}
          pageSizeOptions={['10', '20', '50']}
          onChange={onChangePage}
          onShowSizeChange={onShowSizeChange}
        />
      </PaginationWrap>

      <OptionalFeld
        allTitleList={allTitleList}
        plainOptions={plainOptions}
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

export default DemandTree
