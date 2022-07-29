/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-len */
import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import { Menu, Dropdown, Pagination } from 'antd'
import { TableWrap, PaginationWrap } from '@/components/StyleCommon'
import { useNavigate } from 'react-router-dom'
import { useCallback, useState } from 'react'

interface Props {
  onChangeOperation(type: string, item: any, e: any): void
  projectList: any
  onChangePageNavigation(item: any): void
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
  display: 'flex',
  alignItems: 'center',
  div: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    marginRight: 8,
  },
  span: {
    color: '#323233',
    fontSize: 14,
    fontWeight: 400,
  },
})

interface MoreProps {
  menu: React.ReactElement
  text: string
}

const MoreContent = (props: MoreProps) => {
  const [isVisible, setIsVisible] = useState(false)

  const onChangeVisible = (e: any) => {
    e.stopPropagation()
    setIsVisible(!isVisible)
  }

  return (
    <MoreWrap>
      <Dropdown
        visible={isVisible}
        overlay={props.menu}
        trigger={['click']}
        placement="bottomRight"
        getPopupContainer={node => node}
      >
        <RowIconFont onClick={e => onChangeVisible(e)} type="more" />
      </Dropdown>
      <div style={{ marginLeft: 32 }}>{props.text}</div>
    </MoreWrap>
  )
}

const MainTable = (props: Props) => {
  const navigate = useNavigate()
  const menu = (record: any) => (
    <Menu
      items={[
        {
          key: '1',
          label: (
            <div onClick={e => props.onChangeOperation?.('edit', record, e)}>
              编辑
            </div>
          ),
        },
        {
          key: '2',
          label: (
            <div onClick={e => props.onChangeOperation?.('end', record, e)}>
              {record.status === 1 ? '结束' : '开启'}
            </div>
          ),
        },
        {
          key: '3',
          label: (
            <div onClick={e => props.onChangeOperation?.('delete', record, e)}>
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
        return <MoreContent menu={menu(record)} text={text} />
      },
    },
    {
      title: '图片',
      dataIndex: 'cover',
      render: (text: string) => <img style={{ width: 60, height: 28, borderRadius: 2 }} src={text} />
      ,
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
          <StatusWrap>
            <div style={{ background: text === 1 ? '#43BA9A' : '#BBBDBF' }} />
            <span>{text === 1 ? '已开启' : '已关闭'}</span>
          </StatusWrap>
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

  const onChangePage = (page: number, size: number) => {
    props.onChangePageNavigation({ page, size })
  }

  const onShowSizeChange = (page: number, size: number) => {
    props.onChangePageNavigation({ page, size })
  }

  const onTableRow = useCallback((row: any) => {
    return {
      onClick: () => {
        navigate(`/Detail/Demand?id=${row.id}`)
      },
    }
  }, [])

  return (
    <div>
      <TableBox
        rowKey="id"
        columns={columns}
        dataSource={props.projectList?.list}
        pagination={false}
        scroll={{ x: 'max-content' }}
        showSorterTooltip={false}
        onRow={onTableRow}
      />
      <PaginationWrap>
        <Pagination
          defaultCurrent={1}
          current={props.projectList?.currentPage}
          showSizeChanger
          showQuickJumper
          total={props.projectList?.total}
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
