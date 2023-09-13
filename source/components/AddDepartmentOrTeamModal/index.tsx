/* eslint-disable no-constant-binary-expression */
/* eslint-disable complexity */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import { Checkbox, Input, TreeSelect } from 'antd'
import { CheckboxChangeEvent } from 'antd/lib/checkbox'
import { useEffect, useState } from 'react'
import CommonModal from '../CommonModal'
import CommonUserAvatar from '../CommonUserAvatar'
import {
  getDepartmentUserList,
  getDepartmentUserList1,
} from '@/services/setting'
import IconFont from '../IconFont'
import NoData from '../NoData'
import {
  CheckBoxWrap,
  ContentBox,
  ContentLeft,
  ContentRight,
  Header,
  IconWrap,
  LeftItem,
  LeftItems,
  ListItem,
  ListWraps,
  TreeStyle,
} from './style'
import { unionBy } from 'lodash'
import { useTranslation } from 'react-i18next'
import { getProjectList, getProjectMember } from '@/services/project'

type ChooseAddType = 1 | 2 | 3 | undefined | 4 | null

interface MemberItem {
  id: number
  name: string
  children: []
  avatar: string
  parent_id: string
}

interface AddDepartmentModalProps {
  isVisible: boolean
  onClose(): void
  onConfirm(list: MemberItem[]): void
  type: ChooseAddType
  projectId?: number
  users?: number[]
  // 汇报相关查团队的时候需要传参is_report
  is_report?: boolean
}

const AddDepartmentOrTeamModal = (props: AddDepartmentModalProps) => {
  const [t] = useTranslation()
  // 选中的人员数据
  const [checkedList, setCheckedList] = useState<MemberItem[]>([])
  const [dataList, setDataList] = useState<MemberItem[]>([])
  const [searchValue, setSearchValue] = useState('')
  //   部门树选中值
  const [checkedKeys, setCheckedKeys] = useState<any>()
  //   部门树展示
  const [treeData, setTreeData] = useState<any>(null)
  const [selectDataList, setSelectDataList] = useState<any>([])

  // 清空
  const onClearAll = () => {
    setCheckedList([])
    setCheckedKeys([])
  }

  // 关闭
  const onClose = () => {
    onClearAll()
    setTreeData(null)
    setDataList([])
    props.onClose()
  }

  // 确认
  const onConfirm = () => {
    props.onConfirm(
      checkedList.map((i: MemberItem) => ({
        ...i,
        type: props.type,
      })),
    )
    onClose()
    props.onClose()
  }

  //全选
  const checkAllChange = (e: CheckboxChangeEvent) => {
    setCheckedList(e.target.checked ? dataList : [])
  }

  // 勾选框
  const onChangeChecked = (item: MemberItem, checked: boolean) => {
    let resultList: MemberItem[]
    if (checked) {
      resultList = [...checkedList, ...[item]]
    } else {
      resultList = checkedList.filter((i: MemberItem) => i.id !== item.id)
    }
    setCheckedList(resultList)
  }

  // 重新组装数据 -- 部门
  const newTreeData = (res: any) => {
    for (const i in res) {
      if (res[i].staffs?.length >= 1) {
        const data = res[i].staffs?.map((el: any) => ({
          ...el,
          id: 'department_id_' + el.id,
        }))
        if (res[i].children) {
          res[i].children = [...res[i]?.children, ...data]
        } else {
          res[i].children = [...data]
        }
      }
      if (res[i].children) {
        newTreeData(res[i].children)
      }
    }
    return res
  }

  // 获取所有的部门列表
  let checkedFilterDataList: any = []
  const checkedFilterData = (data: any) => {
    for (const i in data) {
      if (data[i].children) {
        checkedFilterDataList.push(...data[i].children)
        checkedFilterData(data[i].children)
      }
    }
    return checkedFilterDataList
  }

  //   获取部门列表
  const getDepartmentTree = async () => {
    const res = await getDepartmentUserList1({
      search: {
        project_id: '0',
        type: 'company',
      },
    })

    setTreeData(res)
    // 拍平数组
    const data = unionBy(checkedFilterData(res))
    data.unshift({ name: res[0].name, value: res[0].id, ...res[0] })
    setSelectDataList(
      data.map((el: any) => ({ label: el.name, value: el.id, ...el })),
    )
  }

  //   获取团队列表
  const getTeamList = async () => {
    const res = await getDepartmentUserList({
      search: {
        project_id: '0',
        type: 'team',
      },
      // eslint-disable-next-line no-undefined
      is_report: props.is_report ? 1 : undefined,
    })

    setSelectDataList(res)
    setDataList(res)
  }

  // 部门-勾选复选框
  const onCheck = (checkedKey: any, e: any) => {
    setCheckedKeys(checkedKey)
    let resultCheck
    if (checkedKey.length === selectDataList.length) {
      resultCheck = e.checkedNodes.filter((i: any) => i.parent_id === '0')
    } else {
      resultCheck = e.checkedNodes
    }
    setCheckedList(resultCheck)
  }

  // 查找当前层级下的所有子级
  let checkedFilterChildrenList: any = []
  const checkedFilterChildren = (data: any) => {
    for (const i in data) {
      checkedFilterChildrenList.push({ ...data[i] })
      if (data[i].children) {
        checkedFilterChildrenList.push(...data[i].children)
        checkedFilterChildren(data[i].children)
      }
    }
    return checkedFilterChildrenList
  }

  // 部门-从下往上查找父级id
  const seekParentList: any = []
  const seekParent = (id: any) => {
    let obj: any = {}
    if (id !== '0') {
      obj = selectDataList.filter((k: any) => k.id === id)[0]
      seekParentList.push(selectDataList.filter((k: any) => k.id === id)[0])
    }
    if (obj.parent_id !== '0') {
      seekParent(obj.parent_id)
    }
    return seekParentList
  }

  //   部门删除
  const onDepartmentDelete = (item: MemberItem) => {
    // 删除当前子级下的所有子级
    const hasChildren = item.children
      ? unionBy(checkedFilterChildren(item.children))
      : []
    //   包括自己
    hasChildren.push(item)
    const parent = seekParent(item.parent_id)
    const resultDelete = [...hasChildren, ...parent]
    // 取不同值
    const resultList = checkedList?.filter(
      (i: any) => !resultDelete.some((k: any) => k.id === i.id),
    )
    setCheckedList(resultList)
    setCheckedKeys(resultList.map((i: any) => i.id))
  }

  //   其他删除 ，团队或者是成员
  const onOtherDelete = (item: MemberItem) => {
    const resultList = checkedList.filter((i: MemberItem) => i.id !== item.id)
    setCheckedList(resultList)
  }

  // 点击图标删除 -- 部门
  const onDeleteItem = (item: MemberItem) => {
    props.type === 1 ? onDepartmentDelete(item) : onOtherDelete(item)
  }

  // 对象数组去重
  const fitlerDataList = (data: any) => {
    const obj: any = {}
    const set: any = data?.reduce((cur: any, next: any) => {
      obj[next.id] ? '' : (obj[next.id] = true && cur.push(next))
      return cur
    }, [])
    return set
  }

  // 部门 搜索选中事件
  const onSelect = (_newValue: string, node: any) => {
    const hasChildren: MemberItem[] = node.children
      ? unionBy(checkedFilterChildren(node.children))
      : []
    hasChildren.push(node)
    const resultList = fitlerDataList([...checkedList, ...hasChildren])
    setCheckedList(resultList)
    setCheckedKeys(resultList.map((i: any) => i.id))
  }
  const getProjectPersonData = async () => {
    const res = await getProjectMember({
      all: true,
      projectId: props.projectId,
    })
    setCheckedList(
      res.filter((el: { id: number }) => props.users?.includes(el.id)),
    )
    setSelectDataList(res)
    setDataList(res)
  }
  useEffect(() => {
    if (props.isVisible) {
      switch (props.type) {
        case 4:
          getDepartmentTree()
          break
        case 3:
          getTeamList()
          break
        case 2:
          getProjectPersonData()
      }
    }
  }, [props.isVisible])
  return (
    <CommonModal
      isVisible={props.isVisible}
      title={
        props.type === 3
          ? t('AddDepartmentOrTeamModal.add_team')
          : props.type === 2
          ? t('AddDepartmentOrTeamModal.add_members')
          : t('AddDepartmentOrTeamModal.add_department')
      }
      onClose={onClose}
      onConfirm={onConfirm}
    >
      <ContentBox>
        <ContentLeft>
          <div style={{ paddingRight: 20 }}>
            {props.type !== 4 && (
              <>
                <Input
                  value={searchValue}
                  allowClear
                  onChange={e => setSearchValue(e.target.value)}
                  placeholder={t('AddDepartmentOrTeamModal.search', {
                    text:
                      props.type === 3
                        ? t('AddDepartmentOrTeamModal.team')
                        : t('AddDepartmentOrTeamModal.person'),
                  })}
                />
                <CheckBoxWrap>
                  <Checkbox
                    checked={
                      selectDataList.length > 0 &&
                      checkedList.length > 0 &&
                      selectDataList.length === checkedList.length
                    }
                    onChange={(e: any) => checkAllChange(e)}
                    indeterminate={
                      checkedList.length > 0 &&
                      checkedList.length !== selectDataList.length
                    }
                  >
                    {t('AddDepartmentOrTeamModal.all_checked')}
                  </Checkbox>
                </CheckBoxWrap>
                <LeftItems>
                  {dataList
                    .filter((k: MemberItem) => k.name.includes(searchValue))
                    .map((i: MemberItem) => (
                      <LeftItem key={i.id}>
                        <Checkbox
                          checked={checkedList
                            ?.map((k: MemberItem) => k.id)
                            .includes(i.id)}
                          onChange={e => onChangeChecked(i, e.target.checked)}
                        />
                        <div
                          onClick={() =>
                            onChangeChecked(
                              i,
                              !checkedList
                                ?.map((k: MemberItem) => k.id)
                                .includes(i.id),
                            )
                          }
                        >
                          {i.name}
                        </div>
                      </LeftItem>
                    ))}
                  {dataList.filter((k: MemberItem) =>
                    k.name.includes(searchValue),
                  ).length <= 0 && <NoData size />}
                </LeftItems>
              </>
            )}
            {props.type === 4 && (
              <>
                <TreeSelect
                  style={{ width: '100%' }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={treeData}
                  showSearch
                  placeholder={t('AddDepartmentOrTeamModal.search', {
                    text: t('AddDepartmentOrTeamModal.department'),
                  })}
                  treeDefaultExpandAll
                  onSelect={onSelect}
                  treeNodeFilterProp="name"
                  fieldNames={{
                    label: 'name',
                    value: 'id',
                  }}
                />
                {checkedKeys}
                <TreeStyle
                  multiple
                  showIcon
                  checkable
                  onCheck={onCheck}
                  checkedKeys={checkedKeys}
                  switcherIcon={
                    <IconFont
                      type="down-icon"
                      style={{
                        color: ' var(--auxiliary-text-t2-d1)',
                        fontSize: '8',
                      }}
                    />
                  }
                  titleRender={(node: any) => (
                    <CommonUserAvatar avatar={node.avatar} name={node.name} />
                  )}
                  treeData={treeData}
                  fieldNames={{
                    title: 'name',
                    key: 'id',
                  }}
                />
              </>
            )}
          </div>
        </ContentLeft>
        <ContentRight>
          <Header>
            <span>
              {t('AddDepartmentOrTeamModal.checked_count', {
                count: checkedList.length,
                selectCount: selectDataList.length,
              })}
            </span>
            <span onClick={onClearAll}>
              {t('AddDepartmentOrTeamModal.clear')}
            </span>
          </Header>
          <ListWraps>
            {checkedList.length > 0 &&
              checkedList.map((i: MemberItem) => (
                <ListItem key={i.id}>
                  {props.type === 2 && (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <CommonUserAvatar avatar={i.avatar} fontSize={14} />
                      <div className="name" style={{ marginLeft: '8px' }}>
                        {i.name}
                      </div>
                    </div>
                  )}
                  {props.type !== 2 && (
                    <div className="otherType">
                      <IconWrap
                        className={
                          props.type === 3 ? 'teamIcon' : 'departmentIcon '
                        }
                      >
                        <IconFont
                          type={props.type === 3 ? 'team-2' : 'branch'}
                        />
                      </IconWrap>

                      <span className="name">{i.name}</span>
                    </div>
                  )}
                  <IconFont
                    onClick={() => onDeleteItem(i)}
                    className="closeIcon"
                    type="close"
                    style={{ fontSize: 16, color: 'var(--neutral-n3)' }}
                  />
                </ListItem>
              ))}
            {checkedList.length <= 0 && <NoData size="small" />}
          </ListWraps>
        </ContentRight>
      </ContentBox>
    </CommonModal>
  )
}

export default AddDepartmentOrTeamModal
