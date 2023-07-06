import MyBreadcrumb from '@/components/MyBreadcrumb'
import {
  ButtonGroup,
  DetailTabItem,
  DetailText,
  DetailTitle,
  DetailTop,
  ItemNumber,
  OperationWrap,
  Wrap,
} from './style'
import CommonButton from '@/components/CommonButton'
import { Dropdown, Menu, Space, Tabs, TabsProps, Tooltip } from 'antd'
import CommonIconFont from '@/components/CommonIconFont'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from '@store/index'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import useDeleteConfirmModal from '@/hooks/useDeleteConfirmModal'
import {
  copyLink,
  getIdByUrl,
  getIsPermission,
  getProjectIdByUrl,
} from '@/tools'
import { getIterateInfo } from '@store/iterate/iterate.thunk'
import ChangeRecord from './components/ChangeRecord'
import Achieve from './components/Achieve'
import Flaw from './components/Flaw'
import Demand from './components/Demand'
import Overview from './components/Overview'
import ScreenMinHover from '@/components/ScreenMinHover'
import { DividerWrap } from '@/components/StyleCommon'
import DropDownMenu from '@/components/DropDownMenu'
import SetShowField from '@/components/SetShowField/indedx'
import { OptionalFeld } from '@/components/OptionalFeld'
import TableFilter from '@/components/TableFilter'
import InputSearch from '@/components/InputSearch'
import { setIsUpdateAddWorkItem, setProjectInfoValues } from '@store/project'
import IterationStatus from '@/components/IterationStatus'
import { deleteIterate, updateIterateStatus } from '@/services/iterate'
import { getMessage } from '@/components/Message'
import {
  setCreateIterationParams,
  setIsCreateIterationVisible,
} from '@store/iterate'
import { encryptPhp } from '@/tools/cryptoPhp'
import { useNavigate } from 'react-router-dom'
import CopyIcon from '@/components/CopyIcon'

const IterationDetail = () => {
  const [t] = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [tabActive, setTabActive] = useState('1')
  const { open, DeleteConfirmModal } = useDeleteConfirmModal()
  const { iterateInfo, isUpdateList } = useSelector(store => store.iterate)
  const { projectInfo, projectInfoValues, isUpdateAddWorkItem } = useSelector(
    store => store.project,
  )
  const [filterState, setFilterState] = useState(true)
  const [settingState, setSettingState] = useState(false)
  const [isVisibleFields, setIsVisibleFields] = useState(false)
  const [plainOptions, setPlainOptions] = useState<any>([])
  const [plainOptions2, setPlainOptions2] = useState<any>([])
  const [plainOptions3, setPlainOptions3] = useState<any>([])
  const [titleList, setTitleList] = useState<any[]>([])
  const [titleList2, setTitleList2] = useState<any[]>([])
  const [titleList3, setTitleList3] = useState<any[]>([])
  const [allTitleList, setAllTitleList] = useState<any[]>([])
  const [searchList, setSearchList] = useState<any[]>([])
  const [filterBasicsList, setFilterBasicsList] = useState<any[]>([])
  const [filterSpecialList, setFilterSpecialList] = useState<any[]>([])
  const [filterCustomList, setFilterCustomList] = useState<any[]>([])
  const [searchValue, setSearchValue] = useState('')
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
    searchVal: '',
  })

  const hasChangeStatus = getIsPermission(
    projectInfo?.projectPermissions,
    'b/iterate/status',
  )

  const hasEdit = getIsPermission(
    projectInfo?.projectPermissions,
    'b/iterate/update',
  )
  const hasDel = getIsPermission(
    projectInfo?.projectPermissions,
    'b/iterate/del',
  )

  const hasFilter = getIsPermission(
    projectInfo?.projectPermissions,
    'b/story/get',
  )

  const hasFilterFlaw = getIsPermission(
    projectInfo?.projectPermissions,
    'b/flaw/get',
  )

  const isCanCheck = getIsPermission(
    projectInfo?.projectPermissions,
    'b/iterate/achieve/info',
  )

  // 监听左侧信息滚动
  const onChangeTabs = (value: string) => {
    setTabActive(value)
    if (value === '1') {
      dispatch(
        getIterateInfo({
          projectId: getProjectIdByUrl(),
          id: getIdByUrl('iterateId'),
        }),
      )
    }
  }

  // 复制标题
  const onCopy = () => {
    copyLink(iterateInfo.name, '复制成功！', '复制失败！')
  }

  // 返回
  const onBack = () => {
    history.go(-1)
  }

  // 更新
  const onUpdateDetail = () => {
    dispatch(
      getIterateInfo({
        projectId: getProjectIdByUrl(),
        id: getIdByUrl('iterateId'),
      }),
    )
  }

  // 编辑
  const onEdit = () => {
    dispatch(setIsCreateIterationVisible(true))
    dispatch(
      setCreateIterationParams({
        ...iterateInfo,
        projectId: projectInfo?.id,
      }),
    )
  }

  //   删除迭代确认事件
  const onDeleteConfirm = async (item: any) => {
    await deleteIterate({
      projectId: getProjectIdByUrl(),
      id: item.id,
    })
    getMessage({ msg: t('common.deleteSuccess') as string, type: 'success' })
    const params = encryptPhp(JSON.stringify({ id: projectInfo?.id }))
    navigate(`/ProjectManagement/Iteration?data=${params}`)
  }

  // 删除
  const onDelete = () => {
    open({
      title: '删除确认',
      text: '确认删除该迭代？',
      onConfirm() {
        onDeleteConfirm(iterateInfo)
        return Promise.resolve()
      },
    })
  }

  const getSearchKey = async (key?: any, typeVal?: number) => {
    const filterFelid = projectInfo?.filterFelid
    if (key && typeVal === 0) {
      setSearchList(searchList.filter((item: any) => item.content !== key))
      return
    }
    if (key && typeVal === 1) {
      const addList = filterFelid?.filter((item: any) => item.content === key)

      setSearchList([...searchList, ...addList])

      return
    }

    const arr = filterFelid?.filter((item: any) => item.isDefault === 1)

    setSearchList(arr)
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
      class_ids: e.class,
      category_id: e.category,
      schedule_start: e.schedule?.start,
      schedule_end: e.schedule?.end,
      custom_field: customField,
      searchVal: searchValue,
    }

    setSearchGroups(params)
  }

  const tabItems: TabsProps['items'] = [
    {
      key: '1',
      label: (
        <DetailTabItem>
          <span>迭代概况</span>
        </DetailTabItem>
      ),
      children: <Overview activeKey={tabActive} />,
    },
    {
      key: '2',
      label: (
        <DetailTabItem>
          <span>需求</span>
          <ItemNumber isActive={tabActive === '2'}>
            {iterateInfo?.storyCount || 0}
          </ItemNumber>
        </DetailTabItem>
      ),
      children: (
        <div>
          {!filterState && (
            <TableFilter
              onFilter={getSearchKey}
              onSearch={onFilterSearch}
              list={searchList}
              basicsList={filterBasicsList?.filter((i: any) => i.is_flaw !== 1)}
              specialList={filterSpecialList}
              customList={filterCustomList}
              isIteration
            />
          )}
          <Demand
            activeKey={tabActive}
            searchGroups={searchGroups}
            checkList={titleList}
            checkList2={titleList2}
            checkList3={titleList3}
          />
        </div>
      ),
    },
    {
      key: '3',
      label: (
        <DetailTabItem>
          <span>缺陷</span>
          <ItemNumber isActive={tabActive === '3'}>
            {iterateInfo?.bug_count || 0}
          </ItemNumber>
        </DetailTabItem>
      ),
      children: (
        <div>
          {!filterState && (
            <TableFilter
              onFilter={getSearchKey}
              onSearch={onFilterSearch}
              list={searchList}
              basicsList={filterBasicsList}
              specialList={filterSpecialList}
              customList={filterCustomList}
              isIteration
            />
          )}
          <Flaw
            activeKey={tabActive}
            searchGroups={searchGroups}
            checkList={titleList}
            checkList2={titleList2}
            checkList3={titleList3}
          />
        </div>
      ),
    },
    {
      key: '4',
      label: (
        <DetailTabItem>
          <span>迭代成果</span>
        </DetailTabItem>
      ),
      children: <Achieve activeKey={tabActive} />,
    },
    {
      key: '5',
      label: (
        <DetailTabItem>
          <span>变更记录</span>
          <ItemNumber isActive={tabActive === '5'}>
            {iterateInfo?.changeCount || 0}
          </ItemNumber>
        </DetailTabItem>
      ),
      children: <ChangeRecord activeKey={tabActive} />,
    },
  ]

  // 标签栏上的操作
  const tabBarExtraContent = (
    <OperationWrap>
      {(tabActive === '2' ? hasFilter : hasFilterFlaw) ? null : (
        <>
          <ScreenMinHover
            label={t('common.search')}
            icon="filter"
            onClick={() => setFilterState(!filterState)}
            isActive={!filterState}
          />
          <DividerWrap type="vertical" />
        </>
      )}

      <ScreenMinHover
        icon="sync"
        label={t('common.refresh')}
        onClick={() =>
          dispatch(setIsUpdateAddWorkItem(isUpdateAddWorkItem + 1))
        }
      />

      <DividerWrap type="vertical" />

      <DropDownMenu
        menu={
          <SetShowField
            onChangeFieldVisible={() => {
              setSettingState(true)
              setIsVisibleFields(false)
            }}
          />
        }
        icon="settings"
        isVisible={isVisibleFields}
        onChangeVisible={setIsVisibleFields}
        isActive={settingState}
      >
        <div>{t('common.tableFieldSet')}</div>
      </DropDownMenu>
    </OperationWrap>
  )

  const getCheckList = (
    list: any[],
    list2: any[],
    list3: any[],
    all: any[],
  ) => {
    setTitleList(list)
    setTitleList2(list2)
    setTitleList3(list3)
    setAllTitleList(all)
  }

  const onPressEnter = (value: any) => {
    if (searchGroups.searchVal !== value) {
      let obj = JSON.parse(JSON.stringify(searchGroups))
      obj.searchVal = value
      setSearchValue(value)
      setSearchGroups(obj)
    }
  }

  const onChangeStatus = async (val: number) => {
    if (val !== iterateInfo?.status) {
      await updateIterateStatus({
        projectId: getProjectIdByUrl(),
        id: iterateInfo?.id,
        status: val,
      })
      getMessage({ msg: t('common.editS') as string, type: 'success' })
      const beforeValues = JSON.parse(JSON.stringify(projectInfoValues))
      // 修改迭代状态更新到项目下拉数据中
      const newValues = beforeValues?.map((i: any) =>
        i.key === 'iterate_name'
          ? {
              ...i,
              children: i.children?.map((v: any) => ({
                ...v,
                status: v.id === iterateInfo?.id ? val : v.status,
              })),
            }
          : i,
      )
      dispatch(setProjectInfoValues(newValues))
      dispatch(
        getIterateInfo({
          projectId: getProjectIdByUrl(),
          id: getIdByUrl('iterateId'),
        }),
      )
    }
  }

  useEffect(() => {
    if (projectInfo?.id) {
      getSearchKey()
      setFilterBasicsList(projectInfo?.filterBasicsList)
      setFilterSpecialList(projectInfo?.filterSpecialList)
      setFilterCustomList(projectInfo?.filterCustomList)
      setPlainOptions(projectInfo.plainOptions)
      setPlainOptions2(projectInfo.plainOptions2)
      setPlainOptions3(projectInfo.plainOptions3)
      setTitleList(projectInfo.titleList)
      setTitleList2(projectInfo.titleList2)
      setTitleList3(projectInfo.titleList3)
      setAllTitleList([
        ...projectInfo.titleList,
        ...projectInfo.titleList2,
        ...projectInfo.titleList3,
      ])
    }
  }, [projectInfo])

  useEffect(() => {
    if (isUpdateList) {
      onUpdateDetail()
    }
  }, [isUpdateList])

  return (
    <Wrap>
      <DeleteConfirmModal />
      {['2', '3'].includes(tabActive) && (
        <OptionalFeld
          allTitleList={allTitleList}
          plainOptions={plainOptions.filter((i: any) =>
            tabActive === '2' ? i.is_flaw !== 1 : i,
          )}
          plainOptions2={plainOptions2}
          plainOptions3={plainOptions3}
          checkList={titleList}
          checkList2={titleList2}
          checkList3={titleList3}
          isVisible={settingState}
          onClose={() => setSettingState(false)}
          getCheckList={getCheckList}
        />
      )}
      <DetailTop>
        <MyBreadcrumb />
        {['2', '3'].includes(tabActive) && (
          <div>
            <InputSearch
              placeholder={
                tabActive === '2'
                  ? '请搜索需求名称或需求编号'
                  : '请搜索缺陷名称或缺陷编号'
              }
              onChangeSearch={onPressEnter}
              leftIcon
            />
          </div>
        )}
      </DetailTop>
      <DetailTitle>
        <DetailText>
          <span className="name">{iterateInfo.name}</span>
          <CopyIcon onCopy={onCopy} />
          <IterationStatus
            hasChangeStatus={hasChangeStatus}
            iterateInfo={iterateInfo}
            onChangeStatus={onChangeStatus}
          />
        </DetailText>
        <ButtonGroup size={16}>
          <CommonButton type="icon" icon="left-md" onClick={onBack} />
          {!hasEdit && (
            <CommonButton type="icon" icon="edit" onClick={onEdit} />
          )}
          {!hasDel && (
            <CommonButton type="icon" icon="delete" onClick={onDelete} />
          )}
        </ButtonGroup>
      </DetailTitle>
      <Tabs
        className="tabs"
        activeKey={tabActive}
        items={
          isCanCheck ? tabItems.filter((i: any) => i.key !== '4') : tabItems
        }
        onChange={onChangeTabs}
        tabBarExtraContent={
          ['1', '4', '5'].includes(tabActive) ? null : tabBarExtraContent
        }
      />
    </Wrap>
  )
}

export default IterationDetail
