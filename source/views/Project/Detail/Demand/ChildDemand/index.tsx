import IconFont from '@/components/IconFont'
import { Button, Menu, Dropdown, Pagination } from 'antd'
import styled from '@emotion/styled'
import TableSetting from '@/components/TableSetting'
import { TableWrap } from '@/components/StyleCommon'
import { useCallback, useState } from 'react'
import EditDemand from '../components/EditDemand'

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
  fontSize: 12,
  width: 'fit-content',
})

const statusList = [
  { id: 0, name: '规划中', color: '#2877ff' },
  { id: 1, name: '实现中', color: '#2877ff' },
  { id: 2, name: '已实现', color: '#2877ff' },
  { id: 3, name: '已关闭', color: '#2877ff' },
]

const List = [
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

export default () => {
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
                  style={{ fontSize: 16, color: '#BBBDBF' }}
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
      render: (text: number) => {
        return (
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
    console.log(page, size)
  }

  const onShowSizeChange = (current: number, pageSize: number) => {
    console.log(current, pageSize)
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
        <TableSetting />
      </Operation>
      <TableWrap
        rowKey="key"
        onRow={onTableRow}
        columns={columns}
        dataSource={List}
        pagination={false}
        scroll={{ x: 'max-content' }}
        showSorterTooltip={false}
      />
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
    </div>
  )
}
