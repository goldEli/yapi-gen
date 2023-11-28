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
import { useDynamicColumns } from './TableColum'
import { useDispatch, useSelector } from '@store/index'
import { getVerifyList, getVerifyUserList, cancelVerify } from '@/services/mine'
import InputSearch from '@/components/InputSearch'
import PaginationBox from '@/components/TablePagination'
import useOpenDemandDetail from '@/hooks/useOpenDemandDetail'
import ResizeTable from '@/components/ResizeTable'
import ScreenMinHover from '@/components/ScreenMinHover'
import DeleteConfirm from '@/components/DeleteConfirm'
import { getProjectInfo, getProjectInfoValues } from '@/services/project'
import { setProjectInfo, setProjectInfoValues } from '@store/project'
import EditExamine from '@/components/EditExamine'

const LoadingSpin = styled(Spin)({
  height: '100%',
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
  const dispatch = useDispatch()
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
  const [pageObj, setPageObj] = useState({ page: 1, size: 30 })
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
      pageSize: item ? item.size : 30,
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

  // 获取项目配置
  const getConfig = async (id: number) => {
    const result = await getProjectInfo({ projectId: id })
    dispatch(setProjectInfo(result))
    const result1 = await getProjectInfoValues({ projectId: id })
    dispatch(setProjectInfoValues(result1))
  }

  useEffect(() => {
    getList(pageObj, order, keyword, searchParams)
    if (props?.projectId !== 0) {
      getConfig(props?.projectId)
    }
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

  const onClickItem = async (item: any) => {
    // 阻止修改原始数据
    const newListItem = JSON.parse(JSON.stringify(item))
    if (props.id === 0 || !props.id) {
      getConfig(newListItem.project_id ?? newListItem.projectId)
    }

    const demandIds = listData?.list?.map((i: any) => i.demandId)
    newListItem.id = newListItem.demandId
    newListItem.isMineOrHis = true
    newListItem.isAllProject = props.projectId === 0
    let type = 0
    if (newListItem.project_type === 2) {
      type = 1
    }
    if (newListItem.project_type === 1 && newListItem.is_bug === 2) {
      type = 3
    }
    if (newListItem.project_type === 1 && newListItem.is_bug === 1) {
      type = 2
    }
    // type 1事务 2 缺陷 3 需求
    openDemandDetail(
      { ...newListItem, ...{ demandIds } },
      newListItem.project_id ?? newListItem.projectId,
      newListItem.demandId,
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
          display: 'flex',
          width: 'calc(100% - 48px)',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--neutral-n6-d1)',
          margin: '0 24px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginRight: 24,
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
          <InputSearch
            placeholder={t('searchForRequirementNameOrNumber')}
            onChangeSearch={onPressEnter}
            leftIcon
            width={184}
            defaultValue={keyword}
          />
        </div>

        <SearchWrap>
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

      <div style={{ height: 'calc(100vh - 295px)' }}>
        <LoadingSpin spinning={isSpin}>
          <div style={{ padding: '0 24px' }}>
            <ResizeTable
              isSpinning={false}
              dataWrapNormalHeight="calc(100vh - 295px)"
              col={selectColum}
              dataSource={listData?.list}
              noData={<NoData />}
            />
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
