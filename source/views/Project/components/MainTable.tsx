import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import { Table, Menu, Dropdown, Pagination } from 'antd'
import { useCallback, useState } from 'react'
import projectImg from '@/assets/projectImg.png'
import { TableWrap } from '@/components/StyleCommon'

interface Props {
  onChangeOperation(type: string, id: number): void
}

const StatusWrap = styled.div({
  width: 8,
  height: 8,
  borderRadius: '50%',
  marginRight: 8,
})

const List = [
  {
    id: '121212',
    url: '',
    name: '项目名称',
    person: 6,
    demand: 8,
    iteration: 9,
    progress: '90%',
    createName: '何飞',
    status: 0,
    time: '2022-02-32',
    endTime: '200-03-12',
  },
  {
    id: '121212',
    url: '',
    name: '项目名称',
    person: 6,
    demand: 8,
    iteration: 9,
    progress: '90%',
    createName: '何飞',
    status: 0,
    time: '2022-02-32',
    endTime: '200-03-12',
  },
  {
    id: '121212',
    url: '',
    name: '项目名称',
    person: 6,
    demand: 8,
    iteration: 9,
    progress: '90%',
    createName: '何飞',
    status: 0,
    time: '2022-02-32',
    endTime: '200-03-12',
  },
  {
    id: '121212',
    url: '',
    name: '项目名称',
    person: 6,
    demand: 8,
    iteration: 9,
    progress: '90%',
    createName: '何飞',
    status: 0,
    time: '2022-02-32',
    endTime: '200-03-12',
  },
  {
    id: '121212',
    url: '',
    name: '项目名称',
    person: 6,
    demand: 8,
    iteration: 9,
    progress: '90%',
    createName: '何飞',
    status: 0,
    time: '2022-02-32',
    endTime: '200-03-12',
  },
  {
    id: '121212',
    url: '',
    name: '项目名称',
    person: 6,
    demand: 8,
    iteration: 9,
    progress: '90%',
    createName: '何飞',
    status: 0,
    time: '2022-02-32',
    endTime: '200-03-12',
  },
  {
    id: '121212',
    url: '',
    name: '项目名称',
    person: 6,
    demand: 8,
    iteration: 9,
    progress: '90%',
    createName: '何飞',
    status: 0,
    time: '2022-02-32',
    endTime: '200-03-12',
  },
  {
    id: '121212',
    url: '',
    name: '项目名称',
    person: 6,
    demand: 8,
    iteration: 9,
    progress: '90%',
    createName: '何飞',
    status: 0,
    time: '2022-02-32',
    endTime: '200-03-12',
  },
  {
    id: '121212',
    url: '',
    name: '项目名称',
    person: 6,
    demand: 8,
    iteration: 9,
    progress: '90%',
    createName: '何飞',
    status: 0,
    time: '2022-02-32',
    endTime: '200-03-12',
  },
  {
    id: '121212',
    url: '',
    name: '项目名称',
    person: 6,
    demand: 8,
    iteration: 9,
    progress: '90%',
    createName: '何飞',
    status: 0,
    time: '2022-02-32',
    endTime: '200-03-12',
  },
  {
    id: '121212',
    url: '',
    name: '项目名称',
    person: 6,
    demand: 8,
    iteration: 9,
    progress: '90%',
    createName: '何飞',
    status: 0,
    time: '2022-02-32',
    endTime: '200-03-12',
  },
  {
    id: '121212',
    url: '',
    name: '项目名称',
    person: 6,
    demand: 8,
    iteration: 9,
    progress: '90%',
    createName: '何飞',
    status: 0,
    time: '2022-02-32',
    endTime: '200-03-12',
  },
  {
    id: '121212',
    url: '',
    name: '项目名称',
    person: 6,
    demand: 8,
    iteration: 9,
    progress: '90%',
    createName: '何飞',
    status: 0,
    time: '2022-02-32',
    endTime: '200-03-12',
  },
  {
    id: '121212',
    url: '',
    name: '项目名称',
    person: 6,
    demand: 8,
    iteration: 9,
    progress: '90%',
    createName: '何飞',
    status: 0,
    time: '2022-02-32',
    endTime: '200-03-12',
  },
]

const statusList = [
  { id: 0, name: '运行中', color: '#2877ff' },
  { id: 1, name: '已上线', color: '#2877ff' },
  { id: 2, name: '异常', color: '#2877ff' },
  { id: 3, name: '关闭', color: '#2877ff' },
]

export default (props: Props) => {
  const [rowActiveIndex, setRowActiveIndex] = useState(null)
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
          label: (
            <div onClick={() => props.onChangeOperation?.('edit', 0)}>编辑</div>
          ),
        },
        {
          key: '2',
          label: (
            <div onClick={() => props.onChangeOperation?.('end', 0)}>结束</div>
          ),
        },
        {
          key: '3',
          label: (
            <div onClick={() => props.onChangeOperation?.('delete', 0)}>
              删除
            </div>
          ),
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
                  style={{
                    fontSize: 16,
                    cursor: 'pointer',
                    color: record.id === rowActiveIndex ? '#2877ff' : '#BBBDBF',
                  }}
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
      title: '图片',
      dataIndex: 'url',
      render: () => (
        <img
          style={{ width: 60, height: 28, borderRadius: 2 }}
          src={projectImg}
        />
      ),
    },
    {
      title: '项目名称',
      dataIndex: 'name',
    },
    {
      title: '项目人数',
      dataIndex: 'person',
      sorter: {
        compare: (a: any, b: any) => a.person - b.person,
      },
    },
    {
      title: '需求数',
      dataIndex: 'demand',
      sorter: {
        compare: (a: any, b: any) => a.demand - b.demand,
      },
    },
    {
      title: '迭代数',
      dataIndex: 'iteration',
      sorter: {
        compare: (a: any, b: any) => a.iteration - b.iteration,
      },
    },
    {
      title: '项目进度',
      dataIndex: 'progress',
      sorter: {
        compare: (a: any, b: any) => a.progress - b.progress,
      },
    },
    {
      title: '创建人',
      dataIndex: 'createName',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (text: number) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <StatusWrap
              style={{
                background: statusList.filter(i => i.id === text)[0].color,
              }}
            ></StatusWrap>
            <div>{statusList.filter(i => i.id === text)[0].name}</div>
          </div>
        )
      },
    },
    {
      title: '创建时间',
      dataIndex: 'time',
      sorter: {
        compare: (a: any, b: any) => a.progress - b.progress,
      },
    },
    {
      title: '结束时间',
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
