/* eslint-disable no-param-reassign */
// eslint-disable-next-line no-param-reassign
import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react'
import { getDepartmentUserList } from '@/services/setting'
import { DepartCheckboxAll, TreeWrap } from '../style'
import _ from 'lodash'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from '@store/index'
import { setStatistiDepartment } from '@store/project'
import CommonIconFont from '@/components/CommonIconFont'
const EmployeeDepartment = (props: any, ref: any) => {
  const [list, setList] = useState()
  const [usersData, setUsersData] = useState()
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const { statistiDepartment } = useSelector(store => store.project)
  const { expandedKeys = [], departMentUserKey = [] } = statistiDepartment ?? []
  const [checked, setChecked] = useState(false)
  const getlist = async () => {
    const res = await getDepartmentUserList({
      search: {
        project_id: '0',
        type: 'company',
      },
      is_report: void 0,
    })
    setUsersData(res)
    const cloneData = _.cloneDeep(res)
    const treeData = diffData(cloneData)
    setList(treeData)
    const users = getAllUserData(cloneData)
    dispatch(setStatistiDepartment({ ...statistiDepartment, list: users }))
  }
  // 处理部门数据
  const diffData = (data: any) => {
    for (const item of data) {
      if (item.staffs && item.staffs.length && item.children) {
        item.children = [...item.children, ...item.staffs]
      }
      if (item.staffs && item.staffs.length && !item.children) {
        item.children = [...item.staffs]
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
    const newExpandedKeys = newTreeData.reduce((acc: any, current: any) => {
      acc = acc.concat(current.id)
      if (current.children) {
        acc = acc.concat(childrenIds(current.children))
      }
      return acc
    }, [])

    dispatch(
      setStatistiDepartment({
        ...statistiDepartment,
        expandedKeys: e.target.checked
          ? [...new Set([...newExpandedKeys])]
          : [],
        departMentUserKey: e.target.checked
          ? [...new Set(newUser.map((item: any) => item.id))]
          : [],
      }),
    )
  }

  const onCheck = (checkedKeys: any) => {
    dispatch(
      setStatistiDepartment({
        ...statistiDepartment,
        expandedKeys: checkedKeys,
      }),
    )
  }

  useEffect(() => {
    getlist()
  }, [])
  useImperativeHandle(ref, () => {
    return {
      usersData,
    }
  })
  return (
    <div>
      <DepartCheckboxAll checked={checked} onClick={allChecked}>
        {t('selectAll')}
      </DepartCheckboxAll>
      <TreeWrap
        checkable
        checkedKeys={expandedKeys}
        autoExpandParent
        onCheck={onCheck}
        treeData={list}
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
