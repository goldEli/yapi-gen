/* eslint-disable no-undefined */
import PermissionWrap from '@/components/PermissionWrap'
import { useSelector } from '@store/index'
import React, { useEffect, useRef, useState } from 'react'
import {
  ContentLeft,
  ContentMain,
  ContentRight,
  ContentWrap,
  OperationWrap,
  Wrap,
} from './style'
import { useSearchParams } from 'react-router-dom'
import { getIsPermission, getParamsData } from '@/tools'
import ProjectCommonOperation from '@/components/CommonProjectComponent/CommonHeader'
import WrapLeft from './components/WrapLeft'
import { Checkbox, Popover, Space, Tooltip } from 'antd'
import { useTranslation } from 'react-i18next'
import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import CommonButton from '@/components/CommonButton'
import CommonIconFont from '@/components/CommonIconFont'
import OperationGroup from '@/components/OperationGroup'
import SprintTable from './components/SprintTable'
import { getDemandList } from '@/services/demand'
import SprintTree from './components/SprintTree'
import DeleteConfirm from '@/components/DeleteConfirm'
import ChangeStatusPopover from '@/components/ChangeStatusPopover/index'

interface IProps {}

const IconWrap = styled(IconFont)({
  fontSize: 20,
  cursor: 'pointer',
  padding: 6,
  borderRadius: 6,
  color: 'var(--neutral-n3)',
  '&: hover': {
    color: 'var(--neutral-n1-d1)',
    background: 'var(--hover-d3)',
  },
})

export const MoreWrap = styled.div<{ type?: any }>(
  {
    display: 'flex',
    alignItems: 'center',
    height: 32,
    borderRadius: 6,
    padding: '0 16px',
    fontSize: 14,
    fontWeight: 400,
    cursor: 'pointer',
  },
  ({ type }) => ({
    background: type ? 'var(--primary-d1)' : 'var(--hover-d2)',
    color: type ? 'var(--neutral-white-d7)' : 'var(--primary-d2)',
    '&: hover': {
      background: type ? 'var(--primary-d1)' : 'var(--hover-d2)',
    },
    '&: active': {
      background: type ? 'var(--primary-d1)' : 'var(--hover-d2)',
    },
  }),
)

const MoreItem = styled.div({
  display: 'flex',
  alignItems: 'center',
  height: 32,
  color: 'var(--neutral-n2)',
  fontSize: 14,
  fontWeight: 400,
  cursor: 'pointer',
  padding: '0 16px',
  svg: {
    color: 'var(--neutral-n3)',
  },
  '&: hover': {
    color: 'var(--neutral-n1-d1)!important',
    background: 'var(--hover-d3)',
    svg: {
      color: 'var(--neutral-n1-d1)!important',
    },
  },
})

export const TreeContext: any = React.createContext('')

const SprintProjectAffair: React.FC<IProps> = props => {
  const { currentMenu } = useSelector(store => store.user)
  const [key, setKey] = useState()
  const keyRef = useRef()
  const myTreeComponent: any = useRef(null)
  const [isShowLeft, setIsShowLeft] = useState(false)
  const [t, i18n] = useTranslation()
  const [isShow, setIsShow] = useState(false)
  const [isShow2, setIsShow2] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isVisibleMore, setIsVisibleMore] = useState(false)
  const [isShowImport, setIsShowImport] = useState(false)
  const [isShowExport, setIsShowExport] = useState(false)
  // 导出超出限制提示
  const [exceedState, setExceedState] = useState(false)
  const [filterState, setFilterState] = useState(true)
  const [isSettingState, setIsSettingState] = useState(false)
  const [isSpinning, setIsSpinning] = useState(false)
  const [searchItems, setSearchItems] = useState<any>({})
  const [pageObj, setPageObj] = useState<any>({ page: 1, size: 20 })
  const [order, setOrder] = useState<any>({ value: '', key: '' })
  // 用于控制失焦事件与展开子需求冲突
  const [isUpdated, setIsUpdated] = useState(false)
  // 用于当前操作层级不折叠
  const [topParentId, setTopParentId] = useState(0)
  const [isGrid, setIsGrid] = useState(0)
  const [dataList, setDataList] = useState<any>({
    list: undefined,
  })
  const [deleteItem, setDeleteItem] = useState<any>({})
  const [isDeleteCheck, setIsDeleteCheck] = useState(false)
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
  const { projectInfo } = useSelector(store => store.project)

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
        projectId: 27,
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
        // system_view: searchChoose ? searchChoose['system_view'] : undefined,
      }
    } else {
      params = {
        projectId: 27,
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
        // system_view: searchChoose ? searchChoose['system_view'] : undefined,
      }
    }
    if (state === 2) {
      params.tree = 1
      params.topParentId = topId ?? topParentId
    }
    // dispatch(setFilterParams(params))
    const result = await getDemandList(params)
    setDataList(result)
    setIsSpinning(false)
    // props.onIsUpdate?.()
    // dispatch(setIsRefresh(false))
    setTopParentId(0)
    setIsUpdated(false)
    // dispatch(setIsUpdateDemand(false))
  }

  const onInputSearch = () => {
    //
  }

  // 更新需求列表，state： 是否有加载动画，topId: 用于树形结构展开，isClass： 是否编辑的是需求分类
  const onUpdate = (state?: boolean, topId?: any, isClass?: any) => {
    // getList(isGrid, searchItems, pageObj, order, state, topId)
    // // 是编辑需求分类的话，就更新左侧需求分类列表
    // if (isClass) {
    //   myTreeComponent?.current?.init()
    // }
  }

  const onClickIcon = (value: any) => {
    if (value === 1) {
      setIsShow2(false)
    } else {
      setIsShow(false)
    }
    setIsShowLeft(!isShowLeft)
  }

  const onImportClick = () => {
    setIsVisible(false)
    setIsShowImport(true)
    setIsVisibleMore(false)
  }

  const onExportClick = () => {
    // if (props.dataLength > 5000) {
    //   setIsVisibleMore(false)
    //   setExceedState(true)
    //   return
    // }
    setIsVisible(false)
    setIsShowExport(true)
    setIsVisibleMore(false)
  }

  const onChangeFilter = () => {
    setFilterState(!filterState)
  }

  const onChangeGrid = (val: any) => {
    if (val !== isGrid) {
      setIsGrid(val)
      setDataList({ list: undefined })
    }
  }

  const onDelete = (item: any) => {
    setDeleteItem(item)
    setIsVisible(true)
    setTopParentId(item?.topId)
  }

  const onDeleteConfirm = async () => {
    // try {
    //   await deleteDemand({ projectId, id: deleteId })
    //   getMessage({ msg: t('common.deleteSuccess'), type: 'success' })
    //   setIsVisible(false)
    //   setDeleteId(0)
    //   getList(isGrid, searchItems, pageObj, order)
    //   myTreeComponent?.current?.init()
    // } catch (error) {
    //   //
    // }
  }

  const onChangePageNavigation = (item: any) => {
    // setPageObj(item)
  }

  const onChangeRow = (topId?: any) => {
    // getList(isGrid, searchItems, pageObj, order, false, topId)
  }

  const onChangeOrder = (item: any) => {
    // setOrder(item)
  }

  const keyValue = {
    key,
    changeKey: (value: any) => {
      setKey(value)
      keyRef.current = value
    },
  }

  const moreOperation = (
    <div
      style={{
        padding: '4px 0',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {hasImport || projectInfo?.status !== 1 ? null : (
        <MoreItem onClick={onImportClick}>
          <CommonIconFont type="export" />
          <span style={{ marginLeft: 8 }}>导入事务</span>
        </MoreItem>
      )}
      {hasExport ? null : (
        <MoreItem onClick={onExportClick}>
          <CommonIconFont type="Import" />
          <span style={{ marginLeft: 8 }}>导出事务</span>
        </MoreItem>
      )}
    </div>
  )

  useEffect(() => {
    getList(isGrid, searchItems, pageObj, order)
  }, [isGrid])

  return (
    // <PermissionWrap
    //   auth="/ProjectManagement/Project"
    //   permission={currentMenu?.children?.map((i: any) => i.url)}
    // >
    <TreeContext.Provider value={keyValue}>
      <Wrap>
        <ChangeStatusPopover>12121</ChangeStatusPopover>
        <DeleteConfirm
          title={`删除【${deleteItem?.storyPrefixKey}】？`}
          isVisible={isVisible}
          onChangeVisible={() => setIsVisible(!isVisible)}
          onConfirm={onDeleteConfirm}
        >
          <div style={{ marginBottom: 9 }}>
            你将永久删除该事务，删除后将不可恢复请谨慎操作!
          </div>
          <Checkbox onChange={e => setIsDeleteCheck(e.target.checked)}>
            同时删除该事务下所有子事务
          </Checkbox>
        </DeleteConfirm>
        <ProjectCommonOperation onInputSearch={onInputSearch} />
        <ContentWrap>
          <ContentLeft>
            <WrapLeft
              ref={myTreeComponent}
              projectId={projectId}
              isShowLeft={isShowLeft}
              onUpdate={onUpdate}
              iKey={key}
            />
          </ContentLeft>
          <ContentRight>
            <OperationWrap>
              <Space size={16} style={{ position: 'relative' }}>
                {isShowLeft ? (
                  <Tooltip
                    visible={isShow}
                    onVisibleChange={isShow3 => setIsShow(isShow3)}
                    getTooltipContainer={node => node}
                    title={t('newlyAdd.collapseClass')}
                  >
                    <IconWrap onClick={() => onClickIcon(1)} type="outdent" />
                  </Tooltip>
                ) : (
                  <Tooltip
                    visible={isShow2}
                    onVisibleChange={isShow1 => setIsShow2(isShow1)}
                    getTooltipContainer={node => node}
                    title={t('newlyAdd.openClass')}
                  >
                    <IconWrap onClick={() => onClickIcon(2)} type="indent" />
                  </Tooltip>
                )}
                {getIsPermission(
                  projectInfo?.projectPermissions,
                  'b/story/save',
                ) || projectInfo?.status !== 1 ? null : (
                  <CommonButton type="primary">创建事务</CommonButton>
                )}
                {hasExport && hasImport ? null : (
                  <Popover
                    content={moreOperation}
                    placement="bottom"
                    getPopupContainer={node => node}
                    key={isVisibleMore.toString()}
                    visible={isVisibleMore}
                    onVisibleChange={visible => setIsVisibleMore(visible)}
                  >
                    <MoreWrap>
                      <span>{t('newlyAdd.moreOperation')}</span>
                      <IconFont
                        style={{ fontSize: 16, marginLeft: 8 }}
                        type={isVisibleMore ? 'up' : 'down'}
                      />
                    </MoreWrap>
                  </Popover>
                )}
              </Space>
              <OperationGroup
                onChangeFilter={onChangeFilter}
                onChangeGrid={onChangeGrid}
                onRefresh={onUpdate}
                isGrid={isGrid}
                filterState={filterState}
                settingState={isSettingState}
                onChangeSetting={() => setIsSettingState(!isSettingState)}
              />
            </OperationWrap>
            <ContentMain>
              {!isGrid && (
                <SprintTable
                  onDelete={onDelete}
                  data={dataList}
                  onChangePageNavigation={onChangePageNavigation}
                  onChangeRow={onChangeRow}
                  settingState={isSettingState}
                  onChangeSetting={setIsSettingState}
                  onChangeOrder={onChangeOrder}
                  isSpinning={isSpinning}
                  onUpdate={onUpdate}
                />
              )}
              {isGrid === 2 && (
                <SprintTree
                  onDelete={onDelete}
                  data={dataList}
                  onChangePageNavigation={onChangePageNavigation}
                  onChangeRow={onChangeRow}
                  settingState={isSettingState}
                  onChangeSetting={setIsSettingState}
                  onChangeOrder={onChangeOrder}
                  isSpinning={isSpinning}
                  onUpdate={onUpdate}
                  onUpdateTopId={setTopParentId}
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
              )}
            </ContentMain>
          </ContentRight>
        </ContentWrap>
      </Wrap>
    </TreeContext.Provider>
    // </PermissionWrap>
  )
}
export default SprintProjectAffair
