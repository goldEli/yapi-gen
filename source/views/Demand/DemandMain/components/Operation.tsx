// 需求主页-操作栏

/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable complexity */
import styled from '@emotion/styled'
import OperationGroup from '@/components/OperationGroup'
import TableFilter from '@/components/TableFilter'
import { useEffect, useRef, useState } from 'react'
import { getIsPermission } from '@/tools/index'
import { useTranslation } from 'react-i18next'
import IconFont from '@/components/IconFont'
import { Popover, Space, Tooltip } from 'antd'
import CommonModal from '@/components/CommonModal'
import DeleteConfirm from '@/components/DeleteConfirm'
import ExportDemand from './ExportDemand'
import ImportDemand from './ImportDemand'
import { useDispatch, useSelector } from '@store/index'
import { setFilterKeys, setFilterParamsModal } from '@store/project'
import {
  setCreateCategory,
  setCreateDemandProps,
  setIsCreateDemandVisible,
} from '@store/demand'
import { saveScreen } from '@store/view'

const OperationWrap = styled.div({
  minHeight: 32,
  minWidth: '800px',
  lineHeight: '32px',
  background: 'var(--neutral-white-d2)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  '.ant-space-item': {
    display: 'flex',
    alignItems: 'center',
  },
  '.ant-popover-content': {
    width: 'max-content',
  },
})

const StickyWrap = styled.div({
  background: 'white',
})

const LiWrap = styled.div<{ color: any }>(
  {
    cursor: 'pointer',
    padding: '0 16px',
    width: '100%',
    height: 32,
    display: 'flex',
    alignItems: 'center',
    background: 'white',
  },
  ({ color }) => ({
    '&: hover': {
      background: color,
    },
  }),
)

const IconWrap = styled(IconFont)({
  fontSize: 20,
  color: 'black',
  cursor: 'pointer',
  padding: 6,
  borderRadius: 6,
  '&: hover': {
    color: 'var(--neutral-n1-d1)',
    background: 'var(--neutral-n6-d1)',
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
  '&: hover': {
    color: 'var(--neutral-n1-d1)',
    background: 'var(--hover-d3)',
  },
})

interface Props {
  isGrid: any
  onChangeGrid(val: any): void
  onChangeVisible?(e?: any): void
  onSearch(params: any): void
  settingState: boolean
  onChangeSetting(val: boolean): void
  onChangeIsShowLeft?(): void
  isShowLeft?: boolean
  otherParams: any
  dataLength: any
  pid: any
}

const Operation = (props: Props) => {
  const [t, i18n] = useTranslation()
  const [isShow, setIsShow] = useState(false)
  const [isShow2, setIsShow2] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isVisibleMore, setIsVisibleMore] = useState(false)
  const [isShowImport, setIsShowImport] = useState(false)
  const [isShowExport, setIsShowExport] = useState(false)
  const [filterState, setFilterState] = useState(true)
  const [defaultValue, setDefaultValue] = useState({})

  // 导出超出限制提示
  const [exceedState, setExceedState] = useState(false)
  const { projectInfo, colorList, filterKeys, projectInfoValues } = useSelector(
    store => store.project,
  )
  const { filterParams } = useSelector(store => store.demand)
  const { searchChoose } = useSelector(store => store.view)
  const [searchList, setSearchList] = useState<any[]>([])
  const [filterBasicsList, setFilterBasicsList] = useState<any[]>([])
  const [filterSpecialList, setFilterSpecialList] = useState<any[]>([])
  const [filterCustomList, setFilterCustomList] = useState<any[]>([])
  const [searchVal, setSearchVal] = useState('')
  const [searchGroups, setSearchGroups] = useState<any>({
    statusId: [],
    priorityId: [],
    iterateId: [],
    tagId: [],
    userId: [],
    usersnameId: [],
    usersCopysendNameId: [],
    createdAtId: [],
    expectedStartAtId: [],
    expectedendat: [],
    updatedat: [],
    finishAt: [],
    searchValue: '',
  })
  const stickyWrapDom = useRef<HTMLDivElement>(null)
  const dispatch = useDispatch()

  const hasImport = getIsPermission(
    projectInfo?.projectPermissions,
    'b/story/import',
  )

  const hasExport = getIsPermission(
    projectInfo?.projectPermissions,
    'b/story/export',
  )

  const onChangeSearch = (value: string) => {
    if (searchVal !== value) {
      setSearchVal(value)
      const params = searchGroups
      params.searchValue = value
      setSearchGroups(params)
      props.onSearch(params)

      // 添加搜索项 计数
      const keys = value
        ? [...filterKeys, ...['searchVal']]
        : filterKeys?.filter((i: any) => i !== 'searchVal')
      dispatch(setFilterKeys([...new Set(keys)]))
    }
  }

  const onFilterSearch = (e: any, customField: any) => {
    const params = {
      statusId: e.status,
      priorityId: e.priority,
      iterateId: e.iterate_name,
      tagId: e.tag,
      userId: e.user_name,
      usersnameId: e.users_name,
      usersCopysendNameId: e.users_copysend_name,
      createdAtId: e.created_at,
      expectedStartAtId: e.expected_start_at,
      expectedendat: e.expected_end_at,
      updatedat: e.updated_at,
      finishAt: e.finish_at,
      searchValue: searchVal,
      class_ids: e.class,
      category_id: e.category,
      schedule_start: e.schedule?.start,
      schedule_end: e.schedule?.end,
      custom_field: customField,
    }
    setSearchGroups(params)
    props.onSearch(params)
  }

  const getSearchKey = async (key?: any, type?: number) => {
    const filterFelid = projectInfo?.filterFelid

    if (key && type === 0) {
      setSearchList(searchList.filter((item: any) => item.content !== key))
      dispatch(
        saveScreen(searchList.filter((item: any) => item.content !== key)),
      )
      return
    }
    if (key && type === 1) {
      const addList = filterFelid?.filter((item: any) => item.content === key)
      setSearchList([...searchList, ...addList])
      dispatch(saveScreen([...searchList, ...addList]))
      return
    }
    const arr = filterFelid?.filter((item: any) => item.isDefault === 1)

    setSearchList(arr)
    dispatch(saveScreen(arr))
    setFilterBasicsList(projectInfo?.filterBasicsList)
    setFilterSpecialList(projectInfo?.filterSpecialList)
    setFilterCustomList(projectInfo?.filterCustomList)
  }

  function filterObj(mainObject: any, filterFunction: any) {
    return Object.keys(mainObject)
      .filter(ObjectKey => {
        return filterFunction(mainObject[ObjectKey])
      })
      .reduce((result: any, ObjectKey) => {
        result[ObjectKey] = mainObject[ObjectKey]
        return result
      }, {})
  }
  useEffect(() => {
    if (searchChoose && searchChoose.system_view) {
      return
    }
    if (searchChoose) {
      const targetSubjects = filterObj(searchChoose, (grade: any) => {
        return grade !== null
      })
      const keys = Object.keys(searchChoose)
      const filterFelid = projectInfo?.filterFelid
      const newArr = filterFelid?.filter((i: any) => {
        return keys.includes(i.content)
      })
      setSearchList(newArr)
      dispatch(saveScreen(newArr))
      setDefaultValue(targetSubjects)
    }
  }, [searchChoose])

  useEffect(() => {
    if (projectInfo?.id) {
      getSearchKey()
    }
  }, [projectInfo])

  const onChangeFilter = () => {
    setFilterState(!filterState)
  }

  const onChangeCategory = (e: any, item: any) => {
    dispatch(setCreateCategory(item))

    // 需求列表筛选参数赋值给 弹窗
    dispatch(setFilterParamsModal(filterParams))
    setTimeout(() => {
      dispatch(setIsCreateDemandVisible(true))
      dispatch(setCreateDemandProps({ projectId: projectInfo?.id }))
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
        ?.map((k: any) => {
          return (
            <LiWrap
              key={k.id}
              color={
                colorList?.filter((i: any) => i.key === k.color)[0]?.bgColor
              }
              onClick={(e: any) => onChangeCategory(e, k)}
            >
              <img
                src={
                  k.category_attachment
                    ? k.category_attachment
                    : 'https://varlet.gitee.io/varlet-ui/cat.jpg'
                }
                style={{
                  width: '18px',
                  height: '18px',
                  marginRight: '8px',
                }}
                alt=""
              />
              <span>{k.content}</span>
            </LiWrap>
          )
        })}
    </div>
  )

  const onImportClick = () => {
    setIsVisible(false)
    setIsShowImport(true)
    setIsVisibleMore(false)
  }

  const onExportClick = () => {
    if (props.dataLength > 5000) {
      setIsVisibleMore(false)
      setExceedState(true)
      return
    }
    setIsVisible(false)
    setIsShowExport(true)
    setIsVisibleMore(false)
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
          <IconFont style={{ fontSize: 16, marginRight: 8 }} type="Import" />
          <span>{t('newlyAdd.importDemand')}</span>
        </MoreItem>
      )}
      {hasExport ? null : (
        <MoreItem onClick={onExportClick}>
          <IconFont style={{ fontSize: 16, marginRight: 8 }} type="export" />
          <span>{t('newlyAdd.exportDemand')}</span>
        </MoreItem>
      )}
    </div>
  )

  const onImportClose = () => {
    setIsShowImport(false)
  }

  const onClickIcon = (value: any) => {
    if (value === 1) {
      setIsShow2(false)
    } else {
      setIsShow(false)
    }
    props?.onChangeIsShowLeft?.()
  }

  return (
    <StickyWrap ref={stickyWrapDom}>
      <DeleteConfirm
        onConfirm={() => setExceedState(false)}
        onChangeVisible={() => setExceedState(false)}
        isVisible={exceedState}
        title={t('p2.toast')}
        text={t('p2.exportDemandText')}
      />
      <CommonModal
        isVisible={isShowImport}
        width={784}
        title={t('newlyAdd.importDemand')}
        isShowFooter
        onClose={onImportClose}
      >
        <ImportDemand />
      </CommonModal>

      <ExportDemand
        isShowExport={isShowExport}
        onClose={setIsShowExport}
        searchGroups={searchGroups}
        otherParams={props.otherParams}
      />

      <OperationWrap>
        <Space size={16} style={{ position: 'relative' }}>
          {props.isShowLeft ? (
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
          {getIsPermission(projectInfo?.projectPermissions, 'b/story/save') ||
          projectInfo?.status !== 1 ? null : (
            <Popover
              content={changeStatus}
              placement="bottomLeft"
              getPopupContainer={node => node}
              visible={isVisible}
              onVisibleChange={visible => setIsVisible(visible)}
            >
              <MoreWrap type="create">
                <span>{t('common.createDemand')}</span>
                <IconFont
                  style={{ fontSize: 16, marginLeft: 8 }}
                  type={isVisible ? 'up' : 'down'}
                />
              </MoreWrap>
            </Popover>
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
          onChangeGrid={props.onChangeGrid}
          isGrid={props.isGrid}
          filterState={filterState}
          settingState={props.settingState}
          onChangeSetting={() => props.onChangeSetting(!props.settingState)}
        />
      </OperationWrap>
      {!filterState && (
        <TableFilter
          noNeed
          defaultValue={defaultValue}
          onFilter={getSearchKey}
          onSearch={() => onFilterSearch}
          list={searchList}
          basicsList={filterBasicsList}
          specialList={filterSpecialList}
          customList={filterCustomList}
        />
      )}
    </StickyWrap>
  )
}

export default Operation
