import { TableWrap, StylePagination } from '@/components/StyleCommon'
import SearchComponent from '@/components/SearchComponent'
import TableFilter from '@/components/TableFilter'
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import { useState, useCallback } from 'react'
import { Menu, Dropdown } from 'antd'
import posterImg from '@/assets/poster.png'

const Wrap = styled.div({
  display: 'flex',
  flexDirection: 'column',
})

const Header = styled.div({
  minHeight: 64,
  background: 'white',
  position: 'sticky',
  top: 64,
  zIndex: 2,
  padding: '0 24px',
})

const HeaderTop = styled.div({
  height: 64,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})

const Content = styled.div({
  padding: 16,
})

const List = [
  {
    nickname: '张三',
    username: '里斯',
    avatar: '',
    sex: '女',
    department: '产品部',
    job: '设计师',
    permission: '管理员',
    joinTime: '2022-02-12',
  },
  {
    nickname: '张三',
    username: '里斯',
    avatar: '',
    sex: '女',
    department: '产品部',
    job: '设计师',
    permission: '管理员',
    joinTime: '2022-02-12',
  },
]

export default () => {
  const [rowActiveIndex, setRowActiveIndex] = useState(null)
  const [visible, setVisible] = useState(true)

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

  const onChangePage = (page: React.SetStateAction<number>, size: any) => {
    console.log(page, size)
  }

  const onShowSizeChange = (current: number, pageSize: number) => {
    console.log(current, pageSize)
  }
  const menu = (
    <Menu
      items={[
        {
          key: '1',
          label: <div>编辑</div>,
        },
        {
          key: '2',
          label: <div>移除</div>,
        },
      ]}
    />
  )
  const columns = [
    {
      title: '昵称',
      dataIndex: 'nickname',
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
            <img
              src={posterImg}
              style={{
                marginLeft: 32,
                width: 32,
                height: 32,
                borderRadius: '50%',
              }}
            />
            <span style={{ marginLeft: 12, color: '#323233', fontSize: 14 }}>
              {text}
            </span>
          </div>
        )
      },
    },
    {
      title: '真实姓名',
      dataIndex: 'username',
    },
    {
      title: '性别',
      dataIndex: 'sex',
    },
    {
      title: '部门',
      dataIndex: 'department',
    },
    {
      title: '职位',
      dataIndex: 'job',
    },
    {
      title: '项目权限',
      dataIndex: 'permission',
    },
    {
      title: '加入时间',
      dataIndex: 'joinTime',
    },
  ]
  return (
    <Wrap>
      <Header>
        <HeaderTop>
          <SearchComponent text="添加成员" placeholder="输入昵称姓名" />
          <IconFont
            style={{ fontSize: 20, color: '#969799', cursor: 'pointer' }}
            type="filter"
            onClick={() => setVisible(!visible)}
          />
        </HeaderTop>
        <TableFilter showForm={visible} />
      </Header>
      <Content>
        <TableWrap
          rowKey="key"
          onRow={onTableRow}
          columns={columns}
          dataSource={List}
          pagination={false}
          scroll={{ x: 'max-content' }}
          showSorterTooltip={false}
        />
        <StylePagination
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
      </Content>
    </Wrap>
  )
}
