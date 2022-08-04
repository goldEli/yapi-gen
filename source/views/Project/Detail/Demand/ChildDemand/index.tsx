/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-empty-function */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-empty-function */
import IconFont from '@/components/IconFont'
import { Button, Menu, Dropdown, Pagination, message } from 'antd'
import styled from '@emotion/styled'
import { TableWrap, PaginationWrap } from '@/components/StyleCommon'
import { useEffect, useMemo, useState } from 'react'
import EditDemand from '../components/EditDemand'
import { OptionalFeld } from '@/components/OptionalFeld'
import { useDynamicColumns } from './CreatePrejectTableColum'
import type { CheckboxValueType } from 'antd/lib/checkbox/Group'
import { useModel } from '@/models'
import { useSearchParams } from 'react-router-dom'
import DeleteConfirm from '@/components/DeleteConfirm'
import { useTranslation } from 'react-i18next'

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
  } = useModel('demand')
  const [searchParams] = useSearchParams()
  const projectId = searchParams.get('id')
  const demandId = searchParams.get('demandId')
  const [dataList, setDataList] = useState<any>([])
  const [titleList, setTitleList] = useState<any[]>([])
  const [titleList2, setTitleList2] = useState<any[]>([])
  const [plainOptions, setPlainOptions] = useState<any>([])
  const [plainOptions2, setPlainOptions2] = useState<any>([])
  const [order, setOrder] = useState<any>({ value: '', key: '' })
  const { projectInfo } = useModel('project')
  const [pageObj, setPageObj] = useState<any>({ page: 1, size: 10 })

  const getShowkey = () => {
    setPlainOptions(projectInfo?.plainOptions || [])
    setPlainOptions2(projectInfo?.plainOptions2 || [])
    setTitleList(projectInfo?.titleList || [])
    setTitleList2(projectInfo?.titleList2 || [])
  }

  const getList = async (item?: any, orderItem?: any) => {
    const result = await getDemandList({
      projectId,
      page: item ? item.page : 1,
      pageSize: item ? item.size : 10,
      order: orderItem.value,
      orderKey: orderItem.key,
      parentId: demandId,
    })
    setDataList(result)
  }

  useEffect(() => {
    getList(pageObj, order)
  }, [])

  useEffect(() => {
    getShowkey()
  }, [projectInfo])

  const getCheckList = (
    list: CheckboxValueType[],
    list2: CheckboxValueType[],
  ) => {
    setTitleList(list)
    setTitleList2(list2)
  }

  const onEdit = (e: any, item: any) => {
    setIsVisible(true)
    setOperationItem(item)
  }

  const onUpdate = () => {
    getDemandInfo({ projectId, id: demandId })
    getList(pageObj, order)
  }

  const updateOrderkey = (key: any, val: any) => {
    setOrder({ value: val === 2 ? 'desc' : 'asc', key })
    getList(pageObj, { value: val === 2 ? 'desc' : 'asc', key })
  }

  const setMenu = (
    <Menu
      items={[
        {
          key: '1',
          label:
            <div onClick={() => setIsSettingState(true)}>设置显示字段</div>
          ,
        },
      ]}
    />
  )

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
      })
      message.success('优先级修改成功')
      onUpdate()
    } catch (error) {

      //
    }
  }

  const onChangeStatus = async (value: any) => {
    try {
      await updateDemandStatus(value)
      message.success('状态修改成功')
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
      message.success('删除成功')
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
    onEdit,
    onDelete,
    rowIconFont,
  })

  const selectColum: any = useMemo(() => {
    const arr = [...titleList, ...titleList2]
    const newList = []
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < columns.length; j++) {
        if (arr[i] === columns[j].key) {
          newList.push(columns[j])
        }
      }
    }
    return newList
  }, [titleList, titleList2, columns])

  return (
    <div>
      <EditDemand
        visible={isVisible}
        onChangeVisible={onChangeVisible}
        isChild
        id={operationItem.id}
        onUpdate={onUpdate}
      />
      <DeleteConfirm
        text="确认要删除当前子需求？"
        isVisible={isDelete}
        onChangeVisible={() => setIsDelete(!isDelete)}
        onConfirm={onDeleteConfirm}
      />
      <Operation>
        <ButtonWrap
          onClick={() => setIsVisible(true)}
          icon={<IconFont type="plus" />}
        >
          添加子需求
        </ButtonWrap>
        <Dropdown overlay={setMenu}>
          <IconFontWrap active={isSettingState} type="settings" />
        </Dropdown>
      </Operation>
      <TableBox
        rowKey="id"
        columns={selectColum}
        dataSource={dataList?.list}
        pagination={false}
        scroll={{ x: 'max-content' }}
        showSorterTooltip={false}
      />
      <PaginationWrap>
        <Pagination
          defaultCurrent={1}
          current={dataList?.currentPage}
          showSizeChanger
          showQuickJumper
          total={dataList?.total}
          showTotal={total => `Total ${total} items`}
          pageSizeOptions={['10', '20', '50']}
          onChange={onChangePage}
          onShowSizeChange={onShowSizeChange}
        />
      </PaginationWrap>
      {isSettingState ? (
        <OptionalFeld
          plainOptions={plainOptions}
          plainOptions2={plainOptions2}
          checkList={titleList}
          checkList2={titleList2}
          isVisible={isSettingState}
          onClose={() => setIsSettingState(false)}
          getCheckList={getCheckList}
        />
      ) : null}
    </div>
  )
}

export default ChildDemand
