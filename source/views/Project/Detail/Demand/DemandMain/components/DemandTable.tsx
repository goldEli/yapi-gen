// 需求主页-需求表格模式
/* eslint-disable no-constant-binary-expression */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react/jsx-no-leaked-render */
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Pagination, message, Spin, Menu } from 'antd'
import styled from '@emotion/styled'
import {
  TableStyleBox,
  PaginationWrap,
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
import { useDispatch, useSelector } from '@store/index'
import { setFilterParamsModal } from '@store/project'

const Content = styled.div({
  padding: '16px 16px 0 16px',
  background: '#F5F7FA',
  height: 'auto',
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
  const { updatePriority, updateDemandStatus, filterParams } =
    useModel('demand')
  const { projectInfo, filterKeys } = useSelector(
    (store: { project: any }) => store.project,
  )
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
  const dataWrapRef = useRef<HTMLDivElement>(null)
  asyncSetTtile(`${t('title.need')}【${projectInfo.name}】`)
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
  }

  const onShowSizeChange = (page: number, size: number) => {
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
    props.onChangeOrder?.({ value: val === 2 ? 'desc' : 'asc', key })
  }

  const onPropsChangeVisible = (e: any, item: any) => {
    setIsShowMore(false)
    props.onChangeVisible(e, item)
  }

  const onPropsChangeDelete = (item: any) => {
    setIsShowMore(false)
    props.onDelete(item)
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
    ]
    return [...arrList, ...newList]
  }, [titleList, titleList2, titleList3, columns])

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

  const onClick = () => {
    setIsAddVisible(!isAddVisible)
    dispatch(setFilterParamsModal(filterParams))
  }

  return (
    <Content style={{ height: 'calc(100% - 52px)' }}>
      {/* 暂无数据创建 */}
      <EditDemand
        visible={isAddVisible}
        noDataCreate
        onChangeVisible={() => setIsAddVisible(!isAddVisible)}
        onUpdate={() => props.onUpdate(true)}
      />
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
      </DataWrap>

      <PaginationWrap>
        <Pagination
          defaultCurrent={1}
          current={props.data?.currentPage}
          pageSize={props.data?.pageSize || 20}
          showSizeChanger
          showQuickJumper
          total={props.data?.total}
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

export default DemandTable
