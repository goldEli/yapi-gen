import { useEffect, useMemo, useState, type SetStateAction } from 'react'
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import { Button, Dropdown, Menu, Pagination } from 'antd'
import type { CheckboxValueType } from 'antd/lib/checkbox/Group'
import { useDynamicColumns } from './components/StaffTable'
import { OptionalFeld } from '@/components/OptionalFeld'
import { StaffPersonal } from './components/StaffPower'
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

const Staff = () => {
  const [isShow, setIsShow] = useState<boolean>(true)
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
  const [staffPersonalVisible, setStaffPersonalVisible]
    = useState<boolean>(false)
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
  const controlStaffPersonalVisible = () => {
    setStaffPersonalVisible(true)
  }
  const closeStaffPersonal = () => {
    setStaffPersonalVisible(false)
  }
  const columns = useDynamicColumns({
    controlStaffPersonalVisible,
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

  const onChangePage = () => {

    //
  }
  const onShowSizeChange = () => {

    //
  }
  useEffect(() => {

    //
  }, [])
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
      {isShow ? (
        <SearchList
          onSearch={() => {

            //
          }}
        />
      ) : null}

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
          hideOnSinglePage
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
      />

      <StaffPersonal
        visible={staffPersonalVisible}
        close={closeStaffPersonal}
      />
    </>
  )
}

export default Staff
