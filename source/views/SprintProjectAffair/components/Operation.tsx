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
import DeleteConfirm from '@/components/DeleteConfirm'
import { useDispatch, useSelector } from '@store/index'
import { setAddWorkItemModal, setFilterParamsModal } from '@store/project'
import { saveScreen } from '@store/view'
import CommonIconFont from '@/components/CommonIconFont'
import { OperationWrap } from '../style'
import CommonButton from '@/components/CommonButton'
import CommonModal from '@/components/CommonModal'
import CommonImport from '@/components/CommonImport'
import {
  getImportDownloadAffairsModel,
  getImportAffairsExcel,
  getImportAffairsExcelUpdate,
  getExportAffairsFields,
  getLoadAffairsListFields,
  getExportAffairsExcel,
} from '@/services/affairs'
import CommonExport from '@/components/CommonExport'
import useShortcutC from '@/hooks/useShortcutC'

const StickyWrap = styled.div({
  background: 'white',
})

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

interface Props {
  isGrid: any
  onChangeGrid(val: any): void
  onSearch(params: any): void
  onRefresh(): void
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
  // const { filterParams } = useSelector(store => store.demand)
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
    projectInfo.projectType === 1 ? 'b/story/import' : 'b/transaction/import',
  )

  const hasExport = getIsPermission(
    projectInfo?.projectPermissions,
    projectInfo.projectType === 1 ? 'b/story/export' : 'b/transaction/export',
  )

  const onFilterSearch = (e: any, customField: any) => {
    // 如果筛选未打开
    if (filterState) {
      return
    }
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
  const handleShortcutEvent = () => {
    console.log('C键被按下')
    dispatch(
      setAddWorkItemModal({
        visible: true,
        params: { noDataCreate: true, type: 7 },
      }),
    )
  }

  useShortcutC(handleShortcutEvent)
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
        title={t('common.importTransaction')}
        isShowFooter
        onClose={onImportClose}
      >
        <CommonImport
          templateTitle={t('project.importChoose')}
          interfaces={{
            getImportDownloadModel: getImportDownloadAffairsModel,
            getImportExcel: getImportAffairsExcel,
            getImportExcelUpdate: getImportAffairsExcelUpdate,
          }}
          templateInterfaces={{
            getExportFields: getExportAffairsFields,
            getLoadListFields: getLoadAffairsListFields,
          }}
          stepText={t('common.uploadTransaction')}
          tips={{
            tab1: (
              <>
                <span>{t('project.importText1')}</span>
                <span>{t('project.importText2')}</span>
                <span>{t('project.importText3')}</span>
                <span>{t('project.importText4')}</span>
                <span>{t('project.importText5')}</span>
                <span>{t('project.importText6')}</span>
                <span>{t('project.importText7')}</span>
                <span>{t('project.importText8')}</span>
              </>
            ),
            tab2: (
              <>
                <span>{t('project.importText9')}</span>
                <span>{t('project.importText10')}</span>
                <span>{t('project.importText11')}</span>
                <span>{t('project.importText12')}</span>
                <span>{t('project.importText13')}</span>
                <span>{t('project.importText14')}</span>
                <span>{t('project.importText15')}</span>
                <span>{t('project.importText16')}</span>
              </>
            ),
          }}
          onUpdate={() => {
            // Todo 导入后更新列表
          }}
        />
      </CommonModal>

      <CommonExport
        interfaces={{ getExportExcel: getExportAffairsExcel }}
        isShowExport={isShowExport}
        onClose={setIsShowExport}
        searchGroups={searchGroups}
        otherParams={props.otherParams}
        templateInterfaces={{
          getExportFields: getExportAffairsFields,
          getLoadListFields: getLoadAffairsListFields,
        }}
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
          {getIsPermission(
            projectInfo?.projectPermissions,
            projectInfo.projectType === 1
              ? 'b/story/save'
              : 'b/transaction/save',
          ) || projectInfo?.status !== 1 ? null : (
            <CommonButton
              onClick={() =>
                dispatch(
                  setAddWorkItemModal({
                    visible: true,
                    params: { noDataCreate: true, type: 7 },
                  }),
                )
              }
              type="primary"
            >
              创建事务
            </CommonButton>
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
          onRefresh={props.onRefresh}
          isGrid={props.isGrid}
          filterState={filterState}
          settingState={props.settingState}
          onChangeSetting={() => props.onChangeSetting(!props.settingState)}
        />
      </OperationWrap>

      <div
        style={{
          height: filterState ? '0px' : 'initial',
          visibility: filterState ? 'hidden' : 'visible',
        }}
      >
        <TableFilter
          noNeed
          defaultValue={defaultValue}
          onFilter={getSearchKey}
          onSearch={onFilterSearch}
          list={searchList}
          basicsList={filterBasicsList}
          specialList={filterSpecialList}
          customList={filterCustomList}
        />
      </div>
    </StickyWrap>
  )
}

export default Operation
