/* eslint-disable max-params */
// 迭代主页

/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
/* eslint-disable no-undefined */
/* eslint-disable react-hooks/exhaustive-deps */
import Operation from './components/Operation'
import IterationTable from './components/IterationTable'
import IterationGrid from './components/IterationGrid'
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
import {
  setDemandInfo,
  setFilterParams,
  setIsUpdateDemand,
} from '@store/demand'
import { setIsRefreshList, setIsUpdateList } from '@store/iterate'
import { Content, IterationContent } from './style'
import ProjectCommonOperation from '@/components/ProjectCommonOperation'
import DemandTree from './components/DemandTree'
import { setFilterKeys } from '@store/project'

const Right = styled.div({
  width: '100%',
  height: '100%',
  overflowY: 'auto',
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
  const [isDemandVisible, setIsDemandVisible] = useState(false)
  const [demandItem, setDemandItem] = useState<any>({})
  const [isShowLeft, setIsShowLeft] = useState(true)
  const [dataList, setDataList] = useState<any>({
    list: undefined,
  })
  const [searchParams] = useSearchParams()
  const [isVisible, setIsVisible] = useState(false)
  const [pageObj, setPageObj] = useState<any>({ page: 1, size: 20 })
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
  const { iterateId } = paramsData
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
  const { filterKeys } = useSelector(store => store.project)
  const { isUpdateDemand } = useSelector(store => store.demand)
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
    dispatch(setIsUpdateDemand(false))
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
    setDemandItem(item)
    setIsDemandVisible(true)
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
      message.success(t('common.deleteSuccess'))
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

  const onChangeVisible = () => {
    setIsDemandVisible(!isDemandVisible)
    setDemandItem({})
  }

  const onChangeOrder = (item: any) => {
    setOrder(item)
    setDataList({ list: undefined })
    getList(isGrid, { page: 1, size: pageObj.size }, searchItems)
  }

  const onChangeIsUpdate = () => {
    props.onChangeIsUpdate(false)
  }

  const onSearch = (params: string) => {
    setSearchItems(params)
    setDataList({ list: undefined })
    getList(isGrid, { page: 1, size: pageObj.size }, params)
  }

  const onUpdate = (updateState?: boolean) => {
    getList(isGrid, { page: 1, size: pageObj.size }, searchItems, updateState)
  }

  const onChangeCurrent = (item: any) => {
    keyRef.current = item
    setDataList({ list: undefined })
    getList(isGrid, { page: 1, size: pageObj.size }, searchItems)
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
    if (isUpdateDemand) {
      onUpdate()
    }
  }, [isUpdateDemand])

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
                }}
                isUpdated={isUpdated}
                iterateId={keyRef.current?.id}
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
