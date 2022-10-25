/* eslint-disable no-undefined */
/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/naming-convention */
import IconFont from '@/components/IconFont'
import { Menu, Dropdown, Pagination, message, Spin } from 'antd'
import styled from '@emotion/styled'
import { TableWrap, PaginationWrap } from '@/components/StyleCommon'
import { useEffect, useMemo, useState } from 'react'
import { useModel } from '@/models'
import { useSearchParams } from 'react-router-dom'
import EditDemand from '@/components/EditDemand'
import DeleteConfirm from '@/components/DeleteConfirm'
import { getIsPermission, getParamsData, openDetail } from '@/tools/index'
import { useTranslation } from 'react-i18next'
import NoData from '@/components/NoData'
import { encryptPhp } from '@/tools/cryptoPhp'
import { useDynamicColumns } from '@/components/CreateProjectTableColum'

const RowIconFont = styled(IconFont)({
  visibility: 'hidden',
  fontSize: 16,
  cursor: 'pointer',
  color: '#2877ff',
})

const TableBox = styled(TableWrap)({
  '.ant-table-thead > tr > th:nth-child(1)': {
    paddingLeft: 64,
  },
  '.ant-table-row:hover': {
    [RowIconFont.toString()]: {
      visibility: 'visible',
    },
  },
})

const DataWrap = styled.div({
  height: 'calc(100% - 64px)',
  background: 'white',
  overflowX: 'auto',
})

const DemandWrap = () => {
  const [t] = useTranslation()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
  const { iterateId } = paramsData
  const { projectInfo } = useModel('project')
  const { getDemandList, updateDemandStatus, updatePriority, deleteDemand } =
    useModel('demand')
  const { isRefresh, setIsRefresh } = useModel('user')
  const [isVisible, setIsVisible] = useState(false)
  const [isDelete, setIsDelete] = useState(false)
  const [dataList, setDataList] = useState<any>({
    list: undefined,
  })
  const [pageObj, setPageObj] = useState<any>({ page: 1, size: 10 })
  const [demandItem, setDemandItem] = useState<any>({})
  const [deleteId, setDeleteId] = useState(0)
  const [order, setOrder] = useState<any>({ value: '', key: '' })
  const [isSpinning, setIsSpinning] = useState(false)
  const [titleList, setTitleList] = useState<any[]>([])
  const [titleList2, setTitleList2] = useState<any[]>([])
  const hasEdit = getIsPermission(
    projectInfo?.projectPermissions,
    'b/story/update',
  )
  const hasDel = getIsPermission(
    projectInfo?.projectPermissions,
    'b/story/delete',
  )

  const getShowkey = () => {
    setTitleList(projectInfo?.titleList || [])
    setTitleList2(projectInfo?.titleList2 || [])
  }

  const getList = async (item?: any, orderVal?: any, updateState?: boolean) => {
    if (!updateState) {
      setIsSpinning(true)
    }
    const result = await getDemandList({
      projectId,
      iterateIds: [iterateId],
      page: item ? item.page : 1,
      pageSize: item ? item.size : 10,
      order: orderVal.value,
      orderKey: orderVal.key,
    })
    setDataList(result)
    setIsSpinning(false)
    setIsRefresh(false)
  }

  useEffect(() => {
    getList(pageObj, order)
  }, [])

  useEffect(() => {
    getShowkey()
  }, [projectInfo])

  useEffect(() => {
    if (isRefresh) {
      getList({ page: 1, size: pageObj.size }, order)
    }
  }, [isRefresh])

  const onChangePage = (page: number, size: number) => {
    setPageObj({ page, size })
    getList({ page, size }, order)
  }

  const onShowSizeChange = (page: number, size: number) => {
    setPageObj({ page, size })
    getList({ page, size }, order)
  }

  const onClickRow = (item: any) => {
    setDemandItem(item)
    setIsVisible(true)
  }

  const onDelete = (item: any) => {
    setDeleteId(item.id)
    setIsDelete(true)
  }

  const menu = (item: any) => {
    let menuItems = [
      {
        key: '1',
        label: <div onClick={() => onClickRow(item)}>{t('common.edit')}</div>,
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

  const onUpdateOrderKey = (key: any, val: any) => {
    setOrder({ value: val === 2 ? 'desc' : 'asc', key })
    getList(
      { page: 1, size: pageObj.size },
      { value: val === 2 ? 'desc' : 'asc', key },
    )
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
      getList(pageObj, order)
    } catch (error) {
      //
    }
  }

  const onChangeStatus = async (value: any) => {
    try {
      await updateDemandStatus(value)
      message.success(t('common.statusSuccess'))
      getList(pageObj, order)
    } catch (error) {
      //
    }
  }

  const rowIconFont = () => {
    return <RowIconFont type="more" />
  }

  const onUpdate = (updateState?: boolean) => {
    getList(pageObj, order, updateState)
  }

  const columns = useDynamicColumns({
    projectId,
    orderKey: order.key,
    order: order.value,
    onUpdateOrderKey,
    onChangeStatus,
    onChangeState,
    onClickItem,
    rowIconFont,
    showChildCOntent: true,
    onUpdate,
  })

  const onChangeVisible = () => {
    setIsVisible(!isVisible)
    setDemandItem({})
  }

  const onDeleteConfirm = async () => {
    try {
      await deleteDemand({ projectId, id: deleteId })
      message.success(t('common.deleteSuccess'))
      setIsVisible(false)
      setDeleteId(0)
      getList(pageObj, order)
    } catch (error) {
      //
    }
  }

  const selectColum: any = useMemo(() => {
    const arr: any = [...titleList, ...titleList2]
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
                <Dropdown
                  overlay={menu(record)}
                  trigger={['hover']}
                  placement="bottomLeft"
                  getPopupContainer={node =>
                    dataList?.list?.length === 1 ? document.body : node
                  }
                >
                  {rowIconFont()}
                </Dropdown>
              )}
            </div>
          )
        },
      },
    ]
    return [...arrList, ...newList]
  }, [titleList, titleList2, columns])

  return (
    <div style={{ height: '100%' }}>
      <DeleteConfirm
        text={t('mark.del')}
        isVisible={isDelete}
        onChangeVisible={() => setIsDelete(!isDelete)}
        onConfirm={onDeleteConfirm}
      />
      {isVisible ? (
        <EditDemand
          visible={isVisible}
          onChangeVisible={onChangeVisible}
          demandId={demandItem?.id}
          onUpdate={() => getList(pageObj)}
          iterateId={iterateId}
        />
      ) : null}
      <DataWrap>
        <Spin spinning={isSpinning}>
          {!!dataList?.list &&
            (dataList?.list?.length > 0 ? (
              <TableBox
                rowKey="id"
                columns={selectColum}
                dataSource={dataList?.list}
                pagination={false}
                scroll={{ x: 'max-content' }}
                showSorterTooltip={false}
                sticky
              />
            ) : (
              <NoData />
            ))}
        </Spin>
      </DataWrap>

      <PaginationWrap>
        <Pagination
          defaultCurrent={1}
          current={dataList?.currentPage}
          showSizeChanger
          showQuickJumper
          total={dataList?.total}
          showTotal={total => t('common.tableTotal', { count: total })}
          pageSizeOptions={['10', '20', '50']}
          onChange={onChangePage}
          onShowSizeChange={onShowSizeChange}
        />
      </PaginationWrap>
    </div>
  )
}

export default DemandWrap
