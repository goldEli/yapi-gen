import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react'
import { getDepartmentUserList } from '@/services/setting'
import { CheckboxAll, TreeWrap } from '../style'
import _ from 'lodash'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from '@store/index'
import { setStatistiDepartment } from '@store/project'
const EmployeeDepartment = (props: any, ref: any) => {
  const [list, setList] = useState()
  const [usersData, setUsersData] = useState()
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const { statistiDepartment } = useSelector(store => store.project)
  const { expandedKeys = [] } = statistiDepartment ?? []
  const getlist = async () => {
    const res = await getDepartmentUserList({
      search: {
        project_id: '0',
        type: 'company',
      },
      is_report: void 0,
    })
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
        // eslint-disable-next-line no-param-reassign
        result = result.concat(item.staffs)
      }
      if (item.children) {
        // eslint-disable-next-line no-param-reassign
        result = result.concat(getStaffsFromChildren(item.children))
      }
      return result
    }, [])
  }
  // 获取全部人员数据
  const getAllUserData = (data: any[]) => {
    const staffsArray = data.reduce((result, item) => {
      if (item.staffs) {
        // eslint-disable-next-line no-param-reassign
        result = result.concat(item.staffs)
      }
      if (item.children) {
        // eslint-disable-next-line no-param-reassign
        result = result.concat(getStaffsFromChildren(item.children))
      }
      return result
    }, [])
    return staffsArray
  }
  // 选中树节点
  const onSelect = (selectedKeys: any) => {
    console.log(selectedKeys)
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
      <CheckboxAll checked={false} onClick={() => {}}>
        {t('selectAll')}
      </CheckboxAll>
      <TreeWrap
        checkable
        checkedKeys={expandedKeys}
        autoExpandParent
        onSelect={onSelect}
        onCheck={onCheck}
        treeData={list}
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
