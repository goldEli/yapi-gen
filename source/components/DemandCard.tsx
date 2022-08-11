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
import { getIsPermission } from '@/tools'
import { ClickWrap } from './StyleCommon'
import { useTranslation } from 'react-i18next'

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
  height: 90,
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
  padding: '12px 16px 12px 20px',
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

const DemandCard = (props: Props) => {
  const [t] = useTranslation()
  const [isVisible, setIsVisible] = useState(false)
  const [isMoreVisible, setIsMoreVisible] = useState(false)
  const { getDemandList, updateDemandStatus } = useModel('demand')
  const { projectInfo } = useModel('project')
  const [searchParams] = useSearchParams()
  const projectId = searchParams.get('id')
  const [dataList, setDataList] = useState<any>([])
  const hasEdit = getIsPermission(
    projectInfo?.projectPermissions,
    'b/story/update',
  )
  const hasDel = getIsPermission(
    projectInfo?.projectPermissions,
    'b/story/delete',
  )

  const getList = async () => {
    const result = await getDemandList({
      projectId,
      all: true,
      parentId: props.item?.id,
    })
    setDataList(result)
  }

  const onChildClick = () => {
    getList()
    setIsVisible(!isVisible)
  }

  const onChangeStatus = async (value: any) => {
    try {
      await updateDemandStatus(value)
      message.success(t('common.statusSuccess'))
      getList()
    } catch (error) {

      //
    }
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
      title: 'ID',
      dataIndex: 'id',
      sorter: {
        compare: (a: any, b: any) => a.demand - b.demand,
      },
    },
    {
      title: t('common.demandName'),
      dataIndex: 'name',
      render: (text: string) => {
        return <OmitText width={180}>{text}</OmitText>
      },
      sorter: {
        compare: (a: any, b: any) => a.iteration - b.iteration,
      },
    },
    {
      title: t('common.iterate'),
      dataIndex: 'iteration',
      sorter: {
        compare: (a: any, b: any) => a.progress - b.progress,
      },
    },
    {
      title: t('common.status'),
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
            <StatusWrap color={text?.color}>{text?.content}</StatusWrap>
          </PopConfirm>
        )
      },
    },
    {
      title: t('common.createName'),
      dataIndex: 'dealName',
    },
  ]

  return (
    <div>
      <Wrap>
        <WrapBorder style={{ background: props.item?.priority?.color }} />
        <MainWrap>
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
                      {item.slice(item.length - 2, item.length)}
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
            <Popover
              key={isVisible.toString()}
              visible={isVisible}
              placement="bottom"
              trigger="hover"
              onVisibleChange={visible => setIsVisible(visible)}
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
                <span style={{ color: '#323233', fontSize: 16 }}>
                  {props.item?.childCount}
                </span>
              </div>
            </Popover>
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
