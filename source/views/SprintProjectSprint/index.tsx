/* eslint-disable require-atomic-updates */
/* eslint-disable no-undefined */
import React, { useCallback, useEffect, useRef, useState } from 'react'
import GuideModal from '@/components/GuideModal'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from '@store/index'
import InputSearch from '@/components/InputSearch'
import TabItem from './components/TabItem'
import IconFont from '@/components/IconFont'
import { Popover, Spin, Tooltip, Select } from 'antd'
import CustomSelect from '@/components/MoreSelect'
import DndKitTable from './components/DndKitTable'
import MyBreadcrumb from '@/components/MyBreadcrumb'
import CreateSprintModal from './components/CreateSprintModal'
import NewLoadingTransition from '@/components/NewLoadingTransition'
import { useSearchParams } from 'react-router-dom'
import { getIsPermission, getParamsData, removeNull } from '@/tools'
import CategoryDropdown from '@/components/CategoryDropdown'
import useKeyPress from '@/hooks/useKeyPress'
import { updateCompanyUserPreferenceConfig } from '@/services/user'
import { getLoginDetail } from '@store/user/user.thunk'
import { setAddWorkItemModal } from '@store/project'
import PermissionWrap from '@/components/PermissionWrap'
import {
  SprintDetailDragLine,
  SprintDetailMouseDom,
} from '@/components/DetailScreenModal/DemandDetail/style'
import { useGetloginInfo } from '@/hooks/useGetloginInfo'
import {
  SearchBox,
  ContentWrap,
  Left,
  TabsWrap,
  RightIcon,
  IconBox,
  TabItemWrap,
  Right,
  SelectWrapForList,
  CategorySelectWrap,
  ClearButton,
  DragContent,
} from './styles'
import { getSprintGroupList, getLeftSprintList } from '@/services/sprint'

const SprintProjectSprint: React.FC = () => {
  const [t] = useTranslation()
  const filterList = [
    {
      id: 1,
      name: t('sprint.unfinished'),
    },
    {
      id: 2,
      name: t('sprint.completed'),
    },
    {
      id: 0,
      name: t('sprint.allSprint'),
    },
  ]

  const filterList1 = [
    {
      id: 1,
      name: t('sprint.unfinished'),
    },
    {
      id: 2,
      name: t('sprint.completed'),
    },
    {
      id: 0,
      name: t('sprint.allLongStory'),
    },
  ]
  const dispatch = useDispatch()
  const { useKeys } = useKeyPress()
  useKeys('3', '/Report/Performance')
  useKeys('2', '/ProjectDetail/KanBan')
  const { sprintRefresh, sprintRightListRefresh } = useSelector(
    store => store.sprint,
  )
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
  const [userIds, setUserIds] = useState<number[]>([])
  const [categoryIds, setCategoryIds] = useState<number[]>([])
  const info = useGetloginInfo()
  const [focus, setFocus] = useState(false)
  const [endWidth, setEndWidth] = useState<any>()
  const leftRef = useRef<any>()
  const [activeKey, setActiveKey] = useState(0)
  const [isExpand, setIsExpand] = useState(true)
  const [isFilter, setIsFilter] = useState(false)
  const [currentFilter, setCurrentFilter] = useState(filterList[0])
  const [sprintModal, setSprintModal] = useState<{
    visible: boolean
    type: any
  }>({
    visible: false,
    type: 'create',
  })
  const [checkCommission, setCheckCommission] = useState([false, false])
  const [leftLoading, setLeftLoading] = useState(false)
  const [rightLoading, setRightLoading] = useState(false)
  const [checkList, setCheckList] = useState<boolean[]>([])
  const [searchKey, setSearchKey] = useState('')
  const { userPreferenceConfig } = useSelector(store => store.user)
  const { projectInfo, projectInfoValues, isUpdateAddWorkItem } = useSelector(
    store => store.project,
  )
  const searchRef = useRef<any>({
    orderkey: 'id',
    activeKey: 0,
    all: 1,
    order: 'desc',
    sprint_status: 1,
    is_long_story: 0,
    story_name: '',
    user_ids: [],
    category_id: [],
    left: [],
  })

  const [leftSprintList, setLeftSprintList] = useState<any>({
    list: [],
    unassigned_count: 0,
  })
  const [rightSprintList, setRightSprintList] = useState<any[]>([])

  const isCanEditSprint = !getIsPermission(
    projectInfo?.projectPermissions,
    'b/sprint',
  )

  const inform = [
    {
      key: 0,
      title: t('sprint.stepTitle1'),
      desc: t('sprint.stepDesc1'),
      img: 'https://mj-system-1308485183.cos.accelerate.myqcloud.com/public/2.7.1/sprint1.jpg',
    },
    {
      key: 1,
      title: t('sprint.stepTitle2'),
      desc: t('sprint.stepDesc2'),
      img: 'https://mj-system-1308485183.cos.accelerate.myqcloud.com/public/2.7.1/sprint2.jpg',
    },
    {
      key: 2,
      title: t('sprint.stepTitle3'),
      desc: t('sprint.stepDesc3'),
      img: 'https://mj-system-1308485183.cos.accelerate.myqcloud.com/public/2.7.1/sprint3.jpg',
    },
  ]

  const onDragLine = () => {
    document.onmousemove = e => {
      const sideDom = document.querySelector('#sidebar_yang')
      setFocus(true)
      if (
        e.clientX + 69 - (sideDom?.getBoundingClientRect().width ?? 0) <
        316
      ) {
        return
      }
      setEndWidth(
        e.clientX + 69 - (sideDom?.getBoundingClientRect().width ?? 0),
      )
    }
    document.onmouseup = () => {
      document.onmousemove = null
      document.onmouseup = null
      setFocus(false)
    }
  }

  const getRightDataList = async () => {
    const {
      orderkey,
      activeKey,
      all,
      order,
      is_long_story,
      is_no_creation_long_story,
      story_name,
      user_ids,
      category_id,
      list,
      checkList,
    } = searchRef.current
    const search = {
      orderkey,
      order,
      is_long_story,
      search: {
        all,
        project_id: projectId,
        story_name: story_name ? story_name : undefined,
        user_ids,
        category_id,
        resource_ids:
          activeKey === 1 && is_no_creation_long_story === 1
            ? []
            : list
                .filter((_: any, idx: any) => checkList[idx])
                .map((k: any) => k.id),
      },
    }
    setRightLoading(true)
    const result = await getSprintGroupList(search).finally(() => {
      setRightLoading(false)
    })
    if (result) {
      setRightSprintList(result)
    }
  }

  const getLeftDataList = async () => {
    const { orderkey, all, order, is_long_story, sprint_status } =
      searchRef.current
    const search = {
      order,
      orderkey,
      is_long_story,
      search: {
        all,
        sprint_status,
        project_id: projectId,
      },
    }
    setLeftLoading(true)
    const result = await getLeftSprintList(search).finally(() => {
      setLeftLoading(false)
    })
    if (result) {
      setLeftSprintList(result)
      searchRef.current.list = result.list ?? []
      const noRefresh = sessionStorage.getItem('noRefresh')
      if (!noRefresh) {
        const ck = new Array(result?.list?.length).fill(true)
        searchRef.current.checkList = ck
        setCheckList(ck)
      }
    }
  }

  const getAllData = async () => {
    await getLeftDataList()
    await getRightDataList()
  }

  const changeSprintTab = () => {
    setIsExpand(true)
    if (activeKey === 0) {
      return
    }
    sessionStorage.removeItem('noRefresh')
    setActiveKey(0)
    searchRef.current.activeKey = 0
    searchRef.current.sprint_status = filterList[0]?.id
    searchRef.current.is_long_story = 0
    setCurrentFilter(filterList[0])
    getAllData()
  }

  const changeStoryTab = () => {
    setIsExpand(true)
    if (activeKey === 1) {
      return
    }
    sessionStorage.removeItem('noRefresh')
    setActiveKey(1)
    searchRef.current.activeKey = 1
    searchRef.current.sprint_status = filterList1[0]?.id
    searchRef.current.is_long_story = 1
    setCurrentFilter(filterList1[0])
    getAllData()
  }

  const onChangeFilter = (item: any) => {
    sessionStorage.removeItem('noRefresh')
    setCurrentFilter(item)
    setIsFilter(false)
    searchRef.current.sprint_status = item.id
    getAllData()
  }

  useEffect(() => {
    sessionStorage.removeItem('noRefresh')
    getAllData()
    return () => {
      setRightSprintList([])
    }
  }, [])

  useEffect(() => {
    if (sprintRefresh > 0) {
      getAllData()
    }
  }, [sprintRefresh])

  useEffect(() => {
    if (sprintRightListRefresh > 0) {
      getRightDataList()
    }
  }, [sprintRightListRefresh])

  useEffect(() => {
    // 监听创建事务，刷新页面
    if (isUpdateAddWorkItem > 0) {
      getRightDataList()
    }
  }, [isUpdateAddWorkItem])

  const checkNoCreateLongStory = useCallback((val: boolean) => {
    searchRef.current.is_no_creation_long_story = val ? 1 : 0
    getRightDataList()
  }, [])

  const format = (arr: any) => {
    if (arr) {
      const newA = arr?.filter((j: any) => {
        return j.value === info
      })

      const newB = arr?.filter((j: any) => {
        return j.value !== info
      })

      return newA
        .map((i: any) => ({
          ...i,
          id: i.id,
          value: i.value,
          label: `${i.label}（${t('myself')}）`,
        }))
        .concat(newB)
    }
    return []
  }
  const filterContent = (
    <div className="filter">
      {(activeKey === 0 ? filterList : filterList1).map((item: any) => (
        <div
          className={`item ${item.id === currentFilter.id ? 'active' : ''}`}
          key={item.id}
          onClick={() => onChangeFilter(item)}
        >
          {item.name}
          <IconFont
            className="icon"
            type={currentFilter.id === item.id ? 'check' : ''}
          />
        </div>
      ))}
    </div>
  )

  const onVisibleChange = (visible: any) => {
    setIsFilter(visible)
  }
  const splitArrayByValue = (arr: any) => {
    const arr1 = arr.filter((x: any) => x.status === 1)
    // 已离职
    const arr2 = arr
      .filter((x: any) => x.status === 2)
      .map((item: any, index: number) => ({ ...item, isFirst: index === 0 }))
    return [...arr1, ...arr2]
  }

  const isLength =
    projectInfo?.id && projectInfo?.projectPermissions?.length <= 0

  return (
    <PermissionWrap
      auth="b/transaction/"
      permission={
        isLength
          ? ['0']
          : projectInfo?.projectPermissions?.map((i: any) => i.identity)
      }
    >
      <div>
        <SearchBox>
          <MyBreadcrumb headerParmas />
        </SearchBox>
        <ContentWrap>
          {isExpand ? (
            <Left
              style={{
                width: endWidth,
              }}
              ref={leftRef}
              active={focus}
            >
              <SprintDetailMouseDom
                active={focus}
                onMouseDown={onDragLine}
                style={{ right: 0 }}
              >
                <SprintDetailDragLine active={focus} className="line" />
              </SprintDetailMouseDom>
              <div className="header">
                <TabsWrap>
                  <div
                    className={`move ${activeKey === 1 ? 'left' : ''}`}
                  ></div>
                  <div
                    className={`tab1 ${activeKey === 0 ? 'active' : ''}`}
                    onClick={changeSprintTab}
                  >
                    {t('sprint.sprint')}
                  </div>
                  <div
                    className={`tab2 ${activeKey === 1 ? 'active' : ''}`}
                    onClick={changeStoryTab}
                  >
                    {t('sprint.longStory')}
                  </div>
                </TabsWrap>
                <RightIcon>
                  <Popover
                    trigger="click"
                    placement="bottomRight"
                    content={filterContent}
                    getPopupContainer={node => node}
                    visible={isFilter}
                    onVisibleChange={onVisibleChange}
                  >
                    <Tooltip title={t('common.search')}>
                      <IconBox isActive={isFilter}>
                        <IconFont type="filter" />
                      </IconBox>
                    </Tooltip>
                  </Popover>
                  <div
                    className="line"
                    style={isCanEditSprint ? {} : { visibility: 'hidden' }}
                  />
                  {/* {isEnd ? <div style={{ width: 32 }} /> : null} */}
                  {isExpand ? (
                    <Tooltip
                      style={{ display: isExpand ? 'block' : 'none' }}
                      onVisibleChange={() => {}}
                      getTooltipContainer={node => node}
                      title={isExpand ? t('common.collapseMenu') : ''}
                    >
                      <IconBox
                        onClick={() => {
                          setIsExpand(false)
                        }}
                      >
                        <IconFont type="outdent" color="black" />
                      </IconBox>
                    </Tooltip>
                  ) : (
                    <Tooltip
                      style={{ display: isExpand ? 'none' : 'block' }}
                      onVisibleChange={() => {}}
                      getTooltipContainer={node => node}
                      title={isExpand ? '' : t('common.openMenu')}
                    >
                      <IconBox
                        onClick={() => {
                          setIsExpand(true)
                        }}
                      >
                        <IconFont type="indent" color="black" />
                      </IconBox>
                    </Tooltip>
                  )}
                </RightIcon>
              </div>

              <div
                onClick={() => {
                  sessionStorage.removeItem('noRefresh')
                  if (activeKey === 0) {
                    setSprintModal({
                      visible: true,
                      type: 'create',
                    })
                  } else {
                    dispatch(
                      setAddWorkItemModal({
                        visible: true,
                        params: {
                          type: 3,
                          title: t('sprint.createTransaction'),
                          noDataCreate: true,
                          projectId,
                        },
                      }),
                    )
                  }
                }}
                style={{
                  margin: '0 24px  16px ',
                  background: '#6688FF',
                  borderRadius: '6px',
                  height: '32px',
                  cursor: 'pointer',
                  visibility: isCanEditSprint ? 'visible' : 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  gap: '8px',
                }}
              >
                <IconFont
                  style={{
                    fontSize: 16,
                    color: 'var(--neutral-n3) !important',
                  }}
                  type="plus"
                />
                {activeKey === 0
                  ? t('sprint.createSprint')
                  : t('sprint.createStory')}
              </div>

              <TabItemWrap>
                <Spin
                  spinning={leftLoading}
                  indicator={<NewLoadingTransition />}
                >
                  <TabItem
                    data={leftSprintList}
                    checkCommission={checkCommission}
                    setCheckCommission={setCheckCommission}
                    activeKey={activeKey}
                    currentFilter={currentFilter}
                    checkNoCreateLongStory={checkNoCreateLongStory}
                    setCheckList={setCheckList}
                    checkList={checkList}
                    searchRef={searchRef}
                    callback={() => {
                      getRightDataList()
                    }}
                  />
                </Spin>
              </TabItemWrap>
            </Left>
          ) : null}

          <Right>
            <div className="header">
              {!isExpand && (
                <TabsWrap style={{ margin: '0 16px 0 0' }}>
                  <div
                    className={`move ${activeKey === 1 ? 'left' : ''}`}
                  ></div>
                  <div
                    className={`tab1 ${activeKey === 0 ? 'active' : ''}`}
                    onClick={changeSprintTab}
                  >
                    {t('sprint.sprint')}
                  </div>
                  <div
                    className={`tab2 ${activeKey === 1 ? 'active' : ''}`}
                    onClick={changeStoryTab}
                  >
                    {t('sprint.longStory')}
                  </div>
                </TabsWrap>
              )}

              <div>
                <InputSearch
                  onChangeSearch={(val: any) => {
                    setSearchKey(val)
                    searchRef.current.story_name = val
                    getRightDataList()
                  }}
                  placeholder={t('sprint.searchTips')}
                  leftIcon
                  defaultValue={searchKey}
                />
              </div>
              <SelectWrapForList>
                <span style={{ margin: '0 16px', fontSize: '14px' }}>
                  {t('common.dealName')}
                </span>
                <CustomSelect
                  style={{ width: 148 }}
                  getPopupContainer={(node: any) => node}
                  width={216}
                  allowClear
                  optionFilterProp="label"
                  showArrow
                  popupClassName="aa"
                  showSearch
                  value={userIds}
                  renderChildren
                  options={format(
                    removeNull(projectInfoValues, 'user_name')?.map(
                      (k: any) => ({
                        label: k.content,
                        id: k.id,
                        value: k.id,
                      }),
                    ),
                  )}
                  onChange={(users: any) => {
                    searchRef.current.user_ids = users
                    setUserIds(users)
                    getRightDataList()
                  }}
                  onConfirm={() => null}
                >
                  {splitArrayByValue(
                    format(
                      removeNull(projectInfoValues, 'user_name')?.map(
                        (k: any) => ({
                          ...k,
                          label: k.content,
                          id: k.id,
                          value: k.id,
                        }),
                      ),
                    ),
                  ).map((item: any) => {
                    return (
                      <Select.Option
                        key={item.id}
                        value={item.id}
                        label={item.label}
                        className={
                          item.status === 2 && item.isFirst ? 'removeStyle' : ''
                        }
                      >
                        {item.label ?? item.content}
                        <span>{item.status === 1 ? '' : t('removed')}</span>
                      </Select.Option>
                    )
                  })}
                </CustomSelect>
              </SelectWrapForList>
              <CategorySelectWrap>
                <span className="title">{t('sprint.transactionType')}</span>
                <CategoryDropdown
                  w={296}
                  type
                  projectId={projectId}
                  value={categoryIds}
                  onChangeCallBack={(val: number[]) => {
                    searchRef.current.category_id = val
                    setCategoryIds(val)
                    getRightDataList()
                  }}
                  onClearCallback={() => {
                    searchRef.current.category_id = []
                    setCategoryIds([])
                    getRightDataList()
                  }}
                  mode="multiple"
                />
              </CategorySelectWrap>
              <ClearButton
                onClick={() => {
                  sessionStorage.removeItem('noRefresh')
                  searchRef.current.user_ids = []
                  setUserIds([])
                  searchRef.current.category_id = []
                  setCategoryIds([])
                  setCheckList(checkList.map(() => true))
                  searchRef.current.checkList = checkList.map(() => true)
                  setSearchKey('')
                  searchRef.current.story_name = ''
                  setCheckCommission([false, false])
                  getAllData()
                }}
              >
                {t('reset')}
              </ClearButton>
            </div>
            <Spin spinning={rightLoading} indicator={<NewLoadingTransition />}>
              <DragContent>
                <DndKitTable
                  activeKey={activeKey}
                  checkCommission={checkCommission}
                  rightSprintList={rightSprintList}
                  setRightSprintList={setRightSprintList}
                  callback={() => {
                    getRightDataList()
                  }}
                />
              </DragContent>
            </Spin>
          </Right>
        </ContentWrap>
        {userPreferenceConfig?.guidePageConfig?.sprint === 1 ? (
          <GuideModal
            width={784}
            height={670}
            inform={inform}
            close={async () => {
              await updateCompanyUserPreferenceConfig({
                id: userPreferenceConfig?.id,
                previewModel: userPreferenceConfig.previewModel,
                guidePageConfig: {
                  sprint: 2,
                },
              })
              dispatch(getLoginDetail())
            }}
          />
        ) : null}

        <CreateSprintModal
          projectId={projectId}
          type={sprintModal.type}
          visible={sprintModal.visible}
          onClose={() =>
            setSprintModal({
              visible: false,
              type: 'create',
            })
          }
        />
      </div>
    </PermissionWrap>
  )
}
export default SprintProjectSprint
