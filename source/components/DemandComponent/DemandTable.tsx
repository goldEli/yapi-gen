// 需求主页-需求表格模式
/* eslint-disable no-constant-binary-expression */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react/jsx-no-leaked-render */
import {
  createRef,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { message, Spin, Menu, Table } from 'antd'
import styled from '@emotion/styled'
import { TableStyleBox, SecondButton } from '@/components/StyleCommon'
import { useSearchParams } from 'react-router-dom'
import type { CheckboxValueType } from 'antd/lib/checkbox/Group'
import { OptionalFeld } from '@/components/OptionalFeld'
import { useDynamicColumns } from '@/components/CreateProjectTableColum'
import { useTranslation } from 'react-i18next'
import NoData from '@/components/NoData'
import { getIsPermission, getParamsData } from '@/tools'
import MoreDropdown from '@/components/MoreDropdown'
import useSetTitle from '@/hooks/useSetTitle'
import { useDispatch, useSelector } from '@store/index'
import { setFilterParamsModal } from '@store/project'
import { updateDemandStatus, updatePriority } from '@/services/demand'
import PaginationBox from '@/components/TablePagination'
import { onTapSearchChoose, saveSort, saveTitles } from '@store/view'
import FloatBatch from '../FloatBatch'
import { DemandOperationDropdownMenu } from './DemandOperationDropdownMenu'
import { setCreateDemandProps, setIsCreateDemandVisible } from '@store/demand'
import useOpenDemandDetail from '@/hooks/useOpenDemandDeatil'

const Content = styled.div({
  padding: '20px 12px 0 8px',
  background: 'var(--neutral-white-d1)',
  height: 'calc(100% - 32px)',
})

const DataWrap = styled.div({
  background: 'white',
  overflowX: 'auto',
  height: 'calc(100% - 64px)',
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
  onUpdate(updateState?: boolean): void
}

const DemandTable = (props: Props) => {
  const asyncSetTtile = useSetTitle()
  const [t] = useTranslation()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
  const { projectInfo, filterKeys } = useSelector(store => store.project)
  const titles = useSelector(store => store.view.tapTitles)
  const tapSort = useSelector(store => store.view.tapSort)
  const { filterParams } = useSelector(store => store.demand)
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
  const [isAddVisible, setIsAddVisible] = useState(false)
  const batchDom: any = createRef()
  // 勾选的id集合
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([])
  const dataWrapRef = useRef<HTMLDivElement>(null)
  asyncSetTtile(`${t('title.need')}【${projectInfo.name}】`)
  const dispatch = useDispatch()
  const [openDemandDetail] = useOpenDemandDetail()

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
    dispatch(
      saveTitles([
        ...(projectInfo.titleList || []),
        ...(projectInfo.titleList2 || []),
        ...(projectInfo.titleList3 || []),
      ]),
    )
  }

  useEffect(() => {
    getShowkey()
  }, [projectInfo])

  function getTitle(arr: any, arr1: any) {
    const arr2: any = []
    arr1.forEach((i: any) => {
      arr2.push(i.value)
    })

    const myArr: any = []
    arr.forEach((i: any) => {
      if (arr2.includes(i)) {
        myArr.push(i)
      }
    })

    return myArr
  }

  useEffect(() => {
    if (titles) {
      setTitleList(getTitle(titles, plainOptions))
      setTitleList2(getTitle(titles, plainOptions2))
      setTitleList3(getTitle(titles, plainOptions3))

      setAllTitleList(titles)
    }
  }, [titles])

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
    dispatch(saveTitles(all))
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
    props.onChangeOrder?.({ value: val === 2 ? 'desc' : 'asc', key })
  }

  // 点击编辑
  const onEditChange = (item: any) => {
    setIsShowMore(false)
    dispatch(setIsCreateDemandVisible(true))
    dispatch(
      setCreateDemandProps({ demandId: item.id, projectId: item.project_id }),
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
    dispatch(setIsCreateDemandVisible(true))
    dispatch(
      setCreateDemandProps({
        projectId: item.project_id,
        isChild: true,
        parentId: item.id,
      }),
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

  const [dataWrapHeight, setDataWrapHeight] = useState(0)
  const [tableWrapHeight, setTableWrapHeight] = useState(0)

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
  }, [props.data?.list])

  const tableY =
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
    setIsAddVisible(!isAddVisible)
    dispatch(setFilterParamsModal(filterParams))
  }

  return (
    <Content>
      <DataWrap ref={dataWrapRef}>
        <Spin spinning={props?.isSpinning}>
          {!!props.data?.list &&
            (props.data?.list?.length > 0 ? (
              <TableStyleBox
                rowKey="id"
                columns={selectColum}
                dataSource={props.data?.list}
                pagination={false}
                scroll={{
                  x: 'max-content',
                  y: tableY,
                }}
                showSorterTooltip={false}
                tableLayout="auto"
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
                  <SecondButton onClick={onClick} style={{ marginTop: 24 }}>
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

      <PaginationBox
        currentPage={props.data?.currentPage}
        pageSize={props.data?.pageSize}
        total={props.data?.total}
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
        isVisible={props.settingState}
        onClose={() => props.onChangeSetting(false)}
        getCheckList={getCheckList}
      />
    </Content>
  )
}

export default DemandTable
