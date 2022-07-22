/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-empty-function */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-empty-function */
import IconFont from '@/components/IconFont'
import { Button, Menu, Dropdown, Pagination } from 'antd'
import styled from '@emotion/styled'
import { TableWrap, PaginationWrap } from '@/components/StyleCommon'
import { useCallback, useState } from 'react'
import EditDemand from '../components/EditDemand'
import { ShapeContent } from '@/components/Shape'
import { LevelContent } from '@/components/Level'
import PopConfirm from '@/components/Popconfirm'
import { OptionalFeld } from '@/components/OptionalFeld'
import type { CheckboxValueType } from 'antd/lib/checkbox/Group'

const Operation = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 24px',
  height: 52,
  background: 'white',
})

const ButtonWrap = styled(Button)({
  color: '#2877ff',
  border: '1px solid #2877FF',
})

const StatusWrap = styled.div({
  height: 22,
  borderRadius: 6,
  padding: '0 8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid #2877FF',
  color: '#2877FF',
  width: 'fit-content',
  cursor: 'pointer',
})

const PriorityWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  div: {
    color: '#323233',
    fontSize: 14,
    marginLeft: 8,
  },
  '.anticon': {
    fontSize: 16,
  },
})

const IconFontWrap = styled(IconFont)<{ active?: boolean }>(
  {
    fontSize: 20,
    cursor: 'pointer',
  },
  ({ active }) => ({
    color: active ? '#2877FF' : '#969799',
  }),
)

const statusList = [
  { id: 0, name: '规划中', color: '#2877ff' },
  { id: 1, name: '实现中', color: '#2877ff' },
  { id: 2, name: '已实现', color: '#2877ff' },
  { id: 3, name: '已关闭', color: '#2877ff' },
]

const priorityList = [
  { name: '高', type: 'tall', color: '#ff5c5e' },
  { name: '中', type: 'middle', color: '#fa9746' },
  { name: '低', type: 'low', color: '#43ba9a' },
  { name: '极低', type: 'knockdown', color: '#bbbdbf' },
]

const list = [
  {
    id: '121212',
    name: '项目名称',
    priority: 2,
    iteration: '敏捷版本V1.0',
    createName: '何飞',
    status: 0,
    time: '2022-02-32',
    endTime: '200-03-12',
  },
  {
    id: '121212',
    name: '项目名称',
    priority: 2,
    iteration: '敏捷版本V1.0',
    createName: '何飞',
    status: 0,
    time: '2022-02-32',
    endTime: '200-03-12',
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

const ChildDemand = () => {
  const [rowActiveIndex, setRowActiveIndex] = useState(null)
  const [visible, setVisible] = useState(false)
  const onTableRow = useCallback((row: any) => {
    return {
      onMouseEnter: () => {
        setRowActiveIndex(row.id)
      },
      onMouseLeave: () => {
        setRowActiveIndex(null)
      },
    }
  }, [])

  const [settingState, setSettingState] = useState(false)

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

  const getCheckList = (
    keys: CheckboxValueType[],
    list2: CheckboxValueType[],
  ) => {
    setTitleList(keys)
    setTitleList2(list2)
  }

  const menu = (
    <Menu
      items={[
        {
          key: '1',
          label: <div onClick={() => setVisible(true)}>编辑</div>,
        },
        {
          key: '3',
          label: <div>删除</div>,
        },
      ]}
    />
  )

  const setMenu = (
    <Menu
      items={[
        {
          key: '1',
          label: <div onClick={() => setSettingState(true)}>设置显示字段</div>,
        },
      ]}
    />
  )

  const columns = [
    {
      title: '项目ID',
      dataIndex: 'id',
      render: (text: string, record: any) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                visibility: record.id === rowActiveIndex ? 'visible' : 'hidden',
              }}
            >
              <Dropdown
                overlay={menu}
                trigger={['hover']}
                placement="bottomRight"
                getPopupContainer={node => node}
              >
                <IconFont
                  style={{ fontSize: 16, color: '#2877ff', cursor: 'pointer' }}
                  type="more"
                />
              </Dropdown>
            </div>
            <div style={{ marginLeft: 32 }}>{text}</div>
          </div>
        )
      },
    },
    {
      title: '标题',
      dataIndex: 'name',
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      render: (text: string, record: any) => {
        return (
          <PopConfirm
            content={({ onHide }: { onHide(): void }) => {
              return (
                <LevelContent tap={() => {}} hide={onHide} record={record} />
              )
            }}
            record={record}
          >
            <PriorityWrap>
              <IconFont
                type={priorityList[Number(text)].type}
                style={{
                  fontSize: 16,
                  color: priorityList[Number(text)].color,
                }}
              />
              <div>{priorityList[Number(text)].name}</div>
            </PriorityWrap>
          </PopConfirm>
        )
      },
      sorter: {
        compare: (a: any, b: any) => a.priority - b.priority,
      },
    },
    {
      title: '迭代',
      dataIndex: 'iteration',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (text: number, record: any) => {
        return (
          <PopConfirm
            content={({ onHide }: { onHide(): void }) => {
              return (
                <ShapeContent tap={() => {}} hide={onHide} record={record} />
              )
            }}
            record={record}
          >
            <StatusWrap
              style={{
                color: statusList.filter(i => i.id === text)[0].color,
                border: `1px solid ${
                  statusList.filter(i => i.id === text)[0].color
                }`,
              }}
            >
              {statusList.filter(i => i.id === text)[0].name}
            </StatusWrap>
          </PopConfirm>
        )
      },
    },
    {
      title: '处理人',
      dataIndex: 'createName',
    },
    {
      title: '创建时间',
      dataIndex: 'time',
      sorter: {
        compare: (a: any, b: any) => a.progress - b.progress,
      },
    },
    {
      title: '预计开始时间',
      dataIndex: 'time',
      sorter: {
        compare: (a: any, b: any) => a.progress - b.progress,
      },
    },
    {
      title: '预计结束时间',
      dataIndex: 'endTime',
      sorter: {
        compare: (a: any, b: any) => a.progress - b.progress,
      },
    },
  ]

  const onChangePage = (page: React.SetStateAction<number>, size: any) => {

    //
  }

  const onShowSizeChange = (current: number, pageSize: number) => {

    //
  }
  return (
    <div>
      <EditDemand
        visible={visible}
        onChangeVisible={() => setVisible(!visible)}
      />
      <Operation>
        <ButtonWrap
          onClick={() => setVisible(true)}
          icon={<IconFont type="plus" />}
        >
          添加子需求
        </ButtonWrap>
        <Dropdown overlay={setMenu}>
          <IconFontWrap type="settings" />
        </Dropdown>
      </Operation>
      <TableWrap
        rowKey="key"
        onRow={onTableRow}
        columns={columns}
        dataSource={list}
        pagination={false}
        scroll={{ x: 'max-content' }}
        showSorterTooltip={false}
      />
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
        visible={settingState}
        close={() => setSettingState(false)}
        getCheckList={getCheckList}
      />
    </div>
  )
}

export default ChildDemand
