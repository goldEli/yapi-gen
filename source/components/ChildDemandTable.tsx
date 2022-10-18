/* eslint-disable complexity */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable multiline-ternary */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-undefined */
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { getParamsData, openDetail } from '@/tools'
import { useState } from 'react'
import { useModel } from '@/models'
import { message, Popover, Progress, Table } from 'antd'
import { encryptPhp } from '@/tools/cryptoPhp'
import Sort from '@/components/Sort'
import { ClickWrap, StatusWrap } from '@/components/StyleCommon'
import { OmitText } from '@star-yun/ui'
import PopConfirm from '@/components/Popconfirm'
import NoData from '@/components/NoData'
import { ShapeContent } from '@/components/Shape'
import IconFont from './IconFont'
import DemandProgress from './DemandProgress'

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

const ChildDemandTable = (props: {
  value: any
  row: any
  id?: any
  hasIcon?: boolean
}) => {
  const [t] = useTranslation()
  const [searchParams] = useSearchParams()
  let projectId: any
  if (props.id) {
    projectId = props.id
  } else {
    const paramsData = getParamsData(searchParams)
    projectId = paramsData.id || props.id
  }
  const [isVisible, setIsVisible] = useState(false)
  const [dataList, setDataList] = useState<any>({
    list: undefined,
  })
  const { getDemandList, updateDemandStatus } = useModel('demand')
  const { userInfo } = useModel('user')
  const [order, setOrder] = useState<any>({ value: '', key: '' })
  const { projectInfo } = useModel('project')
  const isCanEdit
    = projectInfo.projectPermissions?.length > 0
    || projectInfo.projectPermissions?.filter((i: any) => i.name === '编辑需求')
      ?.length > 0

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

  const onToDetail = (item: any) => {
    const params = encryptPhp(
      JSON.stringify({ type: 'info', id: projectId, demandId: item.id }),
    )
    openDetail(`/Detail/Demand?data=${params}`)
  }

  const onUpdate = () => {
    getList(order)
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
      width: 100,
      render: (text: string, record: any) => {
        return (
          <ClickWrap
            onClick={() => onToDetail(record)}
            isClose={record.status?.content === '已关闭'}
          >
            {text}
          </ClickWrap>
        )
      },
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
      width: 160,
      render: (text: string, record: any) => {
        return (
          <OmitText width={160} tipProps={{ placement: 'topLeft' }}>
            <ClickWrap
              onClick={() => onToDetail(record)}
              isName
              isClose={record.status?.content === '已关闭'}
            >
              {text}
            </ClickWrap>
          </OmitText>
        )
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
      width: 100,
      render: (text: string) => {
        return (
          <OmitText tipProps={{ placement: 'topLeft' }} width={100}>
            <span style={{ minWidth: 30, display: 'inline-block' }}>
              {text || '--'}
            </span>
          </OmitText>
        )
      },
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
      width: 120,
      render: (text: any, record: any) => {
        return (
          <PopConfirm
            content={({ onHide }: { onHide(): void }) => {
              return isCanEdit ? (
                <ShapeContent
                  tap={(value: any) => onChangeStatus(value)}
                  hide={onHide}
                  row={record}
                  record={{
                    id: record.id,
                    project_id: projectId,
                    status: {
                      id: record.status.id,
                      can_changes: record.status.can_changes,
                    },
                  }}
                />
              ) : null
            }}
            record={record}
          >
            <StatusWrap
              isShow={isCanEdit}
              style={{
                color: text?.status.color,
                border: `1px solid ${text?.status.color}`,
              }}
            >
              {text?.status.content}
            </StatusWrap>
          </PopConfirm>
        )
      },
    },
    {
      title:
        <NewSort fixedKey="schedule">{t('newlyAdd.demandProgress')}</NewSort>
      ,
      dataIndex: 'schedule',
      key: 'schedule',
      width: 120,
      render: (text: string, record: any) => {
        return (
          <div>
            {isCanEdit
            && record?.usersNameIds?.includes(userInfo?.id)
            && record.status.is_start !== 1
            && record.status.is_end !== 1 ? (
                  <div style={{ cursor: 'pointer' }}>
                    <DemandProgress
                      value={record.schedule}
                      row={record}
                      onUpdate={onUpdate}
                    />
                  </div>
                ) : (
                  <Progress
                    strokeColor="#43BA9A"
                    style={{ color: '#43BA9A' }}
                    width={38}
                    type="circle"
                    percent={record.schedule}
                    format={percent => percent === 100 ? '100%' : `${percent}%`}
                    strokeWidth={8}
                  />
                )}
          </div>
        )
      },
    },
    {
      title: (
        <NewSort
          fixedKey="users_name"
          nowKey={order.key}
          order={order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('common.dealName')}
        </NewSort>
      ),
      dataIndex: 'dealName',
      width: 120,
      render: (text: string) => {
        return (
          <OmitText tipProps={{ placement: 'topLeft' }} width={120}>
            <span style={{ minWidth: 30, display: 'inline-block' }}>
              {text || '--'}
            </span>
          </OmitText>
        )
      },
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
        <div style={{ maxWidth: 720, maxHeight: 310, overflow: 'auto' }}>
          {!!dataList?.list && dataList?.list.length ? (
            <Table
              rowKey="id"
              pagination={false}
              columns={columnsChild}
              dataSource={dataList?.list}
              sticky
              style={{ borderRadius: 4, overflow: 'hidden' }}
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
        {props?.hasIcon ? (
          <IconFont
            type="apartment"
            style={{ color: '#969799', fontSize: 16, marginRight: 8 }}
          />
        ) : null}
        {props.value}
      </ClickWrap>
    </Popover>
  )
}

export default ChildDemandTable
