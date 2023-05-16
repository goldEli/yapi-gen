// 需求主页-操作栏

/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable complexity */
import styled from '@emotion/styled'
import TableFilter from '@/components/TableFilter'
import { useEffect, useRef, useState } from 'react'
import { getIsPermission } from '@/tools/index'
import { useTranslation } from 'react-i18next'
import IconFont from '@/components/IconFont'
import DeleteConfirm from '@/components/DeleteConfirm'
// import ExportDemand from './ExportDemand'
// import ImportDemand from './ImportDemand'
import { useDispatch, useSelector } from '@store/index'
import { setAddWorkItemModal, setFilterParamsModal } from '@store/project'
import { setCreateCategory } from '@store/demand'
import { saveScreen } from '@store/view'
import CommonIconFont from '@/components/CommonIconFont'
import KanBanOperation from '@/components/KanBanOperation'
import SelectOptions from '../SelectOptions'
import {
  onChangeSortByGroupOptions,
  onChangeSortByRowAndStatusOptions,
  onChangeSortByView,
} from '@store/sprintKanBan'

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

const LeftBox = styled.div`
  display: flex;
  gap: 8px;
`
const RightBox = styled.div``

const StickyWrap = styled.div({
  background: 'white',
})

const LiWrap = styled.div({
  cursor: 'pointer',
  padding: '0 16px',
  width: '100%',
  height: 32,
  display: 'flex',
  alignItems: 'center',
  background: 'var(--neutral-white-d3)',
  '&: hover': {
    background: 'var(--hover-d3)',
  },
})

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
  onChangeVisible?(e?: any): void
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
  const [t] = useTranslation()
  const { sortByGroupOptions, sortByRowAndStatusOptions, sortByView } =
    useSelector(store => store.sprintKanBan)

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

  // const hasImport = getIsPermission(
  //   projectInfo?.projectPermissions,
  //   'b/story/import',
  // )

  // const hasExport = getIsPermission(
  //   projectInfo?.projectPermissions,
  //   'b/story/export',
  // )

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

  // const onChangeCategory = (e: any, item: any) => {
  //   dispatch(setCreateCategory(item))

  //   // 需求列表筛选参数赋值给 弹窗
  //   dispatch(setFilterParamsModal(filterParams))
  //   setTimeout(() => {
  //     dispatch(
  //       setAddWorkItemModal({
  //         visible: true,
  //         params: { projectId: projectInfo?.id },
  //       }),
  //     )
  //     setIsVisible(false)
  //   }, 0)
  // }

  // const changeStatus = (
  //   <div
  //     style={{
  //       padding: '4px 0px',
  //       display: 'flex',
  //       flexDirection: 'column',
  //       alignItems: 'flex-start',
  //       minWidth: i18n.language === 'zh' ? 110 : 151,
  //     }}
  //   >
  //     {projectInfoValues
  //       ?.filter((i: any) => i.key === 'category')[0]
  //       ?.children?.filter((i: any) => i.status === 1)
  //       ?.map((k: any) => {
  //         return (
  //           <LiWrap key={k.id} onClick={(e: any) => onChangeCategory(e, k)}>
  //             <img
  //               src={
  //                 k.category_attachment
  //                   ? k.category_attachment
  //                   : 'https://varlet.gitee.io/varlet-ui/cat.jpg'
  //               }
  //               style={{
  //                 width: '18px',
  //                 height: '18px',
  //                 marginRight: '8px',
  //               }}
  //               alt=""
  //             />
  //             <span>{k.content}</span>
  //           </LiWrap>
  //         )
  //       })}
  //   </div>
  // )

  // const onImportClick = () => {
  //   setIsVisible(false)
  //   setIsShowImport(true)
  //   setIsVisibleMore(false)
  // }

  // const onExportClick = () => {
  //   if (props.dataLength > 5000) {
  //     setIsVisibleMore(false)
  //     setExceedState(true)
  //     return
  //   }
  //   setIsVisible(false)
  //   setIsShowExport(true)
  //   setIsVisibleMore(false)
  // }

  return (
    <StickyWrap ref={stickyWrapDom}>
      <DeleteConfirm
        onConfirm={() => setExceedState(false)}
        onChangeVisible={() => setExceedState(false)}
        isVisible={exceedState}
        title={t('p2.toast')}
        text={t('p2.exportDemandText')}
      />

      <OperationWrap>
        <LeftBox>
          <SelectOptions
            title="分组"
            options={sortByGroupOptions ?? []}
            onChange={key => {
              dispatch(onChangeSortByGroupOptions(key))
            }}
          />
          <SelectOptions
            title="列与状态"
            options={sortByRowAndStatusOptions ?? []}
            onChange={key => {
              dispatch(onChangeSortByRowAndStatusOptions(key))
            }}
          />
          <SelectOptions
            title="视图"
            options={sortByView ?? []}
            onChange={key => {
              dispatch(onChangeSortByView(key))
            }}
          />
        </LeftBox>
        <RightBox>
          <KanBanOperation
            onChangeFilter={onChangeFilter}
            onChangeGrid={props.onChangeGrid}
            onRefresh={props.onRefresh}
            isGrid={props.isGrid}
            filterState={filterState}
            settingState={props.settingState}
            onChangeSetting={() => props.onChangeSetting(!props.settingState)}
          />
        </RightBox>
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
          basicsList={filterBasicsList}
          specialList={filterSpecialList}
          customList={filterCustomList}
        />
      </div>
    </StickyWrap>
  )
}

export default Operation
