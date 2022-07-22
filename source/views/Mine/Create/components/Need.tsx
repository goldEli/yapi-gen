import {
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import styled from '@emotion/styled'
import { useNavigate } from 'react-router-dom'
import { css } from '@emotion/css'
import {
  StaffHeader,
  Hehavior,
  PaginationWrap,
  StaffTableWrap,
  MyInput,
  SearchLine,
  SetButton,
  TabsItem,
  TabsHehavior,
  LabNumber,
  tabCss,
  ShowWrap,
  StyledTable,
} from '@/components/StyleCommon'
import IconFont from '@/components/IconFont'
import { Button, Dropdown, Menu, Pagination, Table } from 'antd'
import type { CheckboxValueType } from 'antd/lib/checkbox/Group'
import { useDynamicColumns } from './CreatePrejectTableColum'
import { OptionalFeld } from '@/components/OptionalFeld'
import EditCreate from './EditCreate'

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 12 Lake Park',
    feiji: 'New York No. 22 Lake Park',
    level: 1,
    shape: '规划中',
  },
  {
    key: '2',
    name: 'John Brown',
    age: 3222,
    address: 'New York No. 1 Lake Park',
    feiji: 'New York No. 12222 Lake Park',
    level: 2,
    shape: '实现中',
  },
  {
    key: '3',
    name: 'John Brown',
    age: 3222,
    address: 'New York No. 1 Lake Park',
    feiji: 'New York No. 12222 Lake Park',
    level: 3,
    shape: '已实现',
  },
  {
    key: '4',
    name: 'John Brown',
    age: 3222,
    address: 'New York No. 1 Lake Park',
    feiji: 'New York No. 12222 Lake Park',
    level: 4,
    shape: '已关闭',
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

const tabsList = [
  { name: '创建的项目', type: 1 },
  { name: '创建的需求', type: 2 },
]

const Need = () => {
  const [active, setActive] = useState(1)
  const navigate = useNavigate()
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
  const [isEditVisible, setIsEditVisible] = useState<boolean>(false)
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
  const levelTap = (value: any) => {

    //
  }
  const shapeTap = (value: any) => {

    //
  }
  const controlEditVisible = () => {
    setIsEditVisible(true)
  }
  const columns = useDynamicColumns({
    levelTap,
    shapeTap,
    controlEditVisible,
  })
  const onChangePage = (page: React.SetStateAction<number>, size: any) => {

    //
  }
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
  const onShowSizeChange = (current: number, pageSize: number) => {

    //
  }
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

  const onChange = (key: string) => {

    //
  }
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
      <Hehavior>
        <div>
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
          <SetButton>
            <IconFont type="filter" style={{ fontSize: 20 }} />
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
      <SearchLine />
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
      <EditCreate
        visible={isEditVisible}
        onChangeVisible={() => setIsEditVisible(false)}
      />
    </>
  )
}

export default Need
