// 项目设置-项目成员

/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-undefined */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-len */
import {
  TableStyleBox,
  PaginationWrap,
  SelectWrapBedeck,
  HoverWrap,
} from '@/components/StyleCommon'
import SearchComponent from '@/components/SearchComponent'
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { Menu, Pagination, message, Select, Form, Spin, Space } from 'antd'
import { useModel } from '@/models'
import { useSearchParams, useNavigate } from 'react-router-dom'
import DeleteConfirm from '@/components/DeleteConfirm'
import Sort from '@/components/Sort'
import PermissionWrap from '@/components/PermissionWrap'
import { getIsPermission, getParamsData, openDetail } from '@/tools'
import { useTranslation } from 'react-i18next'
import NoData from '@/components/NoData'
import SetPermissionWrap from './SetPermission'
import { encryptPhp } from '@/tools/cryptoPhp'
import MoreDropdown from '@/components/MoreDropdown'
import useSetTitle from '@/hooks/useSetTitle'
import { StaffSelect } from '@xyfe/uikit'
import { getAddDepartMember } from '@/services/staff'
import { addMember } from '@/services/project'
import PubSub from 'pubsub-js'

const Wrap = styled.div({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
})

const Header = styled.div({
  background: 'white',
  padding: '0 24px',
})

const HeaderTop = styled.div({
  height: 64,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  zIndex: 1,
})

const Content = styled.div({
  padding: 16,
})

const FilterWrap = styled(Form)({
  display: 'flex',
  minHeight: 64,
  alignItems: 'center',
})

const SearchWrap = styled(Space)({
  display: 'flex',
  alignItems: 'center',
  minHeight: 64,
  background: 'white',
  flexWrap: 'wrap',
})

const SelectWrap = styled(Select)`
  .ant-select-selection-placeholder {
    color: black;
  }
  .ant-select-selector {
    min-width: 200px;
    border: none !important;
    outline: none !important;
  }
`

const NameWrap = styled.span({
  width: 32,
  height: 32,
  borderRadius: '50%',
  marginRight: 8,
  textAlign: 'center',
  lineHeight: '32px',
  background: '#A4ACF5',
  color: 'white',
  marginLeft: 32,
})

const DataWrap = styled.div({
  background: 'white',
  overflowX: 'auto',
  height: 'calc(100% - 48px)',
})

const NewSort = (sortProps: any) => {
  return (
    <Sort
      fixedKey={sortProps.fixedKey}
      onChangeKey={sortProps.onUpdateOrderKey}
      nowKey={sortProps.nowKey}
      order={sortProps.order === 'asc' ? 1 : 2}
    >
      {sortProps.children}
    </Sort>
  )
}

const ProjectMember = () => {
  const asyncSetTtile = useSetTitle()
  const [t] = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [isVisible, setIsVisible] = useState(true)
  const [isAddVisible, setIsAddVisible] = useState(false)
  const [isDelete, setIsDelete] = useState(false)
  const [operationItem, setOperationItem] = useState<any>({})
  const [memberList, setMemberList] = useState<any>({
    list: undefined,
  })
  const [jobList, setJobList] = useState<any>([])
  const {
    getProjectMember,
    deleteMember,
    projectPermission,
    projectInfo,
    isRefreshMember,
    updateMember,
    getProjectInfoValues,
    getMemberList,
    getProjectPermission,
    setProjectPermission,
    getProjectInfo,
  } = useModel('project')
  const { getPositionSelectList } = useModel('staff')
  const { userInfo } = useModel('user')
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
  const [form] = Form.useForm()
  const [order, setOrder] = useState<any>({ value: '', key: '' })
  const [pageObj, setPageObj] = useState<any>({ page: 1, size: 20 })
  const stickyWrapDom = useRef<HTMLDivElement>(null)
  const [filterHeight, setFilterHeight] = useState<any>(64)
  const [isSpinning, setIsSpinning] = useState(false)
  const [isEditVisible, setIsEditVisible] = useState(false)
  const [dataWrapHeight, setDataWrapHeight] = useState(0)
  const [tableWrapHeight, setTableWrapHeight] = useState(0)
  const [departments, setDepartments] = useState([])
  const [member, setMember] = useState<any>()
  const [userDataList, setUserDataList] = useState<any[]>([])
  const dataWrapRef = useRef<HTMLDivElement>(null)
  asyncSetTtile(`${t('title.a2')}【${projectInfo.name ?? ''}】`)
  useLayoutEffect(() => {
    if (dataWrapRef.current) {
      const currentHeight = dataWrapRef.current.clientHeight
      if (currentHeight !== dataWrapHeight) {
        setDataWrapHeight(currentHeight)
      }

      const tableBody = dataWrapRef.current.querySelector('.ant-table-tbody')
      if (tableBody && tableBody.clientHeight !== tableWrapHeight) {
        setTableWrapHeight(tableBody.clientHeight)
      }
    }
  }, [memberList])

  const tableY =
    tableWrapHeight > dataWrapHeight - 52 ? dataWrapHeight - 52 : void 0

  const hasAdd = getIsPermission(
    projectInfo?.projectPermissions,
    'b/project/member/save',
  )
  const hasDel = getIsPermission(
    projectInfo?.projectPermissions,
    'b/project/member/delete',
  )
  const hasEdit = getIsPermission(
    projectInfo?.projectPermissions,
    'b/project/member/update',
  )

  const hasCheck = getIsPermission(
    projectInfo?.projectPermissions,
    'b/project/member/info',
  )

  const getList = async (orderVal?: any, pagePrams?: any) => {
    setIsSpinning(true)
    const values = await form.getFieldsValue()
    const result = await getProjectMember({
      projectId,
      order: orderVal?.value,
      orderKey: orderVal?.key,
      page: pagePrams?.page,
      pageSize: pagePrams?.size,
      ...values,
    })
    setMemberList(result)
    setIsSpinning(false)
  }

  const getJobList = async () => {
    const result = await getPositionSelectList()
    const arr = result.data?.map((i: any) => ({
      label: i.name,
      value: i.id,
    }))
    setJobList(arr)
  }

  // 获取项目权限组
  const getPermission = async () => {
    const res = await getProjectPermission({ projectId })
    setProjectPermission(
      res.list?.map((i: any) => ({
        label: i.name,
        value: i.id,
        tagLabel: i.label,
      })),
    )
  }

  useEffect(() => {
    getList(order, pageObj)
    getJobList()
    getPermission()
  }, [])

  useEffect(() => {
    if (isRefreshMember) {
      getList(order, { page: 1, size: pageObj.size })
    }
  }, [isRefreshMember])

  const onChangePage = (page: number, size: number) => {
    setPageObj({ page, size })
    getList(order, { page, size })
  }

  const onShowSizeChange = (current: number, size: number) => {
    form.setFieldsValue({
      pageSize: size,
      page: 1,
    })
    setPageObj({ page: current, size })
    getList(order, { page: current, size })
  }

  const onOperationMember = (item: any, type: string) => {
    setOperationItem(item)
    if (type === 'del') {
      setIsDelete(true)
    } else {
      setIsEditVisible(true)
    }
  }

  const onDeleteConfirm = async () => {
    try {
      await deleteMember({ projectId, userId: operationItem.id })
      message.success(t('common.deleteSuccess'))
      setIsDelete(false)
      setOperationItem({})
      if (operationItem.id === userInfo?.id) {
        navigate('/Project')
      } else {
        getList(order, pageObj)
        getMemberList({ all: true, projectId })
      }
    } catch (error) {
      //
    }
  }

  const onReset = () => {
    form.resetFields()
    getList(order, { page: 1, size: pageObj.size })
  }

  const onValuesChange = () => {
    getList(order, { page: 1, size: pageObj.size })
  }

  const onChangeSearch = (val: string) => {
    form.setFieldsValue({ searchValue: val })
    getList(order, { page: 1, size: pageObj.size })
  }

  const menu = (item: any) => {
    let menuItems = [
      {
        key: '1',
        label: (
          <div onClick={() => onOperationMember(item, 'edit')}>
            {t('common.edit')}
          </div>
        ),
      },
      {
        key: '2',
        label: (
          <div onClick={() => onOperationMember(item, 'del')}>
            {t('common.move')}
          </div>
        ),
      },
    ]

    if (hasEdit) {
      menuItems = menuItems.filter((i: any) => i.key !== '1')
    }

    if (hasDel) {
      menuItems = menuItems.filter((i: any) => i.key !== '2')
    }

    const hasUser = memberList?.list?.filter(
      (i: any) => i.roleName === '管理员',
    ).length

    if (hasUser === 1 && item.roleName === '管理员') {
      menuItems = menuItems.filter((i: any) => i.key !== '2')
    }

    return <Menu items={menuItems} />
  }

  const onUpdateOrderKey = (key: any, val: any) => {
    setOrder({ value: val === 2 ? 'desc' : 'asc', key })
    getList(
      { value: val === 2 ? 'desc' : 'asc', key },
      { page: 1, size: pageObj.size },
    )
  }

  const onToDetail = (row: any) => {
    if (row.id === userInfo.id) {
      openDetail('/mine')
    } else {
      const params = encryptPhp(
        JSON.stringify({ id: projectId, isMember: true, userId: row.id }),
      )
      openDetail(`/Detail/MemberInfo/profile?data=${params}`)
    }
  }

  const columns = [
    {
      title: (
        <NewSort
          fixedKey="nickname"
          nowKey={order.key}
          order={order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('common.nickname')}
        </NewSort>
      ),
      dataIndex: 'nickname',
      width: 240,
      render: (text: string, record: any) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {hasDel && hasEdit ? null : <MoreDropdown menu={menu(record)} />}
            {record.avatar ? (
              <img
                src={record.avatar}
                alt=""
                style={{
                  marginLeft: 32,
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                }}
              />
            ) : (
              <NameWrap>
                {String(record.name?.trim().slice(0, 1)).toLocaleUpperCase()}
              </NameWrap>
            )}
            <span style={{ marginLeft: 12, color: '#323233', fontSize: 14 }}>
              {text}
            </span>
          </div>
        )
      },
    },
    {
      title: (
        <NewSort
          fixedKey="name"
          nowKey={order.key}
          order={order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('project.realName')}
        </NewSort>
      ),
      dataIndex: 'name',
      width: 180,
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
    {
      title: (
        <NewSort
          fixedKey="gender"
          nowKey={order.key}
          order={order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('common.sex')}
        </NewSort>
      ),
      dataIndex: 'gender',
      width: 120,
      render: (text: number) => {
        return <span>{text === 1 ? t('common.male') : t('common.female')}</span>
      },
    },
    {
      title: (
        <NewSort
          fixedKey="department_name"
          nowKey={order.key}
          order={order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('common.department')}
        </NewSort>
      ),
      dataIndex: 'departmentName',
      width: 160,
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
    {
      title: (
        <NewSort
          fixedKey="position_name"
          nowKey={order.key}
          order={order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('common.job')}
        </NewSort>
      ),
      dataIndex: 'positionName',
      width: 120,
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
    {
      title: (
        <NewSort
          fixedKey="role_name"
          nowKey={order.key}
          order={order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('project.projectPermission')}
        </NewSort>
      ),
      dataIndex: 'roleName',
      width: 200,
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
    {
      title: (
        <NewSort
          fixedKey="created_at"
          nowKey={order.key}
          order={order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('project.joinTime')}
        </NewSort>
      ),
      dataIndex: 'joinTime',
      width: 200,
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
    {
      title: t('newlyAdd.operation'),
      dataIndex: 'action',
      width: 120,
      fixed: 'right',
      render: (text: string, record: any) => {
        return (
          <>
            {hasCheck ? (
              '--'
            ) : (
              <span
                onClick={() => onToDetail(record)}
                style={{ fontSize: 14, color: '#2877ff', cursor: 'pointer' }}
              >
                {t('project.checkInfo')}
              </span>
            )}
          </>
        )
      },
    },
  ]

  const onChangeUpdate = () => {
    setOperationItem({})
    getList(order, pageObj)
  }

  const onChangeValue = () => {
    setOperationItem({})
    setIsAddVisible(!isAddVisible)
  }

  const onChangeFilter = () => {
    setIsVisible(!isVisible)
    setTimeout(() => {
      setFilterHeight(stickyWrapDom.current?.clientHeight)
    }, 100)
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
  const init = async () => {
    const res2 = await getAddDepartMember(projectId)

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
  const onClickCancel = () => {
    setIsAddVisible(false)
  }
  const onChangeMember = (value: any) => {
    setUserDataList(value)
  }
  const onConfirmEdit = async (roleId: any) => {
    const params: any = {
      projectId,
      userGroupId: roleId,
      userIds: operationItem?.id,
    }
    try {
      await updateMember(params)
      message.success(t('common.editSuccess'))
      setOperationItem({})
      onChangeUpdate()
      getMemberList({ all: true, projectId })
      getProjectInfoValues({ projectId })
      setIsEditVisible(false)
    } catch (error) {
      //
    }
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
      projectId,
      userGroupId,
      userIds: userDataList,
    }
    await addMember(params)
    message.success(t('common.addSuccess'))
    setUserDataList([])
    getList(order, pageObj)
    setIsAddVisible(false)
    setTimeout(() => {
      form.resetFields()
      getProjectInfo({ projectId: projectId })
    }, 100)
  }
  useEffect(() => {
    if (isAddVisible) {
      init()
    }
  }, [isAddVisible])

  useEffect(() => {
    PubSub.subscribe('getPeople', () => {
      getList(order, { page: 1, size: pageObj.size })
    })
  }, [])

  return (
    <PermissionWrap
      auth="b/project/member"
      permission={projectInfo.projectPermissions}
      isType={2}
      isPadding
    >
      <Wrap>
        <SetPermissionWrap
          data={operationItem}
          isVisible={isEditVisible}
          onClose={() => {
            setIsEditVisible(false)
          }}
          onConfirm={onConfirmEdit}
        />
        <DeleteConfirm
          text={t('mark.delPeople')}
          isVisible={isDelete}
          onChangeVisible={() => setIsDelete(!isDelete)}
          onConfirm={onDeleteConfirm}
        />

        <StaffSelect
          title={t('project.addMember')}
          user={userObj as any}
          departments={departments}
          staffListAll={member}
          visible={isAddVisible}
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
        <Header>
          <HeaderTop>
            <SearchComponent
              onChangeVisible={onChangeValue}
              text={t('project.addMember1')}
              placeholder={t('project.pleaseNickname')}
              onChangeSearch={onChangeSearch}
              isPermission={hasAdd}
            />
            <HoverWrap onClick={onChangeFilter} isActive={!isVisible}>
              <IconFont className="iconMain" type="filter" />
              <span className="label">{t('common.search')}</span>
            </HoverWrap>
          </HeaderTop>
          <FilterWrap
            hidden={isVisible}
            form={form}
            onValuesChange={onValuesChange}
          >
            <SearchWrap size={16}>
              <SelectWrapBedeck>
                <span style={{ margin: '0 16px', fontSize: '14px' }}>
                  {t('common.job')}
                </span>
                <Form.Item name="searchValue" />
                <Form.Item name="jobIds" noStyle>
                  <SelectWrap
                    showArrow
                    mode="multiple"
                    style={{ width: '100%' }}
                    placeholder={t('common.all')}
                    showSearch
                    options={jobList}
                    optionFilterProp="label"
                    allowClear
                  />
                </Form.Item>
              </SelectWrapBedeck>
              <SelectWrapBedeck>
                <span style={{ margin: '0 16px', fontSize: '14px' }}>
                  {t('common.permissionGroup')}
                </span>
                <Form.Item name="userGroupIds" noStyle>
                  <SelectWrap
                    showArrow
                    mode="multiple"
                    style={{ width: '100%' }}
                    placeholder={t('common.all')}
                    showSearch
                    options={projectPermission}
                    optionFilterProp="label"
                    allowClear
                  />
                </Form.Item>
              </SelectWrapBedeck>
              <div
                style={{ color: '#2877FF', fontSize: 15, cursor: 'pointer' }}
                onClick={onReset}
              >
                {t('common.clearForm')}
              </div>
            </SearchWrap>
          </FilterWrap>
        </Header>
        <Content style={{ height: `calc(100% - ${filterHeight}px)` }}>
          <DataWrap ref={dataWrapRef}>
            <Spin spinning={isSpinning}>
              {!!memberList?.list &&
                (memberList?.list?.length > 0 ? (
                  <TableStyleBox
                    isPadding
                    isBottom
                    rowKey="id"
                    columns={columns as any}
                    dataSource={memberList?.list}
                    pagination={false}
                    scroll={{
                      x: 'max-content',
                      y: tableY,
                    }}
                    tableLayout="auto"
                    showSorterTooltip={false}
                  />
                ) : (
                  <NoData />
                ))}
            </Spin>
          </DataWrap>

          <PaginationWrap>
            <Pagination
              defaultCurrent={1}
              current={memberList?.currentPage}
              pageSize={memberList?.pageSize || 20}
              showSizeChanger
              showQuickJumper
              total={memberList?.total}
              showTotal={total => t('common.tableTotal', { count: total })}
              pageSizeOptions={['10', '20', '50']}
              onChange={onChangePage}
              onShowSizeChange={onShowSizeChange}
            />
          </PaginationWrap>
        </Content>
      </Wrap>
    </PermissionWrap>
  )
}

export default ProjectMember
