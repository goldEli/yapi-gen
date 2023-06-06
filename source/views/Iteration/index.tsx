// 迭代主页

/* eslint-disable camelcase */
/* eslint-disable complexity */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/naming-convention */
import IterationMain from './IterationMain'
import IterationInfo from './IterationInfo'
import ChangeRecord from './ChangeRecord'
import Demand from './Demand'
import Achieve from './Achieve'
import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import styled from '@emotion/styled'
import { Space, message } from 'antd'
import DeleteConfirm from '@/components/DeleteConfirm'
import { getIsPermission, getParamsData } from '@/tools/index'
import { useTranslation } from 'react-i18next'
import { DividerWrap, HoverWrap } from '@/components/StyleCommon'
import { encryptPhp } from '@/tools/cryptoPhp'
import TableFilter from '@/components/TableFilter'
import { OptionalFeld } from '@/components/OptionalFeld'
import IterationStatus from './components/IterationStatus'
import IconFont from '@/components/IconFont'
import DropDownMenu from '@/components/DropDownMenu'
import InputSearch from '@/components/InputSearch'
import useSetTitle from '@/hooks/useSetTitle'
import { useDispatch, useSelector } from '@store/index'
import { setIsUpdateAddWorkItem, setProjectInfoValues } from '@store/project'
import {
  deleteIterate,
  getIterateInfo,
  updateIterateStatus,
} from '@/services/iterate'
import {
  setCreateIterationParams,
  setIsCreateIterationVisible,
  setIterateInfo,
} from '@store/iterate'
import SetShowField from '@/components/SetShowField/indedx'
import MyBreadcrumb from '@/components/MyBreadcrumb'
import PermissionWrap from '@/components/PermissionWrap'
import CommonButton from '@/components/CommonButton'
import ScreenMinHover from '@/components/ScreenMinHover'
import { getMessage } from '@/components/Message'
import useKeyPress from '@/hooks/useKeyPress'
const Wrap = styled.div`
  height: 100%;
  display: flex;
  padding: 20px 24px 0 0px;
  flex-direction: column;
`

const DemandInfoWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: 32,
  background: 'white',
  margin: '20px 0 6px 24px',
})

const NameWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  '.name': {
    fontSize: 16,
    fontWeight: 400,
    color: 'black',
    marginRight: 8,
  },
})

const ContentWrap = styled.div({
  display: 'flex',
  flexDirection: 'column',
  height: 'calc(100% - 90px)',
  padding: '0 0 0 24px',
})

const MainWrap = styled.div({
  background: 'white',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: '1px solid var(--neutral-n6-d1)',
  '.ant-space-item': {
    display: 'flex',
  },
})

const TitleWrap = styled(Space)({
  display: 'flex',
  alignItems: 'center',
})

const OperationWrap = styled(Space)({
  display: 'flex',
  alignItems: 'center',
})

const Item = styled.div<{ activeIdx: boolean }>(
  {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    span: {
      fontSize: 14,
      fontWeight: 400,
      marginRight: 4,
      color: 'var(--neutral-n2)',
      display: 'inline-block',
      height: 50,
      lineHeight: '50px',
    },
    div: {
      minWidth: 20,
      height: 20,
      padding: '0 6px',
      borderRadius: 10,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
  ({ activeIdx }) => ({
    span: {
      color: activeIdx ? 'var(--primary-d2)' : 'var(--neutral-n1-d2)',
      borderBottom: activeIdx
        ? '2px solid var(--primary-d2)'
        : '2px solid white',
      fontFamily: activeIdx ? 'SiYuanMedium' : '',
    },
    div: {
      color: activeIdx ? 'white' : 'var(--primary-d2)',
      background: activeIdx ? 'var(--primary-d2)' : 'var(--function-tag5)',
    },
  }),
)

const Iteration = () => {
  const { useKeys } = useKeyPress()
  useKeys('2', '/ProjectManagement/KanBan')
  useKeys('3', '/Report/PerformanceInsight')
  const [t] = useTranslation()
  const [isVisible, setIsVisible] = useState(false)
  const [filterState, setFilterState] = useState(true)
  const [settingState, setSettingState] = useState(false)
  const [operationDetail, setOperationDetail] = useState<any>({})
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
  const { type } = paramsData
  const navigate = useNavigate()
  const { iterateId } = paramsData
  const [isDelete, setIsDelete] = useState(false)
  const [isUpdateState, setIsUpdateState] = useState(false)
  const { projectInfo, projectInfoValues } = useSelector(store => store.project)
  const { currentMenu } = useSelector(store => store.user)
  const { iterateInfo, createIterationParams } = useSelector(
    store => store.iterate,
  )
  const [searchList, setSearchList] = useState<any[]>([])
  const [filterBasicsList, setFilterBasicsList] = useState<any[]>([])
  const [filterSpecialList, setFilterSpecialList] = useState<any[]>([])
  const [filterCustomList, setFilterCustomList] = useState<any[]>([])
  const [plainOptions, setPlainOptions] = useState<any>([])
  const [plainOptions2, setPlainOptions2] = useState<any>([])
  const [plainOptions3, setPlainOptions3] = useState<any>([])
  const [titleList, setTitleList] = useState<any[]>([])
  const [titleList2, setTitleList2] = useState<any[]>([])
  const [titleList3, setTitleList3] = useState<any[]>([])
  const [allTitleList, setAllTitleList] = useState<any[]>([])
  const [isVisibleFields, setIsVisibleFields] = useState(false)
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
  const dispatch = useDispatch()
  const asyncSetTtile = useSetTitle()
  asyncSetTtile(`${t('title.iteration')}【${projectInfo.name}】`)

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

  const isCanCheck = getIsPermission(
    projectInfo?.projectPermissions,
    'b/iterate/achieve/info',
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
      class_ids: e.class,
      category_id: e.category,
      schedule_start: e.schedule?.start,
      schedule_end: e.schedule?.end,
      custom_field: customField,
      searchVal: searchValue,
    }

    setSearchGroups(params)
  }

  const childContent = () => {
    if (type === 'info') {
      return <IterationInfo />
    } else if (type === 'demand') {
      return (
        <Demand
          searchGroups={searchGroups}
          checkList={titleList}
          checkList2={titleList2}
          checkList3={titleList3}
        />
      )
    } else if (type === 'achieve') {
      return <Achieve />
    }
    return (
      <ChangeRecord
        isUpdate={isUpdateState}
        onChangeUpdate={() => setIsUpdateState(false)}
      />
    )
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

  const onUpdateIterateInfo = async (id: any) => {
    const result = await getIterateInfo({ projectId, id })
    dispatch(setIterateInfo(result))
    dispatch(setCreateIterationParams({}))
  }

  useEffect(() => {
    // 迭代详情页面调用迭代详情
    if (iterateId || (iterateId && createIterationParams?.isUpdate)) {
      onUpdateIterateInfo(iterateId)
    }
  }, [iterateId, createIterationParams?.isUpdate])

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

  const onChangeIdx = (val: string) => {
    const params = encryptPhp(
      JSON.stringify({ type: val, id: projectId, iterateId }),
    )
    navigate(`/ProjectManagement/Iteration?data=${params}`)
  }

  const onChangeOperation = (item: any) => {
    setOperationDetail(item)
  }

  const onDeleteConfirm = async () => {
    try {
      await deleteIterate({ projectId, id: iterateId })
      getMessage({ msg: t('common.deleteSuccess'), type: 'success' })
      setIsDelete(false)
      const params = encryptPhp(JSON.stringify({ id: projectId }))
      navigate(`/ProjectManagement/Iteration?data=${params}`)
    } catch (error) {
      //
    }
  }

  const onChangeVisible = (val?: any) => {
    setIsVisible(!isVisible)
    if (val) {
      setOperationDetail({})
    }
  }

  const onChangeEditVisible = () => {
    dispatch(setIsCreateIterationVisible(true))
    dispatch(
      setCreateIterationParams({
        ...iterateInfo,
        ...{ projectId },
      }),
    )
  }

  const onChangeStatus = async (val: number) => {
    if (val !== iterateInfo?.status) {
      try {
        await updateIterateStatus({
          projectId,
          id: iterateInfo?.id,
          status: val,
        })
        getMessage({ msg: t('common.editS'), type: 'success' })
        onUpdateIterateInfo(iterateInfo?.id)
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
        setIsUpdateState(true)
      } catch (error) {
        //
      }
    }
  }

  const onPressEnter = (value: any) => {
    if (searchGroups.searchVal !== value) {
      let obj = JSON.parse(JSON.stringify(searchGroups))
      obj.searchVal = value
      setSearchValue(value)
      setSearchGroups(obj)
    }
  }

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

  const content = () => {
    if (!type) {
      return (
        <IterationMain
          onChangeVisible={onChangeVisible}
          onChangeOperation={item => onChangeOperation(item)}
          updateState={isUpdateState}
          onChangeIsUpdate={setIsUpdateState}
        />
      )
    }

    const refresh = () => {
      dispatch(setIsUpdateAddWorkItem(true))
    }

    return (
      <div style={{ height: '100%' }}>
        <DeleteConfirm
          text={t('mark.editIterate')}
          isVisible={isDelete}
          onChangeVisible={() => setIsDelete(!isDelete)}
          onConfirm={onDeleteConfirm}
        />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 32,
            paddingLeft: 24,
          }}
        >
          <MyBreadcrumb />
          {type === 'demand' && (
            <div>
              <InputSearch
                placeholder={t('common.pleaseSearchDemand')}
                onChangeSearch={onPressEnter}
                leftIcon
              />
            </div>
          )}
        </div>
        <DemandInfoWrap>
          <NameWrap>
            <span className="name">{iterateInfo.name}</span>
            <IterationStatus
              hasChangeStatus={hasChangeStatus}
              iterateInfo={iterateInfo}
              onChangeStatus={onChangeStatus}
            />
          </NameWrap>
          <Space size={16}>
            {hasEdit ? null : (
              <CommonButton type="light" onClick={onChangeEditVisible}>
                {t('common.edit')}
              </CommonButton>
            )}
            {hasDel ? null : (
              <CommonButton type="light" onClick={() => setIsDelete(!isDelete)}>
                {t('common.del')}
              </CommonButton>
            )}
          </Space>
        </DemandInfoWrap>
        <ContentWrap>
          <MainWrap>
            <TitleWrap size={32}>
              <Item
                onClick={() => onChangeIdx('info')}
                activeIdx={type === 'info'}
              >
                <span>{t('common.iterateSurvey')}</span>
              </Item>
              <Item
                onClick={() => onChangeIdx('demand')}
                activeIdx={type === 'demand'}
              >
                <span>{t('common.demand')}</span>
                <div>{iterateInfo?.storyCount || 0}</div>
              </Item>
              {isCanCheck ? null : (
                <Item
                  onClick={() => onChangeIdx('achieve')}
                  activeIdx={type === 'achieve'}
                >
                  <span>{t('p2.d2')}</span>
                </Item>
              )}

              <Item
                onClick={() => onChangeIdx('record')}
                activeIdx={type === 'record'}
              >
                <span>{t('common.changeRecord')}</span>
                <div>{iterateInfo?.changeCount || 0}</div>
              </Item>
            </TitleWrap>
            {type === 'demand' && (
              <OperationWrap>
                {hasFilter ? null : (
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
                  onClick={refresh}
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
            )}
          </MainWrap>

          {/* 迭代详情-需求列表 */}
          {type === 'demand' && (
            <OptionalFeld
              allTitleList={allTitleList}
              plainOptions={plainOptions.filter((i: any) => i.is_flaw !== 1)}
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

          {!filterState && type === 'demand' && (
            <TableFilter
              onFilter={getSearchKey}
              onSearch={onFilterSearch}
              list={searchList}
              basicsList={filterBasicsList.filter((i: any) => i.is_flaw !== 1)}
              specialList={filterSpecialList}
              customList={filterCustomList}
              isIteration
            />
          )}
          {childContent()}
        </ContentWrap>
      </div>
    )
  }

  return (
    <PermissionWrap
      auth="/ProjectManagement/Project"
      permission={currentMenu?.children?.map((i: any) => i.url)}
    >
      <Wrap>{content()}</Wrap>
    </PermissionWrap>
  )
}

export default Iteration
