import React, { useState, useCallback } from 'react'
import { Pagination, Dropdown } from 'antd'
import styled from '@emotion/styled'
import { TableWrap } from '@/components/StyleCommon'
import IconFont from '@/components/IconFont'

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
})

const Content = styled.div({
  padding: 24,
  background: '#F5F7FA',
  height: 'auto',
})

interface Props {
  menu: React.ReactElement
  List: any[]
}

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

  const onChangePage = (page: React.SetStateAction<number>, size: any) => {
    console.log(page, size)
  }

  const onShowSizeChange = (current: number, pageSize: number) => {
    console.log(current, pageSize)
  }
  const columns = [
    {
      title: 'ID',
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
                overlay={props.menu}
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
      title: '需求数',
      dataIndex: 'demand',
      sorter: {
        compare: (a: any, b: any) => a.demand - b.demand,
      },
    },
    {
      title: '优先级',
      dataIndex: 'iteration',
      sorter: {
        compare: (a: any, b: any) => a.iteration - b.iteration,
      },
    },
    {
      title: '迭代',
      dataIndex: 'iteration',
      sorter: {
        compare: (a: any, b: any) => a.progress - b.progress,
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (text: string) => {
        return <StatusWrap>{text}</StatusWrap>
      },
    },
    {
      title: '处理人',
      dataIndex: 'dealName',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      sorter: {
        compare: (a: any, b: any) => a.progress - b.progress,
      },
    },
    {
      title: '预计开始时间',
      dataIndex: 'startTime',
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
  return (
    <Content>
      <TableWrap
        rowKey="key"
        onRow={onTableRow}
        columns={columns}
        dataSource={props.List}
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
    </Content>
  )
}
