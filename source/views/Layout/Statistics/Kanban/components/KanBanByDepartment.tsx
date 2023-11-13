import React, { useState, useEffect } from 'react'
import { getDepartmentUserList } from '@/services/setting'
import { TreeWrap } from '../style'
import { set } from 'lodash'
const KanBanByDepartment = () => {
  const [list, setList] = useState()
  const [expandedKeys, setExpandedKeys] = useState()
  const getlist = async () => {
    const res = await getDepartmentUserList({
      search: {
        project_id: '0',
        type: 'company',
      },
      is_report: void 0,
    })
    console.log('res-----', res)
    setList(res)
  }
  // 选中树节点
  const onSelect = (selectedKeys: any) => {
    console.log(selectedKeys)
  }
  const onCheck = (checkedKeys: any) => {
    console.log(checkedKeys)
  }
  const onExpand = (a: any) => {
    console.log(a)
    setExpandedKeys(a)
  }
  useEffect(() => {
    getlist()
    console.log(111)
  }, [])
  return (
    <TreeWrap
      checkable
      expandedKeys={expandedKeys}
      autoExpandParent
      onSelect={onSelect}
      onCheck={onCheck}
      onExpand={onExpand}
      treeData={list}
      fieldNames={{
        title: 'name',
        key: 'id',
        children: 'children',
      }}
    ></TreeWrap>
  )
}

export default KanBanByDepartment
