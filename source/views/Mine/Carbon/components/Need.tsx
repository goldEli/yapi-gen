import React, { useCallback, useEffect, useMemo, useState } from 'react'
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
  StyledTable,
} from '@/components/StyleCommon'
import IconFont from '@/components/IconFont'
import { Button, Dropdown, Menu, Pagination, Table } from 'antd'
import { CheckboxValueType } from 'antd/lib/checkbox/Group'
import { useDynamicColumns } from './CreatePrejectTableColum'
import { OptionalFeld } from '@/components/OptionalFeld'

const titleCss = css`
  height: 54px;
  padding: 17px 0;
  color: rgba(150, 151, 153, 1);
  font-size: 14px;
`
const titleCssWrap = css`
  &:nth-of-type(1) {
    padding-top: 0;
  }
`
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
const moreData = [
  {
    name: '逾期',
    data: [
      {
        key: '5',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 12 Lake Park',
        feiji: 'New York No. 22 Lake Park',
        level: 1,
        shape: '规划中',
      },
      {
        key: '6',
        name: 'John Brown',
        age: 3222,
        address: 'New York No. 1 Lake Park',
        feiji: 'New York No. 12222 Lake Park',
        level: 2,
        shape: '实现中',
      },
      {
        key: '7',
        name: 'John Brown',
        age: 3222,
        address: 'New York No. 1 Lake Park',
        feiji: 'New York No. 12222 Lake Park',
        level: 3,
        shape: '已实现',
      },
      {
        key: '8',
        name: 'John Brown',
        age: 3222,
        address: 'New York No. 1 Lake Park',
        feiji: 'New York No. 12222 Lake Park',
        level: 4,
        shape: '已关闭',
      },
    ],
  },
  {
    name: '本月到期',
    data: [
      {
        key: '9',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 12 Lake Park',
        feiji: 'New York No. 22 Lake Park',
        level: 1,
        shape: '规划中',
      },
      {
        key: '10',
        name: 'John Brown',
        age: 3222,
        address: 'New York No. 1 Lake Park',
        feiji: 'New York No. 12222 Lake Park',
        level: 2,
        shape: '实现中',
      },
      {
        key: '11',
        name: 'John Brown',
        age: 3222,
        address: 'New York No. 1 Lake Park',
        feiji: 'New York No. 12222 Lake Park',
        level: 3,
        shape: '已实现',
      },
      {
        key: '12',
        name: 'John Brown',
        age: 3222,
        address: 'New York No. 1 Lake Park',
        feiji: 'New York No. 12222 Lake Park',
        level: 4,
        shape: '已关闭',
      },
    ],
  },
  {
    name: '今天到期',
    data: [
      {
        key: '13',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 12 Lake Park',
        feiji: 'New York No. 22 Lake Park',
        level: 1,
        shape: '规划中',
      },
      {
        key: '14',
        name: 'John Brown',
        age: 3222,
        address: 'New York No. 1 Lake Park',
        feiji: 'New York No. 12222 Lake Park',
        level: 2,
        shape: '实现中',
      },
      {
        key: '15',
        name: 'John Brown',
        age: 3222,
        address: 'New York No. 1 Lake Park',
        feiji: 'New York No. 12222 Lake Park',
        level: 3,
        shape: '已实现',
      },
      {
        key: '16',
        name: 'John Brown',
        age: 3222,
        address: 'New York No. 1 Lake Park',
        feiji: 'New York No. 12222 Lake Park',
        level: 4,
        shape: '已关闭',
      },
    ],
  },
  {
    name: '本周到期',
    data: [
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
    ],
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
export default () => {
  const [tableState, setTableState] = useState(false)
  const [rowActiveIndex, setRowActiveIndex] = useState<number | null>()
  const navigate = useNavigate()
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
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
  const columns = useDynamicColumns({
    rowActiveIndex,
  })
  const onChangePage = (page: React.SetStateAction<number>, size: any) => {
    console.log(page, size)
  }
  const selectColum:any = useMemo(() => {
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
  const onShowSizeChange = (current: number, pageSize: number) => {
    console.log(current, pageSize)
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
    console.log(key)
  }
  const changeTableState = () => {
    setTableState(!tableState)
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
          <SetButton onClick={changeTableState} show={!tableState}>
            <IconFont type="unorderedlist" style={{ fontSize: 20 }} />
          </SetButton>
          <SetButton onClick={changeTableState} show={tableState}>
            <IconFont type="database" style={{ fontSize: 20 }} />
          </SetButton>
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
      <SearchLine></SearchLine>
      <StaffTableWrap>
        {!tableState && (
          <StyledTable
            rowKey="key"
            columns={selectColum}
            dataSource={data}
            pagination={false}
            scroll={{ x: 'max-content' }}
          />
        )}
        {tableState &&
          moreData.map(i => (
            <div>
              <div className={titleCss}>{i.name}</div>
              <StyledTable
                rowKey="key"
                columns={selectColum}
                dataSource={i.data}
                pagination={false}
                scroll={{ x: 'max-content' }}
              />
            </div>
          ))}
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
    </>
  )
}
