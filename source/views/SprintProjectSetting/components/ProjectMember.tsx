// 项目设置-项目成员

/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-undefined */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-len */
import {
  SelectWrapBedeck,
  HoverWrap,
  SelectWrap,
  DividerWrap,
} from '@/components/StyleCommon'
import styled from '@emotion/styled'
import { css } from '@emotion/css'
import IconFont from '@/components/IconFont'
import { useState, useEffect, useRef, useMemo } from 'react'
import { Menu, message, Form, Space, Checkbox, Tooltip, Table } from 'antd'
import { useSearchParams, useNavigate } from 'react-router-dom'
import Sort from '@/components/Sort'
import PermissionWrap from '@/components/PermissionWrap'
import { getIsPermission, getParamsData } from '@/tools'
import { useTranslation } from 'react-i18next'
import NoData from '@/components/NoData'
import SetPermissionWrap from './SetPermission'
import { encryptPhp } from '@/tools/cryptoPhp'
import MoreDropdown from '@/components/MoreDropdown'
import useSetTitle from '@/hooks/useSetTitle'
import TableSelectOptions from '@/components/TableSelectOptions'
import { getAddDepartMember, getPositionSelectList } from '@/services/staff'
import { updateProjectRole } from '@/services/sprint'
import BatchSetPermGroup from '@/views/ProjectSetting/components/BatchSetPermGroup'
import {
  addMember,
  getProjectInfo,
  getProjectMember,
  getProjectPermission,
  updateMember,
  batchUpdateMember,
} from '@/services/project'
import { useDispatch, useSelector } from '@store/index'
import { setIsUpdateMember, setProjectInfo } from '@store/project'
import InputSearch from '@/components/InputSearch'
import CommonButton from '@/components/CommonButton'
import PaginationBox from '@/components/TablePagination'
import ResizeTable from '@/components/ResizeTable'
import ProjectOverModal from '@/components/ProjectOverModal'
import type { CheckboxChangeEvent } from 'antd/lib/checkbox'
import BatchAction, { boxItem } from '@/components/BatchOperation/BatchAction'
import ScreenMinHover from '@/components/ScreenMinHover'
import CommonUserAvatar from '@/components/CommonUserAvatar'
import { getMessage } from '@/components/Message'
import { menuList } from '@/views/SprintProjectManagement/config'
import CommonIconFont from '@/components/CommonIconFont'
import NewAddUserModalForTandD from '@/components/NewAddUserModal/NewAddUserModalForTandD/NewAddUserModalForTandD'
const Wrap = styled.div({
  padding: '0 24px',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  overflow: 'auto',
})

const Header = styled.div({
  background: 'white',
  // padding: '0 24px',
})

const HeaderTop = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  zIndex: 1,
  marginBottom: 20,
})

const Content = styled.div({
  // padding: 16,
  height: 'calc(100% - 32px)',
})

const FilterWrap = styled(Form)({
  display: 'flex',
  minHeight: 64,
  alignItems: 'center',
  borderBottom: '1px solid var(--neutral-n6-d1)',
})

const SearchWrap = styled(Space)({
  display: 'flex',
  alignItems: 'center',
  minHeight: 64,
  background: 'white',
  flexWrap: 'wrap',
})

const NameWrap = styled.span({
  width: 32,
  height: 32,
  borderRadius: '50%',
  marginRight: 8,
  textAlign: 'center',
  lineHeight: '32px',
  background: '#A4ACF5',
  color: 'white',
  // marginLeft: 32,
})
const selectOptionsIcon = css`
  color: var(--neutral-n4);
  margin-left: 10px;
  cursor: pointer;
`
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
const OptionDropTd = styled.div`
  height: 52px;
  display: flex;
  align-items: center;
  cursor: pointer;
`
const ProjectMember = (props: { searchValue?: string }) => {
  const asyncSetTtile = useSetTitle()
  const [t] = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [isVisible, setIsVisible] = useState(true)
  const [isAddVisible, setIsAddVisible] = useState(false)
  const [isDelete, setIsDelete] = useState(false)
  const [operationItem, setOperationItem] = useState<any>({})
  const [memberList, setMemberList] = useState<any>({ list: undefined })
  const [jobList, setJobList] = useState<any>([])
  const [projectPermission, setProjectPermission] = useState<any>([])
  const { userInfo } = useSelector(store => store.user)
  const { projectInfo, isUpdateMember } = useSelector(store => store.project)
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
  const [form] = Form.useForm()
  const [order, setOrder] = useState<any>({ value: '', key: '' })
  const [pageObj, setPageObj] = useState<any>({ page: 1, size: 20 })
  const [isSpinning, setIsSpinning] = useState(false)
  const [isEditVisible, setIsEditVisible] = useState(false)
  const [batchEditVisible, setBatchEditVisible] = useState(false)
  const [departments, setDepartments] = useState([])
  const [member, setMember] = useState<any>()
  const [userDataList, setUserDataList] = useState<any[]>([])
  const [selectRowKey, setSelectRowKey] = useState('')
  const [optionsDrop, setOptionsDrop] = useState(false)
  asyncSetTtile(`${t('title.a2')}【${projectInfo.name ?? ''}】`)
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([])
  const dispatch = useDispatch()

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
    setMemberList({ list: undefined })
    setIsSpinning(true)
    const values = await form.getFieldsValue()
    const result = await getProjectMember({
      projectId,
      order: orderVal?.value,
      orderKey: orderVal?.key,
      page: pagePrams?.page,
      pageSize: pagePrams?.size,
      ...values,
      searchValue: props?.searchValue,
    })
    // console.log('resulue', result)
    setMemberList(result)
    setIsSpinning(false)
    dispatch(setIsUpdateMember(false))
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
    getJobList()
    getPermission()
    // dispatch(getProjectRole({ projectId }))
  }, [])

  useEffect(() => {
    getList(order, { ...pageObj, page: 1 })
  }, [props?.searchValue])

  const onChangePage = (page: number, size: number) => {
    setPageObj({ page, size })
    getList(order, { page, size })
  }

  const onOperationMember = (item: any, type: string) => {
    setOperationItem(item)
    if (type === 'del') {
      setIsDelete(true)
    } else {
      setIsEditVisible(true)
    }
  }

  const onReset = () => {
    form.resetFields()
    getList(order, { page: 1, size: pageObj.size })
  }

  const onValuesChange = () => {
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
      navigate('/ProjectManagement/Mine/profile')
    } else {
      const params = encryptPhp(
        JSON.stringify({ id: projectId, isMember: true, userId: row.id }),
      )
      navigate(`/MemberInfo/Profile?data=${params}`)
    }
  }

  const onOperationCheckbox = (keys: number[]) => {
    const redClassElements = document.getElementsByClassName(
      'ant-checkbox-wrapper',
    )
    for (const i of redClassElements) {
      if (i.getElementsByClassName('tagLength')[0]) {
        i.removeChild(i.getElementsByClassName('tagLength')[0])
      }
      if (keys?.length > 0) {
        const div2 = document.createElement('div')
        div2.innerText = String(keys.length)
        div2.className = 'tagLength'
        i.appendChild(div2)
      }
    }
  }
  const onSelectChange = (keys: number[]) => {
    setSelectedRowKeys(keys)
    onOperationCheckbox(keys)
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
            <CommonUserAvatar avatar={record.avatar} size="small" />
            <div
              style={{
                marginLeft: 12,
                display: 'flex',
                color: 'var(--neutral-n1-d1)',
                fontSize: 14,
              }}
            >
              <span>{text}</span>
              {record.is_admin === 1 && (
                <Tooltip
                  placement="top"
                  title={t('project_leader')}
                  getPopupContainer={node => node}
                  zIndex={99999}
                  trigger="hover"
                >
                  <div style={{ cursor: 'pointer' }}>
                    <CommonIconFont
                      type="leader"
                      size={20}
                      color="#FA9746"
                    ></CommonIconFont>
                  </div>
                </Tooltip>
              )}
            </div>
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
      width: 200,
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
      width: 180,
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
      render: (text: string, record: any, index: number) => {
        return (
          <OptionDropTd
            style={{ position: 'relative' }}
            onMouseEnter={() => {
              setSelectRowKey(record.id)
            }}
            onMouseLeave={() => {
              setSelectRowKey('')
              setOptionsDrop(false)
            }}
            onClick={() => {
              setOptionsDrop(!optionsDrop)
            }}
          >
            <span>
              {text}
              {record.id === selectRowKey && (
                <label className={selectOptionsIcon}>
                  {' '}
                  <IconFont type="down-icon" />
                </label>
              )}
            </span>
            {optionsDrop && record.id === selectRowKey ? (
              <TableSelectOptions
                roleName={text}
                callBack={data => setProjectClick(data, record, index)}
              ></TableSelectOptions>
            ) : null}
          </OptionDropTd>
        )
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
                style={{
                  fontSize: 14,
                  color: 'var(--primary-d2)',
                  cursor: 'pointer',
                }}
              >
                {t('project.checkInfo')}
              </span>
            )}
          </>
        )
      },
    },
  ]
  // 修改角色权限
  const setProjectClick = async (
    data: Model.Sprint.ProjectSettings,
    record: any,
    index: number,
  ) => {
    // console.log(data, record, index)
    try {
      await updateProjectRole({
        user_group_id: data.id,
        project_id: projectId,
        user_id: record.id,
      })
      getMessage({ msg: t('common.editSuccess') as string, type: 'success' })
      setMemberList((prevData: any) => {
        let obj = { ...prevData }
        let cloneList = [...obj.list]
        cloneList[index] = { ...record, roleName: data.name }
        obj.list = cloneList
        return obj
      })
      setOptionsDrop(false)
    } catch (error) {
      // getMessage({ msg: error as string, type: 'error' })
    }
  }
  const selectColumns: any = useMemo(() => {
    const initColumns = [
      {
        width: 40,
        render: (text: string, record: any) => {
          return hasDel && hasEdit ? null : <MoreDropdown menu={menu(record)} />
        },
      },
    ]
    initColumns.push(Table.SELECTION_COLUMN as any)
    return [...initColumns, ...columns]
  }, [columns])
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

  const onConfirmEdit = async (roleId: any) => {
    const params: any = {
      projectId,
      userGroupId: roleId,
      userIds: operationItem?.id,
    }
    try {
      await updateMember(params)
      getMessage({ msg: t('common.editSuccess') as string, type: 'success' })
      setOperationItem({})
      // 可以考虑不走接口修改
      onChangeUpdate()
      setIsEditVisible(false)
    } catch (error) {
      //
    }
  }
  const onConfirmBatchEdit = async (roleId: any) => {
    try {
      await batchUpdateMember({
        projectId,
        userGroupId: roleId,
        userIds: selectedRowKeys.map(i => Number(i)),
      })
      getMessage({ msg: t('report.list.success') as string, type: 'success' })
      setSelectedRowKeys([])
      getList(order, pageObj)
      setBatchEditVisible(false)
    } catch (error) {
      //
    }
  }

  // 更新项目信息
  const onUpdate = async () => {
    const result = await getProjectInfo({ projectId: projectInfo.id })
    dispatch(setProjectInfo(result))
  }

  const handleOk = async (list: any, userId: number) => {
    if (list.length <= 0) {
      getMessage({ msg: t('project.memberNull'), type: 'warning' })
      return
    }
    const params: any = {
      projectId,
      userGroupId: userId,
      userIds: list.map((el: any) => el.id),
    }
    await addMember(params)
    getMessage({ msg: t('common.addSuccess') as string, type: 'success' })
    setUserDataList([])
    getList(order, pageObj)
    setIsAddVisible(false)
    setTimeout(() => {
      form.resetFields()
      onUpdate()
    }, 100)
  }
  useEffect(() => {
    if (isAddVisible) {
      init()
    }
  }, [isAddVisible])

  useEffect(() => {
    if (isUpdateMember) {
      getList(order, { page: 1, size: pageObj.size })
    }
  }, [isUpdateMember])

  const refresh = () => {
    getList(order, pageObj)
  }
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }

  // 判断是否详情回来，并且权限是不是有
  const isLength =
    projectInfo?.id && projectInfo?.projectPermissions?.length <= 0

  return (
    <PermissionWrap
      auth="b/project/member"
      permission={
        isLength
          ? ['0']
          : projectInfo?.projectPermissions?.map((i: any) => i.identity)
      }
    >
      <Wrap>
        <SetPermissionWrap
          data={operationItem}
          isVisible={isEditVisible}
          onClose={() => {
            setIsEditVisible(false)
          }}
          onConfirm={onConfirmEdit}
          projectPermission={projectPermission}
        />
        <BatchSetPermGroup
          isVisible={batchEditVisible}
          onClose={() => {
            setBatchEditVisible(false)
          }}
          projectState={true}
          projectId={projectId}
          onConfirm={onConfirmBatchEdit}
        />
        <ProjectOverModal
          id={operationItem}
          visible={isDelete}
          close={() => setIsDelete(!isDelete)}
          confirm={() => getList(order, pageObj)}
        />

        <NewAddUserModalForTandD
          isPermisGroup
          userGroupId={
            projectPermission?.filter((i: any) => i.tagLabel === '参与者')[0]
              ?.value
          }
          title={t('project.addMember')}
          isVisible={isAddVisible}
          onClose={onClickCancel}
          onConfirm={handleOk}
          projectPermission={projectPermission}
        />

        <BatchAction
          open={selectedRowKeys.length > 0}
          onCancel={() => setSelectedRowKeys([])}
        >
          <Tooltip
            placement="top"
            getPopupContainer={node => node}
            title={t('common.permissionGroup')}
          >
            <div className={boxItem} onClick={() => setBatchEditVisible(true)}>
              <IconFont type="lock" />
            </div>
          </Tooltip>
        </BatchAction>

        <Header>
          <HeaderTop>
            <Space size={24}>
              {!hasAdd && (
                <CommonButton
                  type="primary"
                  icon="plus"
                  iconPlacement="left"
                  onClick={onChangeValue}
                >
                  {t('project.addMember1')}
                </CommonButton>
              )}
            </Space>
            <Space size={8}>
              <ScreenMinHover
                label={t('common.search')}
                icon="filter"
                onClick={onChangeFilter}
                isActive={!isVisible}
              />
              <DividerWrap type="vertical" />
              <ScreenMinHover
                label={t('common.refresh')}
                icon="sync"
                onClick={refresh}
              />
            </Space>
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
                style={{
                  color: 'var(--primary-d2)',
                  fontSize: 15,
                  cursor: 'pointer',
                }}
                onClick={onReset}
              >
                {t('common.clearForm')}
              </div>
            </SearchWrap>
          </FilterWrap>
        </Header>
        <Content>
          <ResizeTable
            isSpinning={isSpinning}
            dataWrapNormalHeight="calc(100% - 64px)"
            col={selectColumns}
            dataSource={memberList?.list}
            rowSelection={rowSelection}
            noData={<NoData />}
          />
          <PaginationBox
            total={memberList?.total}
            currentPage={memberList?.currentPage}
            pageSize={memberList?.pageSize}
            onChange={onChangePage}
          />
        </Content>
      </Wrap>
    </PermissionWrap>
  )
}

export default ProjectMember
