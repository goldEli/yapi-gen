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
} from '@/components/StyleCommon'
import IconFont from '@/components/IconFont'
import { Divider, Pagination, Spin, Tooltip } from 'antd'
import { useModel } from '@/models'
import NoData from '@/components/NoData'
import { useTranslation } from 'react-i18next'
import styled from '@emotion/styled'
import SearchList from './Filter'
import EditExamine from './EditExamine'
import { encryptPhp } from '@/tools/cryptoPhp'
import { openDetail } from '@/tools'
import { useDynamicColumns } from './TableColum'

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

const SearchWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  position: 'relative',
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
  const { userInfo } = useModel('user')
  const { getVerifyList, getVerifyUserList, setCount, count } = useModel('mine')
  const [listData, setListData] = useState<any>({
    list: undefined,
  })
  const [order, setOrder] = useState<any>({ value: '', key: '' })
  const [pageObj, setPageObj] = useState({ page: 1, size: 20 })
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
    const result =
      val ?? activeTab
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
    getList(pageObj, { value, key }, keyword, searchParams)
  }

  const columns = useDynamicColumns({
    orderKey: order?.key,
    order: order?.value,
    onUpdateOrderkey,
    onChangeOperation,
    activeTab,
  })

  const selectColum: any = useMemo(() => {
    return columns
  }, [columns])

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
          <Tooltip title={t('common.search')} getPopupContainer={node => node}>
            <IconFontWrap
              active={!filterState}
              type="filter"
              onClick={() => setFilterState(!filterState)}
            />
          </Tooltip>
        </SearchWrap>
      </TabsHehavior>

      {!filterState && (
        <SearchList activeTab={activeTab} onFilterChange={onFilterChange} />
      )}

      <div>
        <LoadingSpin spinning={isSpin}>
          <StaffTableWrap>
            {listData?.list ? (
              listData?.list?.length ? (
                <TableBox
                  rowKey="id"
                  columns={selectColum}
                  dataSource={listData?.list}
                  pagination={false}
                  scroll={{ x: 'max-content' }}
                />
              ) : (
                <NoData />
              )
            ) : null}
          </StaffTableWrap>
        </LoadingSpin>
      </div>

      <PaginationWrap style={{ paddingRight: 24 }}>
        <Pagination
          defaultCurrent={1}
          current={listData?.currentPage}
          pageSize={pageObj?.size}
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
