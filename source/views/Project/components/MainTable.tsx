/* eslint-disable @typescript-eslint/naming-convention */
import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import { Menu, Dropdown, Pagination } from 'antd'
import projectImg from '@/assets/projectImg.png'
import { TableWrap, PaginationWrap } from '@/components/StyleCommon'

interface Props {
  onChangeOperation(type: string, id: number): void
  projectList: any
}

const RowIconFont = styled(IconFont)({
  visibility: 'hidden',
  fontSize: 16,
  cursor: 'pointer',
  color: '#2877ff',
})

const TableBox = styled(TableWrap)({
  '.ant-table-row:hover': {
    [RowIconFont.toString()]: {
      visibility: 'visible',
    },
  },
})

const MoreWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
})

const StatusWrap = styled.div({
  width: 8,
  height: 8,
  borderRadius: '50%',
  marginRight: 8,
})

const statusList = [
  { id: 0, name: '运行中', color: '#2877ff' },
  { id: 1, name: '已上线', color: '#2877ff' },
  { id: 2, name: '异常', color: '#2877ff' },
  { id: 3, name: '关闭', color: '#2877ff' },
]

const MainTable = (props: Props) => {
  const menu = (
    <Menu
      items={[
        {
          key: '1',
          label:
            <div onClick={() => props.onChangeOperation?.('edit', 0)}>编辑</div>
          ,
        },
        {
          key: '2',
          label:
            <div onClick={() => props.onChangeOperation?.('end', 0)}>结束</div>
          ,
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
      render: (text: string) => {
        return (
          <MoreWrap>
            <Dropdown
              overlay={menu}
              trigger={['hover']}
              placement="bottomRight"
              getPopupContainer={node => node}
            >
              <RowIconFont type="more" />
            </Dropdown>
            <div style={{ marginLeft: 32 }}>{text}</div>
          </MoreWrap>
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
      dataIndex: 'memberCount',
      sorter: {
        compare: (a: any, b: any) => a.memberCount - b.memberCount,
      },
    },
    {
      title: '需求数',
      dataIndex: 'storyCount',
      sorter: {
        compare: (a: any, b: any) => a.storyCount - b.storyCount,
      },
    },
    {
      title: '迭代数',
      dataIndex: 'iterateCount',
      sorter: {
        compare: (a: any, b: any) => a.iterateCount - b.iterateCount,
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
            />
            <div>{statusList.filter(i => i.id === text)[0].name}</div>
          </div>
        )
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
    },
  ]

  const onChangePage = () => {

    //
  }

  const onShowSizeChange = () => {

    //
  }

  return (
    <div>
      <TableBox
        rowKey="id"
        columns={columns}
        dataSource={props.projectList?.list}
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
    </div>
  )
}

export default MainTable
