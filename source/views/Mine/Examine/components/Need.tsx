// 审核列表

/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable max-params */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable complexity */
/* eslint-disable no-undefined */
/* eslint-disable @typescript-eslint/naming-convention */
import { useEffect, useMemo, useState } from 'react'
import {
  TabsItem,
  LabNumber,
  ShowWrap,
  HoverWrap,
  DividerWrap,
} from '@/components/StyleCommon'
import IconFont from '@/components/IconFont'
import { Button, Spin, Table } from 'antd'
import NoData from '@/components/NoData'
import { useTranslation } from 'react-i18next'
import styled from '@emotion/styled'
import SearchList from './Filter'
import EditExamine from './EditExamine'
import { useDynamicColumns } from './TableColum'
import { useSelector } from '@store/index'
import { getVerifyList, getVerifyUserList, cancelVerify } from '@/services/mine'
import InputSearch from '@/components/InputSearch'
import PaginationBox from '@/components/TablePagination'
import useOpenDemandDetail from '@/hooks/useOpenDemandDetail'
import ResizeTable from '@/components/ResizeTable'
import ScreenMinHover from '@/components/ScreenMinHover'
import DeleteConfirm from '@/components/DeleteConfirm'

const RowIconFont = styled(IconFont)({
  visibility: 'hidden',
  fontSize: 16,
  cursor: 'pointer',
  color: 'var(--primary-d2)',
})

const TableBox = styled(Table)({
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
})

const Need = (props: any) => {
  const [t] = useTranslation()
  const [openDemandDetail] = useOpenDemandDetail()
  const [filterState, setFilterState] = useState(true)
  const [activeTab, setActiveTab] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [operationObj, setOperationObj] = useState<any>({})
  const { userInfo } = useSelector(store => store.user)
  const [count, setCount] = useState({ verifyUser: 0, verify: 0 })
  const [listData, setListData] = useState<any>({
    list: undefined,
  })
  const [order, setOrder] = useState<any>({ value: '', key: '' })
  const [pageObj, setPageObj] = useState({ page: 1, size: 20 })
  const [keyword, setKeyword] = useState<string>('')
  const [searchParams, setSearchParams] = useState<any>({})
  const [isSpin, setIsSpin] = useState<boolean>(false)
  const [delIsVisible, setDelIsVisible] = useState<boolean>(false)
  const [currentItem, setCurrentItem] = useState<any>({})

  const getList = async (
    item?: any,
    orderVal?: any,
    searchValue?: any,
    filterParams?: any,
    val?: any,
  ) => {
    setListData({ list: undefined })
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
      verifyUser: val ?? activeTab ? result?.otherCount : result?.total,
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

  const onFilterChange = (params: any) => {
    setSearchParams(params)
    getList(pageObj, order, keyword, params)
  }

  const onPressEnter = (value: any) => {
    if (keyword !== value) {
      setKeyword(value)
      getList(pageObj, order, value, searchParams)
    }
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

  const onClickItem = (item: any) => {
    const demandIds = listData?.list?.map((i: any) => i.demandId)
    item.id = item.demandId
    item.isMineOrHis = true
    item.isAllProject = props.projectId === 0
    let type = 0
    if (item.project_type === 2) {
      type = 1
    }
    if (item.project_type === 1 && item.is_bug === 2) {
      type = 3
    }
    if (item.project_type === 1 && item.is_bug === 1) {
      type = 2
    }
    // type 1事务 2 缺陷 3 需求
    openDemandDetail(
      { ...item, ...{ demandIds } },
      item.projectId,
      item.demandId,
      type,
    )
  }

  const columns = useDynamicColumns({
    orderKey: order?.key,
    order: order?.value,
    onUpdateOrderkey,
    onChangeOperation,
    activeTab,
    onClickItem,
  })
  const onUpdate = () => {
    getList(pageObj, order, keyword, searchParams)
  }

  const handleCancel = async () => {
    await cancelVerify(currentItem.id)
    setDelIsVisible(false)
    setCurrentItem({})
    onUpdate()
  }

  const selectColum: any = useMemo(() => {
    if (activeTab === 1) {
      return columns.concat([
        {
          title: <>{t('newlyAdd.operation')}</>,
          dataIndex: 'action',
          key: 'action',
          render: (_: string, record: any) => {
            return (
              <>
                {record.status === 1 && (
                  <Button
                    type="link"
                    style={{ padding: 0 }}
                    onClick={() => {
                      setDelIsVisible(true)
                      setCurrentItem(record)
                    }}
                  >
                    {t('newlyAdd.cancelExamine')}
                  </Button>
                )}
              </>
            )
          },
        },
      ])
    }
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

  return (
    <div
      style={{
        width: '100%',
      }}
    >
      {isVisible && (
        <EditExamine
          isVisible={isVisible}
          onClose={() => setIsVisible(false)}
          item={operationObj}
          isEdit={!activeTab}
          onUpdate={onUpdate}
        />
      )}
      <div
        style={{
          // margin: '0 24px',
          display: 'flex',
          width: 'calc(100% - 48px)',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--neutral-n6-d1)',
          margin: '0 24px',
        }}
      >
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
          }}
        >
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
          <div style={{ position: 'absolute', top: '20px', right: '24px' }}>
            <InputSearch
              placeholder={t('common.pleaseSearchDemand')}
              onChangeSearch={onPressEnter}
              leftIcon
            />
          </div>
          <ScreenMinHover
            label={t('common.search')}
            icon="filter"
            onClick={() => setFilterState(!filterState)}
            isActive={!filterState}
            style={{ marginRight: '8px' }}
          />

          <DividerWrap type="vertical" />

          <ScreenMinHover
            label={t('common.refresh')}
            icon="sync"
            onClick={onUpdate}
            style={{ marginLeft: '8px' }}
          />
        </SearchWrap>
      </div>

      {!filterState && (
        <SearchList activeTab={activeTab} onFilterChange={onFilterChange} />
      )}

      <div>
        <LoadingSpin spinning={isSpin}>
          <div style={{ padding: '0 24px' }}>
            {listData?.list && listData?.list?.length > 0 && (
              <ResizeTable
                isSpinning={false}
                dataWrapNormalHeight="calc(100vh - 309px)"
                col={selectColum}
                dataSource={listData?.list}
                noData={<NoData />}
              />
            )}
          </div>
        </LoadingSpin>
      </div>

      {listData?.list?.length >= 1 && (
        <PaginationBox
          total={listData?.total}
          pageSize={pageObj?.size}
          currentPage={listData?.currentPage}
          onChange={onChangePage}
        />
      )}

      <DeleteConfirm
        title={t('newlyAdd.cancelExamine')}
        text={t('newlyAdd.sureCancelExamine')}
        isVisible={delIsVisible}
        onConfirm={handleCancel}
        onChangeVisible={() => {
          setDelIsVisible(false)
          setCurrentItem({})
        }}
      />
    </div>
  )
}

export default Need
