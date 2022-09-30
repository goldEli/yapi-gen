/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable multiline-ternary */
/* eslint-disable complexity */
import styled from '@emotion/styled'
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
import CommonModal from '@/components/CommonModal'
import ImportDemand from './ImportDemand'
import { getPermission } from '@/services/project'

const OperationWrap = styled.div({
  minHeight: 52,
  minWidth: '800px',
  lineHeight: '52px',
  background: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 24px',
  '.ant-popover-content': {
    width: 'max-content',
  },
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

const MoreWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  height: 32,
  borderRadius: 6,
  padding: '0 16px',
  background: '#F0F4FA',
  color: '#2877ff',
  fontSize: 14,
  fontWeight: 400,
  cursor: 'pointer',
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
    color: '#2877ff',
    background: '#F0F4FA',
  },
})

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
  const [isVisible, setIsVisible] = useState(false)
  const [isVisibleMore, setIsVisibleMore] = useState(false)
  const [isShowImport, setIsShowImport] = useState(false)
  const [filterState, setFilterState] = useState(true)
  const { filterAll, projectInfo, categoryList, colorList }
    = useModel('project')
  const { setFilterHeight, setCreateCategory } = useModel('demand')
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
  const hasImport = getIsPermission(
    projectInfo?.projectPermissions,
    'b/story/import',
  )

  const hasExport = getIsPermission(
    projectInfo?.projectPermissions,
    'b/story/export',
  )

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
    setFilterCustomList(projectInfo?.filterCustomList)
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

  const onChangeCategory = (e: any, item: any) => {
    setCreateCategory(item)
    setTimeout(() => {
      props.onChangeVisible?.(e)
      setIsVisible(false)
    }, 100)
  }

  const changeStatus = (
    <Space
      style={{
        padding: '8px 16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
    >
      {categoryList?.list?.map((k: any) => (
        <StatusTag
          style={{ marginRight: 0 }}
          key={k.id}
          color={k.color}
          bgColor={colorList?.filter((i: any) => i.key === k.color)[0]?.bgColor}
          onClick={(e: any) => onChangeCategory(e, k)}
        >
          {k.name}
        </StatusTag>
      ))}
    </Space>
  )

  const onImportClick = () => {
    setIsVisible(false)
    setIsShowImport(true)
  }

  const moreOperation = (
    <div style={{ padding: '4px 0', display: 'flex', flexDirection: 'column' }}>
      {hasImport ? null : (
        <MoreItem onClick={onImportClick}>
          <IconFont style={{ fontSize: 16, marginRight: 8 }} type="Import" />
          <span>导入需求</span>
        </MoreItem>
      )}
      {hasExport ? null : (
        <MoreItem>
          <IconFont style={{ fontSize: 16, marginRight: 8 }} type="export" />
          <span>导出需求</span>
        </MoreItem>
      )}
    </div>
  )

  const onImportClose = () => {
    setIsShowImport(false)
  }

  return (
    <StickyWrap ref={stickyWrapDom}>
      <CommonModal
        isVisible={isShowImport}
        width={784}
        title="导入需求"
        isShowFooter
        onClose={onImportClose}
      >
        <ImportDemand />
      </CommonModal>
      <OperationWrap>
        <Space size={16}>
          <Tooltip
            visible={isShow}
            onVisibleChange={isShow1 => setIsShow(isShow1)}
            getTooltipContainer={node => node}
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
              }}
            />
          </Tooltip>
          {getIsPermission(
            projectInfo?.projectPermissions,
            'b/story/save',
          ) ? null : (
            <Popover
              content={changeStatus}
              placement="bottomLeft"
              getPopupContainer={node => node}
              visible={isVisible}
              onVisibleChange={visible => setIsVisible(visible)}
            >
              <Button type="primary" icon={<IconFont type="plus" />}>
                {t('common.createDemand')}
              </Button>
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
                <span>更多操作</span>
                <IconFont
                  style={{ fontSize: 16, marginLeft: 8 }}
                  type={isVisibleMore ? 'up' : 'down'}
                />
              </MoreWrap>
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
          customList={filterCustomList}
        />
      )}
    </StickyWrap>
  )
}

export default Operation
