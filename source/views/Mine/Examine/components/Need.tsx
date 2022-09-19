/* eslint-disable multiline-ternary */
/* eslint-disable no-negated-condition */
/* eslint-disable no-undefined */
/* eslint-disable @typescript-eslint/naming-convention */
import { useEffect, useMemo, useState } from 'react'
import {
  Hehavior,
  PaginationWrap,
  StaffTableWrap,
  MyInput,
  tabCss,
  TabsHehavior,
  TabsItem,
  LabNumber,
  ShowWrap,
  TableWrap,
  ClickWrap,
  CategoryWrap,
} from '@/components/StyleCommon'
import IconFont from '@/components/IconFont'
import { Pagination, Spin } from 'antd'
import { useModel } from '@/models'
import NoData from '@/components/NoData'
import { useTranslation } from 'react-i18next'
import styled from '@emotion/styled'
import Sort from '@/components/Sort'
import { OmitText } from '@star-yun/ui'
import SearchList from './Filter'
import EditExamine from './EditExamine'

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
    [ShowWrap.toString()]: {
      visibility: 'visible',
    },
  },
})

const LoadingSpin = styled(Spin)({
  minHeight: 300,
  '.ant-spin-container': {
    height: 'initial!important',
  },
})

const StatusWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  div: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    marginRight: 8,
  },
  span: {
    color: '#323233',
    fontSize: 14,
    fontWeight: 400,
  },
})

const NewSort = (props: any) => {
  return (
    <Sort
      fixedKey={props.fixedKey}
      onChangeKey={props.onUpdateOrderkey}
      nowKey={props.orderKey}
      order={props.order}
    >
      {props.children}
    </Sort>
  )
}

const Need = (props: any) => {
  const [t] = useTranslation()
  const [activeTab, setActiveTab] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [operationObj, setOperationObj] = useState<any>({})
  const { colorList } = useModel('project')
  const [listData, setListData] = useState<any>({
    list: [
      {
        id: 1,
        name: '需求标题',
        category: { color: '#43BA9A', name: '软件开发' },
        dealName: '何飞',
        createName: '校长',
        status: '[实现中] 至 [已实现]',
        examineStatus: '1',
        time: '2022-06-16 16:20:29',
        reason: '我的审核意见我的审核意见',
      },
      {
        id: 1,
        name: '需求标题',
        category: { color: '#43BA9A', name: '软件开发' },
        dealName: '何飞',
        createName: '校长',
        status: '[实现中] 至 [已实现]',
        examineStatus: '1',
        time: '2022-06-16 16:20:29',
        reason: '我的审核意见我的审核意见',
      },
    ],
  })
  const [page, setPage] = useState<number>(1)
  const [pagesize, setPagesize] = useState<number>(10)
  const [total, setTotal] = useState<number>()
  const [orderKey, setOrderKey] = useState<any>()
  const [order, setOrder] = useState<any>(3)
  const [keyword, setKeyword] = useState<string>('')
  const [isSpin, setIsSpin] = useState<boolean>(false)

  const onChangePage = (newPage: any) => {
    setPage(newPage)
  }
  const onShowSizeChange = (current: any, size: any) => {
    setPagesize(size)
  }

  const onPressEnter = (e: any) => {
    setKeyword(e.target.value)
  }

  const onToDetail = (item: any) => {

    //
  }

  const onChangeOperation = (record: any) => {
    setOperationObj(record)
    setIsVisible(true)
  }

  const columns = [
    {
      title: <NewSort fixedKey="id">ID</NewSort>,
      dataIndex: 'id',
      key: 'id',
      render: (text: string, record: any) => {
        return <ClickWrap onClick={() => onToDetail(record)}>{text}</ClickWrap>
      },
    },
    {
      title: <NewSort fixedKey="name">{t('common.title')}</NewSort>,
      dataIndex: 'name',
      key: 'name',
      render: (text: string | number, record: any) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <CategoryWrap
              style={{ marginLeft: 0 }}
              color={record.category.color}
              bgColor={
                colorList?.filter(i => i.key === record.category.color)[0]
                  ?.bgColor
              }
            >
              {record.category.name}
            </CategoryWrap>
            <ClickWrap onClick={() => onToDetail(record)}>
              <OmitText width={200}>{text}</OmitText>
            </ClickWrap>
          </div>
        )
      },
    },
    {
      title: <NewSort fixedKey="users_name">{t('common.dealName')}</NewSort>,
      dataIndex: 'dealName',
      key: 'users_name',
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
    {
      title: <NewSort fixedKey="create_name">提交人</NewSort>,
      dataIndex: 'createName',
      key: 'create_name',
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },

    {
      title: <NewSort fixedKey="status">流转状态</NewSort>,
      dataIndex: 'status',
      key: 'status',
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
    {
      title: <NewSort fixedKey="examine_status">审核状态</NewSort>,
      dataIndex: 'examineStatus',
      key: 'examine_status',
      render: (text: string, record: any) => {
        return (
          <StatusWrap onClick={() => onChangeOperation(record)}>
            <div
              style={{
                background:
                  text === '1'
                    ? '#43BA9A'
                    : text === '2'
                      ? '#FF5C5E'
                      : '#FA9746',
              }}
            />
            <span style={{ cursor: 'pointer' }}>
              {text === '1' ? '已通过' : text === '2' ? '未通过' : '待审核'}
            </span>
          </StatusWrap>
        )
      },
    },
    {
      title: <NewSort fixedKey="created_at">审核时间</NewSort>,
      dataIndex: 'time',
      key: 'created_at',
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
    {
      title: <NewSort fixedKey="reason">审核意见</NewSort>,
      dataIndex: 'reason',
      key: 'reason',
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
  ]

  const setColumns = useMemo(() => {
    if (activeTab) {
      columns.pop()
    }
    return columns
  }, [activeTab])

  const onChangeTab = (val: number) => {
    setActiveTab(val)
  }

  const onConfirm = () => {

    //
  }

  return (
    <>
      <EditExamine
        isVisible={isVisible}
        onClose={() => setIsVisible(false)}
        item={operationObj}
        isEdit={!activeTab}
      />
      <TabsHehavior>
        <div className={tabCss}>
          <TabsItem isActive={!activeTab} onClick={() => onChangeTab(0)}>
            <div>我审核的</div>
          </TabsItem>
          <LabNumber isActive={!activeTab}>{1}</LabNumber>

          <TabsItem
            isActive={activeTab === 1}
            style={{ marginLeft: 32 }}
            onClick={() => onChangeTab(1)}
          >
            <div>我提交的</div>
          </TabsItem>
          <LabNumber isActive={activeTab === 1}>{12}</LabNumber>
        </div>
      </TabsHehavior>

      <Hehavior>
        <MyInput
          suffix={
            <IconFont
              type="search"
              style={{ color: '#BBBDBF', fontSize: 20 }}
            />
          }
          onPressEnter={onPressEnter}
          placeholder={t('common.pleaseSearchDemand')}
          allowClear
        />
      </Hehavior>

      <SearchList activeTab={activeTab} />

      <div>
        <LoadingSpin spinning={isSpin}>
          <StaffTableWrap>
            {listData?.list
              ? listData?.list?.length ? (
                <TableBox
                  rowKey="id"
                  columns={setColumns}
                  dataSource={listData?.list}
                  pagination={false}
                  scroll={{ x: 'max-content' }}
                />
              )
                : <NoData />

              : null}
          </StaffTableWrap>
        </LoadingSpin>
      </div>

      <PaginationWrap style={{ paddingRight: 24 }}>
        <Pagination
          defaultCurrent={1}
          current={page}
          showSizeChanger
          showQuickJumper
          total={total}
          showTotal={newTotal => t('common.tableTotal', { count: newTotal })}
          pageSizeOptions={['10', '20', '50']}
          onChange={onChangePage}
          onShowSizeChange={onShowSizeChange}
        />
      </PaginationWrap>
    </>
  )
}

export default Need
