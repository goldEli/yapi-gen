// 子需求表格

/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-undefined */
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { getParamsData, openDetail } from '@/tools'
import { useState } from 'react'
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
import NoData from '@/components/NoData'
import IconFont from './IconFont'
import { useSelector } from '@store/index'
import { getDemandList } from '@/services/project/demand'

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
  const [order, setOrder] = useState<any>({ value: '', key: '' })
  const { colorList } = useSelector((store: { project: any }) => store.project)
  let isCanEdit: any

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

  const onToDetail = (item: any) => {
    const params = encryptPhp(
      JSON.stringify({ type: 'info', id: projectId, demandId: item.id }),
    )
    openDetail(`/Detail/Demand?data=${params}`)
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
            <Tooltip title={text} getPopupContainer={node => node}>
              <ListNameWrap
                isName
                isClose={record.status?.is_end === 1}
                onClick={() => onToDetail(record)}
              >
                {text}
              </ListNameWrap>
            </Tooltip>
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
      render: (text: string) => {
        return (
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
        )
      },
    },
    {
      title: (
        <NewSort
          fixedKey="schedule"
          nowKey={order.key}
          order={order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('newlyAdd.demandProgress')}
        </NewSort>
      ),
      dataIndex: 'schedule',
      key: 'schedule',
      width: 120,
      render: (text: any) => {
        return (
          <Progress
            strokeColor="#43BA9A"
            style={{ color: '#43BA9A', cursor: 'not-allowed' }}
            width={38}
            type="line"
            percent={text}
            format={percent => (percent === 100 ? '100%' : `${percent}%`)}
            strokeWidth={4}
          />
        )
      },
    },
    {
      title: t('common.dealName'),
      dataIndex: 'dealName',
      width: 150,
      render: (text: any) => {
        return <span>{text?.join(';') || '--'}</span>
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
        <div style={{ maxHeight: 310, overflow: 'auto', width: 950 }}>
          {!!dataList?.list &&
            (dataList?.list?.length > 0 ? (
              <Table
                rowKey="id"
                pagination={false}
                columns={columnsChild}
                dataSource={dataList?.list}
                scroll={{ x: 'max-content', y: 259 }}
                tableLayout="auto"
                style={{ borderRadius: 4, overflow: 'hidden' }}
              />
            ) : (
              <NoData />
            ))}
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
        {props?.hasIcon && (
          <IconFont
            type="apartment"
            style={{ color: '#969799', fontSize: 16, marginRight: 8 }}
          />
        )}
        {props.value}
      </ClickWrap>
    </Popover>
  )
}

export default ChildDemandTable
