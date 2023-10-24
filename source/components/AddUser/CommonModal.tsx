/* eslint-disable camelcase */
// 公用弹窗

/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-constant-binary-expression */
import { Form, Modal, Space, Tree } from 'antd'
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import { useTranslation } from 'react-i18next'
import { CloseWrap } from '@/components/StyleCommon'
import CommonButton from '@/components/CommonButton'
import { useEffect, useState } from 'react'
import Checkbox from 'antd/lib/checkbox/Checkbox'
import CommonUserAvatar from './CommonUserAvatar'
import { useSelector } from '@store/index'
import {
  getDepartmentUserList,
  getDepartmentUserList1,
} from '@/services/setting'
import { unionBy } from 'lodash'
import CustomSelect from '../CustomSelect'
import { getMessage } from '../Message'

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
  width: 264px;
  display: flex;
  flex-direction: column;
  padding-left: 24px;
  border-right: 1px solid var(--neutral-n6-d1);
`
const Tabs = styled.div`
  width: 216px;
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
    width: 108px;
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
  width: 216px;
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
  width: 216px;
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
  onConfirm?(list: any[], id?: number): void
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

const CommonModal = (props: ModalProps) => {
  const [t] = useTranslation()
  const { projectInfo } = useSelector(store => store.project)
  // 添加成员拍平数组
  const [selectDataList, setSelectDataList] = useState<any>()
  const [searchVal, setSearchVal] = useState<any>('')
  const [checkedKeys, setCheckedKeys] = useState<any>()
  const [personData, setPersonData] = useState<any>([])
  const [tabsTreeDataList, setTabsTreeDataList] = useState<any>([])
  const [tabs, setTabs] = useState([
    {
      label: t('commonModal.labelTitle'),
      key: '1',
    },
    {
      label: t('commonModal.labelTitle1'),
      key: '2',
    },
  ])
  const [tabsActive, setTabsActive] = useState(0)
  const [treeData, setTreeData] = useState<any>()
  const [treeData2, setTreeData2] = useState<any>()
  const [form] = Form.useForm()
  const onInit = () => {
    setPersonData([])
    setSearchVal('')
    setCheckedKeys([])
  }

  useEffect(() => {
    if (props.isVisible) {
      onInit()
      props.isPermisGroup &&
        form.setFieldsValue({
          userGroupId: props?.userGroupId,
        })
    }
    // 如果是团队项目并且可以操作权限组的
    // if (projectInfo?.teamId && props.isPermisGroup) {
    //   setTabs(tabs.filter(el => el.key === '1'))
    //   setTabsActive(1)
    // }
  }, [props.isVisible])
  // 勾选后获取到成员
  let checkdFilterDataList: any = []
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
  const newTreeData = (res: any) => {
    for (const i in res) {
      if (res[i].staffs?.length >= 1) {
        const data = res[i].staffs?.map((el: any) => ({
          ...el,
          staffs: { ...el, id: 'department_id_' + el.id },
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
        res[i].staffs = res[i].staffs?.map((el: any) => ({
          ...el,
          staffs: { ...el, id: 'department_id_' + el.id },
          id: 'department_id_' + el.id,
        }))
      }
    }
    return res
  }
  // 部门api
  const getCompany = async () => {
    const res = await getDepartmentUserList1({
      search: {
        project_id:
          props.isPermisGroup && !props.isCalendar ? projectInfo?.id : '0',
        type: 'company',
      },
    })
    const data1 = newTreeData(res)
    setTreeData2(data1)
    // 拍平数组
    const data = unionBy(checkdFilterData(res), 'id')
    setTabsTreeDataList(
      data.map((el: any) => ({ label: el.name, value: el.id, ...el })),
    )
    setSelectDataList(
      data.map((el: any) => ({ label: el.name, value: el.id, ...el })),
    )
  }
  // 团队
  const getTeam = async () => {
    const res = await getDepartmentUserList({
      search: {
        project_id:
          props.isPermisGroup && !props.isCalendar ? projectInfo?.id : '0',
        type: 'team',
      },
    })
    setTreeData(res)
    let data: any = []
    res.forEach((el: any) => {
      el.children.forEach((item: any) => {
        data.push({ ...item, label: item.name, value: item.id })
      })
    })
    // 拍平数组
    setTabsTreeDataList(deleteDeep(data))
    setSelectDataList(deleteDeep(data))
  }
  useEffect(() => {
    if (tabsActive === 0 && props.isVisible) {
      getTeam()
    } else if (tabsActive === 1 && props.isVisible) {
      getCompany()
    }
  }, [tabsActive, props.isVisible])
  useEffect(() => {
    switch (props.state) {
      case 2:
        setTabsActive(0)
        setTabs([
          {
            label: t('commonModal.labelTitle'),
            key: '1',
          },
          {
            label: t('commonModal.labelTitle1'),
            key: '2',
          },
        ])
        break
    }
  }, [props.state])

  // 删除成员
  const delPersonDataList = (el: any) => {
    let key: any = []
    if (tabsActive === 1) {
      key = personData
        .filter((item: any) => el.id !== item.id)
        ?.map((item: any) => item.department_id)
      setCheckedKeys(key)
      setCheckedKeys(
        personData
          .filter((item: any) => item.id !== el.id && !item.children)
          .map((item: any) => item.id),
      )
      setPersonData(personData.filter((item: any) => el.id !== item.id))
    } else {
      setCheckedKeys(
        personData
          .filter((item: any) => item.id !== el.id && !item.children)
          .map((item: any) => item.id),
      )
      setPersonData(personData.filter((item: any) => el.id !== item.id))
    }
    key?.length < 1 && setSearchVal('')
  }
  // 清空成员
  const clearPerson = () => {
    setPersonData([])
    setCheckedKeys([])
    setSearchVal('')
  }
  // 勾选去获取成员数据
  const getStaffs = (res: any) => {
    let data: any = []
    for (const i in res) {
      if (res[i].staffs.length >= 1) {
        data = [...data, ...res[i]?.staffs]
      } else if (res[i].staffs) {
        data = [...data, res[i]?.staffs]
      }
      if (res[i].children) {
        getStaffs(res[i].children)
      }
    }
    return data
  }
  // 去重，团队有重复人员
  function deleteDeep(arr: any) {
    let set = new Set()
    let newArr = []
    for (let i = 0; i < arr.length; i++) {
      if (!set.has(arr[i].id)) {
        set.add(arr[i].id)
        newArr.push(arr[i])
      }
    }
    return newArr
  }
  // 勾选复选框
  const onCheck = (checkedKey: any, e: any) => {
    checkdFilterDataList = []
    if (tabsActive === 1) {
      const data = getStaffs(e.checkedNodes)
      const filterArr = data.filter((el: any) =>
        String(el.id).includes('department_id_'),
      )
      const emptyData = filterArr.filter((el: any) => el?.length !== 0)
      setPersonData(deleteDeep(emptyData))
      setCheckedKeys(checkedKey)
    } else {
      const fatherData = getKeyData(treeData, 0)
      setCheckedKeys(checkedKey)
      setPersonData(
        e.checkedNodes?.filter(
          (item: any) =>
            !fatherData?.includes(item.id) && typeof item.id === 'number',
        ),
      )
    }
  }
  // 把team组成大数组去过滤父级
  let dataTeam: any = []
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
  // 全选
  const checkAllChange = (e: any) => {
    if (e.target.checked) {
      if (tabsActive === 1) {
        const keys = treeData2.map((el: any) => el.id)
        setCheckedKeys(keys)
      } else {
        const keys = tabsTreeDataList?.map((item: any) => item.id)
        setCheckedKeys(keys)
      }
      const data = tabsTreeDataList?.map((item: any) => item)
      setPersonData(data)
    } else {
      setCheckedKeys([])
      setPersonData([])
    }
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
    const setData =
      personData
        ?.filter((el: any) => String(el?.id)?.includes('department_id_'))
        ?.map((el: any) => ({
          id: Number(el.id.slice(14)),
          name: el.name,
          department_id: el.department_id,
          avatar: el.avatar,
          nickname: el.nickname,
        })) || []
    if (props.isPermisGroup) {
      await form.validateFields()
      props?.onConfirm?.(
        tabsActive === 1 ? setData : personData,
        form.getFieldsValue().userGroupId,
      )
    } else {
      props?.onConfirm?.(tabsActive === 1 ? setData : personData)
    }
  }
  return (
    <ModalStyle
      footer={false}
      open={props.isVisible}
      title={false}
      closable={false}
      bodyStyle={{ padding: '0 4px 0 0' }}
      width={props?.width || 528}
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
            style={{ width: 216 }}
            // eslint-disable-next-line no-undefined
            value={searchVal || undefined}
            onChange={(e: any) => handleChange(e)}
            optionFilterProp="label"
            options={selectDataList}
            placeholder={t('commonModal.placeMsg')}
            suffixIcon={<IconFont type="down" style={{ fontSize: 16 }} />}
          />
          {/* 部门团队切换 */}
          {tabs.length >= 2 ? (
            <Tabs>
              {tabs?.map((el, index) => (
                <span
                  className={tabsActive === index ? 'tabsActive' : ''}
                  onClick={() => {
                    setCheckedKeys([])
                    setPersonData([])
                    setSearchVal('')
                    setTabsActive(index)
                  }}
                  key={el.label}
                >
                  {el.label}
                </span>
              ))}
            </Tabs>
          ) : null}
          <Row>
            <Checkbox
              checked={personData?.length === tabsTreeDataList?.length}
              onChange={(e: any) => checkAllChange(e)}
            >
              {t('commonModal.checkBoxTitle')}
            </Checkbox>
          </Row>
          <TreeStyle
            multiple
            showIcon
            checkable
            onCheck={onCheck}
            checkedKeys={checkedKeys}
            switcherIcon={
              <IconFont
                type="down-icon"
                style={{ color: ' var(--auxiliary-text-t2-d1)', fontSize: '8' }}
              />
            }
            titleRender={(node: any) => (
              <CommonUserAvatar avatar={node.avatar} name={node.name} />
            )}
            treeData={tabsActive === 0 ? treeData : treeData2}
            fieldNames={{
              title: 'name',
              key: 'id',
            }}
          />
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

export default CommonModal
