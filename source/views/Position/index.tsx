import PermissionWrap from '@/components/PermissionWrap'
import React, { useMemo, useState, useEffect } from 'react'
import { useSelector } from '@store/index'
import { useTranslation } from 'react-i18next'
import { useSearchParams, useNavigate } from 'react-router-dom'
import ProjectCommonOperation from '@/components/CommonProjectComponent/CommonHeader'
import {
  getPositionList,
  delPosition,
  updateUserPositionStatus,
} from '@/services/department'
import {
  Wrap,
  HeaderWrap,
  OperateWrap,
  TableWrap,
  OperateLabelText,
  SwitchWrap,
} from './style'
import InputSearch from '@/components/InputSearch'
import CommonButton from '@/components/CommonButton'
import PaginationBox from '@/components/TablePagination'
import ResizeTable from '@/components/ResizeTable'
import NoData from '@/components/NoData'
import Sort from '@/components/Sort'
import { Table, Tooltip, Switch } from 'antd'
import { getParamsData } from '@/tools'
import AddPositionModal from './components/AddPositionModal'
import useProjectId from './hooks/useProjectId'
import BatchAction, { boxItem } from '@/components/BatchOperation/BatchAction'
import IconFont from '@/components/IconFont'
import { getMessage } from '@/components/Message'
import { useDeleteConfirmModal } from '@/hooks/useDeleteConfirmModal'
import { SpinWrap } from '../Layout/style'
import NewLoadingTransition from '@/components/NewLoadingTransition'
const NewSort = (sortProps: any) => {
  return (
    <Sort
      fixedKey={sortProps.fixedKey}
      onChangeKey={sortProps.onUpdateOrderKey}
      nowKey={sortProps.nowKey}
      order={sortProps.order === 'asc' ? 1 : 2}
    >
      {sortProps.children}
    </Sort>
  )
}
const Index = () => {
  const [t] = useTranslation()
  const [isSpinning, setIsSpinning] = useState(false)
  const [order, setOrder] = useState<any>({ value: '', key: '' })
  const { projectInfo } = useSelector(store => store.project)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const { type } = paramsData ?? {}
  const [visible, setVisible] = useState(false)
  const [keyword, setKeyword] = useState('')
  const { projectId } = useProjectId()
  const [rowData, setRowData] = useState<any>()
  const [dataSource, setDataSource] = useState<any>({ list: [] })
  const { DeleteConfirmModal, open } = useDeleteConfirmModal()
  const _getList = async (page = 1, pagesize = 10) => {
    setDataSource({})
    setIsSpinning(true)
    const params = {
      page,
      pagesize,
      project_id: projectId,
      keyword: keyword,
    }
    const res = await getPositionList(params)
    setIsSpinning(false)
    setSelectedRowKeys([])
    setDataSource(res)
  }
  const rowSelection = {
    onChange: (keys: any) => {
      console.log(keys)
      setSelectedRowKeys(keys)
    },
    selectedRowKeys,
    getCheckboxProps: (record: any) => ({
      disabled: record.is_super_admin === 1,
    }),
  }

  const onUpdateOrderKey = (key: any, val: any) => {
    setOrder({ value: val === 2 ? 'desc' : 'asc', key })
  }
  const columns = [
    {
      title: (
        <NewSort
          fixedKey="name"
          nowKey={order.key}
          order={order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          职位名称
        </NewSort>
      ),
      dataIndex: 'name',
      width: 180,
    },

    {
      title: (
        <NewSort
          fixedKey="description"
          nowKey={order.key}
          order={order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          职位简介
        </NewSort>
      ),
      dataIndex: 'description',
      width: 180,
    },
    {
      title: (
        <NewSort
          fixedKey="user_total"
          nowKey={order.key}
          order={order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          成员数
        </NewSort>
      ),
      dataIndex: 'user_total',
      width: 120,
    },
    {
      title: (
        <NewSort
          fixedKey="sort"
          nowKey={order.key}
          order={order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          排序
        </NewSort>
      ),
      dataIndex: 'sort',
      width: 200,
    },
    {
      title: (
        <NewSort
          fixedKey="sort"
          nowKey={order.key}
          order={order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          启用状态
        </NewSort>
      ),
      dataIndex: 'status',
      width: 200,
      render: (text: any, record: any, index: number) => {
        return (
          <SwitchWrap
            checked={text === 1}
            onChange={async value => {
              console.log(value)
              const res = await updateUserPositionStatus({
                project_id: projectId,
                status: value ? 1 : 2,
                id: record.id,
              })
              const { list } = dataSource
              list[index].status = value ? 1 : 2
              setDataSource({
                ...dataSource,
                list: list,
              })
              getMessage({ type: 'success', msg: '修改成功' })
              console.log('-----', dataSource)
              // debugger
              // _getList()
            }}
          ></SwitchWrap>
        )
      },
    },
    {
      title: (
        <NewSort
          fixedKey="created_at"
          nowKey={order.key}
          order={order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          操作
        </NewSort>
      ),
      dataIndex: 'joinTime',
      width: 200,
      render: (text: string, record: any, index: number) => {
        return (
          <div>
            <OperateLabelText
              color="var(--primary-d2)"
              onClick={() => {
                setVisible(true)
                setRowData(record)
              }}
            >
              编辑
            </OperateLabelText>
            <OperateLabelText
              color="var(--primary-d2)"
              onClick={() => {
                open({
                  title: '删除确认',
                  text: '确认删除该部门吗？删除后不可恢复',
                  async onConfirm() {
                    await delPosition({
                      ids: [record.id],
                      project_id: projectId,
                    })
                    _getList()
                    getMessage({
                      msg: t('removedSuccessfully'),
                      type: 'success',
                    })

                    return Promise.resolve()
                  },
                })
              }}
            >
              删除
            </OperateLabelText>
          </div>
        )
      },
    },
  ]
  const selectColumns: any = useMemo(() => {
    const initColumns = []

    initColumns.push(Table.SELECTION_COLUMN as any)
    return [...initColumns, ...columns]
  }, [columns])
  // 判断是否详情回来，并且权限是不是有
  const isLength =
    projectInfo?.id && projectInfo?.projectPermissions?.length <= 0
  useEffect(() => {
    _getList()
  }, [keyword])

  return (
    <PermissionWrap
      auth="b/project/position"
      permission={
        isLength
          ? ['0']
          : projectInfo?.projectPermissions?.map((i: any) => i.identity)
      }
    >
      <AddPositionModal
        isVisible={visible}
        onClose={() => {
          setVisible(false)
        }}
        onConfirm={() => {
          _getList()
          setVisible(false)
        }}
        rowData={rowData}
      ></AddPositionModal>
      <Wrap>
        <ProjectCommonOperation
          onInputSearch={() => {}}
          title={t('searchForDefectNameOrNumber')}
          showSearchInput={false}
        />
        <HeaderWrap>
          <InputSearch
            placeholder="搜索职位名称"
            width={184}
            onChangeSearch={(value: string) => {
              console.log(value)
              setKeyword(value)
            }}
          ></InputSearch>
          <OperateWrap>
            <CommonButton
              type="light"
              icon="left-md"
              iconPlacement="left"
              onClick={() => navigate(-1)}
            >
              返回
            </CommonButton>
            <CommonButton
              type="primary"
              icon="plus"
              onClick={() => {
                setVisible(true)
                setRowData(null)
              }}
            >
              创建职位
            </CommonButton>
          </OperateWrap>
        </HeaderWrap>
        <TableWrap style={{ height: 'calc(100% - 90px)' }}>
          <ResizeTable
            isSpinning={isSpinning}
            dataWrapNormalHeight="calc(100% - 48px)"
            col={selectColumns}
            dataSource={dataSource?.list}
            rowSelection={rowSelection}
            noData={<NoData />}
          />
          <PaginationBox
            total={dataSource?.pager?.total}
            currentPage={page}
            pageSize={pageSize}
            onChange={(p, size) => {
              setPage(p)
              setPageSize(size)
              _getList(p, size)
            }}
          />
        </TableWrap>
      </Wrap>
      <BatchAction
        open={selectedRowKeys.length > 0}
        onCancel={() => setSelectedRowKeys([])}
      >
        <div
          className={boxItem}
          onClick={() =>
            open({
              title: `批量删除（已选中${selectedRowKeys.length}项）`,
              text: '勾选的职位将被删除，确认删除吗？',
              async onConfirm() {
                await delPosition({
                  ids: selectedRowKeys,
                  project_id: projectId,
                })
                _getList()
                getMessage({
                  msg: t('removedSuccessfully'),
                  type: 'success',
                })

                return Promise.resolve()
              },
            })
          }
        >
          {t('common.del')}
        </div>
      </BatchAction>
      <DeleteConfirmModal />
    </PermissionWrap>
  )
}
export default Index
