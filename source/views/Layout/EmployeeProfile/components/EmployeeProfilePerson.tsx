/* eslint-disable no-undefined */
import { getMemberOverviewList } from '@store/employeeProfile/employeeProfile.thunk'
import { useDispatch, useSelector } from '@store/index'
import { useEffect, useState } from 'react'
import {
  CheckBoxWrap,
  CheckboxAll,
  CheckboxLi,
  CollapseHeaderWrap,
  MemberItem,
  PersonWrap,
  ReportButton,
  TabWrap,
} from '../style'
import { Checkbox, Collapse, Select } from 'antd'
import CommonUserAvatar from '@/components/CommonUserAvatar'
import { setContrastDrawer } from '@store/employeeProfile'
import { useTranslation } from 'react-i18next'
import MoreSelect from '@/components/MoreSelect'
import { useSearchParams } from 'react-router-dom'
import EmployeeDepartment from './EmployeeDepartment'
import { setStatistiDepartment } from '@store/project'
import CommonIconFont from '@/components/CommonIconFont'

interface EmployeeProfilePersonProps {
  onChangeFilter(value: any): void
  filterParams: any
}
// 折叠头部
const CollapseHeader = (props: any) => {
  const [t] = useTranslation()
  const {
    item,
    onChangeKeys,
    activeKey,
    onChangeSelectKeys,
    selectKeys,
    setUserKeys,
    userKeys,
  } = props
  const [isVisible, setIsVisible] = useState(false)
  const [projectKey, setProjectKey] = useState<any[]>([])
  // 默认选择全部 - 迭代
  const [normal, setNormal] = useState<any[]>([{ id: 0, projectId: 0 }])
  // 全选状态
  const [checkAll, setCheckAll] = useState(false)
  // 半选状态
  const [indeterminate, setIndeterminate] = useState(false)
  //
  // 项目权限-勾选
  const onChangeCheckbox = (e: any) => {
    const { checked } = e.target
    // 全选的key
    const resultKeysCheckEd = [
      ...new Set([
        ...selectKeys,
        ...props.item?.member_list?.map((k: any) => k.id),
      ]),
    ]
    // 取消全选的key
    const resultKeysNotCheckEd = props.selectKeys.filter(
      (object: any) =>
        !props.item?.member_list?.some(
          (otherObject: any) => otherObject.id === object,
        ),
    )
    onChangeSelectKeys(checked ? resultKeysCheckEd : resultKeysNotCheckEd)
  }

  // 点击名称折叠展开
  const onClickName = () => {
    onChangeKeys(activeKey?.includes(item.id), item.id)
  }

  // 修改选中迭代
  const onChangeIteration = (
    id: number,
    memberList?: any,
    projectId?: number,
  ) => {
    let iterationValues
    if (id === 0) {
      iterationValues = [{ id: 0, projectId: 0 }]
      setNormal(iterationValues)
    } else {
      iterationValues = normal
        ?.map((i: any) => i.projectId)
        ?.includes(projectId)
        ? normal?.map((i: any) => i.id)?.includes(id)
          ? normal?.filter((i: any) => i.id !== id)
          : [...new Set([...normal, ...[{ id, projectId }]])]?.filter(
              (i: any) => i.id !== 0,
            )
        : [{ id, projectId }]
      setNormal(iterationValues)
    }
    // 向上返回筛选条件
    props.onChangeIteration(
      iterationValues,
      memberList?.map((i: any) => i.id),
    )
  }
  // 根据筛选条件选中对应的人分组
  useEffect(() => {
    const { user_ids } = props.filterParams
    // setUserKeys(user_ids)
    setNormal(props.filterParams?.iteration ?? [{ id: 0, projectId: 0 }])
  }, [props.filterParams])

  useEffect(() => {
    const resultList = props.selectKeys.filter((object: any) =>
      props.item?.member_list?.some(
        (otherObject: any) => otherObject.id === object,
      ),
    )
    setIndeterminate(
      resultList?.length !== props.item?.member_list?.length &&
        resultList?.length !== 0,
    )
    setCheckAll(resultList?.length === props.item?.member_list?.length)
  }, [props.selectKeys])

  useEffect(() => {
    if (userKeys?.length === 0 || !userKeys) {
      return
    }

    for (const key of userKeys) {
      const [project_id, user_id] = key.split('_')
      const currentProjectUserIds = item.member_list?.filter((item: any) => {
        const { id } = item
        const [pro_id, user_id] = id.split('_')
        return pro_id === project_id
      })
    }
  }, [userKeys])
  return (
    <CollapseHeaderWrap>
      <div className="left">
        <Checkbox
          onChange={e => {
            const userIds = item.member_list.map((item: any) => item.id)
            setProjectKey((pre: any) => {
              if (e.target.checked) {
                setUserKeys((pre: any) => {
                  return [...pre, ...userIds]
                })
                return [...pre, item.id]
              }
              setUserKeys((pre: any) => {
                return [...pre.filter((item: any) => !userIds.includes(item))]
              })
              return [...pre, item.id].filter(i => i !== item.id)
            })
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
  // 折叠展开key
  const [activeKey, setActiveKey] = useState<any>([])
  const [tabActiveKey, setTabActiveKey] = useState('project')
  const { statistiDepartment } = useSelector(store => store.project)
  const { list = [], expandedKeys = [] } = statistiDepartment ?? {}
  // 点击全选
  const onAllChecked = (e: any) => {
    const { checked } = e.target
    // setSelectKeys(checked ? allMemberList?.map((k: any) => k.id) : [])
    const data = getAllUser(allMemberList)
    setIndeterminate(false)
    setCheckAll(checked)
    setUserKeys(checked ? data?.map((k: any) => k.id) : [])
    // props.onChangeFilter({
    //   ...props?.filterParams,
    //   ...{
    //     user_ids: checked ? allMemberList?.map((k: any) => k.id) : [],
    //   },
    // })
    setSearchParams({})
  }
  // 获取所有的人员
  const getAllUser = (data: any) => {
    const arry: any = []
    for (let item of data) {
      arry.push(...item.member_list)
    }
    return arry
  }
  // 点击勾选或者取消人员
  const onItemChecked = (id: number) => {
    let resultKeys: any = []
    // 如果勾选中不存在，则添加
    if (selectKeys?.includes(id)) {
      resultKeys = selectKeys?.filter((i: number) => i !== id)
    } else {
      resultKeys = [...selectKeys, ...[id]]
    }
    setSelectKeys(resultKeys)
    setIndeterminate(
      resultKeys?.length !== allMemberList?.length && resultKeys?.length !== 0,
    )
    setCheckAll(resultKeys?.length === allMemberList?.length)
    props.onChangeFilter({
      ...props?.filterParams,
      ...{
        user_ids: resultKeys,
      },
    })
    setSearchParams({})
  }

  // 打开对比报告
  const onOpenContrast = () => {
    dispatch(setContrastDrawer({ visible: true }))
  }

  // 选择人员
  const onSelectMember = (users: any) => {
    const resultUsers = users ?? []
    setSelectKeys(resultUsers)
    setIndeterminate(
      resultUsers?.length !== allMemberList?.length &&
        resultUsers?.length !== 0,
    )
    setCheckAll(resultUsers?.length === allMemberList?.length)
    props.onChangeFilter({
      ...props?.filterParams,
      ...{
        user_ids: resultUsers,
      },
    })
  }

  useEffect(() => {
    dispatch(getMemberOverviewList())
  }, [])

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
    if (tabActiveKey === 'project') {
      params = userKeys?.map((item: any) => {
        const [project_id, user_id] = item.split('_')
        return {
          project_id,
          user_id,
        }
      })
    }
    if (tabActiveKey === 'department') {
      params = expandedKeys.map((item: any) => {
        return {
          user_id: item,
        }
      })
    }
    props.onChangeFilter({
      ...props?.filterParams,
      ...{
        user_ids: params,
      },
    })
  }, [userKeys, expandedKeys])
  useEffect(() => {
    const { user_ids } = props.filterParams
    // setUserKeys(user_ids)
  }, [props.filterParams])
  // const projectEle = (
  //   <div>
  //     <CheckboxAll
  //       checked={checkAll}
  //       indeterminate={indeterminate}
  //       onClick={onAllChecked}
  //     >
  //       {t('selectAll')}
  //     </CheckboxAll>
  //     <CheckBoxWrap>
  //       {allMemberList?.map((i: any) => (
  //         <CheckboxLi key={i.id}>
  //           <Checkbox
  //             checked={selectKeys?.includes(i.id)}
  //             onClick={() => onItemChecked(i.id)}
  //           >
  //             <div className="content">
  //               <CommonUserAvatar avatar={i.avatar} />
  //               <div className="nameInfo">{i.name}</div>
  //             </div>
  //           </Checkbox>
  //           {i.member_list?.map((user: any) => {
  //             return (
  //               <CheckboxLi key={user.id}>
  //                 <Checkbox
  //                   checked={selectKeys?.includes(i.id)}
  //                   onClick={() => onItemChecked(i.id)}
  //                 >
  //                   <div className="content">
  //                     <CommonUserAvatar avatar={user.avatar} />
  //                     <div className="nameInfo">
  //                       {user.name}（{user.position?.name || '--'}）
  //                     </div>
  //                   </div>
  //                 </Checkbox>
  //               </CheckboxLi>
  //             )
  //           })}
  //         </CheckboxLi>
  //       ))}
  //     </CheckBoxWrap>
  //   </div>
  // )
  // 点击图标展开或折叠
  const onClickIcon = (e: any) => {
    const key = Number(e.panelKey)
    setActiveKey(
      e.isActive
        ? activeKey?.filter((i: any) => i !== key)
        : [...new Set([...activeKey, ...[key]])],
    )
  }
  const projectEle = (
    <div>
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
                  onChangeSelectKeys={() => {}}
                  filterParams={props.filterParams}
                  item={i}
                  onChangeKeys={(state: boolean, key: number) => {}}
                  activeKey={activeKey}
                  onChangeIteration={() => {}}
                  setUserKeys={setUserKeys}
                  userKeys={userKeys}
                />
              }
              key={i.id}
            >
              {i.member_list?.map((i: any) => (
                <MemberItem key={i.id} onClick={() => {}}>
                  <Checkbox
                    checked={userKeys?.includes(i.id)}
                    onChange={e => {
                      setUserKeys((pre: any) => {
                        if (e.target.checked) {
                          return [...pre, i.id]
                        }
                        return [...pre, i.id].filter(item => item !== i.id)
                      })
                    }}
                  />
                  <div className="info">
                    <CommonUserAvatar size="small" avatar={i.avatar} />
                    <span className="name">
                      {i.name}（{i?.department?.name}-{i?.position?.name}）
                    </span>
                  </div>
                </MemberItem>
              ))}
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
        expandedKeys: key,
      }),
    )
  }
  return (
    <PersonWrap>
      <ReportButton onClick={onOpenContrast}>
        {t('comparisonReport')}
      </ReportButton>
      <div className="input">
        {tabActiveKey === 'project' ? (
          <MoreSelect
            placeholder={t('searchMembers')}
            onConfirm={() => null}
            onChange={onSelectMember}
            value={selectKeys}
            options={getAllUser(allMemberList)?.map((k: any) => ({
              label: k.name,
              value: k.id,
              id: k.id,
            }))}
          />
        ) : (
          <Select
            placeholder={t('searchMembers')}
            onChange={onChangeDepartment}
            value={expandedKeys}
            options={list}
            fieldNames={{
              label: 'name',
              value: 'id',
            }}
            allowClear
            mode="multiple"
            showSearch
            maxTagCount={1}
          ></Select>
        )}
      </div>
      <div className="label">
        {currentKey?.name}（{props?.filterParams?.user_ids?.length}）
      </div>
      <TabWrap
        items={[
          { label: '项目组', key: 'project', children: projectEle },
          {
            label: '部门',
            key: 'department',
            children: <EmployeeDepartment></EmployeeDepartment>,
          },
        ]}
        activeKey={tabActiveKey}
        onChange={key => {
          setTabActiveKey(key)
        }}
      ></TabWrap>
    </PersonWrap>
  )
}

export default EmployeeProfilePerson
