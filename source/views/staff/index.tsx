import { useEffect, useMemo, useState } from 'react'
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import { Button, Dropdown, Menu, Pagination } from 'antd'
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

const Reset = styled.div`
  width: 60px;
  height: 32px;
  background: rgba(40, 119, 255, 1);
  background-blend-mode: normal;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 16px 5px 16px;
  margin-left: 24px;
`

const Staff = () => {
  const { getStaffList, refreshStaff, updateStaff } = useModel('staff')
  const [isShow, setIsShow] = useState<boolean>(true)
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
  const [staffPersonalVisible, setStaffPersonalVisible]
    = useState<boolean>(false)
  const [titleList, setTitleList] = useState<CheckboxValueType[]>([
    'name',
    'email',
    'phone',
    'department_name',
    'gender',
    'nickname',
    'position_name',
    'project_num',
    'role_name',
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
    setPlainOptions2(res.plainOptions2)
  }
  const init = () => {
    getStaffListData()
  }
  const controlStaffPersonalVisible = (e: any) => {
    setEditData(e)
    setStaffPersonalVisible(true)
  }
  const closeStaffPersonal = (e: any) => {
    updateStaff(e)
    setStaffPersonalVisible(false)
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
  const onSearch = (e: any) => {
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
    setKeyword(e.target.value)
  }
  useEffect(() => {
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pagesize, keyword, searchGroups, orderKey, order])
  const menu = (
    <Menu
      items={[
        {
          key: '1',
          label: <Button onClick={showModal}>设置显示字段</Button>,
        },
      ]}
    />
  )

  return (
    <>
      <StaffHeader>公司员工</StaffHeader>
      <Hehavior>
        <div style={{ display: 'flex' }}>
          <Reset onClick={() => refreshStaff()}>刷新</Reset>
          <MyInput
            suffix={
              <IconFont
                type="search"
                style={{ color: '#BBBDBF', fontSize: 20 }}
              />
            }
            onPressEnter={onPressEnter}
            placeholder="请输入昵称姓名邮箱电话"
            allowClear
          />
        </div>
        <div style={{ marginRight: '40px', display: 'flex' }}>
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
      <SearchList onSearch={onSearch} />
      <StaffTableWrap>
        <StyledTable
          rowKey="key"
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
          showTotal={newTotal => `Total ${newTotal} items`}
          pageSizeOptions={['10', '20', '50']}
          onChange={onChangePage}
          onShowSizeChange={onShowSizeChange}
          hideOnSinglePage
        />
      </PaginationWrap>

      <OptionalFeld
        plainOptions={plainOptions}
        plainOptions2={plainOptions2}
        checkList={titleList}
        checkList2={titleList2}
        isVisible={isModalVisible}
        onClose={close2}
        getCheckList={getCheckList}
      />

      <StaffPersonal
        data={editData}
        isVisible={staffPersonalVisible}
        onClose={() => {
          setStaffPersonalVisible(false)
        }}
        onConfirm={closeStaffPersonal}
      />
    </>
  )
}

export default Staff
