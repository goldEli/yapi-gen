/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-duplicate-imports */
// 子需求表格

/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-undefined */
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { getParamsData } from '@/tools'
import { useState } from 'react'
import { Popover, Progress, Table, Tooltip } from 'antd'
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
import { getDemandList } from '@/services/demand'
import { getChildAffairsList } from '@/services/affairs'
import { getChildFlawList } from '@/services/flaw'
import useOpenDemandDetail from '@/hooks/useOpenDemandDetail'
import StateTag from './StateTag'
import TableColorText from './TableColorText'
import MultipleAvatar from './MultipleAvatar'
import React from 'react'
import { encryptPhp } from '@/tools/cryptoPhp'

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
interface Props {
  value: any
  row: any
  id?: any
  hasIcon?: boolean
  // 是否是从我的模块或者他的模块使用
  isMineOrHis?: boolean
}
const ChildDemandTable = React.forwardRef((props: Props, ref: any) => {
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
  const [openDemandDetail] = useOpenDemandDetail()
  const { projectInfo } = useSelector(store => store.project)
  const { fullScreen } = useSelector(store => store.kanBan)
  let isCanEdit: any

  const getList = async (item: any) => {
    // 需要区分是那种类型的子需求
    let result = null
    if (projectInfo.projectType === 2) {
      const temp = await getChildAffairsList({
        projectId,
        all: true,
        parentId: props.row.id,
        order: item.value,
        orderKey: item.key,
      })
      result = temp?.list
    } else if (location.href?.includes('Demand')) {
      result = await getDemandList({
        projectId,
        all: true,
        parentId: props.row.id,
        order: item.value,
        orderKey: item.key,
      })
    } else if (location.href?.includes('Defect')) {
      const temp = await getChildFlawList({
        projectId,
        all: true,
        parentId: props.row.id,
        order: item.value,
        orderKey: item.key,
      })
      result = temp?.list
    }
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

  // 跳转详情页面
  const onToDetail = (record: any) => {
    let params = null
    let url = ''
    if (projectInfo?.projectType === 2) {
      params = encryptPhp(
        JSON.stringify({
          id: projectId,
          sprintId: record?.id,
          newOpen: true,
        }),
      )
      url = `SprintProjectManagement/SprintProjectDetail?data=${params}`
    } else if (projectInfo?.projectType === 1 && record.is_bug === 1) {
      params = encryptPhp(
        JSON.stringify({
          id: projectId,
          flawId: record?.id,
          newOpen: true,
        }),
      )
      url = `ProjectManagement/DefectDetail?data=${params}`
    } else if (projectInfo?.projectType === 1 && record.is_bug !== 1) {
      params = encryptPhp(
        JSON.stringify({
          id: projectId,
          demandId: record?.id,
          newOpen: true,
        }),
      )
      url = `ProjectManagement/DemandDetail?data=${params}`
    }

    window.open(`${window.origin}${import.meta.env.__URL_HASH__}${url}`)
  }

  const columnsChild = [
    {
      title: (
        <NewSort
          fixedKey="story_prefix_key"
          nowKey={order.key}
          order={order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('serialNumber')}
        </NewSort>
      ),
      dataIndex: 'storyPrefixKey',
      width: 160,
      render: (text: string, record: any) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ClickWrap
              className="canClickDetail"
              isClose={record.status?.is_end === 1}
              onClick={() => onToDetail(record)}
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
            <Tooltip title={record.categoryRemark}>
              <img
                src={
                  record.category_attachment
                    ? record.category_attachment
                    : 'https://varlet.gitee.io/varlet-ui/cat.jpg'
                }
                style={{
                  width: '18px',
                  height: '18px',
                  marginRight: '8px',
                }}
                alt=""
              />
            </Tooltip>

            <Tooltip title={text}>
              <ListNameWrap
                className="canClickDetail"
                isName
                isClose={record.status?.is_end === 1}
              >
                <TableColorText text={text} />
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
            <OmitText width={100}>{text || '--'}</OmitText>
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
          <StateTag
            name={text.status.content}
            state={
              text?.is_start === 1 && text?.is_end === 2
                ? 1
                : text?.is_end === 1 && text?.is_start === 2
                ? 2
                : text?.is_start === 2 && text?.is_end === 2
                ? 3
                : 0
            }
          />
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
            strokeColor="var(--function-success)"
            style={{ color: 'var(--function-success)', cursor: 'not-allowed' }}
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
      render: (text: any, record: any) => {
        return (
          <MultipleAvatar
            max={3}
            list={record.usersInfo?.map((i: any) => ({
              id: i.id,
              name: i.name,
              avatar: i.avatar,
            }))}
          />
        )
      },
    },
  ]

  const onVisibleChange = (visible: any) => {
    setIsVisible(visible)
  }

  return fullScreen ? (
    <Popover
      key={isVisible.toString()}
      visible={isVisible}
      placement="bottom"
      trigger="click"
      onVisibleChange={onVisibleChange}
      content={
        <div
          style={{
            maxHeight: 310,
            overflow: 'auto',
            width: 950,
          }}
        >
          {!!dataList?.list &&
            (dataList?.list?.length > 0 ? (
              <Table
                rowKey="id"
                pagination={false}
                columns={
                  props.row.project_type === 2
                    ? columnsChild?.filter((i: any) => i.key !== 'schedule')
                    : columnsChild
                }
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
      getPopupContainer={() =>
        document.querySelector('.kanBanFullScreenBox') as any
      }
    >
      <ClickWrap
        ref={ref}
        style={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
        }}
        onClick={onChildClick}
      >
        {props?.hasIcon && (
          <IconFont
            type="apartment02"
            style={{ color: 'var(--neutral-n3)', fontSize: 16, marginRight: 8 }}
          />
        )}
        {props.value}
      </ClickWrap>
    </Popover>
  ) : (
    <Popover
      key={isVisible.toString()}
      visible={isVisible}
      placement="bottom"
      trigger="click"
      onVisibleChange={onVisibleChange}
      content={
        <div
          style={{
            maxHeight: 310,
            overflow: 'auto',
            width: 950,
          }}
        >
          {!!dataList?.list &&
            (dataList?.list?.length > 0 ? (
              <Table
                rowKey="id"
                pagination={false}
                columns={
                  props.row.project_type === 2
                    ? columnsChild?.filter((i: any) => i.key !== 'schedule')
                    : columnsChild
                }
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
        ref={ref}
        style={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
        }}
        onClick={onChildClick}
      >
        {props?.hasIcon && (
          <IconFont
            type="apartment02"
            style={{ color: 'var(--neutral-n3)', fontSize: 16, marginRight: 8 }}
          />
        )}
        {props.value}
      </ClickWrap>
    </Popover>
  )
})

export default ChildDemandTable
