// 迭代主页

/* eslint-disable camelcase */
/* eslint-disable complexity */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/naming-convention */
import EditIteration from './components/EditIteration'
import IterationMain from './IterationMain'
import IterationInfo from './IterationInfo'
import ChangeRecord from './ChangeRecord'
import Demand from './Demand'
import Achieve from './Achieve'
import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import styled from '@emotion/styled'
import { Space, Button, message, Menu } from 'antd'
import { useModel } from '@/models'
import DeleteConfirm from '@/components/DeleteConfirm'
import { getIsPermission, getParamsData } from '@/tools/index'
import { useTranslation } from 'react-i18next'
import { DividerWrap, HoverWrap } from '@/components/StyleCommon'
import { encryptPhp } from '@/tools/cryptoPhp'
import TableFilter from '@/components/TableFilter'
import { OptionalFeld } from '@/components/OptionalFeld'
import IterationStatus from './components/IterationStatus'
import CommonInput from '@/components/CommonInput'
import IconFont from '@/components/IconFont'
import DropDownMenu from '@/components/DropDownMenu'
import PubSub from 'pubsub-js'
import useSetTitle from '@/hooks/useSetTitle'

const DemandInfoWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: 64,
  background: 'white',
  padding: '0 24px',
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
  height: 'calc(100% - 64px)',
})

const MainWrap = styled.div({
  padding: '0 24px',
  background: 'white',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
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
      color: '#323233',
      display: 'inline-block',
      height: 50,
      lineHeight: '50px',
    },
    div: {
      minWidth: 20,
      height: 20,
      padding: '0 6px',
      borderRadius: 10,
      color: '#2877FF',
      background: '#F0F4FA',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
  ({ activeIdx }) => ({
    span: {
      color: activeIdx ? '#2877FF' : '#323233',
      borderBottom: activeIdx ? '2px solid #2877FF' : '2px solid white',
      fontWeight: activeIdx ? 'bold' : 400,
    },
    div: {
      color: activeIdx ? 'white' : '#2877FF',
      background: activeIdx ? '#2877FF' : '#F0F4FA',
    },
  }),
)

const IterationWrap = () => {
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
  const {
    getIterateInfo,
    iterateInfo,
    deleteIterate,
    updateIterateStatus,
    setFilterHeightIterate,
  } = useModel('iterate')
  const [isDelete, setIsDelete] = useState(false)
  const [isUpdateState, setIsUpdateState] = useState(false)
  const { projectInfo, getProjectInfo } = useModel('project')
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

  useEffect(() => {
    setFilterHeightIterate(60)
    // 迭代详情页面调用迭代详情
    if (iterateId) {
      getIterateInfo({ projectId, id: iterateId })
    }
  }, [])

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
    navigate(`/Detail/Iteration?data=${params}`)
  }

  const onChangeOperation = (item: any) => {
    setOperationDetail(item)
  }

  const onDeleteConfirm = async () => {
    try {
      await deleteIterate({ projectId, id: iterateId })
      message.success(t('common.deleteSuccess'))
      setIsDelete(false)
      const params = encryptPhp(JSON.stringify({ id: projectId }))
      navigate(`/Detail/Iteration?data=${params}`)
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
    setIsVisible(!isVisible)
    setOperationDetail(iterateInfo)
  }

  const onChangeStatus = async (val: number) => {
    if (val !== iterateInfo?.status) {
      try {
        await updateIterateStatus({
          projectId,
          id: iterateInfo?.id,
          status: val,
        })
        message.success(t('common.editS'))
        getIterateInfo({ projectId, id: iterateInfo?.id })
        getProjectInfo({ projectId })
        setIsUpdateState(true)
      } catch (error) {
        //
      }
    }
  }

  const onPressEnter = (value: any) => {
    let obj = JSON.parse(JSON.stringify(searchGroups))
    obj.searchVal = value
    setSearchGroups(obj)
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

    return (
      <div style={{ height: '100%' }}>
        <DeleteConfirm
          text={t('mark.editIterate')}
          isVisible={isDelete}
          onChangeVisible={() => setIsDelete(!isDelete)}
          onConfirm={onDeleteConfirm}
        />
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
              <Button type="primary" onClick={onChangeEditVisible}>
                {t('common.edit')}
              </Button>
            )}
            {hasDel ? null : (
              <Button onClick={() => setIsDelete(!isDelete)}>
                {t('common.del')}
              </Button>
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
              <OperationWrap size={16}>
                <CommonInput
                  placeholder={t('common.pleaseSearchDemand')}
                  onChangeSearch={onPressEnter}
                />
                {hasFilter ? null : <DividerWrap type="vertical" />}

                {hasFilter ? null : (
                  <HoverWrap
                    onClick={() => setFilterState(!filterState)}
                    isActive={!filterState}
                  >
                    <IconFont className="iconMain" type="filter" />
                    <span className="label">{t('common.search')}</span>
                  </HoverWrap>
                )}
                <DividerWrap type="vertical" />
                <DropDownMenu
                  menu={
                    <Menu
                      items={[
                        {
                          key: '1',
                          label: (
                            <div
                              onClick={() => {
                                setSettingState(true)
                                setIsVisibleFields(false)
                              }}
                            >
                              {t('common.setField')}
                            </div>
                          ),
                        },
                      ]}
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

          <OptionalFeld
            allTitleList={allTitleList}
            plainOptions={plainOptions}
            plainOptions2={plainOptions2}
            plainOptions3={plainOptions3}
            checkList={titleList}
            checkList2={titleList2}
            checkList3={titleList3}
            isVisible={settingState}
            onClose={() => setSettingState(false)}
            getCheckList={getCheckList}
          />

          {filterState ? null : (
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
          {childContent()}
        </ContentWrap>
      </div>
    )
  }

  const onUpdate = (value: any) => {
    setIsUpdateState(value)
  }

  return (
    <div style={{ height: 'calc(100% - 64px)' }}>
      <EditIteration
        visible={isVisible}
        onChangeVisible={() => onChangeVisible('clear')}
        id={operationDetail.id}
        onUpdate={onUpdate}
      />
      {content()}
    </div>
  )
}

export default IterationWrap
