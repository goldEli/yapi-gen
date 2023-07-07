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
import ExportDemand from '@/components/CommonExport'
import ImportDemand from '@/components/CommonImport'
import { useDispatch, useSelector } from '@store/index'
import {
  setAddWorkItemModal,
  setCreateCategory,
  setFilterParamsModal,
} from '@store/project'
import { saveScreen } from '@store/view'
import CommonIconFont from '@/components/CommonIconFont'
import {
  getImportDownloadModel,
  getImportExcel,
  getImportExcelUpdate,
  getExportFields,
  getLoadListFields,
  getExportExcel,
} from '@/services/demand'
import {
  IconWrap,
  LiWrap,
  MoreItem,
  MoreWrap,
  OperationWrap,
  StickyWrap,
} from '../style'
import { useHotkeys } from 'react-hotkeys-hook'

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
  const { projectInfo, filterKeys, projectInfoValues, filterParams } =
    useSelector(store => store.project)
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
    console.log(key, '=keykeykeykey', type)
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
    console.log(
      filterFelid,
      '=filterFelidfilterFelidfilterFelid',
      projectInfo?.filterFelid,
    )

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
      dispatch(
        setAddWorkItemModal({
          visible: true,
          params: { projectId: projectInfo?.id, type: 1, title: '创建需求' },
        }),
      )
      setIsVisible(false)
    }, 0)
  }
  useHotkeys(
    'c',
    () => {
      dispatch(
        setAddWorkItemModal({
          visible: true,
          params: { projectId: projectInfo?.id, type: 1, title: '创建需求' },
        }),
      )
    },
    [],
  )
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
        ?.children?.filter((i: any) => i.status === 1 && i.work_type === 1)
        ?.map((k: any) => {
          return (
            <LiWrap key={k.id} onClick={(e: any) => onChangeCategory(e, k)}>
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
          <CommonIconFont type="export" />
          <span style={{ marginLeft: 8 }}>{t('newlyAdd.importDemand')}</span>
        </MoreItem>
      )}
      {hasExport ? null : (
        <MoreItem onClick={onExportClick}>
          <CommonIconFont type="Import" />
          <span style={{ marginLeft: 8 }}>{t('newlyAdd.exportDemand')}</span>
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
        <ImportDemand
          tips={{
            tab1: (
              <>
                <span>{t('newlyAdd.importText2')}</span>
                <span>{t('newlyAdd.importText3')}</span>
                <span>{t('newlyAdd.importText4')}</span>
                <span>{t('newlyAdd.importText5')}</span>
                <span>{t('newlyAdd.importText6')}</span>
                <span>{t('newlyAdd.importText7')}</span>
                <span>{t('newlyAdd.importText8')}</span>
                <span>{t('newlyAdd.importText9')}</span>
              </>
            ),
            tab2: (
              <>
                <span>{t('newlyAdd.importText10')}</span>
                <span>{t('newlyAdd.importText4')}</span>
                <span>{t('newlyAdd.importText6')}</span>
                <span>{t('newlyAdd.importText7')}</span>
                <span>{t('newlyAdd.importText8')}</span>
                <span>{t('newlyAdd.importText9')}</span>
                <span>{t('newlyAdd.importText11')}</span>
                <span>{t('newlyAdd.importText12')}</span>
              </>
            ),
          }}
          stepText={t('newlyAdd.uploadDemand')}
          interfaces={{
            getImportDownloadModel,
            getImportExcel,
            getImportExcelUpdate,
          }}
          templateInterfaces={{
            getExportFields,
            getLoadListFields,
          }}
          templateTitle={t('newlyAdd.importChoose')}
          onUpdate={props.onRefresh}
        />
      </CommonModal>

      <ExportDemand
        exportText={t('newlyAdd.exportDemand')}
        isShowExport={isShowExport}
        onClose={setIsShowExport}
        searchGroups={searchGroups}
        otherParams={props.otherParams}
        interfaces={{ getExportExcel }}
        templateInterfaces={{
          getExportFields,
          getLoadListFields,
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
          onSearch={(e: any, customField: any) =>
            onFilterSearch(e, customField)
          }
          list={searchList}
          basicsList={filterBasicsList?.filter((i: any) => i.is_flaw !== 1)}
          specialList={filterSpecialList}
          customList={filterCustomList}
        />
      </div>
    </StickyWrap>
  )
}

export default Operation
