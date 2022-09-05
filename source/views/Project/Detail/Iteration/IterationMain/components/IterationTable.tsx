/* eslint-disable no-negated-condition */
/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/naming-convention */
import { Pagination, Dropdown, Menu, message, Spin } from 'antd'
import styled from '@emotion/styled'
import { TableWrap, PaginationWrap } from '@/components/StyleCommon'
import IconFont from '@/components/IconFont'
import { useSearchParams } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { useModel } from '@/models'
import type { CheckboxValueType } from 'antd/lib/checkbox/Group'
import { useDynamicColumns } from '@/components/CreateProjectTableColum'
import { OptionalFeld } from '@/components/OptionalFeld'
import { useTranslation } from 'react-i18next'
import NoData from '@/components/NoData'
import { getIsPermission, getParamsData, openDetail } from '@/tools'
import { encryptPhp } from '@/tools/cryptoPhp'
import ChildDemandTable from '@/components/ChildDemandTable'

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
  hasId: any
}

const IterationTable = (props: Props) => {
  const [t] = useTranslation()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
  const { updatePriority, updateDemandStatus } = useModel('demand')
  const { projectInfo } = useModel('project')
  const [titleList, setTitleList] = useState<any[]>([])
  const [titleList2, setTitleList2] = useState<any[]>([])
  const [plainOptions, setPlainOptions] = useState<any>([])
  const [plainOptions2, setPlainOptions2] = useState<any>([])
  const [orderKey, setOrderKey] = useState<any>('')
  const [order, setOrder] = useState<any>('')
  const { filterHeightIterate } = useModel('iterate')

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
    const params = encryptPhp(
      JSON.stringify({ type: 'info', id: projectId, demandId: item.id }),
    )
    openDetail(`/Detail/Demand?data=${params}`)
  }

  const onChangePage = (page: number, size: number) => {
    props.onChangePageNavigation?.({ page, size })
  }

  const onShowSizeChange = (page: number, size: number) => {
    props.onChangePageNavigation?.({ page, size })
  }

  const onChangeState = async (item: any) => {
    try {
      await updatePriority({
        demandId: item.id,
        priorityId: item.priorityId,
        projectId,
      })
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
    childeContent,
    rowIconFont,
    showChildCOntent: true,
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
    <Content style={{ height: `calc(100% - ${filterHeightIterate}px)` }}>
      <DataWrap>
        <Spin spinning={props?.isSpinning}>
          {typeof props?.hasId !== 'object'
            ? <NoData />
            : props.data?.list
              ? props.data?.list?.length > 0 ? (
                <TableBox
                  rowKey="id"
                  columns={selectColum}
                  dataSource={props.data?.list}
                  pagination={false}
                  scroll={{ x: 'max-content' }}
                  showSorterTooltip={false}
                  sticky
                />
              )
                : <NoData />

              : null}
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
