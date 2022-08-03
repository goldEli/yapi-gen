/* eslint-disable complexity */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-len */
import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import { Menu, Dropdown, Pagination } from 'antd'
import { TableWrap, PaginationWrap } from '@/components/StyleCommon'
import { useNavigate } from 'react-router-dom'
import { useCallback, useState } from 'react'
import Sort from '@/components/Sort'
import { useModel } from '@/models'
import { getIsPermission } from '@/tools/index'

interface Props {
  onChangeOperation(type: string, item: any, e: any): void
  projectList: any
  onChangePageNavigation(item: any): void
  onUpdateOrderKey(item: any): void
  order: any
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

  //
  const [isVisible, setIsVisible] = useState(false)

  const onChangeVisible = (e: any) => {
    e.stopPropagation()
    setIsVisible(!isVisible)
  }

  const onVisibleChange = (visible: any) => {
    setIsVisible(visible)
  }

  return (
    <MoreWrap>
      <Dropdown
        key={isVisible.toString()}
        visible={isVisible}
        overlay={props.menu}
        trigger={['hover']}
        placement="bottomRight"
        getPopupContainer={node => node}
        onVisibleChange={onVisibleChange}
      >
        <RowIconFont onClick={e => onChangeVisible(e)} type="more" />
      </Dropdown>
      <div style={{ marginLeft: 32 }}>{props.text}</div>
    </MoreWrap>
  )
}

const NewSort = (sortProps: any) => {
  return (
    <Sort
      fixedKey={sortProps.fixedKey}
      onChangeKey={sortProps.onUpdateOrderKey}
      nowKey={sortProps.nowKey}
      order={sortProps.order === 'asc' ? 1 : 2}
    >
      {sortProps.children}
    </Sort>
  )
}

const MainTable = (props: Props) => {
  const navigate = useNavigate()
  const { userInfo } = useModel('user')

  const menu = (record: any) => {
    let menuItems = [
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
    ]

    if (getIsPermission(userInfo?.company_permissions, 'b/project/update')) {
      menuItems = menuItems.filter((i: any) => i.key !== '1')
    }

    if (getIsPermission(userInfo?.company_permissions, 'b/project/delete')) {
      menuItems = menuItems.filter((i: any) => i.key !== '3')
    }

    if (record.status === 1) {
      if (getIsPermission(userInfo?.company_permissions, 'b/project/stop')) {
        menuItems = menuItems.filter((i: any) => i.key !== '2')
      }
    }

    if (getIsPermission(userInfo?.company_permissions, 'b/project/start')) {
      menuItems = menuItems.filter((i: any) => i.key !== '2')
    }

    return <Menu items={menuItems} />
  }

  const onUpdateOrderKey = (key: any, val: any) => {
    props.onUpdateOrderKey({ value: val === 2 ? 'desc' : 'asc', key })
  }

  const columns = [
    {
      dataIndex: 'id',
      title: (
        <NewSort
          fixedKey="id"
          nowKey={props.order.key}
          order={props.order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          项目ID
        </NewSort>
      ),
      render: (text: string, record: any) => {
        return <MoreContent menu={menu(record)} text={text} />
      },
    },
    {
      title: (
        <NewSort
          fixedKey="cover"
          nowKey={props.order.key}
          order={props.order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          图片
        </NewSort>
      ),
      dataIndex: 'cover',
      render: (text: string) => <img style={{ width: 60, height: 28, borderRadius: 2 }} src={text} />
      ,
    },
    {
      dataIndex: 'name',
      title: (
        <NewSort
          fixedKey="name"
          nowKey={props.order.key}
          order={props.order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          项目名称
        </NewSort>
      ),
    },
    {
      title: (
        <NewSort
          fixedKey="member_count"
          nowKey={props.order.key}
          order={props.order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          项目人数
        </NewSort>
      ),
      dataIndex: 'memberCount',
    },
    {
      title: (
        <NewSort
          fixedKey="story_count"
          nowKey={props.order.key}
          order={props.order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          需求数
        </NewSort>
      ),
      dataIndex: 'storyCount',
    },
    {
      title: (
        <NewSort
          fixedKey="iterate_count"
          nowKey={props.order.key}
          order={props.order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          迭代数
        </NewSort>
      ),
      dataIndex: 'iterateCount',
    },
    {
      title: (
        <NewSort
          fixedKey="progress"
          nowKey={props.order.key}
          order={props.order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          项目进度
        </NewSort>
      ),
      dataIndex: 'progress',
    },
    {
      title: (
        <NewSort
          fixedKey="user_name"
          nowKey={props.order.key}
          order={props.order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          创建人
        </NewSort>
      ),
      dataIndex: 'createName',
    },
    {
      title: (
        <NewSort
          fixedKey="status"
          nowKey={props.order.key}
          order={props.order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          状态
        </NewSort>
      ),
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
      title: (
        <NewSort
          fixedKey="created_at"
          nowKey={props.order.key}
          order={props.order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          创建时间
        </NewSort>
      ),
      dataIndex: 'createdTime',
    },
    {
      title: (
        <NewSort
          fixedKey="stop_at"
          nowKey={props.order.key}
          order={props.order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          结束时间
        </NewSort>
      ),
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
        />
      </PaginationWrap>
    </div>
  )
}

export default MainTable
