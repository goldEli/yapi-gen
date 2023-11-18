import PermissionWrap from '@/components/PermissionWrap'
import React, { useMemo, useState } from 'react'
import { useSelector } from '@store/index'
import { useTranslation } from 'react-i18next'
import { useSearchParams, useNavigate } from 'react-router-dom'
import ProjectCommonOperation from '@/components/CommonProjectComponent/CommonHeader'
import {
  Wrap,
  HeaderWrap,
  OperateWrap,
  TableWrap,
  OperateLabelText,
} from './style'
import InputSearch from '@/components/InputSearch'
import CommonButton from '@/components/CommonButton'
import PaginationBox from '@/components/TablePagination'
import ResizeTable from '@/components/ResizeTable'
import NoData from '@/components/NoData'
import Sort from '@/components/Sort'
import { Table } from 'antd'
import { getParamsData } from '@/tools'
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
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const { type } = paramsData ?? {}
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
          部门名称
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
          部门简介
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
              color={index % 2 ? 'var(--primary-d2)' : 'var(--neutral-n4)'}
            >
              编辑
            </OperateLabelText>
            <OperateLabelText
              color={index % 2 ? 'var(--primary-d2)' : 'var(--neutral-n4)'}
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
  return (
    <PermissionWrap
      auth="b/flaw/"
      permission={
        isLength
          ? ['0']
          : projectInfo?.projectPermissions?.map((i: any) => i.identity)
      }
    >
      <Wrap>
        <ProjectCommonOperation
          onInputSearch={() => {}}
          title={t('searchForDefectNameOrNumber')}
          showSearchInput={false}
        />
        <HeaderWrap>
          <InputSearch
            placeholder="搜索部门名称"
            width={184}
            onChangeSearch={(value: string) => {
              console.log(value)
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
            <CommonButton type="primary" icon="plus">
              创建部门
            </CommonButton>
          </OperateWrap>
        </HeaderWrap>
        <TableWrap>
          <ResizeTable
            isSpinning={isSpinning}
            dataWrapNormalHeight="calc(100% - 48px)"
            col={selectColumns}
            dataSource={Array(10)
              .fill(0)
              .map((item, index) => ({
                id: index + 1,
                name: `部门${index + 1}`,
                description: `负责产品部${index + 1}`,
                user_total: index + 1,
                sort: index + 1,
              }))}
            rowSelection={rowSelection}
            noData={<NoData />}
          />
          <PaginationBox
            total={100}
            currentPage={page}
            pageSize={pageSize}
            onChange={(p, size) => {
              if (p !== page) {
                setPage(p)
              }
              if (size !== pageSize) {
                setPageSize(size)
              }
            }}
          />
        </TableWrap>
      </Wrap>
    </PermissionWrap>
  )
}
export default Index
