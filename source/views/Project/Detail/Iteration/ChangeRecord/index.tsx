import { Table, Pagination, Modal, Space } from 'antd'
import { useState } from 'react'
import styled from '@emotion/styled'
import { PaginationWrap } from '@/components/StyleCommon'

const TitleWrap = styled(Space)({
  height: 40,
  background: '#F8F9FA',
  padding: '0 24px',
  borderRadius: 6,
  color: '#323233',
  fontSize: 14,
  marginBottom: 24,
})

const list = [
  {
    id: 1212,
    changeTime: '2022-02-12',
    changeName: '大菲菲',
    type: '需求创建',
    field: [{ name: '标题' }, { name: '详情' }, { name: '创建人' }],
    beforeField: [{ name: '吃饭' }, { name: '--' }, { name: '张三' }],
    afterField: [{ name: '唱歌' }, { name: '--' }, { name: '里斯' }],
  },
  {
    id: 1212,
    changeTime: '2022-02-12',
    changeName: '大菲菲',
    type: '需求创建',
    field: [{ name: '标题' }, { name: '详情' }, { name: '创建人' }],
    beforeField: [{ name: '吃饭' }, { name: '--' }, { name: '张三' }],
    afterField: [{ name: '唱歌' }, { name: '--' }, { name: '里斯' }],
  },
]

const beforeHtml
  = '<p>项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述</p>'

export default () => {
  const [visible, setVisible] = useState(false)
  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
    },
    {
      title: '变更时间',
      dataIndex: 'changeTime',
    },
    {
      title: '变更人',
      dataIndex: 'changeName',
    },
    {
      title: '变更类型',
      dataIndex: 'type',
    },
    {
      title: '变更字段',
      dataIndex: 'field',
      render: (text: { name: string }[]) => {
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '16px 0',
            }}
          >
            {text.map(i => <span>{i.name}</span>)}
          </div>
        )
      },
    },
    {
      title: '变更前',
      dataIndex: 'beforeField',
      render: (text: { name: string }[]) => {
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '16px 0',
            }}
          >
            {text.map(i => <span>{i.name}</span>)}
          </div>
        )
      },
    },
    {
      title: '变更后',
      dataIndex: 'afterField',
      render: (text: { name: string }[]) => {
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '16px 0',
            }}
          >
            {text.map(i => (
              <span>
                {i.name === '--'
                  ? (
                    <span
                      style={{ cursor: 'pointer',
                        color: '#2877ff' }}
                      onClick={() => setVisible(true)}
                    >
                    查看详情
                    </span>
                  )
                  : i.name
                }
              </span>
            ))}
          </div>
        )
      },
    },
  ]
  const onChangePage = (page: React.SetStateAction<number>, size: any) => {
    console.log(
      page,
      size,
    )
  }

  const onShowSizeChange = (current: number, pageSize: number) => {
    console.log(
      current,
      pageSize,
    )
  }
  return (
    <div>
      <Modal
        visible={visible}
        title="变更详情"
        footer={false}
        width={1080}
        onCancel={() => setVisible(false)}
        bodyStyle={{ padding: '8px 24px 24px' }}
      >
        <Space size={32} style={{ display: 'flex' }}>
          <div style={{ display: 'flex',
            flexDirection: 'column' }}>
            <TitleWrap>变更前</TitleWrap>
            <div dangerouslySetInnerHTML={{ __html: beforeHtml }} />
          </div>
          <div style={{ display: 'flex',
            flexDirection: 'column' }}>
            <TitleWrap>变更后</TitleWrap>
            <div dangerouslySetInnerHTML={{ __html: beforeHtml }} />
          </div>
        </Space>
      </Modal>
      <Table
        rowKey="key"
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
    </div>
  )
}
