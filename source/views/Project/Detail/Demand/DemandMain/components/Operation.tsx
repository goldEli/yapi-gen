/* eslint-disable @typescript-eslint/indent */
/* eslint-disable multiline-ternary */
import styled from '@emotion/styled'
import SearchComponent from '@/components/SearchComponent'
import OperationGroup from '@/components/OperationGroup'
import TableFilter from '@/components/TableFilter'
import { useEffect, useRef, useState } from 'react'
import { useModel } from '@/models'
import { getIsPermission } from '@/tools/index'
import { useTranslation } from 'react-i18next'
import IconFont from '@/components/IconFont'
import { Button, Divider, Popover, Space, Tooltip } from 'antd'
import AddButton from '@/components/AddButton'
import { MyInput } from '@/components/StyleCommon'

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
})

const DividerWrap = styled(Divider)({
  height: 20,
  margin: '0 16px 0 24px',
})

const StatusTag = styled.div<{ color?: string; bgColor?: string }>(
  {
    height: 22,
    borderRadius: 11,
    textAlign: 'center',
    lineHeight: '22px',
    padding: '0 8px',
    fontSize: 12,
    cursor: 'pointer',
    marginRight: 8,
  },
  ({ color, bgColor }) => ({
    color,
    background: bgColor,
  }),
)

interface Props {
  isGrid: boolean
  onChangeGrid(val: boolean): void
  onChangeVisible?(e?: any): void
  onSearch(params: any): void
  settingState: boolean
  onChangeSetting(val: boolean): void
  onChangeIsShowLeft?(): void
  isShowLeft?: boolean
}

const Operation = (props: Props) => {
  const [t] = useTranslation()
  const [isShow, setIsShow] = useState(false)
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

  const onChangeCategory = () => {

    //
  }

  const changeStatus = (
    <Space
      size={8}
      style={{ padding: '8px 16px', display: 'flex', flexDirection: 'column' }}
    >
      <StatusTag color="#43BA9A" bgColor="#EDF7F4" onClick={onChangeCategory}>
        开发需求
      </StatusTag>
    </Space>
  )

  return (
    <StickyWrap ref={stickyWrapDom}>
      <OperationWrap>
        <Space size={8}>
          <Tooltip
            style={{ position: 'relative' }}
            key={isShow.toString()}
            visible={isShow}
            onVisibleChange={isShow1 => setIsShow(isShow1)}
            getPopupContainer={node => node}
            title={
              props.isShowLeft ? t('common.collapseMenu') : t('common.openMenu')
            }
          >
            <IconFont
              onClick={props.onChangeIsShowLeft}
              type="indent"
              style={{
                fontSize: 20,
                color: 'black',
                cursor: 'pointer',
                marginRight: 8,
              }}
            />
          </Tooltip>
          {getIsPermission(
            projectInfo?.projectPermissions,
            'b/story/save',
          ) ? null : (
            <Popover
              content={changeStatus}
              placement="bottom"
              getPopupContainer={node => node}
            >
              <Button
                type="primary"
                icon={<IconFont type="plus" />}
                onClick={(e: any) => props.onChangeVisible?.(e)}
              >
                {t('common.createDemand')}
              </Button>
            </Popover>
          )}
        </Space>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <MyInput
            onPressEnter={(e: any) => onChangeSearch?.(e.target.value)}
            suffix={
              <IconFont
                type="search"
                style={{ color: '#BBBDBF', fontSize: 16 }}
              />
            }
            placeholder={t('common.pleaseSearchDemand')}
            allowClear
          />
          <DividerWrap type="vertical" />
          <OperationGroup
            onChangeFilter={onChangeFilter}
            onChangeGrid={props.onChangeGrid}
            isGrid={props.isGrid}
            filterState={filterState}
            settingState={props.settingState}
            onChangeSetting={() => props.onChangeSetting(!props.settingState)}
          />
        </div>
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
