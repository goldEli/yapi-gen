/* eslint-disable max-params */
// 迭代主页

/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
/* eslint-disable no-undefined */
/* eslint-disable react-hooks/exhaustive-deps */
import Operation from './components/Operation'
import IterationTable from './components/IterationTable'
import WrapLeft from './components/WrapLeft'
import { message } from 'antd'
import { useEffect, useRef, useState } from 'react'
import styled from '@emotion/styled'
import { useSearchParams } from 'react-router-dom'
import DeleteConfirm from '@/components/DeleteConfirm'
import { useTranslation } from 'react-i18next'
import { getParamsData } from '@/tools'
import { useDispatch, useSelector } from '@store/index'
import { setIsRefresh } from '@store/user'
import { deleteDemand, getDemandInfo, getDemandList } from '@/services/demand'
import { setDemandInfo } from '@store/demand'
import { setIsRefreshList, setIsUpdateList } from '@store/iterate'
import { Content, IterationContent } from './style'
import ProjectCommonOperation from '@/components/CommonProjectComponent/CommonHeader'
import DemandTree from './components/DemandTree'
import {
  setFilterKeys,
  setIsUpdateAddWorkItem,
  setFilterParams,
} from '@store/project'
import { getMessage } from '@/components/Message'
import IterationGrid from './components/IterationGrid'

const Right = styled.div({
  width: '100%',
  height: '100%',
  overflowY: 'auto',
  paddingLeft: '24px',
})

interface Props {
  onChangeVisible(): void
  onChangeOperation(item: any): void
  updateState: boolean
  onChangeIsUpdate(val: boolean): void
}

const IterationMain = (props: Props) => {
  const [t] = useTranslation()
  const keyRef = useRef<any>()
  const [isGrid, setIsGrid] = useState(0)
  const [isShowLeft, setIsShowLeft] = useState(true)
  const [dataList, setDataList] = useState<any>({
    list: undefined,
  })
  const [searchParams] = useSearchParams()
  const [isVisible, setIsVisible] = useState(false)
  const [pageObj, setPageObj] = useState<any>({ page: 1, size: 20 })
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
  const dispatch = useDispatch()
  const [deleteId, setDeleteId] = useState(0)
  const [isSettingState, setIsSettingState] = useState(false)
  const [order, setOrder] = useState<any>({ value: '', key: '' })
  const [searchItems, setSearchItems] = useState<any>({})
  const [isSpinning, setIsSpinning] = useState(false)
  // 用于控制失焦事件与展开子需求冲突
  const [isUpdated, setIsUpdated] = useState(false)
  // 用于当前操作层级不折叠
  const [topParentId, setTopParentId] = useState(0)
  const { filterKeys, isUpdateAddWorkItem } = useSelector(
    store => store.project,
  )
  const [searchVal, setSearchVal] = useState('')

  const getList = async (
    state: any,
    item: any,
    searchParamsObj: any,
    updateState?: boolean,
    topId?: any,
  ) => {
    if (!updateState) {
      setIsSpinning(true)
    }
    let params: any = {}

    if (state === 1) {
      params = {
        projectId,
        all: true,
        panel: true,
        iterateIds: [keyRef.current?.id],
        statusIds: searchParamsObj.statusId,
        priorityIds: searchParamsObj.priorityId,
        userId: searchParamsObj.userId,
        tagIds: searchParamsObj.tagId,
        startTime: searchParamsObj.createdAtId,
        expectedStart: searchParamsObj.expectedStartAtId,
        expectedEnd: searchParamsObj.expectedendat,
        updatedTime: searchParamsObj.updatedat,
        endTime: searchParamsObj.finishAt,
        usersNameId: searchParamsObj.usersnameId,
        copySendId: searchParamsObj.usersCopysendNameId,
        class_ids: searchParamsObj.class_ids,
        category_id: searchParamsObj.category_id,
        schedule_start: searchParamsObj.schedule_start,
        schedule_end: searchParamsObj.schedule_end,
        custom_field: searchParamsObj?.custom_field,
        searchValue: searchParamsObj.searchVal,
      }
    } else {
      params = {
        projectId,
        page: item ? item?.page : 1,
        pageSize: item ? item?.size : 10,
        order: order.value,
        orderKey: order.key,
        iterateIds: [keyRef.current?.id],
        statusIds: searchParamsObj.statusId,
        priorityIds: searchParamsObj.priorityId,
        userId: searchParamsObj.userId,
        tagIds: searchParamsObj.tagId,
        startTime: searchParamsObj.createdAtId,
        expectedStart: searchParamsObj.expectedStartAtId,
        expectedEnd: searchParamsObj.expectedendat,
        updatedTime: searchParamsObj.updatedat,
        endTime: searchParamsObj.finishAt,
        usersNameId: searchParamsObj.usersnameId,
        copySendId: searchParamsObj.usersCopysendNameId,
        class_ids: searchParamsObj.class_ids,
        category_id: searchParamsObj.category_id,
        schedule_start: searchParamsObj.schedule_start,
        schedule_end: searchParamsObj.schedule_end,
        custom_field: searchParamsObj?.custom_field,
        searchValue: searchParamsObj.searchVal,
      }
    }
    if (state === 2) {
      params.tree = 1
      params.topParentId = topId ?? topParentId
      params.iterateIds = [keyRef.current?.id]
    }
    dispatch(setFilterParams(params))
    const result = await getDemandList(params)
    setDataList(result)
    setIsSpinning(false)
    dispatch(setIsRefresh(false))
    dispatch(setIsUpdateList(false))
    props.onChangeIsUpdate(false)
    setTopParentId(0)
    setIsUpdated(false)
    // 关闭更新需求状态
    dispatch(setIsUpdateAddWorkItem(false))
  }

  const onChangeGrid = (val: any) => {
    setIsGrid(val)
    setDataList({ list: undefined })
    if (keyRef.current?.id) {
      setDataList({ list: undefined })
      getList(val, { page: 1, size: pageObj.size }, searchItems)
    }
  }

  const onChangeOperation = async (item: any) => {
    const result = await getDemandInfo({ projectId, id: item.id })
    dispatch(setDemandInfo(result))
    setTopParentId(item?.topId)
  }

  const onDelete = (item: any) => {
    setDeleteId(item.id)
    setIsVisible(true)
    setTopParentId(item?.topId)
  }

  const onDeleteConfirm = async () => {
    try {
      await deleteDemand({ projectId, id: deleteId })
      getMessage({ msg: t('common.deleteSuccess') as string, type: 'success' })
      setIsVisible(false)
      setDeleteId(0)
      setDataList({ list: undefined })
      getList(isGrid, pageObj, searchItems)
      dispatch(setIsRefreshList(true))
    } catch (error) {
      //
    }
  }

  const onChangePageNavigation = (item: any) => {
    setPageObj(item)
    setDataList({ list: undefined })
    getList(isGrid, item, searchItems)
  }

  const onChangeRow = () => {
    setDataList({ list: undefined })
    getList(isGrid, pageObj, searchItems)
    dispatch(setIsRefreshList(true))
  }

  const onChangeOrder = (item: any) => {
    setOrder(item)
    setDataList({ list: undefined })
    getList(isGrid, { page: 1, size: pageObj.size }, searchItems)
  }

  const onChangeIsUpdate = () => {
    props.onChangeIsUpdate(false)
  }

  const onSearch = (params: any) => {
    const result = { ...params, ...{ searchVal: searchVal } }
    setSearchItems(result)
    setDataList({ list: undefined })
    getList(isGrid, { page: 1, size: pageObj.size }, result)
  }

  const onUpdate = (updateState?: boolean) => {
    getList(
      isGrid,
      { page: 1, size: pageObj.size },
      searchItems,
      updateState,
      topParentId,
    )
  }

  const onChangeCurrent = (item: any) => {
    keyRef.current = item
    setDataList({ list: undefined })
    if (item?.id) {
      getList(isGrid, { page: 1, size: pageObj.size }, searchItems)
    }
  }

  const onInputSearch = (keyValue: string) => {
    if (searchVal !== keyValue) {
      setSearchVal(keyValue)
      const params = searchItems
      params.searchVal = keyValue
      setSearchItems(params)
      setDataList({ list: undefined })
      getList(isGrid, { page: 1, size: pageObj.size }, params)
      setIsUpdated(true)
      setPageObj({
        page: 1,
        size: pageObj.size,
      })
      // 添加搜索项 计数
      const keys = keyValue
        ? [...filterKeys, ...['searchVal']]
        : filterKeys?.filter((i: any) => i !== 'searchVal')
      dispatch(setFilterKeys([...new Set(keys)]))
    }
  }

  useEffect(() => {
    if (isUpdateAddWorkItem) {
      getList(isGrid, pageObj, searchItems, false, topParentId)
    }
  }, [isUpdateAddWorkItem])

  const refresh = () => {
    getList(isGrid, pageObj, searchItems, false, topParentId)
  }

  return (
    <>
      <DeleteConfirm
        text={t('common.confirmDelDemand')}
        isVisible={isVisible}
        onChangeVisible={() => setIsVisible(!isVisible)}
        onConfirm={onDeleteConfirm}
      />
      <Content>
        <ProjectCommonOperation onInputSearch={onInputSearch} />
        <IterationContent>
          <WrapLeft
            isShowLeft={isShowLeft}
            onChangeVisible={props.onChangeVisible}
            onCurrentDetail={onChangeCurrent}
            onIsUpdateList={onChangeIsUpdate}
            onChangeOperation={props.onChangeOperation}
            currentDetail={keyRef.current}
            updateState={props.updateState}
          />
          <Right>
            <Operation
              isGrid={isGrid}
              onChangeGrid={val => onChangeGrid(val)}
              onChangeIsShowLeft={() => setIsShowLeft(!isShowLeft)}
              onIsUpdateList={value => dispatch(setIsUpdateList(value))}
              onRefresh={refresh}
              currentDetail={keyRef.current}
              settingState={isSettingState}
              onChangeSetting={setIsSettingState}
              onSearch={onSearch}
              isShowLeft={isShowLeft}
            />
            {isGrid === 2 && (
              <DemandTree
                onChangeVisible={onChangeOperation}
                onDelete={onDelete}
                data={dataList}
                onChangePageNavigation={onChangePageNavigation}
                onChangeRow={onChangeRow}
                settingState={isSettingState}
                onChangeSetting={setIsSettingState}
                onChangeOrder={onChangeOrder}
                isSpinning={isSpinning}
                onUpdate={onUpdate}
                filterParams={{
                  ...searchItems,
                  projectId,
                  page: 1,
                  pageSize: 100,
                  order: '',
                  orderKey: '',
                  iterateIds: [keyRef.current?.id],
                }}
                isUpdated={isUpdated}
                iterateId={keyRef.current?.id}
                onUpdateTopId={setTopParentId}
                hasId={keyRef.current}
              />
            )}
            {!isGrid && (
              <IterationTable
                onChangeVisible={onChangeOperation}
                onDelete={onDelete}
                data={dataList}
                onChangePageNavigation={onChangePageNavigation}
                onChangeRow={onChangeRow}
                settingState={isSettingState}
                onChangeSetting={setIsSettingState}
                onChangeOrder={onChangeOrder}
                isSpinning={isSpinning}
                hasId={keyRef.current}
                onUpdate={onUpdate}
                iterateId={keyRef.current?.id}
              />
            )}
            {isGrid === 1 && (
              <IterationGrid
                onChangeVisible={onChangeOperation}
                onDelete={onDelete}
                data={dataList}
                isSpinning={isSpinning}
                hasId={keyRef.current}
                onUpdate={onUpdate}
                iterateId={keyRef.current?.id}
              />
            )}
          </Right>
        </IterationContent>
      </Content>
    </>
  )
}

export default IterationMain
