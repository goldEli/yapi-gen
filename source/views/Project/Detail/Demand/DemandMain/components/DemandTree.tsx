// 需求主页-需求树形模式

/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable no-constant-binary-expression */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/naming-convention */
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
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
import EditDemand from '@/components/EditDemandNew'
import FloatBatch from '@/components/FloatBatch'

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

const LineWrap = styled.div<{
  isTop?: any
  isBottom?: any
  isLeft?: any
  isRight?: any
  isLeftBottom?: any
}>(
  {
    position: 'absolute',
    height: 52,
    display: 'flex',
    alignItems: 'center',
    div: {
      background: '#ECEDEF',
      zIndex: 0,
      position: 'absolute',
    },
  },
  ({ isTop, isBottom, isRight, isLeft, isLeftBottom }) => ({
    '.topLine': {
      display: isTop ? 'block' : 'none',
      width: 1,
      left: -16,
      height: 26,
      top: 0,
    },
    '.bottomLine': {
      display: isBottom ? 'block' : 'none',
      height: 26,
      bottom: 0,
      width: 1,
      left: 8,
    },
    '.leftLine': {
      display: isLeft ? 'block' : 'none',
      width: 15,
      bottom: 26,
      height: 1,
      left: -16,
    },
    '.rightLine': {
      display: isRight ? 'block' : 'none',
      width: 20,
      bottom: 26,
      height: 1,
      left: 6,
    },
    '.leftBottomLine': {
      display: isLeftBottom ? 'block' : 'none',
      width: 1,
      bottom: 0,
      height: 26,
      left: -16,
    },
  }),
)

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
  onUpdate(updateState?: boolean): void
  filterParams: any
}

interface TreeIconProps {
  row: any
  // onChangeExpendedKeys(values: any): void
  onGetChildList(): void
}

// 返回标题获取子需求列表icon
const GetTreeIcon = (props: TreeIconProps) => {
  const onChangeData = async () => {
    // 未展开并且是最顶级
    await props.onGetChildList()
    // props.onChangeExpendedKeys(props.row?.id)
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
      {props.row.allChildrenCount <= 0 && <div style={{ marginLeft: 4 }} />}
      {/* <LineWrap
        isBottom={props.row.isExpended}
        isTop={props.row.parentId > 0}
        isLeft={props.row.parentId > 0}
        isRight={
          props.row.parentId > 0 &&
          props.row.allChildrenCount <= 0 &&
          props.row.isExpended
        }
      >
        <div className="topLine" />
        <div className="bottomLine" />
        <div className="leftLine" />
        <div className="rightLine" />
      </LineWrap> */}
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
  const { projectInfo } = useModel('project')
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
    setExpandedRowKeys([])
    props.onChangePageNavigation?.({ page, size })
  }

  const onShowSizeChange = (page: number, size: number) => {
    setExpandedRowKeys([])
    props.onChangePageNavigation?.({ page, size })
  }

  const onClickItem = (item: any) => {
    const params = encryptPhp(
      JSON.stringify({ type: 'info', id: projectId, demandId: item.id }),
    )
    openDetail(`/Detail/Demand?data=${params}`)
  }

  const onChangeState = async (item: any) => {
    try {
      await updatePriority({
        demandId: item.id,
        priorityId: item.priorityId,
        projectId,
      })
      message.success(t('common.prioritySuccess'))
      props.onChangeRow?.()
    } catch (error) {
      //
    }
  }

  const onChangeStatus = async (value: any) => {
    try {
      await updateDemandStatus(value)
      message.success(t('common.statusSuccess'))
      props.onChangeRow?.()
    } catch (error) {
      //
    }
  }

  const updateOrderkey = (key: any, val: any) => {
    setOrderKey(key)
    setOrder(val)
    setExpandedRowKeys([])
    props.onChangeOrder?.({ value: val === 2 ? 'desc' : 'asc', key })
  }

  const onPropsChangeVisible = (e: any, item?: any) => {
    setIsShowMore(false)
    props.onChangeVisible(e, item)
  }

  const onPropsChangeDelete = (item: any) => {
    setIsShowMore(false)
    props.onDelete(item)
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
    setExpandedRowKeys(resultList)

    row.children = row.parentId ? row.children : dataChildren?.list
    setData({ ...data, list: [...data.list] })
    setTimeout(() => {
      row.isExpended = !row.isExpended
      setData({ ...data, list: [...data.list] })
    }, 0)
  }

  // 返回 点击展开子需求图标
  const getTreeIcon = (row: any) => {
    return (
      <>
        {(row.allChildrenCount > 0 || row.parentId > 0) && (
          <GetTreeIcon
            row={row}
            // onChangeExpendedKeys={onChangeExpendedKeys}
            onGetChildList={() => onGetChildList(row)}
          />
        )}
        {/* {row.parentId > 0 && (
          <div
            className="aa"
            style={{
              height: 52,
              width: 1,
              background: '#ECEDEF',
              position: 'absolute',
              left: 8,
            }}
          />
        )} */}
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

  // 点击创建子需求
  const onChangeCreateChild = (item: any) => {
    setIsShowMore(false)
    setIsVisible(true)
    setIsCreateChild(item)
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
            {t('project.addChildDemand')}
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

    const batchItems = [
      {
        key: '0',
        disabled: true,
        label: (
          <div onClick={e => onPropsChangeVisible(e, item)}>
            {t('version2.checked', { count: 23 })}
          </div>
        ),
      },
      {
        key: '1',
        label: (
          <div onClick={e => onPropsChangeVisible(e, item)}>
            {t('version2.batchEdit', { count: 23 })}
          </div>
        ),
      },
      {
        key: '2',
        label: (
          <div onClick={() => onPropsChangeDelete(item)}>
            {t('version2.batchDelete')}
          </div>
        ),
      },
      {
        key: '3',
        label: (
          <div onClick={() => onChangeCreateChild(item)}>
            {t('version2.batchCopyLink')}
          </div>
        ),
      },
    ]

    return (
      <Menu
        style={{ minWidth: 56 }}
        items={selectedRowKeys.includes(item.id) ? batchItems : menuItems}
      />
    )
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
                  menu={menu(record)}
                  onChangeVisible={setIsShowMore}
                />
              )}
            </div>
          )
        },
      },
      Table.SELECTION_COLUMN,
    ]
    return [...arrList, ...newList]
  }, [titleList, titleList2, titleList3, columns, selectedRowKeys])

  const [dataWrapHeight, setDataWrapHeight] = useState(0)
  const [tableWrapHeight, setTableWrapHeight] = useState(0)

  useEffect(() => {
    setData(props.data)
    setExpandedRowKeys([])
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

  // 关闭创建子需求
  const onClose = () => {
    setIsAddVisible(!isAddVisible)
  }

  return (
    <Content style={{ height: 'calc(100% - 52px)' }}>
      {/* 暂无数据创建 */}
      {isAddVisible && (
        <EditDemand
          visible={isAddVisible}
          noDataCreate
          onChangeVisible={onClose}
          onUpdate={() => props.onUpdate(true)}
        />
      )}
      {isVisible && (
        <EditDemand
          visible={isVisible}
          onChangeVisible={onCloseCreateChild}
          onUpdate={() => props.onUpdate(true)}
          isChild
          categoryId={isCreateChild?.categoryId}
          parentId={isCreateChild?.id}
        />
      )}

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
                rowSelection={{
                  selectedRowKeys: selectedRowKeys?.map((i: any) => i.id),
                  onSelect: (record, selected) =>
                    onSelectChange(record, selected),
                  onSelectAll,
                }}
              />
            ) : (
              <NoData
                subText={hasCreate ? '' : t('version2.noDataCreateDemandList')}
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
        <FloatBatch
          isVisible={selectedRowKeys.length > 0}
          onClose={() => onSelectAll(false)}
          selectRows={selectedRowKeys}
          onUpdate={props.onUpdate}
        />
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
