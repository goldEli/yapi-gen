/* eslint-disable max-params */
/* eslint-disable camelcase */
/* eslint-disable no-undefined */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/naming-convention */
import { DemandWrap, DemandOperation } from './style'
import ProjectDetailHeader from '@/components/ProjectDetailHeader'
import DemandClass from './DemandClass'
import DemandTable from '@/components/DemandComponent/DemandTable'
import DemandPanel from '@/components/DemandComponent/DemandPanel'
import DemandTree from '@/components/DemandComponent/DemandTree'
import CommonIconFont from '@/components/CommonIconFont'
import { Popover, Space } from 'antd'
import CommonButton from '@/components/CommonButton'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from '@store/index'
import { useTranslation } from 'react-i18next'
import styled from '@emotion/styled'
import { setCreateCategory, setFilterParams } from '@store/demand'
import { setFilterParamsModal } from '@store/project'
import { CanOperationCategory } from '@/components/StyleCommon'
import { getIsPermission, getParamsData } from '@/tools'
import OperationGroup from '@/components/OperationGroup'
import { useSearchParams } from 'react-router-dom'
import { getDemandList } from '@/services/demand'

const LiWrap = styled.div({
  cursor: 'pointer',
  padding: '0 16px',
  width: '100%',
  height: 32,
  display: 'flex',
  alignItems: 'center',
  background: 'white',
})

const MoreItem = styled.div({
  display: 'flex',
  alignItems: 'center',
  height: 32,
  color: '#646566',
  fontSize: 14,
  fontWeight: 400,
  cursor: 'pointer',
  padding: '0 16px',
  '&: hover': {
    color: '#323233',
    background: '#f4f5f5',
  },
})

const Demand = () => {
  const dispatch = useDispatch()
  const [t, i18n] = useTranslation()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
  const [isGrid, setIsGrid] = useState(0)
  const keyRef = useRef()
  const [searchItems, setSearchItems] = useState({})
  const [pageObj, setPageObj] = useState<any>({ page: 1, size: 20 })
  const [order, setOrder] = useState<any>({ value: '', key: '' })
  // 用于当前操作层级不折叠
  const [topParentId, setTopParentId] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [isVisibleMore, setIsVisibleMore] = useState(false)
  const [isSettingState, setIsSettingState] = useState(false)
  const [isSpinning, setIsSpinning] = useState(false)
  // 导出超出限制提示
  const [exceedState, setExceedState] = useState(false)
  const { projectInfo, colorList, filterKeys, projectInfoValues } = useSelector(
    store => store.project,
  )
  const [dataList, setDataList] = useState<any>({
    list: undefined,
  })
  const [filterState, setFilterState] = useState(true)
  const { filterParams } = useSelector(store => store.demand)
  const hasImport = getIsPermission(
    projectInfo?.projectPermissions,
    'b/story/import',
  )

  const hasExport = getIsPermission(
    projectInfo?.projectPermissions,
    'b/story/export',
  )

  const getList = async (
    state: any,
    searchParamsObj: any,
    item?: any,
    orderItem?: any,
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
        searchValue: searchParamsObj.searchValue,
        statusIds: searchParamsObj.statusId,
        iterateIds: searchParamsObj.iterateId,
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
        class_id: keyRef.current,
      }
    } else {
      params = {
        projectId,
        page: item.page,
        pageSize: item.size,
        order: orderItem.value,
        orderKey: orderItem.key,
        searchValue: searchParamsObj.searchValue,
        statusIds: searchParamsObj.statusId,
        iterateIds: searchParamsObj.iterateId,
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
        class_id: keyRef.current,
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
    // props.onIsUpdate?.()
    // dispatch(setIsRefresh(false))
    setTopParentId(0)
    // setIsUpdated(false)
  }

  useEffect(() => {
    getList(isGrid, searchItems, pageObj, order)
  }, [])

  const onChangeCategory = (e: any, item: any) => {
    dispatch(setCreateCategory(item))
    // 需求列表筛选参数赋值给 弹窗
    dispatch(setFilterParamsModal(filterParams))
    setTimeout(() => {
      // props.onChangeVisible?.(e)
      setIsVisible(false)
    }, 0)
  }

  const changeStatus = (
    <div
      style={{
        padding: '4px 0px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        minWidth: i18n.language === 'zh' ? 110 : 151,
      }}
    >
      {projectInfoValues
        ?.filter((i: any) => i.key === 'category')[0]
        ?.children?.filter((i: any) => i.status === 1)
        ?.map((k: any) => (
          <LiWrap key={k.id} onClick={(e: any) => onChangeCategory(e, k)}>
            <CanOperationCategory
              style={{ marginRight: 0 }}
              color={k.color}
              bgColor={
                colorList?.filter((i: any) => i.key === k.color)[0]?.bgColor
              }
            >
              <span className="title">{k.content}</span>
            </CanOperationCategory>
          </LiWrap>
        ))}
    </div>
  )

  const onImportClick = () => {
    // setIsVisible(false)
    // setIsShowImport(true)
    // setIsVisibleMore(false)
  }

  const onExportClick = () => {
    // if (props.dataLength > 5000) {
    //   setIsVisibleMore(false)
    //   setExceedState(true)
    //   return
    // }
    // setIsVisible(false)
    // setIsShowExport(true)
    // setIsVisibleMore(false)
  }

  const moreOperation = (
    <div style={{ padding: '4px 0', display: 'flex', flexDirection: 'column' }}>
      {hasImport || projectInfo?.status !== 1 ? null : (
        <MoreItem onClick={onImportClick}>
          <CommonIconFont type="Import" />
          <span>{t('newlyAdd.importDemand')}</span>
        </MoreItem>
      )}
      {hasExport ? null : (
        <MoreItem onClick={onExportClick}>
          <CommonIconFont type="export" />
          <span>{t('newlyAdd.exportDemand')}</span>
        </MoreItem>
      )}
    </div>
  )

  const onChangeGrid = (val: any) => {
    if (val !== isGrid) {
      setIsGrid(val)
      setDataList({ list: undefined })
    }
  }

  const onDelete = (item: any) => {
    //
  }

  const onUpdate = () => {
    //
  }

  const onChangeOperation = () => {
    //
  }

  const onChangeOrder = () => {
    //
  }

  return (
    <DemandWrap>
      <ProjectDetailHeader />
      <div style={{ height: 'calc(100% - 52px)' }}>
        {/* <DemandClass /> */}
        <DemandOperation>
          <Space size={16}>
            <CommonIconFont
              type="indent"
              size={20}
              color="var(--neutral-n1-d1)"
            />
            {getIsPermission(projectInfo?.projectPermissions, 'b/story/save') ||
            projectInfo?.status !== 1 ? null : (
              <Popover
                content={changeStatus}
                placement="bottomLeft"
                getPopupContainer={node => node}
                open={isVisible}
                onOpenChange={visible => setIsVisible(visible)}
              >
                <div>
                  <CommonButton
                    type="primary"
                    icon={isVisible ? 'up' : 'down'}
                    iconPlacement="right"
                  >
                    创建需求
                  </CommonButton>
                </div>
              </Popover>
            )}
            {!(hasExport && hasImport) && (
              <Popover
                content={moreOperation}
                placement="bottom"
                getPopupContainer={node => node}
                key={isVisibleMore.toString()}
                open={isVisibleMore}
                onOpenChange={visible => setIsVisibleMore(visible)}
              >
                <div>
                  <CommonButton
                    type="secondary"
                    icon={isVisibleMore ? 'up' : 'down'}
                    iconPlacement="right"
                  >
                    {t('newlyAdd.moreOperation')}
                  </CommonButton>
                </div>
              </Popover>
            )}
          </Space>
          <OperationGroup
            onChangeFilter={() => setFilterState(!filterState)}
            onChangeGrid={onChangeGrid}
            isGrid={isGrid}
            filterState={filterState}
            settingState={isSettingState}
            onChangeSetting={() => setIsSettingState(!setIsSettingState)}
            isDemand
          />
        </DemandOperation>
        {/* {isGrid === 2 && (
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
          />
        )} */}
        {!isGrid && (
          <DemandTable
            onChangeVisible={onChangeOperation}
            onDelete={onDelete}
            data={dataList}
            // onChangePageNavigation={onChangePageNavigation}
            // onChangeRow={onChangeRow}
            settingState={isSettingState}
            onChangeSetting={setIsSettingState}
            onChangeOrder={onChangeOrder}
            isSpinning={isSpinning}
            onUpdate={onUpdate}
          />
        )}
        {/* {isGrid === 1 && (
          <DemandGrid
            onChangeVisible={onChangeOperation}
            onDelete={onDelete}
            data={dataList}
            isSpinning={isSpinning}
            onUpdate={onUpdate}
          />
        )} */}
      </div>
    </DemandWrap>
  )
}

export default Demand
