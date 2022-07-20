import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from '@emotion/styled'
import { useNavigate } from 'react-router-dom'
import { css } from '@emotion/css'
import IconFont from '@/components/IconFont'
import { Button, Dropdown, Input, Menu, Pagination, Table } from 'antd'
import { CheckboxValueType } from 'antd/lib/checkbox/Group'
import { useDynamicColumns } from './components/StaffTable'
import { OptionalFeld } from '@/components/OptionalFeld'
import { StaffPersonal } from './components/StaffPower'
import {
  StaffHeader,
  Hehavior,
  PaginationWrap,
  StaffTableWrap,
  MyInput,
  SearchLine,
  SetButton,
  StyledTable,
} from '@/components/StyleCommon'
import TableFilter from '@/components/TableFilter'

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

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 12 Lake Park',
    feiji: 'New York No. 22 Lake Park',
    level: 1,
  },
  {
    key: '2',
    name: 'John Brown',
    age: 3222,
    address: 'New York No. 1 Lake Park',
    feiji: 'New York No. 12222 Lake Park',
    level: 2,
  },
]
export const plainOptions = [
  { label: 'id', value: 'name' },
  { label: 'id1', value: 'age' },
  { label: 'id2', value: 'address' },
  { label: 'id3', value: 'address1' },
  { label: 'id4', value: 'address2' },
]
export const plainOptions2 = [
  { label: '飞机', value: 'feiji' },
  { label: '大炮', value: 'dapao' },
  { label: '坦克', value: 'tanke' },
  { label: '直升机', value: 'zhishengji' },
  { label: '战舰', value: 'zhanjian' },
]
export default () => {
  const navigate = useNavigate()
  const [isShow, setIsShow] = useState<boolean>(true)
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
  const [staffPersonalVisible, setStaffPersonalVisible] =
    useState<boolean>(false)
  const [titleList, setTitleList] = useState<CheckboxValueType[]>([
    'name',
    'age',
    'address',
  ])
  const [titleList2, setTitleList2] = useState<CheckboxValueType[]>([
    'feiji',
    'dapao',
    'tanke',
  ])
  const controlStaffPersonalVisible = (
    record: Record<string, string | number>,
  ) => {
    console.log(record)

    setStaffPersonalVisible(true)
  }
  const closeStaffPersonal = () => {
    setStaffPersonalVisible(false)
  }
  const columns = useDynamicColumns({
    controlStaffPersonalVisible,
  })

  const selectColum = useMemo(() => {
    let arr = [...titleList, ...titleList2]
    let newList = []
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < columns.length; j++) {
        if (arr[i] === columns[j].key) {
          newList.push(columns[j])
        }
      }
    }
    return newList
  }, [titleList, columns])

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

  const onChangePage = (page: React.SetStateAction<number>, size: any) => {
    console.log(page, size)
  }

  const onShowSizeChange = (current: number, pageSize: number) => {
    console.log(current, pageSize)
  }
  useEffect(() => {}, [])
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
  const searchData = [
    {
      name: '迭代',
      key: 'name',
      type: 'select',
      children: [
        {
          name: 'jack',
        },
        {
          name: 'Lucy',
        },
        {
          name: 'Disabled',
        },
        {
          name: 'yiminghe',
        },
      ],
    },
    {
      name: '职位',
      key: 'age',
      type: 'select',
      children: [
        {
          name: 'jack',
        },
        {
          name: 'Lucy',
        },
        {
          name: 'Disabled',
        },
        {
          name: 'yiminghe',
        },
      ],
    },
    {
      name: '权限组',
      key: 'tall',
      type: 'select',
      children: [
        {
          name: 'jack',
        },
        {
          name: 'Lucy',
        },
        {
          name: 'Disabled',
        },
        {
          name: 'yiminghe',
        },
      ],
    },
  ]
  const list = [
    { name: '人员' },
    { name: '需求' },
    { name: '迭代' },
    { name: '时间' },
    { name: '状态' },
  ]

  return (
    <>
      <StaffHeader>敏捷系统V2.0</StaffHeader>
      <Hehavior>
        <div style={{ display: 'flex' }}>
          <Reset>刷新</Reset>
          <MyInput
            suffix={
              <IconFont
                type="search"
                style={{ color: '#BBBDBF', fontSize: 20 }}
              />
            }
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
      {isShow && (
        <SearchLine>
          <TableFilter allList={list} list={searchData}></TableFilter>
        </SearchLine>
      )}

      <StaffTableWrap>
        <StyledTable
          rowKey="key"
          columns={selectColum}
          dataSource={data}
          pagination={false}
          scroll={{ x: 'max-content' }}
        />
      </StaffTableWrap>

      <PaginationWrap>
        <Pagination
          defaultCurrent={1}
          current={1}
          showSizeChanger
          showQuickJumper
          total={200}
          showTotal={total => `Total ${total} items`}
          pageSizeOptions={['10', '20', '50']}
          onChange={onChangePage}
          onShowSizeChange={onShowSizeChange}
          hideOnSinglePage={true}
        />
      </PaginationWrap>

      <OptionalFeld
        plainOptions={plainOptions}
        plainOptions2={plainOptions2}
        checkList={titleList}
        checkList2={titleList2}
        visible={isModalVisible}
        close={close2}
        getCheckList={getCheckList}
      ></OptionalFeld>

      <StaffPersonal
        visible={staffPersonalVisible}
        close={closeStaffPersonal}
      ></StaffPersonal>
    </>
  )
}
