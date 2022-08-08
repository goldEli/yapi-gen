/* eslint-disable multiline-ternary */
/* eslint-disable complexity */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-len */
import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import { Menu, Dropdown, Pagination } from 'antd'
import { TableWrap, PaginationWrap, ClickWrap } from '@/components/StyleCommon'
import { useNavigate } from 'react-router-dom'
import { useCallback, useState } from 'react'
import Sort from '@/components/Sort'
import { useModel } from '@/models'
import { getIsPermission } from '@/tools/index'
import { useTranslation } from 'react-i18next'
import NoData from '@/components/NoData'

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

const DataWrap = styled.div({
  height: 'calc(100% - 64px)',
  overflowX: 'auto',
  background: 'white',
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
      <ClickWrap style={{ marginLeft: 32 }}>{props.text}</ClickWrap>
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
  const [t] = useTranslation()
  const navigate = useNavigate()
  const { userInfo } = useModel('user')
  const hasEdit = getIsPermission(
    userInfo?.company_permissions,
    'b/project/update',
  )
  const hasDelete = getIsPermission(
    userInfo?.company_permissions,
    'b/project/delete',
  )
  const hasStop = getIsPermission(
    userInfo?.company_permissions,
    'b/project/stop',
  )
  const hasStart = getIsPermission(
    userInfo?.company_permissions,
    'b/project/start',
  )

  const menu = (record: any) => {
    let menuItems = [
      {
        key: '1',
        label: (
          <div onClick={e => props.onChangeOperation?.('edit', record, e)}>
            {t('common.edit')}
          </div>
        ),
      },
      {
        key: '2',
        label: (
          <div onClick={e => props.onChangeOperation?.('end', record, e)}>
            {record.status === 1 ? t('common.stop') : t('common.open')}
          </div>
        ),
      },
      {
        key: '3',
        label: (
          <div onClick={e => props.onChangeOperation?.('delete', record, e)}>
            {t('common.del')}
          </div>
        ),
      },
    ]

    if (hasEdit) {
      menuItems = menuItems.filter((i: any) => i.key !== '1')
    }

    if (hasDelete) {
      menuItems = menuItems.filter((i: any) => i.key !== '3')
    }

    if (record.status === 1) {
      if (hasStop) {
        menuItems = menuItems.filter((i: any) => i.key !== '2')
      }
    }

    if (hasStart) {
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
          {t('project.projectId')}
        </NewSort>
      ),
      render: (text: string, record: any) => {
        return (
          <div>
            {!hasDelete && !hasEdit && !hasStart && !hasStop
              ? <MoreContent menu={menu(record)} text={text} />
              : null}
          </div>
        )
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
          {t('project.img')}
        </NewSort>
      ),
      dataIndex: 'cover',
      render: (text: string) => (
        <img
          style={{ width: 60, height: 28, borderRadius: 2, cursor: 'pointer' }}
          src={text}
        />
      ),
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
          {t('common.projectName')}
        </NewSort>
      ),
      render: (text: string) => {
        return <ClickWrap>{text}</ClickWrap>
      },
    },
    {
      title: (
        <NewSort
          fixedKey="member_count"
          nowKey={props.order.key}
          order={props.order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('project.projectCount')}
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
          {t('project.demandCount')}
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
          {t('project.iterateCount')}
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
          {t('project.projectProgress')}
        </NewSort>
      ),
      dataIndex: 'progress',
      render: (text: string) => {
        return <span>{`${text}%`}</span>
      },
    },
    {
      title: (
        <NewSort
          fixedKey="user_name"
          nowKey={props.order.key}
          order={props.order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('common.createName')}
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
          {t('common.status')}
        </NewSort>
      ),
      dataIndex: 'status',
      render: (text: number) => {
        return (
          <StatusWrap>
            <div style={{ background: text === 1 ? '#43BA9A' : '#BBBDBF' }} />
            <span>
              {text === 1 ? t('common.opening1') : t('common.Closed')}
            </span>
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
          {t('common.createTime')}
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
          {t('common.endTime')}
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
    <div style={{ height: '100%' }}>
      <DataWrap>
        {!!props.projectList?.list
          && (props.projectList?.list?.length > 0 ? (
            <TableBox
              rowKey="id"
              columns={columns}
              dataSource={props.projectList?.list}
              pagination={false}
              scroll={{ x: 'max-content' }}
              showSorterTooltip={false}
              onRow={onTableRow}
            />
          )
            : <NoData />
          )}
      </DataWrap>

      <PaginationWrap>
        <Pagination
          defaultCurrent={1}
          current={props.projectList?.currentPage}
          showSizeChanger
          showQuickJumper
          total={props.projectList?.total}
          showTotal={total => t('common.tableTotal', { count: total })}
          pageSizeOptions={['10', '20', '50']}
          onChange={onChangePage}
          onShowSizeChange={onShowSizeChange}
        />
      </PaginationWrap>
    </div>
  )
}

export default MainTable
