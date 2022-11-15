/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-undefined */
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { getParamsData, openDetail } from '@/tools'
import { useState } from 'react'
import { useModel } from '@/models'
import { message, Popover, Progress, Table, Tooltip } from 'antd'
import { encryptPhp } from '@/tools/cryptoPhp'
import Sort from '@/components/Sort'
import {
  CategoryWrap,
  ClickWrap,
  HiddenText,
  ListNameWrap,
  StatusWrap,
} from '@/components/StyleCommon'
import { OmitText } from '@star-yun/ui'
import PopConfirm from '@/components/Popconfirm'
import NoData from '@/components/NoData'
import { ShapeContent } from '@/components/Shape'
import IconFont from './IconFont'
import DemandProgress from './DemandProgress'
import TableQuickEdit from './TableQuickEdit'

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
  // 是否是从我的模块或者他的模块使用
  isMineOrHis?: boolean
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
  const { projectInfo, colorList, getProjectInfo } = useModel('project')
  let isCanEdit: any

  // 获取是否有编辑需求的权限 --- 主要用于他的/我的
  const getProjectEdit = () => {
    if (props.isMineOrHis) {
      getProjectInfo({ projectId })
    }
    isCanEdit =
      projectInfo.projectPermissions?.length > 0 &&
      projectInfo.projectPermissions?.filter((i: any) => i.name === '编辑需求')
        ?.length > 0
  }

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
    getProjectEdit()
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

  const onExamine = () => {
    message.warning(t('newlyAdd.underReview'))
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
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ClickWrap
              onClick={() => onToDetail(record)}
              isClose={record.status?.is_end === 1}
            >
              {text}
            </ClickWrap>
            {record.isExamine && (
              <IconFont
                type="review"
                style={{
                  fontSize: 46,
                }}
              />
            )}
          </div>
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
      render: (text: string, record: any) => {
        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Tooltip
              placement="top"
              getPopupContainer={node => node}
              title={record.categoryRemark}
            >
              <CategoryWrap
                color={record.categoryColor}
                bgColor={
                  colorList?.filter(
                    (k: any) => k.key === record.categoryColor,
                  )[0]?.bgColor
                }
                style={{ marginLeft: 0 }}
              >
                {record.category}
              </CategoryWrap>
            </Tooltip>
            <TableQuickEdit
              type="text"
              defaultText={text}
              keyText="name"
              item={record}
              onUpdate={onUpdate}
              isMineOrHis={props.isMineOrHis}
              projectPermissions={projectInfo.projectPermissions}
            >
              <Tooltip title={text} getPopupContainer={node => node}>
                <ListNameWrap
                  isName
                  isClose={record.status?.is_end === 1}
                  onClick={() => onToDetail(record)}
                >
                  {text}
                </ListNameWrap>
              </Tooltip>
            </TableQuickEdit>
          </div>
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
      render: (text: string, record: any) => {
        return (
          <TableQuickEdit
            type="fixed_radio"
            defaultText={text}
            keyText="iterate_id"
            item={record}
            onUpdate={onUpdate}
            isMineOrHis={props.isMineOrHis}
            projectPermissions={projectInfo.projectPermissions}
          >
            <HiddenText>
              <OmitText
                width={100}
                tipProps={{
                  getPopupContainer: node => node,
                }}
              >
                {text || '--'}
              </OmitText>
            </HiddenText>
          </TableQuickEdit>
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
      width: 190,
      render: (text: any, record: any) => {
        return (
          <PopConfirm
            content={({ onHide }: { onHide(): void }) => {
              return isCanEdit && !record.isExamine ? (
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
              onClick={record.isExamine ? onExamine : void 0}
              isShow={isCanEdit || record.isExamine}
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
      title: (
        <NewSort fixedKey="schedule">{t('newlyAdd.demandProgress')}</NewSort>
      ),
      dataIndex: 'schedule',
      key: 'schedule',
      width: 120,
      render: (text: string, record: any, index: any) => {
        return (
          <div>
            {isCanEdit &&
            record?.usersNameIds?.includes(userInfo?.id) &&
            record.status.is_start !== 1 &&
            record.status.is_end !== 1 ? (
              <div style={{ cursor: 'pointer' }}>
                <DemandProgress
                  value={record.schedule}
                  row={record}
                  onUpdate={onUpdate}
                  listLength={dataList?.list?.length}
                  index={index}
                />
              </div>
            ) : (
              <Progress
                strokeColor="#43BA9A"
                style={{ color: '#43BA9A', cursor: 'not-allowed' }}
                width={38}
                type="circle"
                percent={record.schedule}
                format={percent => (percent === 100 ? '100%' : `${percent}%`)}
                strokeWidth={8}
              />
            )}
          </div>
        )
      },
    },
    {
      title: t('common.dealName'),
      dataIndex: 'dealName',
      width: 150,
      render: (text: any, record: any) => {
        return (
          <TableQuickEdit
            type="fixed_select"
            defaultText={record?.usersNameIds || []}
            keyText="users"
            item={record}
            onUpdate={onUpdate}
            isMineOrHis={props.isMineOrHis}
            projectPermissions={projectInfo.projectPermissions}
          >
            <span>{text?.join(',') || '--'}</span>
          </TableQuickEdit>
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
        <div style={{ maxHeight: 310, overflow: 'auto' }}>
          {!!dataList?.list && dataList?.list.length ? (
            <Table
              rowKey="id"
              pagination={false}
              columns={columnsChild}
              dataSource={dataList?.list}
              scroll={{ x: 'max-content' }}
              tableLayout="auto"
              style={{ borderRadius: 4, overflow: 'hidden' }}
            />
          ) : (
            <NoData />
          )}
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
