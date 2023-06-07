/* eslint-disable no-prototype-builtins */
/* eslint-disable max-lines */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable camelcase */
// 公用弹窗

/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-constant-binary-expression */
import { Breadcrumb, Checkbox, Form, Modal, Space, Tree } from 'antd'
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import { useTranslation } from 'react-i18next'
import { CloseWrap } from '@/components/StyleCommon'
import CommonButton from '@/components/CommonButton'
import { useEffect, useMemo, useRef, useState } from 'react'

import { useSelector } from '@store/index'
import {
  getDepartmentUserList,
  getDepartmentUserList1,
} from '@/services/setting'

import CustomSelect from '@/components/CustomSelect'
import { getMessage } from '@/components/Message'
import CommonUserAvatar from '@/components/CommonUserAvatar'
import CommonIconFont from '@/components/CommonIconFont'
import NewAddShowList from './DepartmentList'

const { DirectoryTree } = Tree
const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  color: var(--neutral-n1-d1);
  font-family: siyuanmedium;
  height: 56px;
  padding: 0 13px 0 24px;
`
const ModalFooter = styled(Space)({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: 80,
  padding: '0 20px 0 24px',
})
const ModalStyle = styled(Modal)`
  .ant-modal-body {
    background-color: var(--neutral-white-d5);
    border-radius: 6px;
    box-shadow: 0px 0px 15px 6px rgba(0, 0, 0, 0.12);
  }
`

// 添加成员弹窗
const CreatePerson = styled.div`
  width: 100%;
  display: flex;
  height: 448px;
`
const LeftWrap = styled.div`
  width: 320px;
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  padding-left: 24px;
  border-right: 1px solid var(--neutral-n6-d1);
`

const Tabs = styled.div`
  width: 270px;
  height: 24px;
  border-radius: 4px;
  margin-top: 16px;
  font-size: 12px;
  font-weight: 400;
  color: var(--neutral-n3);
  background-color: var(--hover-d1);
  span {
    display: inline-block;
    text-align: center;
    height: 24px;
    line-height: 24px;
    width: 135px;
    color: var(--neutral-n3);
  }
  &:hover {
    cursor: pointer;
    color: var(--neutral-n1-d1);
  }
  .tabsActive {
    color: var(--neutral-n1-d1);
    background-color: var(--neutral-white-d3);
    border-radius: 6px;
    border: 1px solid var(--neutral-n6-d2);
  }
`
const Row = styled.div`
  width: 216px;
  height: 44px;
  display: flex;
  align-items: center;
  padding-left: 16px;
  margin-top: 16px;
  & .ant-checkbox-checked .ant-checkbox-inner {
    background-color: var(--primary-d1);
    border-color: var(--primary-d1);
  }
  span {
    color: var(--neutral-n2);
  }
`
const RightPerson = styled.div`
  overflow: auto;
  width: 264px;
  height: 100%;
  padding-left: 24px;
`
const Header = styled.div`
  width: 230px;
  display: flex;
  height: 36px;
  background: var(--neutral-n7);
  border-radius: 4px 4px 4px 4px;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  & span:first-child {
    color: var(--neutral-n1-d1);
  }
  & span:last-child {
    color: var(--primary-d2);
  }
  & span:last-child:hover {
    cursor: pointer;
  }
`
const ListItem = styled.div`
  width: 230px;
  height: 36px;
  line-height: 36px;
  border-radius: 6px;
  padding: 0 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .del {
    display: none;
  }
  & span:first-child {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    color: var(--primary-d2);
  }
  & span:last-child {
    color: var(--primary-d2);
  }
  &:hover {
    background: var(--hover-d2);
    cursor: pointer;
  }
  &:hover .del {
    display: block;
  }
`
const TreeStyle = styled(DirectoryTree)`
  width: 216px;
  overflow-y: auto;
  overflow-x: auto;
  height: 318px;
  .ant-tree-checkbox-inner {
    width: 16px;
    height: 16px;
    border-radius: 4px;
  }
  .ant-tree-checkbox-checked .ant-tree-checkbox-inner {
    background-color: var(--primary-d1);
    border-color: var(--primary-d1);
  }
  .ant-tree-checkbox-indeterminate .ant-tree-checkbox-inner::after {
    background-color: var(--auxiliary-b2);
  }
  & .ant-tree-iconEle {
    display: none !important;
  }
  .ant-tree-treenode {
    min-width: 216px;
    height: 44px;
    padding-left: 16px;
    /* overflow: hidden; */
  }

  .ant-tree-treenode:hover {
    border-radius: 6px;
    background-color: var(--hover-d2);
    .ant-tree-title div {
      color: var(--neutral-n1-d1) !important;
    }
  }
  .ant-tree.ant-tree-directory .ant-tree-treenode-selected:hover::before,
  .ant-tree.ant-tree-directory .ant-tree-treenode-selected::before {
    background-color: none;
  }
`
const SelectStyle = styled(CustomSelect)``

interface ModalProps {
  width?: number
  isVisible: boolean
  title?: string
  onClose?(): void
  children?: any
  onConfirm?(list: Model.User.User[], id?: number): void
  confirmText?: string
  hasFooter?: any
  isShowFooter?: boolean
  hasTop?: any
  isPermisGroup?: boolean
  userGroupId?: number
  projectPermission?: any
  isCalendar?: boolean
  // 展示某一个
  state?: number
}

const AddDepartmentModalForFlat = (props: ModalProps) => {
  const [t] = useTranslation()

  const { projectInfo } = useSelector(store => store.project)
  // 添加成员拍平数组
  const [selectDataList, setSelectDataList] = useState<any>()
  const [searchVal, setSearchVal] = useState<any>('')
  const [checkedKeys, setCheckedKeys] = useState<any>()
  const [personData, setPersonData] = useState<any>([])
  const [tabsTreeDataList, setTabsTreeDataList] = useState<any>([])

  const [showTreeData, setShowTreeData] = useState<any>()
  const [treeData, setTreeData] = useState<any>()

  const active = useRef<any>([])
  const [form] = Form.useForm()
  const onInit = () => {
    setPersonData([])
    setSearchVal('')
    setCheckedKeys([])
  }

  useEffect(() => {
    if (props.isVisible) {
      onInit()
    }
  }, [props.isVisible])
  // 勾选后获取到成员
  const checkdFilterDataList: any = []
  const checkdFilterData = (data: any) => {
    for (const i in data) {
      if (data[i]?.staffs?.length >= 1) {
        checkdFilterDataList.push(...data[i].staffs)
      }
      if (data[i].children) {
        checkdFilterData(data[i].children)
      }
    }
    return checkdFilterDataList
  }
  // 重新组装数据
  function removeStaffs(treeData: any) {
    if (Array.isArray(treeData)) {
      // 如果是数组，则遍历数组中的每个元素
      treeData.forEach(item => {
        if (item.staffs) {
          // 删除 staffs 属性
          delete item.staffs
        }
        if (item.children) {
          // 递归处理子节点
          removeStaffs(item.children)
        }
      })
    } else if (typeof treeData === 'object') {
      // 如果是对象，则处理对象的属性值
      Object.keys(treeData).forEach(key => {
        const value = treeData[key]
        if (key === 'staffs') {
          // 删除 staffs 属性
          delete treeData[key]
        } else if (Array.isArray(value) || typeof value === 'object') {
          // 递归处理子节点
          removeStaffs(value)
        }
      })
    }
    return treeData
  }
  function flattenTreeData(treeData: any) {
    const result: any = []

    function flatten(node: any) {
      const { id, children, ...rest } = node
      result.push({ id, ...rest })

      if (children && children.length > 0) {
        children.forEach(flatten)
      }
    }

    treeData.forEach(flatten)

    return result
  }
  // 部门api
  const getCompany = async () => {
    const res = await getDepartmentUserList1({
      search: {
        project_id: '0',
        type: 'company',
      },
    })

    const data1 = removeStaffs(JSON.parse(JSON.stringify(res)))
    // const data1 =newTreeData(res)

    setTreeData(data1)
    setShowTreeData({ children: data1, staffs: [] })
    // 拍平数组
    const data = flattenTreeData(data1)
    console.log(data)

    setTabsTreeDataList(
      data.map((el: any) => ({ label: el.name, value: el.id, ...el })),
    )
    setSelectDataList(
      data.map((el: any) => ({ label: el.name, value: el.id, ...el })),
    )
  }

  useEffect(() => {
    if (props.isVisible) {
      getCompany()
    }
  }, [props.isVisible])

  // 删除成员
  const delPersonDataList = (el: any) => {
    let key: any = []

    setCheckedKeys(
      personData
        .filter((item: any) => item.id !== el.id && !item.children)
        .map((item: any) => item.id),
    )
    setPersonData(personData.filter((item: any) => el.id !== item.id))

    key?.length < 1 && setSearchVal('')
  }
  // 清空成员
  const clearPerson = () => {
    setPersonData([])
    setCheckedKeys([])
    setSearchVal('')
  }

  // 勾选复选框

  // 把team组成大数组去过滤父级
  const dataTeam: any = []
  const getKeyData = (res: any, preId: any) => {
    for (const i in res) {
      if (preId === res[i].team_id) {
        dataTeam.push(res[i].team_id)
      }
      if (res[i].children) {
        getKeyData(res[i].children, res[i].id)
      }
    }
    return Array.from(new Set(dataTeam))
  }

  // 下拉框选中
  const handleChange = async (value: any) => {
    setSearchVal(value)
    const hasVal = personData.filter((el: any) => el.id === value)
    if (hasVal.length >= 1) {
      getMessage({ msg: t('commonModal.warnningMsg1'), type: 'warning' })
    } else {
      const filterVal: any = selectDataList.filter((el: any) => el.id === value)
      setCheckedKeys([...checkedKeys, filterVal.find((item: any) => item).id])
      setPersonData([...personData, ...filterVal])
    }
  }
  const onConfirm = async () => {
    props?.onConfirm?.(personData)
  }

  const getTapData = (datas: any) => {
    active.current.push(datas)
    setShowTreeData({ children: datas.children, staffs: datas.staffs })
  }
  // 选中节点
  const setKeys = (keys: any) => {
    if (keys.children && keys.children.length >= 1) {
      getHaveChildBykeys(keys)
    } else {
      getNotHaveChildBykeys(keys)
    }
  }
  // 去除每层级的 staffs 数组并遍历每层级的 children 取出 staffs 数组
  function flattenStaffs(data: any) {
    let result: any = []

    function flatten(node: any) {
      if (node.staffs) {
        result = result.concat(node.staffs)
      }

      if (node.children && node.children.length > 0) {
        node?.children.forEach((child: any) => {
          flatten(child)
        })
      }
    }

    data.forEach((node: any) => {
      flatten(node)
    })

    return result
  }
  // 获取最底层的children数组
  function findBottomChildren(treeData: any) {
    console.log(treeData, '树数据')

    const result: any = []

    function traverse(node: any) {
      result.push(node)

      if (node.children && node.children.length > 0) {
        node.children.forEach(traverse)
      }
    }

    treeData.forEach(traverse)

    return result
  }

  function isEqual(obj1: any, obj2: any) {
    return JSON.stringify(obj1) === JSON.stringify(obj2)
  }
  function compareArrays(A: any, B: any) {
    const result = []

    for (const item of B) {
      const found = A.find((aItem: any) => isEqual(aItem, item))
      if (!found) {
        result.push(item)
      }
    }

    for (const item of A) {
      const found = B.find((bItem: any) => isEqual(bItem, item))
      if (!found) {
        result.push(item)
      }
    }

    return result
  }

  // 辅助函数，用于比较两个对象是否相等

  // 处理数据无children解析为key作为右边
  const getNotHaveChildBykeys = (keys: any) => {
    const isHave = personData.map((i: { id: any }) => i.id).includes(keys.id)

    if (isHave) {
      setPersonData(personData.filter((i: { id: any }) => i.id !== keys.id))
    } else {
      setPersonData([...personData, keys])
    }
  }
  // 处理数据有children解析为key作为右边

  const getHaveChildBykeys = (keys: any) => {
    console.log(keys, '1111111111')

    // 非部门的处理方法
    const findBottomChildrens = findBottomChildren([keys])
    console.log(findBottomChildrens, 'sss')

    const newData = findBottomChildrens.reduce((acc: any, current: any) => {
      // 使用对象来检查已经存在的id值
      const ids = acc.map((item: any) => item.id)

      // 如果当前项的id在已存在的id数组中不存在，则添加到结果数组中
      if (!ids.includes(current.id)) {
        acc.push(current)
      }

      return acc
    }, [])
    const isEquals = isEqual(personData, newData)

    if (personData.length < 1) {
      setPersonData(newData)
    } else if (isEquals) {
      setPersonData([])
    } else {
      const newData2 = compareArrays(personData, newData).reduce(
        (acc: any, current: any) => {
          // 使用对象来检查已经存在的id值
          const ids = acc.map((item: any) => item.id)

          // 如果当前项的id在已存在的id数组中不存在，则添加到结果数组中
          if (!ids.includes(current.id)) {
            acc.push(current)
          }

          return acc
        },
        [],
      )
      setPersonData(newData2)
    }
    // setPersonData(keys)
  }
  function filterUniqueItems(arr1: any, arr2: any) {
    const uniqueItems = arr1.filter((item1: any) => {
      return !arr2.some((item2: any) => item2.id === item1.id)
    })

    return uniqueItems
  }

  // 新的全选逻辑
  const checkAllChangeNew = () => {
    //拿到所有child
    const findBottomChildrens = findBottomChildren([showTreeData])

    //去重
    const newData = findBottomChildrens.reduce((acc: any, current: any) => {
      // 使用对象来检查已经存在的id值
      const ids = acc.map((item: any) => item.id)

      // 如果当前项的id在已存在的id数组中不存在，则添加到结果数组中
      if (!ids.includes(current.id)) {
        acc.push(current)
      }

      return acc
    }, [])

    for (let i = 0; i < newData.length; i++) {
      if (!newData[i].id) {
        newData.splice(i, 1)
        i--
      }
    }

    //判断 拿到的是否包含一部分
    const isSomeHave = personData.some((item: any) =>
      newData.map((i: { id: any }) => i.id).includes(item.id),
    )

    if (isSomeHave) {
      setPersonData(filterUniqueItems(personData, newData))
    } else {
      setPersonData(compareArrays(personData, newData))
    }
    //
  }

  const isSomeChoose = () => {
    if (showTreeData) {
      const findBottomChildrens = findBottomChildren([showTreeData])
      //去重
      const newData = findBottomChildrens.reduce((acc: any, current: any) => {
        // 使用对象来检查已经存在的id值
        const ids = acc.map((item: any) => item.id)

        // 如果当前项的id在已存在的id数组中不存在，则添加到结果数组中
        if (!ids.includes(current.id)) {
          acc.push(current)
        }

        return acc
      }, [])

      let isAll: boolean

      isAll = newData.some((item: any) =>
        personData.map((i: { id: any }) => i.id).includes(item.id),
      )
      return isAll
    }
  }

  const isAllChoose = () => {
    if (showTreeData) {
      const findBottomChildrens = findBottomChildren([showTreeData])
      //去重
      const newData = findBottomChildrens.reduce((acc: any, current: any) => {
        // 使用对象来检查已经存在的id值
        const ids = acc.map((item: any) => item.id)

        // 如果当前项的id在已存在的id数组中不存在，则添加到结果数组中
        if (!ids.includes(current.id)) {
          acc.push(current)
        }

        return acc
      }, [])

      let isAll: boolean

      isAll = newData.every((item: any) =>
        personData.map((i: { id: any }) => i.id).includes(item.id),
      )
      return isAll
    }
  }
  console.log(personData, '选中数据')
  console.log(showTreeData, '列数据')

  return (
    <ModalStyle
      footer={false}
      open={props.isVisible}
      title={false}
      closable={false}
      bodyStyle={{ padding: '0 4px 0 0' }}
      width={props?.width || 640}
      maskClosable={false}
      destroyOnClose
      keyboard={false}
      wrapClassName="vertical-center-modal"
      focusTriggerAfterClose={false}
    >
      <ModalHeader>
        <span>{props?.title}</span>
        <Space size={4}>
          {props.hasTop}
          <CloseWrap onClick={props?.onClose} width={32} height={32}>
            <IconFont
              style={{ fontSize: 20, color: 'var(--neutral-n2)' }}
              type="close"
            />
          </CloseWrap>
        </Space>
      </ModalHeader>
      {/* body */}
      <CreatePerson>
        <LeftWrap>
          <SelectStyle
            notFoundContent={null}
            showSearch
            style={{ width: 270 }}
            // eslint-disable-next-line no-undefined
            value={searchVal || undefined}
            onChange={(e: any) => handleChange(e)}
            optionFilterProp="label"
            options={selectDataList}
            placeholder={t('commonModal.placeMsg')}
            suffixIcon={<IconFont type="down" style={{ fontSize: 16 }} />}
          />

          {active.current.length >= 1 && (
            <div
              style={{
                height: '20px',
                marginTop: '16px',
              }}
            >
              <Breadcrumb>
                <Breadcrumb.Item
                  onClick={() => {
                    setShowTreeData({
                      children: treeData,
                      staffs: [],
                    })
                    active.current = []
                  }}
                >
                  <CommonIconFont color="var(--primary-d1)" type="return" />
                  <span
                    style={{
                      color: 'var(--primary-d1)',
                    }}
                  >
                    返回
                  </span>
                </Breadcrumb.Item>

                {active.current.map((i: any) => (
                  <Breadcrumb.Item key={i.id}>
                    <span
                      onClick={() => {
                        setShowTreeData({
                          children: i.children,
                          staffs: i.staffs,
                        })

                        const thisIndex = active.current.findIndex(
                          (k: any) => i.id === k.id,
                        )

                        active.current.splice(
                          thisIndex + 1,
                          active.current.length - 1,
                        )
                      }}
                    >
                      {i.name}
                    </span>
                  </Breadcrumb.Item>
                ))}
              </Breadcrumb>
            </div>
          )}
          <Row>
            <Checkbox
              indeterminate={isSomeChoose()}
              checked={isAllChoose()}
              onChange={checkAllChangeNew}
            >
              {t('commonModal.checkBoxTitle')}
            </Checkbox>
          </Row>
          <div
            style={{
              height: '320px',
              overflow: 'scroll',
            }}
          >
            <NewAddShowList
              selectKeys={personData}
              setKeys={setKeys}
              getTapData={getTapData}
              treeData={showTreeData}
            />
          </div>
        </LeftWrap>
        <RightPerson>
          <Header>
            <span>
              {t('commonModal.selected')}
              {personData?.length}/{tabsTreeDataList?.length}
            </span>
            <span onClick={() => clearPerson()}>{t('commonModal.clear')}</span>
          </Header>
          {personData.length >= 1
            ? personData.map((el: any) => (
                <ListItem key={el.id}>
                  <CommonUserAvatar
                    name={el.name}
                    fontSize={14}
                    avatar={el.avatar}
                  />
                  <IconFont
                    className="del"
                    type="close"
                    style={{ fontSize: 16, color: 'var(--neutral-n3)' }}
                    onClick={() => delPersonDataList(el)}
                  />
                </ListItem>
              ))
            : null}
        </RightPerson>
      </CreatePerson>
      <ModalFooter>
        {props.isPermisGroup ? (
          <Form form={form}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span
                style={{
                  fontSize: 14,
                  color: 'var(--neutral-n1-d1)',
                  marginRight: 16,
                }}
              >
                {t('project.joinPermission')}
                <span
                  style={{
                    fontSize: 12,
                    color: 'var(--function-error)',
                    marginLeft: 4,
                  }}
                >
                  *
                </span>
              </span>
              <Form.Item
                name="userGroupId"
                noStyle
                rules={[{ required: true, message: '' }]}
              >
                <CustomSelect
                  placeholder={t('project.pleasePermission')}
                  getPopupContainer={(node: any) => node}
                  style={{ width: 192 }}
                  options={props?.projectPermission}
                  showSearch
                  showArrow
                  optionFilterProp="label"
                  defaultValue={
                    props?.projectPermission?.filter(
                      (i: any) => i.tagLabel === '参与者',
                    )[0]?.value
                  }
                />
              </Form.Item>
            </div>
          </Form>
        ) : (
          <div />
        )}
        <div style={{ display: 'flex' }}>
          <CommonButton
            type="light"
            onClick={props?.onClose}
            style={{ marginRight: '16px' }}
          >
            {t('common.cancel')}
          </CommonButton>
          <CommonButton type="primary" onClick={onConfirm}>
            {t('common.confirm')}
          </CommonButton>
        </div>
      </ModalFooter>
    </ModalStyle>
  )
}

export default AddDepartmentModalForFlat