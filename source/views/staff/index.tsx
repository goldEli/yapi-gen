import { useEffect, useMemo, useState } from 'react'
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import { Button, Dropdown, Menu, message, Pagination } from 'antd'
import type { CheckboxValueType } from 'antd/lib/checkbox/Group'
import { useDynamicColumns } from './components/StaffTable'
import { OptionalFeld } from '@/components/OptionalFeld'
import { StaffPersonal } from './components/StaffPower'
import { useModel } from '@/models'
import {
  StaffHeader,
  Hehavior,
  PaginationWrap,
  StaffTableWrap,
  MyInput,
  SetButton,
  StyledTable,
} from '@/components/StyleCommon'
import SearchList from './components/SearchList'
import PermissionWrap from '@/components/PermissionWrap'
import { getIsPermission } from '@/tools/index'
import NoData from '@/components/NoData'
import { css } from '@emotion/css'
import { useTranslation } from 'react-i18next'
import Loading from '@/components/Loading'

const tableWrapP = css`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  /* height:  800px; */
`
const Reset = styled.div`
  height: 32px;
  background: white;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 16px 5px 16px;
  margin-right: 16px;
  border: 1px solid #d5d6d9ff;
  color: #646566ff;
  cursor: pointer;
  &:hover {
    border: 1px solid rgba(40, 119, 255, 1);
    color: rgba(40, 119, 255, 1);
  }
`

const Staff = () => {
  const [t] = useTranslation()
  const { getStaffList, refreshStaff, updateStaff } = useModel('staff')
  const { userInfo } = useModel('user')
  const [isShow, setIsShow] = useState<boolean>(true)
  const [loadingState, setLoadingState] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const [pagesize, setPagesize] = useState<number>(10)
  const [total, setTotal] = useState<number>()
  const [keyword, setKeyword] = useState<string>('')
  const [searchGroups, setSearchGroups] = useState<any>({
    jobId: [],
    departmentId: [],
    userGroupId: [],
  })
  const [listData, setListData] = useState<any>([])
  const [editData, setEditData] = useState<any>({})
  const [plainOptions, setPlainOptions] = useState<any>([])
  const [plainOptions2, setPlainOptions2] = useState<any>([])
  const [orderKey, setOrderKey] = useState<any>()
  const [order, setOrder] = useState<any>(3)
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
  const [isStaffPersonalVisible, setIsStaffPersonalVisible]
    = useState<boolean>(false)
  const [titleList, setTitleList] = useState<CheckboxValueType[]>([
    'nickname',
    'name',
    'gender',
    'email',
    'phone',
    'department_name',
    'position_name',
    'project_num',
    'role_name',
    'status',
  ])
  const [titleList2, setTitleList2] = useState<CheckboxValueType[]>([
    'created_at',
  ])

  const getStaffListData = async () => {
    const res = await getStaffList({
      jobId: searchGroups.jobId,
      departmentId: searchGroups.departmentId,
      userGroupId: searchGroups.userGroupId,
      keyword,
      order,
      orderkey: orderKey,
      page,
      pagesize,
    })
    setListData(res.list)
    setTotal(res.pager.total)
    setPlainOptions(res.plainOptions)
    await setPlainOptions2(res.plainOptions2)
    setLoadingState(true)
  }
  const init = () => {
    getStaffListData()
  }
  const controlStaffPersonalVisible = (e: any) => {
    setEditData(e)
    setIsStaffPersonalVisible(true)
  }
  const closeStaffPersonal = async (e: any) => {
    const res = await updateStaff(e)

    if (res.code === 0) {
      message.success(res.message)
      getStaffListData()
      setIsStaffPersonalVisible(false)
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const updateOrderkey = (key: any, order: any) => {
    setOrderKey(key)
    setOrder(order)
  }

  const columns = useDynamicColumns({
    controlStaffPersonalVisible,
    orderKey,
    order,
    updateOrderkey,
  })

  const selectColum: any = useMemo(() => {
    const arr = [...titleList, ...titleList2]
    const newList = []
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < columns.length; j++) {
        if (arr[i] === columns[j].key) {
          newList.push(columns[j])
        }
      }
    }
    return newList
  }, [titleList, titleList2, columns])

  const showModal = () => {
    setIsModalVisible(true)
  }
  const close2 = () => {
    setIsModalVisible(false)
  }

  const getCheckList = (
    list: CheckboxValueType[],
    list2: CheckboxValueType[],
  ) => {
    setTitleList(list)
    setTitleList2(list2)
  }
  const onSearch = async (e: any) => {
    setSearchGroups({
      jobId: e.position,
      departmentId: e.department,
      userGroupId: e.userGroup,
    })
  }
  const onChangePage = (newPage: any) => {
    setPage(newPage)
  }
  const onShowSizeChange = (current: any, size: any) => {
    setPagesize(size)
  }
  const onPressEnter = (e: any) => {
    setPage(1)
    setKeyword(e.target.value)
  }
  useEffect(() => {
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pagesize, keyword, searchGroups, orderKey, order])
  const rest = async () => {
    const res = await refreshStaff()
    if (res.code === 0) {
      message.success('刷新成功')
      init()
    }
  }
  const menu = (
    <Menu
      items={[
        {
          key: '1',
          label: <span onClick={showModal}>{t('common.setField')}</span>,
        },
      ]}
    />
  )
  if (!loadingState) {
    return <Loading />
  }
  return (
    <PermissionWrap
      auth="b/user/list"
      permission={userInfo?.company_permissions}
    >
      <StaffHeader>{t('staff.companyStaff')}</StaffHeader>
      <Hehavior>
        <div style={{ display: 'flex' }}>
          <Reset onClick={rest}>刷新</Reset>
          <MyInput
            suffix={
              <IconFont
                type="search"
                style={{ color: '#BBBDBF', fontSize: 20 }}
              />
            }
            onPressEnter={onPressEnter}
            placeholder={t('staff.pleaseKey')}
            allowClear
          />
        </div>
        <div style={{ marginRight: '40px', display: 'flex' }}>
          <Reset onClick={rest}>刷新</Reset>
          <SetButton onClick={() => setIsShow(!isShow)}>
            <IconFont
              type="filter"
              style={{
                fontSize: 20,
                color: isShow ? 'rgba(40, 119, 255, 1)' : '',
              }}
            />
          </SetButton>
          <Dropdown overlay={menu} placement="bottomLeft">
            <SetButton>
              <IconFont
                type="set-default
              "
                style={{ fontSize: 20 }}
              />
            </SetButton>
          </Dropdown>
        </div>
      </Hehavior>
      {isShow ? <SearchList onSearch={onSearch} /> : null}

      <div className={tableWrapP}>
        <StaffTableWrap>
          <StyledTable
            rowKey="id"
            columns={selectColum}
            dataSource={listData}
            pagination={false}
            scroll={{ x: 'max-content' }}
          />
        </StaffTableWrap>

        <PaginationWrap>
          <Pagination
            pageSize={pagesize}
            current={page}
            showSizeChanger
            showQuickJumper
            total={total}
            showTotal={newTotal => t('common.tableTotal', { count: newTotal })}
            pageSizeOptions={['10', '20', '50']}
            onChange={onChangePage}
            onShowSizeChange={onShowSizeChange}
          />
        </PaginationWrap>
      </div>

      <OptionalFeld
        plainOptions={plainOptions}
        plainOptions2={plainOptions2}
        checkList={titleList}
        checkList2={titleList2}
        isVisible={isModalVisible}
        onClose={close2}
        getCheckList={getCheckList}
      />
      {isStaffPersonalVisible
        ? (
            <StaffPersonal
              data={editData}
              isVisible={isStaffPersonalVisible}
              onClose={() => {
                setIsStaffPersonalVisible(false)
              }}
              onConfirm={closeStaffPersonal}
            />
          )
        : null}
    </PermissionWrap>
  )
}

export default Staff
