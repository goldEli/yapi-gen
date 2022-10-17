/* eslint-disable max-params */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable complexity */
/* eslint-disable multiline-ternary */
/* eslint-disable no-negated-condition */
/* eslint-disable no-undefined */
/* eslint-disable @typescript-eslint/naming-convention */
import { useEffect, useMemo, useState } from 'react'
import {
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
import { Divider, Pagination, Spin, Tooltip } from 'antd'
import { useModel } from '@/models'
import NoData from '@/components/NoData'
import { useTranslation } from 'react-i18next'
import styled from '@emotion/styled'
import Sort from '@/components/Sort'
import { OmitText } from '@star-yun/ui'
import SearchList from './Filter'
import EditExamine from './EditExamine'
import { encryptPhp } from '@/tools/cryptoPhp'
import { openDetail } from '@/tools'

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
})

const CircleWrap = styled.div({
  width: 8,
  height: 8,
  borderRadius: '50%',
  marginRight: 8,
})

const SearchWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
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

const CanClick = styled.div({
  height: 24,
  borderRadius: 6,
  padding: '0 8px',
  cursor: 'pointer',
  color: 'white',
  fontSize: 12,
  background: '#2877ff',
  lineHeight: '24px',
  width: 'fit-content',
})

const Need = (props: any) => {
  const [t] = useTranslation()
  const [filterState, setFilterState] = useState(true)
  const [activeTab, setActiveTab] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [operationObj, setOperationObj] = useState<any>({})
  const { colorList } = useModel('project')
  const { userInfo } = useModel('user')
  const { getVerifyList, getVerifyUserList, setCount, count } = useModel('mine')
  const [listData, setListData] = useState<any>({
    list: undefined,
  })
  const [order, setOrder] = useState<any>({ value: '', key: '' })
  const [pageObj, setPageObj] = useState({ page: 1, size: 10 })
  const [keyword, setKeyword] = useState<string>('')
  const [searchParams, setSearchParams] = useState<any>({})
  const [isSpin, setIsSpin] = useState<boolean>(false)

  const getList = async (
    item?: any,
    orderVal?: any,
    searchValue?: any,
    filterParams?: any,
    val?: any,
  ) => {
    setIsSpin(true)
    const params = {
      userId: userInfo?.id,
      projectId: props?.projectId,
      searchValue,
      ...filterParams,
      page: item ? item.page : 1,
      pageSize: item ? item.size : 10,
      order: orderVal.value,
      orderKey: orderVal.key,
    }
    const result
      = val ?? activeTab
        ? await getVerifyList(params)
        : await getVerifyUserList(params)
    setListData(result)
    setCount({
      verifyUser: !(val ?? activeTab) ? result?.total : result?.otherCount,
      verify: val ?? activeTab ? result?.total : result?.otherCount,
    })
    setIsSpin(false)
  }

  useEffect(() => {
    getList(pageObj, order, keyword, searchParams)
  }, [props?.projectId])

  const onChangePage = (page: number, size: number) => {
    setPageObj({ page, size })
    getList({ page, size }, order, keyword, searchParams)
  }

  const onShowSizeChange = (page: number, size: number) => {
    setPageObj({ page, size })
    getList({ page, size }, order, keyword, searchParams)
  }

  const onFilterChange = (params: any) => {
    setSearchParams(params)
    getList(pageObj, order, keyword, params)
  }

  const onPressEnter = (e: any) => {
    setKeyword(e.target.value)
    getList(pageObj, order, e.target.value, searchParams)
  }

  const onToDetail = (item: any) => {
    const params = encryptPhp(
      JSON.stringify({
        type: 'info',
        id: item.projectId,
        demandId: item.demandId,
      }),
    )
    openDetail(`/Detail/Demand?data=${params}`)
  }

  const onChangeOperation = (record: any) => {
    setOperationObj(record)
    setTimeout(() => {
      setIsVisible(true)
    }, 100)
  }

  const onUpdateOrderkey = (key: any, value: any) => {
    setOrder({ value, key })

    // getList(pageObj, { value, key }, keyword, searchParams)
  }

  const NewSort = (propsSort: any) => {
    return (
      <Sort
        fixedKey={propsSort.fixedKey}
        onChangeKey={onUpdateOrderkey}
        nowKey={order?.key}
        order={order}
      >
        {propsSort.children}
      </Sort>
    )
  }

  const columns = [
    {
      title: <NewSort fixedKey="story_id">ID</NewSort>,
      dataIndex: 'demandId',
      key: 'story_id',
      render: (text: string, record: any) => {
        return <ClickWrap onClick={() => onToDetail(record)}>{text}</ClickWrap>
      },
    },
    {
      title: <NewSort fixedKey="story_name">{t('common.title')}</NewSort>,
      dataIndex: 'demandName',
      key: 'story_name',
      render: (text: string | number, record: any) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <CategoryWrap
              style={{ marginLeft: 0 }}
              color={record.categoryColor}
              bgColor={
                colorList?.filter(i => i.key === record.categoryColor)[0]
                  ?.bgColor
              }
            >
              {record.categoryName}
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
      dataIndex: 'usersName',
      key: 'users_name',
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
    {
      title: <NewSort fixedKey="user_name">{t('newlyAdd.submitName')}</NewSort>,
      dataIndex: 'userName',
      key: 'user_name',
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },

    {
      title: (
        <NewSort fixedKey="status_from_to">
          {t('newlyAdd.reviewStatus')}
        </NewSort>
      ),
      dataIndex: 'statusFromTo',
      key: 'status_from_to',
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
    {
      title: (
        <NewSort fixedKey="verify_status">
          {t('newlyAdd.examineStatus')}
        </NewSort>
      ),
      dataIndex: 'status',
      key: 'verify_status',
      render: (text: any, record: any) => {
        return (
          <div onClick={() => onChangeOperation(record)}>
            {text === 1 && !activeTab
              ? <CanClick>{t('newlyAdd.waitExamine')}</CanClick>
              : (
                  <StatusWrap>
                    <CircleWrap
                      style={{
                        background:
                      text === 1
                        ? '#FA9746'
                        : text === 2
                          ? '#43BA9A'
                          : '#FF5C5E',
                      }}
                    />
                    <ClickWrap style={{ display: 'inline' }}>
                      {text === 1
                        ? t('newlyAdd.waitExamine')
                        : text === 2
                          ? t('newlyAdd.passed')
                          : t('newlyAdd.notPass')}
                    </ClickWrap>
                  </StatusWrap>
                )}
          </div>
        )
      },
    },
    {
      title:
        <NewSort fixedKey="verify_at">{t('newlyAdd.examineTime')}</NewSort>
      ,
      dataIndex: 'verifyTime',
      key: 'verify_at',
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
    {
      title: (
        <NewSort fixedKey="verify_opinion">
          {t('newlyAdd.examineReason')}
        </NewSort>
      ),
      dataIndex: 'reason',
      key: 'verify_opinion',
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
    props?.onChangeType(val ? 'verify_submit' : 'verify')
    setActiveTab(val)
    setPageObj({ page: 1, size: pageObj.size })
    setSearchParams({})
    setListData({ list: undefined })
    setKeyword('')
    setOrder({ value: '', key: '' })
    getList(
      { page: 1, size: pageObj.size },
      { value: '', key: '' },
      '',
      {},
      val,
    )
  }

  const onUpdate = () => {
    getList(pageObj, order, keyword, searchParams)
  }

  return (
    <>
      {isVisible ? (
        <EditExamine
          isVisible={isVisible}
          onClose={() => setIsVisible(false)}
          item={operationObj}
          isEdit={!activeTab}
          onUpdate={onUpdate}
        />
      ) : null}
      <TabsHehavior
        style={{ padding: '0 24px', justifyContent: 'space-between' }}
      >
        <div className={tabCss}>
          <TabsItem isActive={!activeTab} onClick={() => onChangeTab(0)}>
            <div>{t('newlyAdd.needMineExamine')}</div>
          </TabsItem>
          <LabNumber isActive={!activeTab}>{count?.verifyUser}</LabNumber>

          <TabsItem
            isActive={activeTab === 1}
            style={{ marginLeft: 32 }}
            onClick={() => onChangeTab(1)}
          >
            <div>{t('newlyAdd.mineSubmit')}</div>
          </TabsItem>
          <LabNumber isActive={activeTab === 1}>{count?.verify}</LabNumber>
        </div>
        <SearchWrap>
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
            defaultValue={keyword}
            onBlur={onPressEnter}
          />
          <Divider
            style={{ height: 20, margin: '0 16px 0 24px' }}
            type="vertical"
          />
          <Tooltip title={t('common.search')}>
            <IconFontWrap
              active={!filterState}
              type="filter"
              onClick={() => setFilterState(!filterState)}
            />
          </Tooltip>
        </SearchWrap>
      </TabsHehavior>

      {!filterState
        && <SearchList activeTab={activeTab} onFilterChange={onFilterChange} />
      }

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
          current={listData?.currentPage}
          showSizeChanger
          showQuickJumper
          total={listData?.total}
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
