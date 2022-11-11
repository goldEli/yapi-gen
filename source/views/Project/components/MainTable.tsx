/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable multiline-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-len */
import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import { Menu, Dropdown, Pagination, Progress } from 'antd'
import {
  TableWrap,
  PaginationWrap,
  ClickWrap,
  HiddenText,
} from '@/components/StyleCommon'
import { useNavigate } from 'react-router-dom'
import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import Sort from '@/components/Sort'
import { useModel } from '@/models'
import { getIsPermission, computedAccuracy } from '@/tools/index'
import { useTranslation } from 'react-i18next'
import NoData from '@/components/NoData'
import { encryptPhp } from '@/tools/cryptoPhp'
import { OmitText } from '@star-yun/ui'

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
  '.ant-table-thead > tr > th:nth-child(1)': {
    paddingLeft: 64,
  },
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

const ImgWrap = styled.div<{ url?: string }>(
  {
    width: 60,
    height: 28,
    borderRadius: 4,
    boxSizing: 'border-box',
    border: '1px solid white',
    cursor: 'pointer',
    backgroundSize: 'cover',
    '&: hover': {
      border: '1px solid #2877ff',
    },
  },
  ({ url }) => ({
    backgroundImage: `url(${url})`,
  }),
)

interface MoreProps {
  onChange(type: string, item: any, e: any): void
  text: string
  record?: any
  listLength: number
}

const MoreContent = (props: MoreProps) => {
  const [t] = useTranslation()
  const [isVisible, setIsVisible] = useState(false)
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

  const onClickMore = (type: any, item: any, e: any) => {
    setIsVisible(false)
    props?.onChange(type, item, e)
  }

  const menu = (record: any) => {
    let menuItems = [
      {
        key: '1',
        label: (
          <div onClick={e => onClickMore?.('edit', record, e)}>
            {t('common.edit')}
          </div>
        ),
      },
      {
        key: '2',
        label: (
          <div onClick={e => onClickMore?.('end', record, e)}>
            {record.status === 1 ? t('common.stop') : t('common.open')}
          </div>
        ),
      },
      {
        key: '3',
        label: (
          <div onClick={e => onClickMore?.('delete', record, e)}>
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

  const onChangeVisible = (e: any) => {
    e.stopPropagation()
    setIsVisible(!isVisible)
  }

  const onVisibleChange = (visible: any) => {
    setIsVisible(visible)
  }

  return (
    <>
      {!hasDelete && !hasEdit && !hasStart && !hasStop ? (
        <MoreWrap>
          <Dropdown
            key={isVisible.toString()}
            visible={isVisible}
            overlay={menu(props?.record)}
            trigger={['hover']}
            placement="bottomRight"
            getPopupContainer={node =>
              props.listLength ? document.body : node
            }
            onVisibleChange={onVisibleChange}
          >
            <RowIconFont onClick={e => onChangeVisible(e)} type="more" />
          </Dropdown>
        </MoreWrap>
      ) : (
        <div style={{ width: 16 }} />
      )}
    </>
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
  const [dataWrapHeight, setDataWrapHeight] = useState(0)
  const [tableWrapHeight, setTableWrapHeight] = useState(0)
  const dataWrapRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (dataWrapRef.current) {
      const currentHeight = dataWrapRef.current.clientHeight
      if (currentHeight !== dataWrapHeight) {
        setDataWrapHeight(currentHeight)
      }

      const tableBody = dataWrapRef.current.querySelector('.ant-table-tbody')
      if (tableBody && tableBody.clientHeight !== tableWrapHeight) {
        setTableWrapHeight(tableBody.clientHeight)
      }
    }
  }, [props.projectList?.list])

  const tableY =
    tableWrapHeight > dataWrapHeight - 52 ? dataWrapHeight - 52 : void 0

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
      width: 160,
      render: (text: string, record: any) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <MoreContent
              onChange={props?.onChangeOperation}
              text={text}
              record={record}
              listLength={props.projectList?.list?.length}
            />
            <ClickWrap isClose={record.status === 2} style={{ marginLeft: 32 }}>
              {text}
            </ClickWrap>
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
      width: 120,
      render: (text: string) => <ImgWrap url={text} />,
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
      width: 200,
      render: (text: string, record: any) => {
        return (
          <HiddenText>
            <ClickWrap isName isClose={record.status === 2}>
              <OmitText
                width={160}
                tipProps={{
                  getPopupContainer: node => node,
                }}
              >
                {text}
              </OmitText>
            </ClickWrap>
          </HiddenText>
        )
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
      width: 160,
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
      width: 160,
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
      width: 160,
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
      width: 160,
      render: (text: string) => {
        return (
          <Progress
            strokeColor="#43BA9A"
            style={{ color: '#43BA9A' }}
            width={38}
            type="circle"
            percent={computedAccuracy(text, 100)}
            format={percent => (percent === 100 ? '100%' : `${percent}%`)}
            strokeWidth={8}
          />
        )
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
      width: 160,
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
      width: 160,
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
      width: 180,
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
      width: 180,
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
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
        const params = encryptPhp(JSON.stringify({ id: row.id }))
        navigate(`/Detail/Demand?data=${params}`)
      },
    }
  }, [])

  return (
    <div style={{ height: '100%' }}>
      <DataWrap ref={dataWrapRef}>
        {!!props.projectList?.list &&
          (props.projectList?.list?.length > 0 ? (
            <TableBox
              rowKey="id"
              columns={columns}
              dataSource={props.projectList?.list}
              pagination={false}
              scroll={{
                x: columns.reduce(
                  (totalWidth: number, item: any) => totalWidth + item.width,
                  0,
                ),
                y: tableY,
              }}
              showSorterTooltip={false}
              onRow={onTableRow}
              sticky
            />
          ) : (
            <NoData />
          ))}
      </DataWrap>

      <PaginationWrap>
        <Pagination
          defaultCurrent={1}
          current={props.projectList?.currentPage}
          pageSize={props.projectList?.pageSize || 20}
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
