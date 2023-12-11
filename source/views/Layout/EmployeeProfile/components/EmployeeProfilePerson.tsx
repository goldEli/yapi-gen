/* eslint-disable prefer-destructuring */
/* eslint-disable no-undefined */
import { getMemberOverviewList } from '@store/employeeProfile/employeeProfile.thunk'
import { useDispatch, useSelector } from '@store/index'
import { useEffect, useState } from 'react'
import {
  CheckBoxWrap,
  CheckboxAll,
  CollapseHeaderWrap,
  MemberItem,
  PersonWrap,
  ReportButton,
  TabsWrap,
} from '../style'
import { Checkbox, Collapse, Radio, Select } from 'antd'
import CommonUserAvatar from '@/components/CommonUserAvatar'
import { setContrastDrawer } from '@store/employeeProfile'
import { useTranslation } from 'react-i18next'
import MoreSelect from '@/components/MoreSelect'
import { useSearchParams } from 'react-router-dom'
import EmployeeDepartment from './EmployeeDepartment'
import { setStatistiDepartment } from '@store/project'
import CommonIconFont from '@/components/CommonIconFont'
import _ from 'lodash'
import { getParamsData } from '@/tools'
import { getRecentProject } from '@/services/project'
import useUpdateFilterParams from './hooks/useUpdateFilterParams'
interface EmployeeProfilePersonProps {
  onChangeFilter?(value: any): void
}
// 折叠头部
const CollapseHeader = (props: any) => {
  const [t] = useTranslation()
  const { item, onChangeKeys, activeKey, setUserKeys, userKeys } = props
  const [projectKey, setProjectKey] = useState<any[]>([props.projectKey])
  // 默认选择全部 - 迭代
  const [normal, setNormal] = useState<any[]>([{ id: 0, projectId: 0 }])
  // 全选状态
  const [checkAll, setCheckAll] = useState(false)
  // 半选状态
  const [indeterminate, setIndeterminate] = useState(false)
  const { currentClickNumber, filterParamsOverall } = useSelector(
    store => store.employeeProfile,
  )
  // 点击名称折叠展开
  const onClickName = () => {}

  // 根据筛选条件选中对应的人分组
  useEffect(() => {
    setNormal(props.filterParams?.iteration ?? [{ id: 0, projectId: 0 }])
  }, [props.filterParams])

  // useEffect(() => {
  //   const resultList = props.selectKeys?.filter((object: any) =>
  //     props.item?.member_list?.some(
  //       (otherObject: any) => otherObject.id === object,
  //     ),
  //   )
  //   setIndeterminate(
  //     resultList?.length !== props.item?.member_list?.length &&
  //     resultList?.length !== 0,
  //   )
  //   console.log(111111, projectKey)
  //   setCheckAll(resultList?.length === props.item?.member_list?.length)
  // }, [props.userKeys])

  useEffect(() => {
    if (!userKeys) {
      return
    }
    if (userKeys.length === 0) {
      setProjectKey([])
      return
    }
    const resultList = props.selectKeys?.filter((object: any) =>
      props.item?.member_list?.some(
        (otherObject: any) => otherObject.id === object,
      ),
    )
    setIndeterminate(
      resultList?.length !== props.item?.member_list?.length &&
        resultList?.length !== 0,
    )
    setCheckAll(resultList?.length === props.item?.member_list?.length)
    for (const key of userKeys) {
      const [project_id] = key.split('_')
      const currentProjectUserIds = item.member_list
        ?.filter((item: any) => {
          const { id } = item
          const [pro_id] = id.split('_')
          return pro_id === project_id
        })
        ?.map((ele: any) => {
          const [project_id] = ele.id.split('_')
          return parseInt(project_id, 10)
        })
      setProjectKey(pre => [...pre, ...new Set([...currentProjectUserIds])])
    }
  }, [userKeys])
  useEffect(() => {
    if (currentClickNumber === 0) {
      return
    }
    const { user_ids } = filterParamsOverall ?? {}
    if (
      user_ids?.some(
        (item: any) => item.project_id === 'undefined' || !item.project_id,
      )
    ) {
      return
    }
    const userKeys = user_ids?.map(
      (item: any) => `${item.project_id}_${item.user_id}`,
    )
    if (!userKeys) {
      return
    }
    const projectKeys = user_ids?.map((item: any) => item.project_id)
    setUserKeys(userKeys)
    setProjectKey(projectKeys)
  }, [currentClickNumber])
  // 查询最近的项目

  return (
    <CollapseHeaderWrap>
      <div className="left">
        <Checkbox
          onChange={e => {
            const userIds = item.member_list.map((item: any) => item.id)
            setProjectKey((pre: any) => {
              if (e.target.checked) {
                setUserKeys((pre = []) => {
                  return [...pre, ...userIds]
                })
                return [...pre, item.id]
              }
              setUserKeys((pre: any) => {
                return [...pre?.filter((item: any) => !userIds.includes(item))]
              })
              return [...pre, item.id].filter(i => i !== item.id)
            })
            const resultKeysNotCheckEd = props.userKeys?.filter(
              (object: any) =>
                !props.item?.member_list?.some(
                  (otherObject: any) => otherObject.id === object,
                ),
            )
            props.onChangeProjectKeys(resultKeysNotCheckEd)
          }}
          checked={projectKey?.includes(item.id)}
          indeterminate={indeterminate}
        />
        <div className="name" onClick={onClickName}>
          {item.name}
        </div>
      </div>
    </CollapseHeaderWrap>
  )
}
const EmployeeProfilePerson = (props: EmployeeProfilePersonProps) => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const { updateFilterParams, filterParamsOverall, restRouter } =
    useUpdateFilterParams()
  const [searchParamsUrl] = useSearchParams()
  const paramsData = getParamsData(searchParamsUrl)
  // 全选状态
  const [checkAll, setCheckAll] = useState(false)
  // 半选状态
  const [indeterminate, setIndeterminate] = useState(false)
  // 选中的key
  const [selectKeys, setSelectKeys] = useState<any>([])
  const [searchParams, setSearchParams] = useSearchParams()
  const { allMemberList, currentKey } = useSelector(
    store => store.employeeProfile,
  )
  // 获取选中的keys
  const [userKeys, setUserKeys] = useState<any>([])
  // 获取选中的keys
  const [projectKey, setProjectKey] = useState<any>([])
  // 折叠展开key
  const [activeKey, setActiveKey] = useState<any>([])
  const [tabActiveKey, setTabActiveKey] = useState('project')
  const { statistiDepartment } = useSelector(store => store.project)
  const tabs = [
    { name: t('projectTeam'), value: 'project' },
    // { name: t('department1'), value: 'department' },
  ]
  const {
    list = [],
    checkedKeys = [],
    departMentUserKey = [],
  } = statistiDepartment ?? {}
  // 点击全选
  const onAllChecked = (e: any) => {
    const { checked } = e.target
    const data = getAllUser(allMemberList)
    setIndeterminate(false)
    setCheckAll(checked)
    setUserKeys(checked ? data?.map((k: any) => k.id) : [])
    setSearchParams({})
  }
  // 获取所有的人员
  const getAllUser = (data: any) => {
    const array: any = []
    for (const item of data) {
      for (let i of item.member_list) {
        i = { ...i, project_name: item.name }
        array.push(i)
      }
    }
    return array
  }
  // 选择人员
  const onSelectMember = (users: any) => {
    const resultUsers = users ?? []
    setUserKeys(resultUsers)
    setIndeterminate(
      resultUsers?.length !== allMemberList?.length &&
        resultUsers?.length !== 0,
    )
    setCheckAll(resultUsers?.length === allMemberList?.length)
  }
  useEffect(() => {
    dispatch(getMemberOverviewList())
  }, [])

  // 获取最近的项目
  useEffect(() => {
    // 从钉钉或者卡片进入
    const { user_id, start_time, end_time } = paramsData ?? {}
    // 从钉钉或者卡片进入
    if (user_id) {
      // setUserKeys([paramsData?.user_id])
      const allUsers = getAllUser(_.clone(allMemberList))
      const users = allUsers.filter((item: any) => {
        const [p_id, user_id] = item.id.split('_')
        return parseInt(paramsData?.user_id, 10) === parseInt(user_id, 10)
      })
      const usersKey = users.map((item: any) => item.id)
      setUserKeys(usersKey)
      // 获取需要展开的人员
      const activekey: any[] = []
      updateFilterParams({
        user_ids: usersKey.map((item: any) => {
          const [project_id, user_id] = item.split('_')
          activekey.push(parseInt(project_id, 10))
          return {
            project_id: parseInt(project_id, 10),
            user_id: parseInt(user_id, 10),
          }
        }),
      })
      setActiveKey(activekey)
      return
    }
    const getList = async () => {
      const res = await getRecentProject({ page: 1, pagesize: 15 })
      const { list } = res?.data ?? {}
      const keys = Object.keys(res.data.list)
      const lastProject = list[keys[0]][0]
      const {
        actionable: { id },
      } = lastProject ?? {}
      setProjectKey(id)
      const activekey: any[] = []
      const userKeys = allMemberList
        .find(item => item.id === id)
        ?.member_list.map((member: any) => member.id)
      setUserKeys(userKeys)
      updateFilterParams({
        user_ids: userKeys?.map((item: any) => {
          const [project_id, user_id] = item.split('_')
          activekey.push(parseInt(project_id, 10))
          return {
            project_id: parseInt(project_id, 10),
            user_id: parseInt(user_id, 10),
          }
        }),
      })
      setActiveKey(activekey)
    }
    // 默认展开第一级别
    // setActiveKey([_.cloneDeep(allMemberList).shift()?.id])
    getList()
  }, [allMemberList])
  useEffect(() => {
    if (currentKey?.key && allMemberList?.length > 0) {
      setSelectKeys(currentKey?.user_ids)
      setIndeterminate(
        currentKey?.total !== allMemberList?.length && currentKey?.total !== 0,
      )
      setCheckAll(currentKey?.total === allMemberList?.length)
    }
  }, [currentKey, allMemberList])
  // 监听选中的成员
  useEffect(() => {
    let params: any = []
    if (filterParamsOverall.tabType === 'project') {
      params = userKeys?.map((item: any) => {
        const [project_id, user_id] = item.split('_')
        return {
          project_id: parseInt(project_id, 10),
          user_id: parseInt(user_id, 10),
        }
      })
    }
    if (filterParamsOverall.tabType === 'department') {
      params = checkedKeys.map((item: any) => {
        return {
          user_id: item,
        }
      })
    }
    updateFilterParams({ user_ids: params })
  }, [userKeys, checkedKeys, filterParamsOverall.tabType])
  // 点击图标展开或折叠
  const onClickIcon = (e: any) => {
    console.log('activeKey', activeKey)
    const key = Number(e.panelKey)
    setActiveKey(
      e.isActive
        ? activeKey?.filter((i: any) => i !== key)
        : [...new Set([...activeKey, ...[key]])],
    )
  }
  const projectEle = (
    <div style={{ height: '100%' }}>
      <CheckboxAll
        checked={checkAll}
        indeterminate={indeterminate}
        onClick={onAllChecked}
      >
        {t('selectAll')}
      </CheckboxAll>
      <CheckBoxWrap>
        <Collapse
          expandIcon={e => (
            <CommonIconFont
              type={e.isActive ? 'down-icon' : 'right-icon'}
              size={12}
              color="var(--neutral-n3)"
              onClick={() => onClickIcon(e)}
            />
          )}
          activeKey={activeKey}
        >
          {allMemberList?.map((i: any) => (
            <Collapse.Panel
              header={
                <CollapseHeader
                  selectKeys={selectKeys}
                  filterParams={filterParamsOverall}
                  item={i}
                  setUserKeys={setUserKeys}
                  userKeys={userKeys}
                  onChangeProjectKeys={(keys: any[]) => {
                    restRouter()
                    setIndeterminate(
                      keys?.length !== getAllUser(allMemberList)?.length,
                    )
                    setCheckAll(
                      keys?.length === getAllUser(allMemberList)?.length,
                    )
                  }}
                  projectKey={projectKey}
                />
              }
              key={i.id}
            >
              {filterParamsOverall.personStatus
                ? i.member_list?.map((i: any) => {
                    return (
                      <MemberItem key={i.id} onClick={() => {}}>
                        <Checkbox
                          checked={userKeys?.includes(i.id)}
                          onChange={e => {
                            restRouter()
                            setUserKeys((pre: any) => {
                              if (e.target.checked) {
                                return [...pre, i.id]
                              }
                              return [...pre, i.id].filter(
                                item => item !== i.id,
                              )
                            })
                          }}
                        />
                        <div className="info">
                          <CommonUserAvatar size="small" avatar={i.avatar} />
                          <span className="name">
                            {i.name}（{i?.department?.name}-{i?.position?.name}
                            ）
                          </span>
                        </div>
                      </MemberItem>
                    )
                  })
                : i.member_list
                    ?.filter((item: any) => item.status === 1)
                    ?.map((i: any) => {
                      return (
                        <MemberItem key={i.id} onClick={() => {}}>
                          <Checkbox
                            checked={userKeys?.includes(i.id)}
                            onChange={e => {
                              restRouter()
                              setUserKeys((pre: any) => {
                                if (e.target.checked) {
                                  return [...pre, i.id]
                                }
                                return [...pre, i.id].filter(
                                  item => item !== i.id,
                                )
                              })
                            }}
                          />
                          <div className="info">
                            <CommonUserAvatar size="small" avatar={i.avatar} />
                            <span className="name">
                              {i.name}（{i?.department?.name}-
                              {i?.position?.name}）
                            </span>
                          </div>
                        </MemberItem>
                      )
                    })}
            </Collapse.Panel>
          ))}
        </Collapse>
      </CheckBoxWrap>
    </div>
  )
  const onChangeDepartment = (key: any) => {
    dispatch(
      setStatistiDepartment({
        ...statistiDepartment,
        checkedKeys: key,
        departMentUserKey: key,
      }),
    )
  }
  return (
    <PersonWrap>
      <div className="input">
        {tabActiveKey === 'project' ? (
          <MoreSelect
            placeholder={t('searchMembers')}
            onConfirm={() => null}
            onChange={onSelectMember}
            value={userKeys}
            options={getAllUser(allMemberList)}
            renderChildren
          >
            {getAllUser(allMemberList)?.map((i: any) => (
              <Select.Option key={i.id} value={i.id} label={i.name}>
                {i.name}
                <span role="img" aria-label={i.id}>
                  （{i.project_name}）
                </span>
              </Select.Option>
            ))}
          </MoreSelect>
        ) : (
          <MoreSelect
            placeholder={t('searchMembers')}
            onChange={onChangeDepartment}
            value={departMentUserKey}
            options={_.cloneDeep(list)}
            renderChildren
          >
            {list?.map((i: any) => (
              <Select.Option key={i.id} value={i.id} label={i.name}>
                {i.name}
              </Select.Option>
            ))}
          </MoreSelect>
        )}
      </div>

      <TabsWrap style={{ margin: '0 16px 0 0' }}>
        {tabs.map(item => {
          return (
            <div
              key={item.value}
              className="item-tab"
              onClick={() => {
                updateFilterParams({ tabType: item.value })
                setTabActiveKey(item.value)
              }}
            >
              {tabActiveKey === item.value ? (
                <div className="cover"> {item.name}</div>
              ) : null}
              {item.name}
            </div>
          )
        })}
      </TabsWrap>
      {tabActiveKey === 'project' ? (
        projectEle
      ) : (
        <EmployeeDepartment></EmployeeDepartment>
      )}
    </PersonWrap>
  )
}

export default EmployeeProfilePerson
