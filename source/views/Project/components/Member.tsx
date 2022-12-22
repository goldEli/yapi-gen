// 项目右侧抽屉弹窗

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/naming-convention */
import { Drawer, Dropdown, Form, Input, Menu, message, Select } from 'antd'
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import { useEffect, useState } from 'react'
import { AsyncButton as Button } from '@staryuntech/ant-pro'
import { useModel } from '@/models'
import { useTranslation } from 'react-i18next'
import { getIsPermission } from '@/tools'
import NoData from '@/components/NoData'
import { MoreWrap } from '../Detail/Demand/DemandMain/components/Operation'
import { StaffSelect } from '@xyfe/uikit'
import { getAddDepartMember } from '@/services/staff'
import { CloseWrap } from '@/components/StyleCommon'

interface Props {
  visible: boolean
  onChangeVisible(): void
  projectId: any
}

const DrawerWrap = styled(Drawer)({
  '.ant-drawer-title': {
    width: '100%',
  },
  '.ant-drawer-close': {
    margin: 0,
  },
  '.ant-drawer-header': {
    borderBottom: 'none!important',
  },
  '.ant-drawer-header-title': {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  },
})

const ButtonWrap = styled(Button)({
  // minWidth: '88px',
  height: 32,
  marginLeft: 16,
})

const ListWrap = styled.div`
  margin-top: 16;
  & .ant-popover-inner {
    position: relative !important;
    top: -3px !important;
  }
  .ant-dropdown-menu-item,
  .ant-dropdown-menu-submenu-title {
    padding: 0 !important;
  }
`

const ListItem = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: 56,
  padding: '0 16px',
  '.avatarBox': {
    display: 'flex',
    alignItems: 'center',
    img: {
      width: 32,
      height: 32,
      borderRadius: '50%',
      marginRight: 8,
    },
    div: {
      display: 'flex',
      flexDirection: 'column',
      'span:first-child': {
        color: '#323233',
        fontSize: 14,
      },
      'span:last-child': {
        color: '#BBBDBF',
        fontSize: 12,
      },
    },
  },
  '.job': {
    color: 'black',
    fontSize: 12,
  },
  '&:hover': {
    backgroundColor: '#f4f5f5',
  },
})
const MoreWrap2 = styled(MoreWrap)`
  padding: 0;
  background-color: transparent;
  font-size: 12px;
  .job1,
  .job {
    color: #323233;
  }
  &:hover {
    background-color: transparent !important;
    .job {
      color: #2877ff;
    }
    .job1 {
      color: #2877ff;
      transform: rotate(180deg);
    }
  }
`
const WaiWrap = styled.div``

const NameWrap = styled.div({
  width: 32,
  height: 32,
  borderRadius: '50%',
  marginRight: 8,
  textAlign: 'center',
  lineHeight: '32px',
  background: '#A4ACF5',
  color: 'white',
})

const HeaderWrap = styled.div({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})
const Myd = styled.div<{ active: boolean }>`
  text-align: left;
  padding: 5px 16px !important;
  color: #646566;
  &:hover {
    color: #323233;
    background-color: #f4f5f5;
  }
  color: ${({ active }) => (active ? '#2877FF !important' : '')};
`
interface DropDownProps {
  row: any
  onClickMenu(item: any, row: any): void
  roleOptions: any
  name: any
}

const MoreDropdown = (props: DropDownProps) => {
  const [isVisible, setIsVisible] = useState(false)

  const onClickItem = (item: any) => {
    setIsVisible(false)
    props.onClickMenu(item, props.row)
  }

  const menu = () => {
    const menuItems: any = []
    props.roleOptions?.forEach((i: any, idx: any) => {
      menuItems.push({
        key: idx,
        label: (
          <Myd
            active={i.label === props.row.roleName}
            onClick={() => onClickItem(i)}
          >
            {i.label}
            {i.label === props.row.roleName && (
              <IconFont
                style={{ fontSize: 16, margin: '1px 0px 0px 15px' }}
                type="check"
              />
            )}
          </Myd>
        ),
      })
    })
    return <Menu items={menuItems} />
  }

  return (
    <Dropdown
      key={isVisible ? isVisible.toString() : null}
      visible={isVisible}
      overlay={menu}
      trigger={['hover']}
      placement="bottomRight"
      getPopupContainer={node => node}
      onVisibleChange={setIsVisible}
    >
      <MoreWrap2>
        <div
          style={{
            marginRight: '4px',
          }}
          className="job"
        >
          {props.row.roleName}
        </div>
        <span className="job1">
          <IconFont style={{ fontSize: 14 }} type="down" />
        </span>
      </MoreWrap2>
    </Dropdown>
  )
}

const Member = (props: Props) => {
  const [t] = useTranslation()
  const { getProjectMember, isRefreshMember, setIsRefreshMember, projectInfo } =
    useModel('project')
  const { getProjectPermission, updateMember, projectPermission, addMember } =
    useModel('project')
  const [isVisible, setIsVisible] = useState(false)
  const [roleOptions, setRoleOptions] = useState([])
  const [departments, setDepartments] = useState([])
  const [member, setMember] = useState<any>()
  const [search, setSearch] = useState<any>()
  const [memberList, setMemberList] = useState<any>([])
  const [userDataList, setUserDataList] = useState<any[]>([])
  const [form] = Form.useForm()
  const hasEdit = !getIsPermission(
    projectInfo?.projectPermissions,
    'b/project/member/update',
  )

  const getPermission = async () => {
    const res = await getProjectPermission({ projectId: props.projectId })
    setRoleOptions(res.list)
  }
  const getList = async () => {
    const result = await getProjectMember({
      projectId: props.projectId,
      all: true,
      searchValue: search,
    })

    setMemberList(result)
    setIsRefreshMember(false)
    getPermission()
  }
  const init = async () => {
    const res2 = await getAddDepartMember(props.projectId)

    const arr = res2.companyList.map((i: any) => {
      return {
        id: i.id,
        code: '234234',
        name: i.name,
        avatar: i.avatar,
        phoneNumber: '123123213',
        departmentId: i.department_id,
        jobName: '',
        jobId: '1584818157136687105',
        cardType: '',
        cardNumber: '',
        hiredate: '2022-11-26',
        type: 1,
        gender: 0,
        companyId: '1504303190303051778',
      }
    })

    const obj = {
      list: arr,
    }
    setMember(obj)

    setDepartments(res2.departments)
  }

  useEffect(() => {
    if (isVisible) {
      init()
    }
  }, [isVisible])

  const onClickMenu = async (item: any, row: any) => {
    try {
      await updateMember({
        projectId: props.projectId,
        userGroupId: item.id,
        userIds: row.id,
      })
      message.success(t('common.editS'))
      getList()
    } catch (error) {
      //
    }
  }

  useEffect(() => {
    if (props.visible) {
      getList()
    }
  }, [props.visible])

  useEffect(() => {
    if (isRefreshMember) {
      getList()
    }
  }, [isRefreshMember])

  const onChangeSearch = (e: any) => {
    setSearch(e.target.value)
  }
  useEffect(() => {
    getList()
  }, [search])

  const onClickCancel = () => {
    setIsVisible(false)
  }
  const handleOk = async () => {
    const values = form.getFieldsValue()

    if (userDataList.length <= 0) {
      message.warning(t('project.memberNull'))
      return
    }
    let { userGroupId } = values
    if (!form.getFieldValue('userGroupId')) {
      userGroupId = projectPermission?.filter(
        (i: any) => i.tagLabel === '参与者',
      )[0]?.value
    }

    const params: any = {
      projectId: props.projectId,
      userGroupId,
      userIds: userDataList,
    }
    await addMember(params)
    message.success(t('common.addSuccess'))
    setUserDataList([])
    getList()
    setIsVisible(false)
    PubSub.publish('member')
    setTimeout(() => {
      form.resetFields()
    }, 100)
  }

  const onChangeMember = (value: any) => {
    setUserDataList(value)
  }
  const userObj = {
    avatar:
      'https://oa-1308485183.cos.ap-chengdu.myqcloud.com/oa-dev-img/1504303190303051778/1531903254371954690/2022-11-15/71A2A5C7-CFB9CDD612ED.jpeg',
    name: '杨一',
    id: '1531903254371954690',
    companyId: '1504303190303051778',
    companyName: '成都定星科技',
    phone: '18380129474',
    remark: '',
    admin: false,
    gender: 1,
  }
  return (
    <WaiWrap>
      <StaffSelect
        title={t('project.addMember')}
        user={userObj as any}
        departments={departments}
        staffListAll={member}
        visible={isVisible}
        onCancel={onClickCancel}
        value={userDataList}
        onOk={handleOk}
        onChange={onChangeMember}
        plugArea={
          <div style={{ marginBottom: '25px' }}>
            <Form form={form}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span
                  style={{ fontSize: 14, color: '#323233', marginRight: 16 }}
                >
                  {t('project.joinPermission')}
                  <span style={{ fontSize: 12, color: 'red', marginLeft: 4 }}>
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
                    options={projectPermission}
                    showSearch
                    showArrow
                    optionFilterProp="label"
                    defaultValue={
                      projectPermission?.filter(
                        (i: any) => i.tagLabel === '参与者',
                      )[0]?.value
                    }
                  />
                </Form.Item>
              </div>
            </Form>
          </div>
        }
      />

      <DrawerWrap
        title={
          <HeaderWrap>
            <span>
              {t('project.projectMemberAll', {
                count: projectInfo.memberCount,
              })}
            </span>
            <CloseWrap width={32} height={32} onClick={props.onChangeVisible}>
              <IconFont
                style={{
                  fontSize: '20px',
                }}
                type="close"
              />
            </CloseWrap>
            {/* <IconFont
              onClick={props.onChangeVisible}
              style={{ cursor: 'pointer' }}
              type="close"
            /> */}
          </HeaderWrap>
        }
        headerStyle={{ width: '100%' }}
        closable={false}
        placement="right"
        open={props.visible}
        onClose={props.onChangeVisible}
        // visible={props.visible}
        bodyStyle={{ padding: 0 }}
        width={400}
      >
        <div
          style={{
            padding: '0 16px',
            background: 'white',
            display: 'flex',
            marginBottom: '12px',
          }}
        >
          <Input
            autoComplete="off"
            onPressEnter={onChangeSearch}
            onBlur={onChangeSearch}
            suffix={
              <IconFont
                type="search"
                style={{ color: '#BBBDBF', fontSize: 16 }}
              />
            }
            placeholder={t('project.searchMember')}
            allowClear
          />
          {getIsPermission(
            projectInfo?.projectPermissions,
            'b/project/member/save',
          ) ? null : (
            <ButtonWrap type="primary" onClick={() => setIsVisible(true)}>
              {t('project.addMember1')}
            </ButtonWrap>
          )}
        </div>
        {memberList?.length > 0 ? (
          <ListWrap>
            {memberList?.map((i: any) => (
              <ListItem key={i.id}>
                <div className="avatarBox">
                  {i.avatar ? (
                    <img src={i.avatar} alt="" />
                  ) : (
                    <NameWrap>
                      {String(i.name?.trim().slice(0, 1)).toLocaleUpperCase()}
                    </NameWrap>
                  )}
                  <div>
                    <span>
                      {i.name}
                      {i.nickname ? `(${i.nickname})` : ''}
                    </span>
                    <span>
                      {i.positionName || '--'}
                      {i.is_admin === 1 ? `  （${t('new_p1.a8')}）` : ''}
                    </span>
                  </div>
                </div>
                {hasEdit && i.is_admin !== 1 ? (
                  <MoreDropdown
                    onClickMenu={onClickMenu}
                    roleOptions={roleOptions}
                    row={i}
                    name={i.positionName}
                  />
                ) : (
                  <span
                    style={{
                      color: '#969799',
                      fontSize: '12px',
                      marginRight: '18px',
                    }}
                  >
                    {i.roleName}
                  </span>
                )}
              </ListItem>
            ))}
          </ListWrap>
        ) : (
          <div style={{ height: 'calc(100% - 134px)' }}>
            <NoData />
          </div>
        )}
      </DrawerWrap>
    </WaiWrap>
  )
}

export default Member
