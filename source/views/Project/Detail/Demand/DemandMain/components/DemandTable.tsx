/* eslint-disable no-undefined */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable multiline-ternary */
/* eslint-disable camelcase */
/* eslint-disable no-empty-function */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/naming-convention */
import { useEffect, useMemo, useState } from 'react'
import { Pagination, Table, Popover, message, Spin, Dropdown, Menu } from 'antd'
import styled from '@emotion/styled'
import { TableWrap, PaginationWrap, ClickWrap } from '@/components/StyleCommon'
import IconFont from '@/components/IconFont'
import { ShapeContent } from '@/components/Shape'
import PopConfirm from '@/components/Popconfirm'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { OmitText } from '@star-yun/ui'
import { useModel } from '@/models'
import type { CheckboxValueType } from 'antd/lib/checkbox/Group'
import { OptionalFeld } from '@/components/OptionalFeld'
import { useDynamicColumns } from './CreatePrejectTableColum'
import Sort from '@/components/Sort'
import { useTranslation } from 'react-i18next'
import NoData from '@/components/NoData'
import { getIsPermission } from '@/tools'

const StatusWrap = styled.div<{ color?: string }>(
  {
    height: 22,
    borderRadius: 6,
    padding: '0 8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'fit-content',
    cursor: 'pointer',
  },
  ({ color }) => ({
    color,
    border: `1px solid ${color}`,
  }),
)
const Content = styled.div({
  padding: '16px 16px 0 16px',
  background: '#F5F7FA',
  height: 'auto',
})

const DataWrap = styled.div({
  background: 'white',
  overflowX: 'auto',
  height: 'calc(100% - 64px)',
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

interface ChildeProps {
  value: any
  row: any
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

const ChildDemandTable = (props: ChildeProps) => {
  const [t] = useTranslation()
  const [searchParams] = useSearchParams()
  const projectId = searchParams.get('id')
  const [isVisible, setIsVisible] = useState(false)
  const [dataList, setDataList] = useState<any>({
    list: undefined,
  })
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
    setDataList({ list: result })
  }

  const onChildClick = async () => {
    getList(order)
    setIsVisible(!isVisible)
  }

  const onUpdateOrderKey = (key: any, val: any) => {
    setOrder({ value: val === 2 ? 'desc' : 'asc', key })
    getList({ value: val === 2 ? 'desc' : 'asc', key })
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

  const columnsChild = [
    {
      title: (
        <NewSort
          fixedKey="id"
          nowKey={order.key}
          order={order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          ID
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
        <div style={{ minWidth: 500, maxHeight: 400 }}>
          {!!dataList?.list && dataList?.list.length ? (
            <Table
              rowKey="id"
              pagination={false}
              columns={columnsChild}
              dataSource={dataList?.list}
            />
          )
            : <NoData />
          }
        </div>
      }
    >
      <ClickWrap
        style={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
        }}
        onClick={onChildClick}
      >
        {props.value}
      </ClickWrap>
    </Popover>
  )
}

const DemandTable = (props: Props) => {
  const [t] = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const projectId = searchParams.get('id')
  const { updatePriority, updateDemandStatus, filterHeight }
    = useModel('demand')
  const { projectInfo } = useModel('project')
  const [titleList, setTitleList] = useState<any[]>([])
  const [titleList2, setTitleList2] = useState<any[]>([])
  const [plainOptions, setPlainOptions] = useState<any>([])
  const [plainOptions2, setPlainOptions2] = useState<any>([])
  const [orderKey, setOrderKey] = useState<any>('')
  const [order, setOrder] = useState<any>('')

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

  const onChangePage = (page: number, size: number) => {
    props.onChangePageNavigation?.({ page, size })
  }

  const onShowSizeChange = (page: number, size: number) => {
    props.onChangePageNavigation?.({ page, size })
  }

  const onClickItem = (item: any) => {
    navigate(`/Detail/Demand?type=info&id=${projectId}&demandId=${item.id}`)
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

export default DemandTable
