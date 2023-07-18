// 需求主页-操作栏

/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable complexity */
import styled from '@emotion/styled'
import TableFilter from '@/components/TableFilter'
import React, { useMemo, useEffect, useRef, useState } from 'react'
import { getIsPermission } from '@/tools/index'
import { useTranslation } from 'react-i18next'
import DeleteConfirm from '@/components/DeleteConfirm'
// import ExportDemand from './ExportDemand'
// import ImportDemand from './ImportDemand'
import { useDispatch, useSelector } from '@store/index'

import {
  clearValue,
  onTapSearchChoose,
  saveScreen,
  saveValue,
} from '@store/view'
import KanBanBtnsArea from '../KanBanBtnsArea'

import SelectOptions from '@/components/SelectOptions'
import {
  delView,
  onChangeSortByGroupOptions,
  onChangeSortByRowAndStatusOptions,
  onChangeSortByView,
  onRefreshKanBan,
  openSaveAsViewModel,
} from '@store/kanBan/kanBan.thunk'
import SelectOptionsNormal from '@/components/SelectOptionsNormal'
import useDeleteConfirmModal from '@/hooks/useDeleteConfirmModal'
import { setSortByGroupOptions, setSpinning } from '@store/kanBan'
import { getMessage } from '@/components/Message'
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
const Btn = styled.div`
  font-size: 14px;
  color: var(--auxiliary-text-t2-d2);
  cursor: pointer;
`
const RightBox = styled.div``

const StickyWrap = styled.div`
  width: 100%;
`

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
    useSelector(store => store.kanBan)
  const [filterState, setFilterState] = useState(true)
  const [defaultValue, setDefaultValue] = useState({})

  // 导出超出限制提示
  const [exceedState, setExceedState] = useState(false)
  const {
    projectInfo,
    colorList,
    filterKeys,
    projectInfoValues,
    filterParams,
  } = useSelector(store => store.project)
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
  const { open, DeleteConfirmModal } = useDeleteConfirmModal()

  // const hasImport = getIsPermission(
  //   projectInfo?.projectPermissions,
  //   projectInfo.projectType === 1 ? 'b/story/import' : 'b/transaction/import',
  // )

  // const hasExport = getIsPermission(
  //   projectInfo?.projectPermissions,
  //   projectInfo.projectType === 1 ? 'b/story/export' : 'b/transaction/export',
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
      console.log('yangyangyangyangynag', searchChoose)
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
  useEffect(() => {
    return () => {
      dispatch(onTapSearchChoose({}))
      dispatch(clearValue())
      dispatch(setSortByGroupOptions('none'))
    }
  }, [])

  return (
    <StickyWrap ref={stickyWrapDom}>
      <DeleteConfirmModal />
      <OperationWrap>
        <LeftBox>
          <SelectOptionsNormal
            title={t('group')}
            options={sortByGroupOptions ?? []}
            onChange={key => {
              dispatch(onChangeSortByGroupOptions(key))
            }}
          />
          <SelectOptionsNormal
            title={t('columns_and_status')}
            options={sortByRowAndStatusOptions ?? []}
            onChange={key => {
              dispatch(onChangeSortByRowAndStatusOptions(key))
            }}
          />
          <SelectOptions
            title={t('view')}
            options={sortByView ?? []}
            onChange={key => {
              dispatch(onChangeSortByView(key))
            }}
            operation
            onDel={key => {
              open({
                title: t('confirmationOfDeletion'),
                text: t('confirmDeletingTheView'),
                onConfirm: () => {
                  dispatch(
                    delView({
                      id: key,
                    }),
                  )
                  return Promise.resolve()
                },
              })
            }}
            onEdit={key => {
              dispatch(openSaveAsViewModel(key))
            }}
            onCreateView={() => {
              dispatch(openSaveAsViewModel())
            }}
          />
          <Btn
            onClick={() => {
              dispatch(openSaveAsViewModel())
            }}
          >
            {t('save_as')}
          </Btn>
          <Btn
            onClick={() => {
              if (sortByView?.find(item => item.check && item.type === 2)) {
                getMessage({ type: 'warning', msg: t('other.systemNot') })
                return
              }
              const currentId = sortByView?.find(item => item.check)?.id
              dispatch(openSaveAsViewModel(currentId, true))
            }}
          >
            {t('save_Changes')}
          </Btn>
        </LeftBox>
        <RightBox>
          <KanBanBtnsArea
            onChangeFilter={onChangeFilter}
            onChangeGrid={props.onChangeGrid}
            onRefresh={() => {
              dispatch(setSpinning(true))
              dispatch(onRefreshKanBan())
            }}
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
          defaultValue={defaultValue}
          onFilter={getSearchKey}
          onSearch={(e: any, customField: any) =>
            onFilterSearch(e, customField)
          }
          list={searchList}
          basicsList={filterBasicsList?.filter((i: any) =>
            projectInfo?.projectType === 1 ? i.is_flaw !== 1 : i,
          )}
          specialList={filterSpecialList}
          customList={filterCustomList}
        />
      </div>
    </StickyWrap>
  )
}

export default Operation
