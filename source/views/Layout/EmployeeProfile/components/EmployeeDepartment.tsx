/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */
// eslint-disable-next-line no-param-reassign
import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useRef,
} from 'react'
import { getDepartmentUserList } from '@/services/setting'
import { DepartCheckboxAll, TreeWrap } from '../style'
import _ from 'lodash'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from '@store/index'
import { setStatistiDepartment } from '@store/project'
import CommonIconFont from '@/components/CommonIconFont'
import { getReportViewLogList } from '@/services/project'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { getParamsData } from '@/tools'
import useUpdateFilterParams from './hooks/useUpdateFilterParams'
const EmployeeDepartment = (props: any, ref: any) => {
  const [list, setList] = useState()
  const [usersData, setUsersData] = useState()
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const { statistiDepartment } = useSelector(store => store.project)
  const { filterParamsOverall } = useUpdateFilterParams()
  const {
    checkedKeys = [],
    departMentUserKey = [],
    expandedKeys = [],
  } = statistiDepartment ?? []
  const [checked, setChecked] = useState(false)
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const getlist = async () => {
    let res = await getDepartmentUserList({
      search: {
        project_id: '0',
        type: 'company',
        all: 1,
      },
      is_report: void 0,
    })
    // res[0].staffs[1].status = 2
    console.log(res)
    setUsersData(res)
    const cloneData = _.cloneDeep(res)
    const treeData = diffData(cloneData)
    setList(treeData[0]?.children)
    const users = getAllUserData(cloneData)
    // 从卡片进入和钉钉进入
    if (paramsData?.user_id) {
      setTimeout(() => {
        dispatch(
          setStatistiDepartment({
            ...statistiDepartment,
            list: users,
            checkedKeys: [paramsData?.user_id],
            departMentUserKey: [paramsData?.user_id],
            expandedKeys: [paramsData?.user_id],
          }),
        )
      })
      return
    }
    // 获取最近的日报第一个人
    const response = await getReportViewLogList({ page: 1, pagesize: 15 })
    const { list } = response?.data ?? {}
    const keys = Object.keys(response.data.list)
    const lastProject = keys.length && list[keys[0]][0]
    const { user_id } = lastProject ?? {}
    const { department_id } =
      users.find((item: any) => item.id === user_id) ?? {}

    setTimeout(() => {
      dispatch(
        setStatistiDepartment({
          ...statistiDepartment,
          list: users,
          checkedKeys: [user_id],
          departMentUserKey: [user_id],
          expandedKeys: [department_id],
        }),
      )
    })
  }
  useEffect(() => {
    if (!usersData) {
      return
    }
    const cloneData = _.cloneDeep(usersData)
    const treeData = diffData(cloneData)
    setList(treeData[0]?.children)
  }, [filterParamsOverall.personStatus])
  // 处理部门数据
  const diffData = (data: any) => {
    for (const item of data) {
      if (item.staffs && item.staffs.length && item.children) {
        item.children = [
          ...item.children,
          ...(filterParamsOverall.personStatus
            ? item.staffs
            : item.staffs.filter((item: any) => item.status === 1)),
        ]
      }
      if (item.staffs && item.staffs.length && !item.children) {
        item.children = [
          ...(filterParamsOverall.personStatus
            ? item.staffs
            : item.staffs.filter((item: any) => item.status === 1)),
        ]
      }
      if (item.children?.length) {
        diffData(item.children)
      }
    }
    return data
  }
  const getStaffsFromChildren = (children: any[]) => {
    return children.reduce((result, item) => {
      if (item.staffs) {
        result = result.concat(item.staffs)
      }
      if (item.children) {
        result = result.concat(getStaffsFromChildren(item.children))
      }
      return result
    }, [])
  }
  // 获取全部人员数据
  const getAllUserData = (data: any[]) => {
    const staffsArray = data.reduce((result, item) => {
      if (item.staffs) {
        result = result.concat(item.staffs)
      }
      if (item.children) {
        result = result.concat(getStaffsFromChildren(item.children))
      }
      return result
    }, [])
    return staffsArray
  }
  // 获取全部的key包含部门和人员
  const childrenIds = (data: any) => {
    return data.reduce((acc: any, current: any) => {
      acc = acc.concat(current.id)
      if (current.children) {
        acc = acc.concat(childrenIds(current.children))
      }
      return acc
    }, [])
  }
  // 全选
  const allChecked = (e: any) => {
    if (!usersData) {
      return
    }
    setChecked(e.target.checked)
    const newTreeData = _.cloneDeep(diffData(usersData))
    const newUser = _.cloneDeep(getAllUserData(usersData))
    const newCheckedKeys = newTreeData.reduce((acc: any, current: any) => {
      acc = acc.concat(current.id)
      if (current.children) {
        acc = acc.concat(childrenIds(current.children))
      }
      return acc
    }, [])

    dispatch(
      setStatistiDepartment({
        ...statistiDepartment,
        checkedKeys: e.target.checked ? [...new Set([...newCheckedKeys])] : [],
        departMentUserKey: e.target.checked
          ? [...new Set(newUser.map((item: any) => item.id))]
          : [],
      }),
    )
  }
  // 点击复选框
  const onCheck = (checkedKeys: any) => {
    dispatch(
      setStatistiDepartment({
        ...statistiDepartment,
        checkedKeys: checkedKeys,
        departMentUserKey: checkedKeys,
      }),
    )
  }
  // 点击展开
  const onExpand = (expandedExpandKeys: any, { expanded, node }: any) => {
    dispatch(
      setStatistiDepartment({
        ...statistiDepartment,
        expandedKeys: expanded
          ? expandedExpandKeys
          : expandedExpandKeys.filter((key: any) => key !== node.id),
      }),
    )
  }
  useEffect(() => {
    getlist()
  }, [])
  useEffect(() => {
    if (checkedKeys?.length === 0 && departMentUserKey?.length === 0) {
      setChecked(false)
    }
  }, [checkedKeys, departMentUserKey])
  // 获取最近的日报

  useImperativeHandle(ref, () => {
    return {
      usersData,
    }
  })
  return (
    <div style={{ height: '100%' }}>
      <DepartCheckboxAll checked={checked} onClick={allChecked}>
        {t('selectAll')}
        {}
      </DepartCheckboxAll>
      <TreeWrap
        checkable
        checkedKeys={checkedKeys}
        autoExpandParent
        onCheck={onCheck}
        treeData={list}
        expandedKeys={expandedKeys}
        onExpand={onExpand}
        switcherIcon={(e: any) => {
          return (
            <CommonIconFont
              type={e.expanded ? 'down-icon' : 'right-icon'}
              size={12}
              color="var(--neutral-n3)"
            />
          )
        }}
        fieldNames={{
          title: 'name',
          key: 'id',
          children: 'children',
        }}
      ></TreeWrap>
    </div>
  )
}

export default forwardRef(EmployeeDepartment)
