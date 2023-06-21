import React, { useEffect, useRef, useState } from 'react'
import GuideModal from '@/components/GuideModal'
import guide_1 from './img/guide_1.png'
import guide_2 from './img/guide_2.png'
import guide_3 from './img/guide_3.png'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from '@store/index'
import styled from '@emotion/styled'
import InputSearch from '@/components/InputSearch'
import {
  CloseWrap,
  DragLine,
  MouseDom,
  SelectWrapBedeck,
} from '@/components/StyleCommon'
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
import { getStaffList } from '@/services/staff'
import NewLoadingTransition from '@/components/NewLoadingTransition'
import { useSearchParams } from 'react-router-dom'
import { getParamsData } from '@/tools'
import CategoryDropdown from '@/components/CategoryDropdown'
import useKeyPress from '@/hooks/useKeyPress'
import { updateCompanyUserPreferenceConfig } from '@/services/user'
import { getLoginDetail } from '@store/user/user.thunk'
import { setAddWorkItemModal } from '@store/project'
import { setCheckList } from '@store/sprint'

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
  background: var(--hover-d2);
  border-radius: 4px 4px 4px 4px;
  display: flex;
  align-items: center;
  font-size: 12px;
  color: var(--neutral-n2);
  cursor: pointer;
  .tab1 {
    width: 56px;
    height: 28px;
    line-height: 28px;
    text-align: center;
  }
  .tab2 {
    line-height: 28px;
    text-align: center;
    width: 68px;
    height: 28px;
  }
  .active {
    background: #ffffff;
    color: var(--primary-d2);
  }
`

const RightIcon = styled.div`
  width: 84px;
  height: 32px;
  display: flex;
  align-items: center;
  .line {
    width: 0px;
    height: 16px;
    opacity: 1;
    border: 1px solid var(--neutral-n6-d1);
    margin: 0px 10px;
  }
  .filter {
    width: 120px;
    height: 104px;
    background: #ffffff;
    box-shadow: 0px 0px 15px 6px rgba(0, 0, 0, 0.12);
    border-radius: 6px 6px 6px 6px;
    cursor: pointer;
    .item {
      height: 32px;
      padding: 0px 16px;
      font-size: 14px;
      font-family: MiSans-Regular, MiSans;
      font-weight: 400;
      color: var(--neutral-n2);
      display: flex;
      align-items: center;
      justify-content: space-between;
      &:hover {
        background: var(--hover-d3);
      }
    }
    .active {
      color: var(--primary-d2);
    }
  }
`
const IconWrap = styled(IconFont)<{ isActive: any }>(
  {
    fontSize: 20,
    color: 'var(--neutral-n3)',
    cursor: 'pointer',
    padding: 6,
    borderRadius: 6,
    '&: hover': {
      color: 'var(--neutral-n1-d1)',
      background: 'var(--hover-d3)',
    },
  },
  ({ isActive }) => ({
    color: isActive ? 'var(--neutral-n1-d1)' : 'var(--neutral-n3)',
    background: isActive ? 'var(--hover-d3)' : 'white',
  }),
)

const IconBox = styled(IconFont)({
  fontSize: 20,
  color: 'var(--neutral-n3)',
  cursor: 'pointer',
  padding: 6,
  borderRadius: 6,
  '&: hover': {
    color: 'var(--neutral-n1-d1)',
    background: 'var(--hover-d3)',
  },
})

const TabItemWrap = styled.div`
  height: 100%;
  padding: 0px 24px;
  overflow: scroll;
  .ant-spin-nested-loading img {
    margin-top: 250px;
  }
`

const Right = styled.div`
  overflow-x: scroll;
  overflow-y: hidden;
  height: 100%;
  padding: 0px 0px 0px 24px;
  flex: 1;
  .header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin-bottom: 24px;
  }
  .ant-spin-nested-loading img.spinImg {
    margin-top: 250px;
  }
`
const SelectWrapForList = styled(SelectWrapBedeck)`
  margin-left: 16px;
`
const CategorySelectWrap = styled.div`
  width: 280px;
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
`

const filterList = [
  {
    id: 1,
    name: '未完成的',
  },
  {
    id: 2,
    name: '已完成的',
  },
  {
    id: 0,
    name: '全部冲刺',
  },
]

const filterList1 = [
  {
    id: 1,
    name: '未完成的',
  },
  {
    id: 2,
    name: '已完成的',
  },
  {
    id: 0,
    name: '全部长故事',
  },
]

const SprintProjectSprint: React.FC = () => {
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
  } = useSelector(store => store.sprint)
  const [t] = useTranslation()
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
  const [userOptions, setUserOptions] = useState<any[]>([])
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
  const [checkCommission, setCheckCommission] = useState(false)
  const { userPreferenceConfig } = useSelector(store => store.user)

  const inform = [
    {
      key: 0,
      title: '开始冲刺前的第一步',
      desc: '这里可以为积压的工作创建一个工作目标，提前来规划您的工作',
      img: guide_1,
    },
    {
      key: 1,
      title: '开始冲刺前的第二步',
      desc: '点击编辑冲刺，为您的冲刺团队准备好目标规则，开始工作吧',
      img: guide_2,
    },
    {
      key: 2,
      title: '开始冲刺前的第三步',
      desc: '为冲刺添加积压的工作，并点击开始冲刺来完成冲刺目标；另外您还可以为事务加上长故事定制功能集',
      img: guide_3,
    },
  ]

  // 拖动线条
  const onDragLine = () => {
    const startX = leftRef.current?.getBoundingClientRect()?.x
    let width: any
    document.onmousemove = e => {
      setFocus(true)
      width = e.clientX - startX
      setEndWidth(width - 4 < 316 ? 312 : width - 4)
      leftRef.current.style.transition = '0s'
      if (leftRef && leftRef.current) {
        leftRef.current.style.width = `${
          Number(width) < 316 ? 316 : Number(width)
        }px`
        leftRef.current.style.transition = 'all 0.3s'
      }
    }
    document.onmouseup = () => {
      document.onmousemove = null
      document.onmouseup = null
      setFocus(false)
    }
  }

  const changeSprintTab = () => {
    setActiveKey(0)
    setSearchObject({
      ...searchObject,
      is_long_story: 0,
    })
    setLeftSearchObject({
      ...leftSearchObject,
      is_long_story: 0,
    })
  }

  const changeStoryTab = () => {
    setActiveKey(1)
    setSearchObject({
      ...searchObject,
      is_long_story: 1,
    })
    setLeftSearchObject({
      ...leftSearchObject,
      is_long_story: 1,
    })
  }

  const onChangeFilter = (item: any) => {
    setCurrentFilter(item)
    setIsFilter(false)
    setSearchObject({
      ...searchObject,
      search: {
        ...searchObject.search,
        sprint_status: item.id,
      },
    })
    setLeftSearchObject({
      ...leftSearchObject,
      search: {
        ...searchObject.search,
        sprint_status: item.id,
      },
    })
  }

  const generateOptions = (item: any) => {
    return {
      label: item.name,
      value: item.id,
      id: item.id,
    }
  }
  const getUserList = async () => {
    try {
      const data = await getStaffList({ all: 1 })
      setUserOptions(data.map(generateOptions))
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    // 获取经办人数据
    getUserList()
    // // 获取本地存储上次操作的数据
    // const tempObj = localStorage.getItem(
    //   encryptPhp(JSON.stringify({ id: userInfo.id })),
    // )
    // if (tempObj) {
    //   const cacheObject = JSON.parse(tempObj)
    //   setActiveKey(cacheObject?.activeKey)
    //   setCurrentFilter(cacheObject?.currentFilter)
    //   dispatch(setCheckList(cacheObject?.checkList))
    // }
  }, [])

  useEffect(() => {
    if (checkList.length) {
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
  }, [searchObject, checkList])

  useEffect(() => {
    dispatch(getLeftSprintList(leftSearchObject))
  }, [leftSearchObject])

  useEffect(() => {
    if (sprintRefresh > 0) {
      dispatch(getLeftSprintList(leftSearchObject))
      dispatch(getRightSprintList(searchObject))
    }
  }, [sprintRefresh])

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

  return (
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
            placeholder="搜索事务或描述"
            leftIcon
          />
        </div>
      </SearchBox>
      <ContentWrap>
        {isExpand ? (
          <Left ref={leftRef} active={focus}>
            <MouseDom
              active={focus}
              onMouseDown={onDragLine}
              style={{ left: endWidth ? endWidth : 312 }}
            >
              <DragLine active={focus} className="line" />
            </MouseDom>
            <div className="header">
              <TabsWrap>
                <div
                  className={`tab1 ${activeKey === 0 ? 'active' : ''}`}
                  onClick={changeSprintTab}
                >
                  冲刺
                </div>
                <div
                  className={`tab2 ${activeKey === 1 ? 'active' : ''}`}
                  onClick={changeStoryTab}
                >
                  长故事
                </div>
              </TabsWrap>
              <RightIcon>
                <CloseWrap
                  width={24}
                  height={24}
                  onClick={() => {
                    if (activeKey === 0) {
                      setSprintModal({
                        visible: true,
                        type: 'create',
                      })
                    } else {
                      // Todo 新建长故事
                      dispatch(
                        setAddWorkItemModal({
                          visible: true,
                          params: {
                            type: 3,
                            title: '创建事务',
                            noDataCreate: true,
                          },
                        }),
                      )
                    }
                  }}
                >
                  <IconFont
                    style={{
                      fontSize: 18,
                      color: 'var(--neutral-n3)',
                    }}
                    type="plus"
                  />
                </CloseWrap>
                <div className="line" />
                <Popover
                  trigger="click"
                  placement="bottomRight"
                  content={filterContent}
                  getPopupContainer={node => node}
                  visible={isFilter}
                  onVisibleChange={onVisibleChange}
                >
                  <Tooltip title={t('common.search')}>
                    <IconWrap type="filter" isActive={isFilter} />
                  </Tooltip>
                </Popover>
              </RightIcon>
            </div>
            <TabItemWrap>
              <Spin spinning={leftLoading} indicator={<NewLoadingTransition />}>
                <TabItem
                  data={leftSprintList}
                  checkCommission={checkCommission}
                  setCheckCommission={setCheckCommission}
                  activeKey={activeKey}
                  currentFilter={currentFilter}
                />
                {/* <NoData
                  size
                  subText={
                    <div>
                      创建您的第一个冲刺，
                      <div style={{ marginTop: 0 }}>
                        以便开始为您的团队分解工作任务！
                      </div>
                    </div>
                  }
                  children={
                    <CommonButton
                      type="light"
                      style={{ marginTop: 24 }}
                      onClick={() => {
                        setSprintModal({
                          visible: true,
                          type: 'create',
                        })
                      }}
                    >
                      创建新的冲刺
                    </CommonButton>
                  }
                /> */}
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
                  type="outdent"
                  color="black"
                />
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
                  type="indent"
                  color="black"
                />
              </Tooltip>
            )}
            <SelectWrapForList>
              <span style={{ margin: '0 16px', fontSize: '14px' }}>经办人</span>
              <CustomSelect
                style={{ width: 148 }}
                getPopupContainer={(node: any) => node}
                allowClear
                optionFilterProp="label"
                showArrow
                showSearch
                value={searchObject.search?.user_id}
                options={userOptions}
                onChange={(users: any) => {
                  setSearchObject({
                    ...searchObject,
                    search: {
                      ...searchObject.search,
                      user_id: users,
                    },
                  })
                }}
                onConfirm={() => null}
              />
            </SelectWrapForList>
            <CategorySelectWrap>
              <span className="title">事务类型</span>
              <CategoryDropdown
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
                setSearchObject({
                  ...searchObject,
                  search: {
                    ...searchObject.search,
                    user_id: [],
                  },
                })
                dispatch(setCheckList(checkList.map(() => true)))
                setCheckCommission(false)
              }}
            >
              {t('common.clearForm')}
            </ClearButton>
          </div>
          <Spin spinning={rightLoading} indicator={<NewLoadingTransition />}>
            <DragContent>
              <DndKitTable checkCommission={checkCommission} />
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
  )
}
export default SprintProjectSprint
