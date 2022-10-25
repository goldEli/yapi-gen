/* eslint-disable complexity */
/* eslint-disable no-undefined */
/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-empty-function */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-empty-function */
import IconFont from '@/components/IconFont'
import { Button, Menu, Dropdown, Pagination, message, Spin } from 'antd'
import styled from '@emotion/styled'
import { TableWrap, PaginationWrap } from '@/components/StyleCommon'
import { useEffect, useMemo, useState } from 'react'
import { OptionalFeld } from '@/components/OptionalFeld'
import { useDynamicColumns } from '@/components/CreateProjectTableColum'
import type { CheckboxValueType } from 'antd/lib/checkbox/Group'
import { useModel } from '@/models'
import { useSearchParams } from 'react-router-dom'
import DeleteConfirm from '@/components/DeleteConfirm'
import { useTranslation } from 'react-i18next'
import NoData from '@/components/NoData'
import { getIsPermission, getParamsData, openDetail } from '@/tools'
import EditDemand from '@/components/EditDemand'
import { encryptPhp } from '@/tools/cryptoPhp'

const Operation = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 24px',
  height: 52,
  background: 'white',
})

const ButtonWrap = styled(Button)({
  color: '#2877ff',
  border: '1px solid #2877FF',
  background: 'none',
  '&: hover': {
    color: '#2877ff',
    border: '1px solid #2877FF',
    background: 'none',
  },
})

const IconFontWrap = styled(IconFont)<{ active?: boolean }>(
  {
    fontSize: 20,
    cursor: 'pointer',
  },
  ({ active }) => ({
    color: active ? '#2877FF' : '#969799',
  }),
)

const RowIconFont = styled(IconFont)({
  visibility: 'hidden',
  fontSize: 16,
  cursor: 'pointer',
  color: '#2877ff',
})

const TableBox = styled(TableWrap)({
  '.ant-table-row:hover': {
    [RowIconFont.toString()]: {
      visibility: 'visible',
    },
  },
})

const DataWrap = styled.div({
  height: 'calc(100% - 92px)',
  background: 'white',
  overflowX: 'auto',
})

const ChildDemand = () => {
  const [t] = useTranslation()
  const [isVisible, setIsVisible] = useState(false)
  const [deleteId, setDeleteId] = useState(0)
  const [isDelete, setIsDelete] = useState(false)
  const [isSettingState, setIsSettingState] = useState(false)
  const [operationItem, setOperationItem] = useState<any>({})
  const {
    getDemandList,
    updatePriority,
    updateDemandStatus,
    deleteDemand,
    getDemandInfo,
    demandInfo,
  } = useModel('demand')
  const { isRefresh, setIsRefresh } = useModel('user')
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
  const [plainOptions, setPlainOptions] = useState<any>([])
  const [plainOptions2, setPlainOptions2] = useState<any>([])
  const [plainOptions3, setPlainOptions3] = useState<any>([])
  const [order, setOrder] = useState<any>({ value: '', key: '' })
  const { projectInfo } = useModel('project')
  const [pageObj, setPageObj] = useState<any>({ page: 1, size: 10 })
  const [isSpinning, setIsSpinning] = useState(false)

  const getShowkey = () => {
    setPlainOptions(projectInfo?.plainOptions || [])
    setPlainOptions2(projectInfo?.plainOptions2 || [])
    setPlainOptions3(projectInfo?.plainOptions3 || [])
    setTitleList(projectInfo?.titleList || [])
    setTitleList2(projectInfo?.titleList2 || [])
    setTitleList3(projectInfo?.titleList3 || [])
  }

  const getList = async (
    item?: any,
    orderItem?: any,
    updateState?: boolean,
  ) => {
    if (!updateState) {
      setIsSpinning(true)
    }
    const result = await getDemandList({
      projectId,
      page: item ? item.page : 1,
      pageSize: item ? item.size : 10,
      order: orderItem.value,
      orderKey: orderItem.key,
      parentId: demandId,
    })
    setDataList(result)
    setIsSpinning(false)
    setIsRefresh(false)
  }

  useEffect(() => {
    getList(pageObj, order)
  }, [])

  useEffect(() => {
    if (isRefresh) {
      getList({ page: 1, size: pageObj.size }, order)
    }
  }, [isRefresh])

  useEffect(() => {
    getShowkey()
  }, [projectInfo])

  const getCheckList = (
    list: CheckboxValueType[],
    list2: CheckboxValueType[],
    list3: CheckboxValueType[],
  ) => {
    setTitleList(list)
    setTitleList2(list2)
    setTitleList3(list3)
  }

  const onEdit = (e: any, item: any) => {
    setOperationItem(item)
    setIsVisible(true)
  }

  const onUpdate = (updateState?: boolean) => {
    getDemandInfo({ projectId, id: demandId })
    getList(pageObj, order, updateState)
  }

  const updateOrderkey = (key: any, val: any) => {
    setOrder({ value: val === 2 ? 'desc' : 'asc', key })
    getList(
      { page: 1, size: pageObj.size },
      { value: val === 2 ? 'desc' : 'asc', key },
    )
  }

  const setMenu = (
    <Menu
      items={[
        {
          key: '1',
          label: (
            <div onClick={() => setIsSettingState(true)}>
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
    openDetail(`/Detail/Demand?data=${params}`)
  }

  const onChangePage = (page: number, size: number) => {
    setPageObj({ page, size })
    getList({ page, size }, order)
  }

  const onShowSizeChange = (page: number, size: number) => {
    setPageObj({ page, size })
    getList({ page, size }, order)
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
    orderKey: order.key,
    order: order.value,
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
    const arr = [...titleList, ...titleList2, ...titleList3]
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
  }, [titleList, titleList2, titleList3, columns])

  return (
    <div style={{ height: 'calc(100% - 50px)' }}>
      {isVisible ? (
        <EditDemand
          visible={isVisible}
          onChangeVisible={onChangeVisible}
          isChild
          demandId={operationItem.id}
          onUpdate={onUpdate}
          childList={dataList?.list}
          categoryId={demandInfo?.category}
        />
      ) : null}
      <DeleteConfirm
        text={t('common.confirmDelChildDemand')}
        isVisible={isDelete}
        onChangeVisible={() => setIsDelete(!isDelete)}
        onConfirm={onDeleteConfirm}
      />
      <Operation>
        {getIsPermission(projectInfo?.projectPermissions, 'b/story/save') ? (
          <div />
        ) : (
          <ButtonWrap
            onClick={() => setIsVisible(true)}
            icon={<IconFont type="plus" />}
          >
            {t('project.addChildDemand')}
          </ButtonWrap>
        )}

        <Dropdown overlay={setMenu}>
          <IconFontWrap active={isSettingState} type="settings" />
        </Dropdown>
      </Operation>
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
      {isSettingState ? (
        <OptionalFeld
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
      ) : null}
    </div>
  )
}

export default ChildDemand
