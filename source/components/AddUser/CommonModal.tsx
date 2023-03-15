/* eslint-disable camelcase */
// 公用弹窗

/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/no-unstable-nested-components */
import { Form, message, Modal, Select, Space, Tree } from 'antd'
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import { useTranslation } from 'react-i18next'
import { CloseWrap } from '@/components/StyleCommon'
import CommonButton from '@/components/CommonButton'
import { useEffect, useState } from 'react'
import Checkbox from 'antd/lib/checkbox/Checkbox'
import CommonUserAvatar from '@/components/CommonUserAvatar'
import { getDepartmentUserList } from '@store/teams/thunk'
import { useDispatch, useSelector } from '@store/index'
import { unionBy } from 'lodash'
const { DirectoryTree } = Tree
const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  color: var(--neutral-n1-d1);
  font-weight: 500;
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
  margin: 16px 0;
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
    color: var(--neutral-n1-d1);
  }
  &:hover {
    cursor: pointer;
    color: var(--neutral-n1-d1);
  }
  .tabsActive {
    background-color: var(--neutral-white-d6);
    color: var(--neutral-n3);
    border-radius: 6px;
    border: 1px solid var(--neutral-n6-d1);
  }
`
const Row = styled.div`
  width: 216px;
  height: 44px;
  display: flex;
  align-items: center;
  padding-left: 16px;
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
`
const TreeStyle = styled(DirectoryTree)`
  width: 216px;
  overflow-y: auto;
  overflow-x: hidden;
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
    width: 216px;
    height: 44px;
    padding-left: 16px;
    overflow: hidden;
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
const SelectStyle = styled(Select)``

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
}

const CommonModal = (props: ModalProps) => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const { departmentUserList } = useSelector(s => s.teams)
  const { projectInfo } = useSelector(store => store.project)
  // 添加成员拍平数组
  const [selectDataList, setSelectDataList] = useState<any>()
  const [searchVal, setSearchVal] = useState<any>('')
  const [checkedKeys, setCheckedKeys] = useState<any>()
  const [personData, setPersonData] = useState<any>([])
  const [tabsTreeDataList, setTabsTreeDataList] = useState<any>([])
  const [tabs, setTabs] = useState([
    {
      label: '团队',
      key: '1',
    },
    {
      label: '部门',
      key: '2',
    },
  ])
  const [tabsActive, setTabsActive] = useState(0)
  const treeData: any = departmentUserList
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
    if (projectInfo?.teamId && props.isPermisGroup) {
      setTabs(tabs.filter(el => el.key === '1'))
    } else {
      setTabs([
        {
          label: '团队',
          key: '1',
        },
        {
          label: '部门',
          key: '2',
        },
      ])
    }
  }, [props.isVisible])
  useEffect(() => {
    dispatch(
      getDepartmentUserList({
        search: {
          project_id: props.isPermisGroup ? projectInfo?.id : '0',
          type: tabsActive === 0 ? 'team' : 'company',
        },
      }),
    )
  }, [tabsActive])

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

  // 删除成员
  const delPersonDataList = (el: any) => {
    setPersonData(personData.filter((item: any) => el.id !== item.id))
    const key: any = personData
      .filter((item: any) => el.id !== item.id)
      ?.map((item: any) => item.department_id)
    setCheckedKeys(key)
    key?.length < 1 && setSearchVal('')
  }

  // 清空成员
  const clearPerson = () => {
    setPersonData([])
    setCheckedKeys([])
    setSearchVal('')
  }

  // 勾选复选框
  const onCheck = (checkedKey: any, e: any) => {
    checkdFilterDataList = []
    setCheckedKeys(checkedKey)

    // 得到重复node需要去重
    const data = unionBy(checkdFilterData(e.checkedNodes), 'id')
    if (e.checkedNodes.length && data.length <= personData.length) {
      message.warning('当前部门层级下无可选成员！')
    }
    setPersonData(data)
  }

  // 全选
  const checkAllChange = (e: any) => {
    if (e.target.checked) {
      const keys = treeData.map((el: any) => el.id)
      setCheckedKeys(keys)
      setPersonData(tabsTreeDataList?.map((item: any) => item))
    } else {
      setCheckedKeys([])
      setPersonData([])
    }
  }
  // 拍平数组
  useEffect(() => {
    const data = unionBy(checkdFilterData(treeData), 'id')
    setTabsTreeDataList(
      data.map((el: any) => ({ label: el.name, value: el.id, ...el })),
    )
    setSelectDataList(
      data.map((el: any) => ({ label: el.name, value: el.id, ...el })),
    )
  }, [departmentUserList])

  // 下拉框选中
  const handleChange = async (value: any) => {
    setSearchVal(value)
    const hasVal = personData.filter((el: any) => el.id === value)
    if (hasVal.length >= 1) {
      message.warning('已存在该联系人')
    } else {
      const filterVal: any = selectDataList.filter((el: any) => el.id === value)
      setPersonData([...personData, ...filterVal])
    }
  }

  const onConfirm = async () => {
    if (props.isPermisGroup) {
      await form.validateFields()
      props?.onConfirm?.(personData, form.getFieldsValue().userGroupId)
    } else {
      props?.onConfirm?.(personData)
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
            onChange={e => handleChange(e)}
            optionFilterProp="label"
            options={selectDataList}
            placeholder="搜索联系人"
            suffixIcon={<IconFont type="down" style={{ fontSize: 16 }} />}
          />
          {/* 部门团队切换 */}
          <Tabs>
            {tabs.map((el, index) => (
              <span
                className={tabsActive === index ? 'tabsActive' : ''}
                onClick={() => {
                  setSearchVal('')
                  setTabsActive(index)
                }}
                key={el.label}
              >
                {el.label}
              </span>
            ))}
          </Tabs>
          <Row>
            <Checkbox
              checked={personData?.length === tabsTreeDataList?.length}
              onChange={(e: any) => checkAllChange(e)}
            >
              全选
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
            treeData={treeData}
            fieldNames={{
              title: 'name',
              key: 'id',
            }}
          />
        </LeftWrap>
        <RightPerson>
          <Header>
            <span>
              已选{personData?.length}/{tabsTreeDataList?.length}
            </span>
            <span onClick={() => clearPerson()}>清空</span>
          </Header>
          {personData.map((el: any) => (
            <ListItem key={el.id}>
              <CommonUserAvatar name={el.name} />
              <IconFont
                type="close"
                style={{ fontSize: 16, color: 'var(--neutral-n3)' }}
                onClick={() => delPersonDataList(el)}
              />
            </ListItem>
          ))}
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
                <Select
                  placeholder={t('project.pleasePermission')}
                  getPopupContainer={node => node}
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
            type="secondary"
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
