/* eslint-disable multiline-ternary */
import styled from '@emotion/styled'
import SearchComponent from '@/components/SearchComponent'
import OperationGroup from '@/components/OperationGroup'
import TableFilter from '@/components/TableFilter'
import { useEffect, useRef, useState } from 'react'
import { useModel } from '@/models'
import { getIsPermission } from '@/tools/index'
import { useTranslation } from 'react-i18next'

const OperationWrap = styled.div({
  minHeight: 52,
  minWidth: '800px',
  lineHeight: '52px',
  background: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 24px',
})

const StickyWrap = styled.div({
  background: 'white',
  position: 'sticky',
  top: 64,
  zIndex: 9,
})

interface Props {
  isGrid: boolean
  onChangeGrid(val: boolean): void
  onChangeVisible?(e?: any): void
  onSearch(params: any): void
  settingState: boolean
  onChangeSetting(val: boolean): void
}

const Operation = (props: Props) => {
  const [t] = useTranslation()
  const [filterState, setFilterState] = useState(true)
  const { filterAll, projectInfo } = useModel('project')
  const { setFilterHeight } = useModel('demand')
  const [searchList, setSearchList] = useState<any[]>([])
  const [filterBasicsList, setFilterBasicsList] = useState<any[]>([])
  const [filterSpecialList, setFilterSpecialList] = useState<any[]>([])
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

  const onChangeSearch = (val: string) => {
    setSearchVal(val)
    const params = searchGroups
    params.searchValue = val
    setSearchGroups(params)
    props.onSearch(params)
  }

  const onFilterSearch = (e: any) => {
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
    }
    setSearchGroups(params)
    props.onSearch(params)
  }

  const getSearchKey = async (key?: any, type?: number) => {
    if (key && type === 0) {
      setSearchList(searchList.filter((item: any) => item.content !== key))
      return
    }
    if (key && type === 1) {
      const addList = filterAll?.filter((item: any) => item.content === key)
      setSearchList([...searchList, ...addList])

      return
    }
    const arr = filterAll?.filter((item: any) => item.isDefault === 1)

    setSearchList(arr)
    setFilterBasicsList(projectInfo?.filterBasicsList)
    setFilterSpecialList(projectInfo?.filterSpecialList)
  }

  useEffect(() => {
    getSearchKey()
  }, [projectInfo, filterAll])

  const onChangeFilter = () => {
    setFilterState(!filterState)
    setTimeout(() => {
      setFilterHeight(stickyWrapDom.current?.clientHeight)
    }, 100)
  }

  // console.log(filterBasicsList, '===', filterSpecialList, ' ---', searchList)

  return (
    <StickyWrap ref={stickyWrapDom}>
      <OperationWrap>
        <SearchComponent
          onChangeVisible={(e: any) => props.onChangeVisible?.(e)}
          onChangeSearch={onChangeSearch}
          placeholder={t('common.pleaseSearchDemand')}
          text={t('common.createDemand')}
          isPermission={getIsPermission(
            projectInfo?.projectPermissions,
            'b/story/save',
          )}
        />
        <OperationGroup
          onChangeFilter={onChangeFilter}
          onChangeGrid={props.onChangeGrid}
          isGrid={props.isGrid}
          filterState={filterState}
          settingState={props.settingState}
          onChangeSetting={() => props.onChangeSetting(!props.settingState)}
        />
      </OperationWrap>
      {filterState ? null : (
        <TableFilter
          onFilter={getSearchKey}
          onSearch={onFilterSearch}
          list={searchList}
          basicsList={filterBasicsList}
          specialList={filterSpecialList}
        />
      )}
    </StickyWrap>
  )
}

export default Operation
