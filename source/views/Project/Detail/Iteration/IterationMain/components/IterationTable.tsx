/* eslint-disable multiline-ternary */
/* eslint-disable camelcase */
/* eslint-disable no-empty-function */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/naming-convention */
import { Pagination, Dropdown, Popover, Table, Menu, message, Spin } from 'antd'
import styled from '@emotion/styled'
import { TableWrap, PaginationWrap } from '@/components/StyleCommon'
import IconFont from '@/components/IconFont'
import { ShapeContent } from '@/components/Shape'
import PopConfirm from '@/components/Popconfirm'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { useModel } from '@/models'
import { OmitText } from '@star-yun/ui'
import type { CheckboxValueType } from 'antd/lib/checkbox/Group'
import { useDynamicColumns } from './CreatePrejectTableColum'
import { OptionalFeld } from '@/components/OptionalFeld'
import Sort from '@/components/Sort'
import { useTranslation } from 'react-i18next'
import NoData from '@/components/NoData'
import { getIsPermission } from '@/tools'

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
  cursor: 'pointer',
})

const Content = styled.div({
  padding: 24,
  background: '#F5F7FA',
})

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

const DataWrap = styled.div({
  background: 'white',
  overflowX: 'auto',
  height: 'calc(100% - 40px)',
})

interface Props {
  data: any
  onChangeVisible(e: any, item: any): void
  onDelete(item: any): void
  onChangePageNavigation?(item: any): void
  onChangeRow?(): void
  settingState: boolean
  onChangeSetting(val: boolean): void
  onChangeOrder?(item: any): void
  isSpinning?: boolean
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

const ChildDemandTable = (props: { value: any; row: any }) => {
  const [t] = useTranslation()
  const [searchParams] = useSearchParams()
  const projectId = searchParams.get('id')
  const [isVisible, setIsVisible] = useState(false)
  const [dataList, setDataList] = useState<any>([])
  const { getDemandList, updateDemandStatus } = useModel('demand')
  const [order, setOrder] = useState<any>({ value: '', key: '' })

  const getList = async (item: any) => {
    const result = await getDemandList({
      projectId,
      all: true,
      parentId: props.row.id,
      order: item.value,
      orderKey: item.key,
    })
    setDataList(result)
  }

  const onChildClick = async () => {
    getList(order)
    setIsVisible(!isVisible)
  }

  const onChangeStatus = async (value: any) => {
    try {
      await updateDemandStatus(value)
      message.success(t('common.statusSuccess'))
      getList(order)
    } catch (error) {

      //
    }
  }

  const onUpdateOrderKey = (key: any, val: any) => {
    setOrder({ value: val === 2 ? 'desc' : 'asc', key })
    getList({ value: val === 2 ? 'desc' : 'asc', key })
  }

  const columnsChild = [
    {
      title: t('common.projectName'),
      dataIndex: 'name',
      render: (text: string) => {
        return <OmitText width={180}>{text}</OmitText>
      },
    },
    {
      title: (
        <NewSort
          fixedKey="id"
          nowKey={order.key}
          order={order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('project.projectId')}
        </NewSort>
      ),
      dataIndex: 'id',
    },
    {
      title: (
        <NewSort
          fixedKey="name"
          nowKey={order.key}
          order={order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('common.demandName')}
        </NewSort>
      ),
      dataIndex: 'name',
      render: (text: string) => {
        return <OmitText width={180}>{text}</OmitText>
      },
    },
    {
      title: (
        <NewSort
          fixedKey="iterate_name"
          nowKey={order.key}
          order={order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('common.iterate')}
        </NewSort>
      ),
      dataIndex: 'iteration',
    },
    {
      title: (
        <NewSort
          fixedKey="status"
          nowKey={order.key}
          order={order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('common.status')}
        </NewSort>
      ),
      dataIndex: 'status',
      render: (text: any, record: any) => {
        return (
          <PopConfirm
            content={({ onHide }: { onHide(): void }) => {
              return (
                <ShapeContent
                  tap={value => onChangeStatus(value)}
                  hide={onHide}
                  record={{
                    id: record.id,
                    project_id: projectId,
                    status: {
                      id: record.status.id,
                      can_changes: record.status.can_changes,
                    },
                  }}
                />
              )
            }}
            record={record}
          >
            <StatusWrap color={text.color}>{text.content_txt}</StatusWrap>
          </PopConfirm>
        )
      },
    },
    {
      title: (
        <NewSort
          fixedKey="user_name"
          nowKey={order.key}
          order={order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('common.createName')}
        </NewSort>
      ),
      dataIndex: 'dealName',
    },
  ]

  const onVisibleChange = (visible: any) => {
    setIsVisible(visible)
  }

  return (
    <Popover
      key={isVisible.toString()}
      visible={isVisible}
      placement="bottom"
      trigger="click"
      onVisibleChange={onVisibleChange}
      content={
        <Table
          rowKey="id"
          pagination={false}
          columns={columnsChild}
          dataSource={dataList}
        />
      }
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
        }}
        onClick={onChildClick}
      >
        <IconFont
          type="apartment"
          style={{ color: '#969799', fontSize: 16, marginRight: 8 }}
        />
        <span style={{ color: '#323233', fontSize: 16 }}>{props.value}</span>
      </div>
    </Popover>
  )
}

const IterationTable = (props: Props) => {
  const [t] = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const projectId = searchParams.get('id')
  const { updatePriority, updateDemandStatus } = useModel('demand')
  const { projectInfo } = useModel('project')
  const [titleList, setTitleList] = useState<any[]>([])
  const [titleList2, setTitleList2] = useState<any[]>([])
  const [plainOptions, setPlainOptions] = useState<any>([])
  const [plainOptions2, setPlainOptions2] = useState<any>([])
  const [orderKey, setOrderKey] = useState<any>('')
  const [order, setOrder] = useState<any>('')
  const { filterHeight } = useModel('iterate')

  const getShowkey = () => {
    setPlainOptions(projectInfo?.plainOptions || [])
    setPlainOptions2(projectInfo?.plainOptions2 || [])
    setTitleList(projectInfo?.titleList || [])
    setTitleList2(projectInfo?.titleList2 || [])
  }

  useEffect(() => {
    getShowkey()
  }, [projectInfo])

  const getCheckList = (
    list: CheckboxValueType[],
    list2: CheckboxValueType[],
  ) => {
    setTitleList(list)
    setTitleList2(list2)
  }

  const onClickItem = (item: any) => {
    navigate(`/Detail/Demand?type=info&id=${projectId}&demandId=${item.id}`)
  }

  const onChangePage = (page: number, size: number) => {
    props.onChangePageNavigation?.({ page, size })
  }

  const onShowSizeChange = (page: number, size: number) => {
    props.onChangePageNavigation?.({ page, size })
  }

  const onChangeState = async (item: any) => {
    try {
      await updatePriority({ demandId: item.id, priorityId: item.priorityId })
      message.success(t('common.prioritySuccess'))
      props.onChangeRow?.()
    } catch (error) {

      //
    }
  }

  const onChangeStatus = async (value: any) => {
    try {
      await updateDemandStatus(value)
      message.success(t('common.statusSuccess'))
      props.onChangeRow?.()
    } catch (error) {

      //
    }
  }

  const updateOrderkey = (key: any, val: any) => {
    setOrderKey(key)
    setOrder(val)
    props.onChangeOrder?.({ value: val === 2 ? 'desc' : 'asc', key })
  }

  const onPropsChangeVisible = (e: any, item: any) => {
    props.onChangeVisible(e, item)
  }

  const onPropsChangeDelete = (item: any) => {
    props.onDelete(item)
  }

  const childeContent = (text: any, record: any) => {
    return <ChildDemandTable value={text} row={record} />
  }

  const rowIconFont = () => {
    return <RowIconFont type="more" />
  }

  const columns = useDynamicColumns({
    projectId,
    orderKey,
    order,
    updateOrderkey,
    onChangeStatus,
    onChangeState,
    onClickItem,
    onPropsChangeVisible,
    onPropsChangeDelete,
    childeContent,
    rowIconFont,
  })

  const hasEdit = getIsPermission(
    projectInfo?.projectPermissions,
    'b/story/update',
  )
  const hasDel = getIsPermission(
    projectInfo?.projectPermissions,
    'b/story/delete',
  )

  const menu = (item: any) => {
    let menuItems = [
      {
        key: '1',
        label: (
          <div onClick={e => onPropsChangeVisible(e, item)}>
            {t('common.edit')}
          </div>
        ),
      },
      {
        key: '2',
        label:
          <div onClick={() => onPropsChangeDelete(item)}>{t('common.del')}</div>
        ,
      },
    ]

    if (hasEdit) {
      menuItems = menuItems.filter((i: any) => i.key !== '1')
    }

    if (hasDel) {
      menuItems = menuItems.filter((i: any) => i.key !== '2')
    }

    return <Menu style={{ minWidth: 56 }} items={menuItems} />
  }

  const selectColum: any = useMemo(() => {
    const arr = [...titleList, ...titleList2]
    const newList = []
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < columns.length; j++) {
        if (arr[i] === columns[j].key) {
          newList.push(columns[j])
        }
      }
    }
    const arrList = [
      {
        width: 40,
        render: (text: any, record: any) => {
          return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {hasEdit && hasDel ? null : (
                <Dropdown
                  overlay={menu(record)}
                  trigger={['hover']}
                  placement="bottomLeft"
                  getPopupContainer={node => node}
                >
                  {rowIconFont()}
                </Dropdown>
              )}
            </div>
          )
        },
      },
    ]
    return [...arrList, ...newList]
  }, [titleList, titleList2, columns])

  return (
    <Content style={{ height: `calc(100% - ${filterHeight}px)` }}>
      <DataWrap>
        <Spin spinning={props?.isSpinning}>
          {!!props.data?.list
            && (props.data?.list?.length > 0 ? (
              <TableBox
                rowKey="id"
                columns={selectColum}
                dataSource={props.data?.list}
                pagination={false}
                scroll={{ x: 'max-content' }}
                showSorterTooltip={false}
              />
            )
              : <NoData />
            )}
        </Spin>
      </DataWrap>
      <PaginationWrap>
        <Pagination
          defaultCurrent={1}
          current={props.data?.currentPage}
          showSizeChanger
          showQuickJumper
          total={props.data?.total}
          showTotal={total => t('common.tableTotal', { count: total })}
          pageSizeOptions={['10', '20', '50']}
          onChange={onChangePage}
          onShowSizeChange={onShowSizeChange}
        />
      </PaginationWrap>
      {props.settingState ? (
        <OptionalFeld
          plainOptions={plainOptions}
          plainOptions2={plainOptions2}
          checkList={titleList}
          checkList2={titleList2}
          isVisible={props.settingState}
          onClose={() => props.onChangeSetting(false)}
          getCheckList={getCheckList}
        />
      ) : null}
    </Content>
  )
}

export default IterationTable
