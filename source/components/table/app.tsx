import React, { useMemo, useCallback, useState } from 'react'
import { Table, Button, Dropdown, Menu } from 'antd'
import { CustomModal } from '../Custom-Modal'
import { useDynamicColumns } from './DynamicColumns'
import { OptionalFeld } from '../OptionalFeld'
import { CheckboxValueType } from 'antd/lib/checkbox/Group'

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
const tableList = [
  { id: 1, name: '逾期' },
  { id: 2, name: '今天到期' },
  { id: 3, name: '本周到期' },
  { id: 4, name: '本月到期' },
  { id: 5, name: '其他' },
]
export default function App() {
  const [rowActiveIndex, setRowActiveIndex] = useState<number | null>()
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
  const [isModalVisible2, setIsModalVisible2] = useState<boolean>(false)
  const [titleList, setTitleList] = useState(['name', 'age', 'address'])
  const [titleList2, setTitleList2] = useState(['feiji', 'dapao', 'tanke'])
  const [data2, setData] = useState('')
  const [tableState, setTableState] = useState<boolean>(false)

  const showModal = () => {
    setIsModalVisible(true)
  }

  const showModal2 = re => {
    setData(re)
    setIsModalVisible2(true)
  }

  const columns = useDynamicColumns({
    rowActiveIndex,
    showModal,
    showModal2,
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
  type TableRow = {
    key: string
    name: string
    age: number
    address: string
    feiji: string
    level: number
  }
  const onTableRow = useCallback((row, index: number) => {
    return {
      onMouseEnter: () => {
        setRowActiveIndex(index)
      },
      onMouseLeave: () => {
        setRowActiveIndex(null)
      },
    }
  }, [])

  const close = () => {
    setIsModalVisible2(false)
  }
  const close2 = () => {
    setIsModalVisible(false)
  }
  const getCheckList = (list:string[], list2:string[]) => {
    setTitleList(list)
    setTitleList2(list2)
  }
  const changeTableState = () => {
    setTableState(!tableState)
  }
  const ManyTable = tableList.map(item => (
    <div key={item.id}>
      <h1>{item.name}</h1>
      <Table
        rowKey="key"
        onRow={onTableRow}
        columns={selectColum}
        dataSource={data}
        pagination={false}
        scroll={{ x: 'max-content' }}
      />
    </div>
  ))
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
    <div>
      <header>
        <Dropdown overlay={menu} placement="bottomLeft">
          <Button>设置</Button>
        </Dropdown>
        <Button onClick={changeTableState}>变表格</Button>
      </header>
      {tableState && (
        <Table
          rowKey="key"
          onRow={onTableRow}
          columns={selectColum}
          dataSource={data}
          pagination={false}
          scroll={{ x: 'max-content' }}
        />
      )}
      {!tableState && ManyTable}

      <CustomModal data2={data2} visible={isModalVisible2} close={() => close}>
        <div>12</div>
      </CustomModal>
      <OptionalFeld
        checkList={titleList}
        checkList2={titleList2}
        visible={isModalVisible}
        close={close2}
        getCheckList={getCheckList}
      ></OptionalFeld>
    </div>
  )
}
