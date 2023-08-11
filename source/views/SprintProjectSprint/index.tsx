import React, { useCallback, useEffect, useRef, useState } from 'react'
import GuideModal from '@/components/GuideModal'
import guide_1 from './img/guide_1.jpg'
import guide_2 from './img/guide_2.jpg'
import guide_3 from './img/guide_3.jpg'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from '@store/index'
import styled from '@emotion/styled'
import InputSearch from '@/components/InputSearch'
import { CloseWrap, SelectWrapBedeck } from '@/components/StyleCommon'
import TabItem from './components/TabItem'
import IconFont from '@/components/IconFont'
import { Popover, Spin, Tooltip } from 'antd'
import CustomSelect from '@/components/MoreSelect'
import DndKitTable from './components/DndKitTable'
import MyBreadcrumb from '@/components/MyBreadcrumb'
import CreateSprintModal from './components/CreateSprintModal'
import {
  getRightSprintList,
  getLeftSprintList,
} from '@store/sprint/sprint.thunk'
import NewLoadingTransition from '@/components/NewLoadingTransition'
import { useSearchParams } from 'react-router-dom'
import {
  getIsPermission,
  getParamsData,
  onComputedPermission,
  removeNull,
} from '@/tools'
import CategoryDropdown from '@/components/CategoryDropdown'
import useKeyPress from '@/hooks/useKeyPress'
import { updateCompanyUserPreferenceConfig } from '@/services/user'
import { getLoginDetail } from '@store/user/user.thunk'
import { setAddWorkItemModal } from '@store/project'
import { setCheckList } from '@store/sprint'
import PermissionWrap from '@/components/PermissionWrap'
import {
  SprintDetailDragLine,
  SprintDetailMouseDom,
} from '@/components/DetailScreenModal/DemandDetail/style'

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
  padding: 20px 24px 20px 24px;
`
const ContentWrap = styled.div`
  display: flex;
  height: calc(100vh - 135px);
  position: relative;
`

const Left = styled.div<{ active: boolean }>`
  position: relative;
  width: 316px;
  box-sizing: border-box;
  height: 100%;
  border-right: ${props =>
    props.active ? '1px solid transparent' : '1px solid var(--neutral-n6-d1)'};
  .header {
    display: flex;
    justify-content: space-between;
    padding: 0px 24px;
  }
  padding-bottom: 52px;
`
const TabsWrap = styled.div`
  width: 128px;
  height: 32px;
  box-sizing: border-box;
  padding-left: 2px;
  margin-bottom: 16px;
  border-radius: 4px 4px 4px 4px;
  display: flex;
  align-items: center;
  font-size: 12px;
  color: var(--neutral-n2);
  cursor: pointer;
  position: relative;
  background: var(--hover-d2);
  .tab1 {
    width: 60px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    z-index: 2;
  }
  .tab2 {
    line-height: 28px;
    text-align: center;
    width: 68px;
    height: 28px;
    z-index: 2;
  }
  .active {
    color: var(--primary-d2);
    font-family: SiYuanMedium;
  }
  .move {
    background: #ffffff;
    position: absolute;
    width: 56px;
    height: 28px;
    transition: all 0.4s;
    border-radius: 4px;
  }

  .left {
    transform: translateX(56px);
    width: 68px;
  }
`

const RightIcon = styled.div`
  width: 84px;
  height: 32px;
  display: flex;
  align-items: center;
  .line {
    width: 1px;
    height: 16px;
    opacity: 1;
    background-color: var(--neutral-n6-d1);
    margin: 0px 10px;
  }
  .filter {
    width: 120px;
    padding: 4px 0px;
    background: #ffffff;
    box-shadow: 0px 0px 15px 6px rgba(0, 0, 0, 0.12);
    border-radius: 6px 6px 6px 6px;
    cursor: pointer;
    .item {
      height: 32px;
      padding: 0px 16px;
      font-size: 14px;
      font-family: SiYuanRegular;
      font-weight: 400;
      color: var(--neutral-n2);
      display: flex;
      align-items: center;
      justify-content: space-between;
      white-space: nowrap;
      &:hover {
        background: var(--hover-d3);
      }
    }
    .active {
      color: var(--primary-d2);
      svg {
        color: var(--primary-d2);
      }
    }
  }
`

const IconBox = styled(CloseWrap)<{ isActive?: boolean }>`
  font-size: 20px;
  cursor: pointer;
  padding: 6px;
  svg {
    color: ${props =>
      props.isActive ? 'var(--neutral-n1-d1)' : 'var(--neutral-n3)'};
  }
  background: ${props => (props.isActive ? 'var(--hover-d1)' : 'white')};
  &:hover {
    background: var(--hover-d1);
    svg {
      color: var(--neutral-n1-d1);
    }
  }
  &:active {
    background: var(--neutral-n6-d1);
    svg {
      color: var(--neutral-n1-d1);
    }
  }
`

const TabItemWrap = styled.div`
  height: 100%;
  padding: 0px 24px;
  overflow: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  .ant-spin-nested-loading img {
    margin-top: 200px;
  }
`

const Right = styled.div`
  overflow-x: scroll;
  overflow-y: hidden;
  height: 100%;
  flex: 1;
  .header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin-bottom: 24px;
    padding-left: 24px;
  }
  .ant-spin-nested-loading img.spinImg {
    margin-top: 120px;
  }
`
const SelectWrapForList = styled(SelectWrapBedeck)`
  margin-left: 16px;
  .ant-select-focused:not(.ant-select-disabled).ant-select:not(
      .ant-select-customize-input
    )
    .ant-select-selector {
    box-shadow: 0 0 0 0px;
  }
  .ant-select-selection-placeholder {
    color: var(--neutral-n4);
  }
`
const CategorySelectWrap = styled.div`
  min-width: 296px;
  height: 32px;
  display: flex;
  align-items: center;
  border: 1px solid var(--active);
  border-radius: 6px;
  margin-left: 16px;
  padding-left: 12px;
  box-sizing: border-box;
  .title {
    font-size: 14;
    white-space: nowrap;
    margin-right: 16px;
  }
`
const ClearButton = styled.div`
  width: 56px;
  height: 22px;
  font-size: 14px;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  color: var(--primary-d2);
  line-height: 22px;
  margin-left: 24px;
  white-space: nowrap;
  cursor: pointer;
`
const DragContent = styled.div`
  height: 100%;
  overflow-y: scroll;
  padding-bottom: 50px;
  background: var(--neutral-n8);
`

const CustomCloseWrap = styled(CloseWrap)`
  svg {
    color: var(--neutral-n3);
  }
  &:hover {
    background: var(--hover-d1);
    svg {
      color: var(--neutral-n1-d1);
    }
  }
  &:active {
    background: var(--neutral-n6-d1);
    svg {
      color: var(--neutral-n1-d1);
    }
  }
`

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
  useKeys('3', '/Report/PerformanceInsight')
  useKeys('2', '/SprintProjectManagement/KanBan')
  const {
    leftSprintList,
    checkList,
    rightLoading,
    leftLoading,
    sprintRefresh,
    sprintRightListRefresh,
  } = useSelector(store => store.sprint)

  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id

  const [searchObject, setSearchObject] = useState<any>({
    order: 'desc',
    orderkey: 'id',
    search: {
      all: 1,
      project_id: projectId,
    },
    is_long_story: 0,
  })
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
  const [leftSearchObject, setLeftSearchObject] = useState<any>({
    order: 'desc',
    orderkey: 'id',
    search: {
      all: 1,
      sprint_status: 1,
      project_id: projectId,
    },
    is_long_story: 0,
  })
  const [checkCommission, setCheckCommission] = useState([false, false])
  const { userPreferenceConfig, currentMenu } = useSelector(store => store.user)
  const { projectInfo, projectInfoValues, isUpdateAddWorkItem } = useSelector(
    store => store.project,
  )
  const isCanEditSprint = !getIsPermission(
    projectInfo?.projectPermissions,
    'b/sprint',
  )

  // 项目是否已经结束
  const isEnd = projectInfo?.status === 2

  const inform = [
    {
      key: 0,
      title: t('sprint.stepTitle1'),
      desc: t('sprint.stepDesc1'),
      img: guide_1,
    },
    {
      key: 1,
      title: t('sprint.stepTitle2'),
      desc: t('sprint.stepDesc2'),
      img: guide_2,
    },
    {
      key: 2,
      title: t('sprint.stepTitle3'),
      desc: t('sprint.stepDesc3'),
      img: guide_3,
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
  const changeSprintTab = () => {
    sessionStorage.removeItem('noRefresh')
    setActiveKey(0)
    setSearchObject({
      ...searchObject,
      is_long_story: 0,
    })
    setLeftSearchObject({
      ...leftSearchObject,
      search: {
        ...leftSearchObject.search,
        sprint_status: filterList[0]?.id,
      },
      is_long_story: 0,
    })
    setCurrentFilter(filterList[0])
  }

  const changeStoryTab = () => {
    sessionStorage.removeItem('noRefresh')
    setActiveKey(1)
    setSearchObject({
      ...searchObject,
      is_long_story: 1,
    })
    setLeftSearchObject({
      ...leftSearchObject,
      search: {
        ...leftSearchObject.search,
        sprint_status: filterList1[0]?.id,
      },
      is_long_story: 1,
    })
    setCurrentFilter(filterList1[0])
  }

  const onChangeFilter = (item: any) => {
    sessionStorage.removeItem('noRefresh')
    setCurrentFilter(item)
    setIsFilter(false)
    setLeftSearchObject({
      ...leftSearchObject,
      search: {
        ...searchObject.search,
        // eslint-disable-next-line no-undefined
        sprint_status: item.id,
      },
    })
  }

  useEffect(() => {
    sessionStorage.removeItem('noRefresh')
  }, [])

  useEffect(() => {
    dispatch(
      getRightSprintList({
        ...searchObject,
        search: {
          ...searchObject.search,
          resource_ids:
            activeKey === 1 && searchObject.is_no_creation_long_story === 1
              ? []
              : leftSprintList.list
                  .filter((_, idx) => checkList[idx])
                  .map(k => k.id),
        },
      }),
    )
  }, [searchObject, checkList])

  useEffect(() => {
    dispatch(getLeftSprintList(leftSearchObject))
  }, [leftSearchObject])

  useEffect(() => {
    if (sprintRefresh > 0) {
      dispatch(getLeftSprintList(leftSearchObject))
    }
  }, [sprintRefresh])

  useEffect(() => {
    if (sprintRightListRefresh > 0) {
      dispatch(
        getRightSprintList({
          ...searchObject,
          search: {
            ...searchObject.search,
            resource_ids: leftSprintList.list
              .filter((_, idx) => checkList[idx])
              .map(k => k.id),
          },
        }),
      )
    }
  }, [sprintRightListRefresh])

  useEffect(() => {
    // 监听创建事务，刷新页面
    dispatch(getLeftSprintList(leftSearchObject))
  }, [isUpdateAddWorkItem])

  const checkNoCreateLongStory = useCallback(
    (val: boolean) => {
      setSearchObject({
        ...searchObject,
        is_no_creation_long_story: val ? 1 : 0,
      })
    },
    [searchObject],
  )

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

  const resultAuth = onComputedPermission(
    currentMenu,
    '/ProjectManagement/Project',
  )

  const isLength =
    projectInfo?.id && projectInfo?.projectPermissions?.length <= 0

  return (
    <PermissionWrap
      auth={resultAuth ? 'b/transaction/' : '/ProjectManagement/Project'}
      permission={
        resultAuth
          ? isLength
            ? ['0']
            : projectInfo?.projectPermissions?.map((i: any) => i.identity)
          : currentMenu?.children?.map((i: any) => i.url)
      }
    >
      <div>
        <SearchBox>
          <MyBreadcrumb />
          <div>
            <InputSearch
              onChangeSearch={(val: any) => {
                setSearchObject({
                  ...searchObject,
                  search: {
                    ...searchObject.search,
                    story_name: val,
                  },
                })
              }}
              placeholder={t('sprint.searchTips')}
              leftIcon
            />
          </div>
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
                  {!isEnd && (
                    <Tooltip
                      title={
                        activeKey === 0
                          ? t('sprint.createSprint')
                          : t('sprint.createStory')
                      }
                    >
                      <CustomCloseWrap
                        style={isCanEditSprint ? {} : { visibility: 'hidden' }}
                        width={32}
                        height={32}
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
                      >
                        <IconFont
                          style={{
                            fontSize: 20,
                            color: 'var(--neutral-n3) !important',
                          }}
                          type="plus"
                        />
                      </CustomCloseWrap>
                    </Tooltip>
                  )}
                  {isEnd && <div style={{ width: 32 }} />}
                  <div
                    className="line"
                    style={
                      isCanEditSprint && !isEnd ? {} : { visibility: 'hidden' }
                    }
                  />
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
                </RightIcon>
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
                  />
                </Spin>
              </TabItemWrap>
            </Left>
          ) : null}

          <Right>
            <div className="header">
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
              <SelectWrapForList>
                <span style={{ margin: '0 16px', fontSize: '14px' }}>
                  {t('common.dealName')}
                </span>
                <CustomSelect
                  style={{ width: 148 }}
                  getPopupContainer={(node: any) => node}
                  allowClear
                  optionFilterProp="label"
                  showArrow
                  showSearch
                  value={searchObject.search?.user_ids}
                  options={removeNull(projectInfoValues, 'user_name')?.map(
                    (k: any) => ({
                      label: k.content,
                      id: k.id,
                      value: k.id,
                    }),
                  )}
                  onChange={(users: any) => {
                    setSearchObject({
                      ...searchObject,
                      search: {
                        ...searchObject.search,
                        user_ids: users,
                      },
                    })
                  }}
                  onConfirm={() => null}
                />
              </SelectWrapForList>
              <CategorySelectWrap>
                <span className="title">{t('sprint.transactionType')}</span>
                <CategoryDropdown
                  type
                  projectId={projectId}
                  value={searchObject.search?.category_id}
                  onChangeCallBack={(val: number[]) => {
                    setSearchObject({
                      ...searchObject,
                      search: {
                        ...searchObject.search,
                        category_id: val,
                      },
                    })
                  }}
                  onClearCallback={() => {
                    setSearchObject({
                      ...searchObject,
                      search: {
                        ...searchObject.search,
                        category_id: [],
                      },
                    })
                  }}
                  mode="multiple"
                />
              </CategorySelectWrap>
              <ClearButton
                onClick={() => {
                  sessionStorage.removeItem('noRefresh')
                  setSearchObject({
                    ...searchObject,
                    search: {
                      ...searchObject.search,
                      user_ids: [],
                      category_id: [],
                    },
                  })
                  dispatch(setCheckList(checkList.map(() => true)))
                  setCheckCommission([false, false])
                }}
              >
                {t('common.clearForm')}
              </ClearButton>
            </div>
            <Spin spinning={rightLoading} indicator={<NewLoadingTransition />}>
              <DragContent>
                <DndKitTable
                  activeKey={activeKey}
                  checkCommission={checkCommission}
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
