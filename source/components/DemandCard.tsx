/* eslint-disable no-undefined */
/* eslint-disable camelcase */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/jsx-no-literals */
/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import IconFont from './IconFont'
import { Dropdown, message, Popover, Table } from 'antd'
import { OmitText } from '@star-yun/ui'
import PopConfirm from '@/components/Popconfirm'
import { ShapeContent } from '@/components/Shape'
import { useModel } from '@/models'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getIsPermission, openDetail } from '@/tools'
import { CategoryWrap, ClickWrap } from './StyleCommon'
import { useTranslation } from 'react-i18next'
import Sort from './Sort'
import NoData from './NoData'
import ChildDemandTable from '@/components/ChildDemandTable'

interface Props {
  item: any
  onChangeEdit?(): void
  onChangeDelete?(): void
  menu: React.ReactElement
  onClickItem(): void
}

const MoreWrap = styled(IconFont)({
  display: 'none',
  position: 'absolute',
  top: 16,
  right: 16,
  cursor: 'pointer',
  color: '#BBBDBF',
})

const Wrap = styled.div({
  width: '100%',
  height: 126,
  background: 'white',
  borderRadius: 6,
  border: '1px solid #EBEDF0',
  borderLeft: 'none',
  position: 'relative',
  marginTop: 16,
  overflow: 'hidden',
  '&: hover': {
    border: '1px solid #2877ff',
    borderLeft: 'none',
    [MoreWrap.toString()]: {
      display: 'block',
    },
  },
})

const WrapBorder = styled.div({
  position: 'absolute',
  left: 0,
  height: '100%',
  width: 4,
  background: '#BBBDBF',
})

const MainWrap = styled.div({
  display: 'flex',
  flexDirection: 'column',
  padding: 16,
})

const AvatarWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: 12,
})

const NameGroup = styled.div({
  display: 'flex',
  alignItems: 'center',
  '.item': {
    width: 32,
    height: 32,
    borderRadius: '50%',
    overflow: 'hidden',
    boxSizing: 'border-box',
    background: '#619BFF',
    border: '1px solid white',
    color: 'white',
    fontSize: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    whiteSpace: 'nowrap',
  },
  '.more': {
    width: 32,
    height: 32,
    borderRadius: '50%',
    border: '1px solid white',
    background: '#B9BAC7',
    fontSize: 16,
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -10,
    zIndex: 4,
  },
})

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

const DemandCard = (props: Props) => {
  const [t] = useTranslation()
  const [isVisible, setIsVisible] = useState(false)
  const [isMoreVisible, setIsMoreVisible] = useState(false)
  const { getDemandList, updateDemandStatus } = useModel('demand')
  const { projectInfo } = useModel('project')
  const [searchParams] = useSearchParams()
  const projectId = searchParams.get('id')
  const [dataList, setDataList] = useState<any>({
    list: undefined,
  })
  const [order, setOrder] = useState<any>({ value: '', key: '' })
  const hasEdit = getIsPermission(
    projectInfo?.projectPermissions,
    'b/story/update',
  )
  const hasDel = getIsPermission(
    projectInfo?.projectPermissions,
    'b/story/delete',
  )

  const getList = async (item: any) => {
    const result = await getDemandList({
      projectId,
      all: true,
      parentId: props.item?.id,
      order: item.value,
      orderKey: item.key,
    })
    setDataList({ list: result })
  }

  const onUpdateOrderKey = (key: any, val: any) => {
    setOrder({ value: val === 2 ? 'desc' : 'asc', key })
    getList(order)
  }

  const onChildClick = () => {
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
      render: (text: string, record: any) => {
        return (
          <ClickWrap
            onClick={() => {
              openDetail(
                `/Detail/Demand?type=info&id=${record.project_id}&demandId=${record.id}`,
              )
            }}
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
      render: (text: string, record: any) => {
        return (
          <OmitText width={180}>
            <ClickWrap
              onClick={() => {
                openDetail(
                  `/Detail/Demand?type=info&id=${record.project_id}&demandId=${record.id}`,
                )
              }}
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
      render: (text: string) => {
        return <span>{text || '--'}</span>
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
      render: (text: any, record: any) => {
        return (
          <PopConfirm
            content={({ onHide }: { onHide(): void }) => {
              return (
                <ShapeContent
                  tap={value => onChangeStatus(value)}
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
              )
            }}
            record={record}
          >
            <StatusWrap
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
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
  ]

  return (
    <div>
      <Wrap>
        <WrapBorder style={{ background: props.item?.priority?.color }} />
        <MainWrap>
          <CategoryWrap
            color="#43BA9A"
            bgColor="#EDF7F4"
            style={{ margin: '0 0 8px 0', width: 'fit-content' }}
          >
            软件需求
          </CategoryWrap>
          <ClickWrap onClick={props.onClickItem}>
            <OmitText width={200}>{props.item.name}</OmitText>
          </ClickWrap>
          <AvatarWrap>
            <NameGroup>
              {props.item?.userName
                ?.slice(0, 3)
                ?.map((item: any, index: number) => (
                  <div
                    className="box"
                    key={item}
                    style={{ marginLeft: index ? -10 : 0, zIndex: index }}
                  >
                    <div className="item" style={{ background: '#A4ACF5' }}>
                      {String(item.trim().slice(0, 1)).toLocaleUpperCase()}
                    </div>
                  </div>
                ))}
              <div
                className="more"
                hidden={props.item?.userName?.length - 3 <= 0}
              >
                +{props.item?.userName?.length - 3}
              </div>
            </NameGroup>
            <ChildDemandTable
              value={props.item?.childCount}
              row={props.item}
              hasIcon
            />
          </AvatarWrap>
        </MainWrap>
        {hasDel && hasEdit
          ? null
          : (
              <Dropdown
                key={isMoreVisible.toString()}
                visible={isMoreVisible}
                overlay={props.menu}
                placement="bottomRight"
                trigger={['hover']}
                getPopupContainer={node => node}
                onVisibleChange={visible => setIsMoreVisible(visible)}
              >
                <MoreWrap type="more" />
              </Dropdown>
            )}
      </Wrap>
    </div>
  )
}

export default DemandCard
