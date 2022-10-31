/* eslint-disable complexity */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-undefined */
/* eslint-disable max-lines */
/* eslint-disable multiline-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-len */
import {
  TableWrap,
  PaginationWrap,
  SelectWrapBedeck,
} from '@/components/StyleCommon'
import SearchComponent from '@/components/SearchComponent'
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import {
  Menu,
  Dropdown,
  Pagination,
  message,
  Select,
  Form,
  Spin,
  Space,
} from 'antd'
import AddMember from '@/views/Project/components/AddMember'
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

const RowIconFont = styled(IconFont)({
  visibility: 'hidden',
  fontSize: 16,
  cursor: 'pointer',
  color: '#2877ff',
})

const TableBox = styled(TableWrap)({
  '.ant-table table': {
    paddingBottom: 0,
  },
  '.ant-table-thead > tr > th:nth-child(1)': {
    paddingLeft: 64,
  },
  '.ant-table-row:hover': {
    [RowIconFont.toString()]: {
      visibility: 'visible',
    },
  },
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
    getProjectInfo,
    getMemberList,
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
  const dataWrapRef = useRef<HTMLDivElement>(null)

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
      order: orderVal.value,
      orderKey: orderVal.key,
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

  useEffect(() => {
    getList(order, pageObj)
    getJobList()
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
            {hasDel && hasEdit ? null : (
              <Dropdown
                overlay={() => menu(record)}
                trigger={['hover']}
                placement="bottom"
                getPopupContainer={node =>
                  memberList?.list?.length === 1 ? document.body : node
                }
              >
                <RowIconFont type="more" />
              </Dropdown>
            )}
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
      getProjectInfo({ projectId })
      setIsEditVisible(false)
    } catch (error) {
      //
    }
  }

  return (
    <PermissionWrap
      auth="b/project/member"
      permission={projectInfo.projectPermissions}
      isType={2}
      isPadding
    >
      <Wrap>
        {isEditVisible ? (
          <SetPermissionWrap
            data={operationItem}
            isVisible={isEditVisible}
            onClose={() => {
              setIsEditVisible(false)
            }}
            onConfirm={onConfirmEdit}
          />
        ) : null}
        <DeleteConfirm
          text={t('mark.delPeople')}
          isVisible={isDelete}
          onChangeVisible={() => setIsDelete(!isDelete)}
          onConfirm={onDeleteConfirm}
        />
        <AddMember
          value={isAddVisible}
          onChangeValue={onChangeValue}
          details={operationItem}
          onChangeUpdate={onChangeUpdate}
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
            <IconFont
              style={{ fontSize: 20, color: '#969799', cursor: 'pointer' }}
              type="filter"
              onClick={onChangeFilter}
            />
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
                  <TableBox
                    rowKey="id"
                    columns={columns as any}
                    dataSource={memberList?.list}
                    pagination={false}
                    scroll={{
                      x: columns.reduce(
                        (totalWidth: number, item: any) =>
                          totalWidth + item.width,
                        0,
                      ),
                      y: tableY,
                    }}
                    showSorterTooltip={false}
                    sticky
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
