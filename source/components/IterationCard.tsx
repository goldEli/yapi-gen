/* eslint-disable react/jsx-no-literals */
/* eslint-disable @typescript-eslint/naming-convention */
import { useState } from 'react'
import styled from '@emotion/styled'
import { Dropdown, Progress } from 'antd'
import IconFont from './IconFont'
import { getIsPermission } from '@/tools'
import { useModel } from '@/models'
import { useTranslation } from 'react-i18next'

const MoreWrap = styled(IconFont)({
  display: 'none',
  position: 'absolute',
  top: 16,
  right: 16,
  color: '#969799',
})

const DetailWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  color: '#BBBDBF',
  fontSize: 12,
})

const CardWrap = styled.div<{ active?: boolean }>(
  {
    padding: '0 8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: 90,
    borderRadius: 6,
    background: 'white',
    marginBottom: 8,
    position: 'relative',
    border: '1px solid #EBEDF0',
    cursor: 'pointer',
    '&: hover': {
      border: '1px solid #2877ff',
      [MoreWrap.toString()]: {
        display: 'block',
      },
      [DetailWrap.toString()]: {
        color: '#2877ff',
      },
    },
    '.ant-progress-circle.ant-progress-status-success .ant-progress-text': {
      color: 'black!important',
    },
  },
  ({ active }) => ({
    border: active ? '1px solid #2877ff' : '1px solid #EBEDF0',
    [DetailWrap.toString()]: {
      color: active ? '#2877ff' : '#BBBDBF',
    },
  }),
)

const InfoContent = styled.div({
  display: 'flex',
  flexDirection: 'column',
  marginLeft: 8,
})

const TitleWrap = styled.div({
  fontSize: 14,
  fontWeight: '400',
  color: 'black',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  maxWidth: 130,
})

const TimeWrap = styled.div({
  fontSize: 12,
  color: '#BBBDBF',
  height: 20,
  lineHeight: '20px',
})

const StatusTag = styled.div<{ isOpen: boolean }>(
  {
    height: 20,
    borderRadius: 6,
    padding: '0 8px',
    width: 'fit-content',
    fontSize: 12,
  },
  ({ isOpen }) => ({
    color: isOpen ? '#43BA9A' : '#969799',
    background: isOpen ? '#EDF7F4' : '#F2F2F4',
  }),
)

interface Props {
  item: any
  menu: React.ReactElement
  onClickInfo(): void
  onClickItem?(): void
  isActive?: boolean
}

const IterationCard = (props: Props) => {
  const [t] = useTranslation()
  const [isVisible, setIsVisible] = useState(false)
  const { projectInfo } = useModel('project')

  const hasEdit = getIsPermission(
    projectInfo?.projectPermissions,
    'b/iterate/update',
  )
  const hasDel = getIsPermission(
    projectInfo?.projectPermissions,
    'b/iterate/del',
  )
  const hasChangeStatus = getIsPermission(
    projectInfo?.projectPermissions,
    'b/iterate/status',
  )

  const onVisibleChange = (visible: any) => {
    setIsVisible(visible)
  }

  return (
    <CardWrap onClick={props.onClickItem} active={props.isActive}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Progress
          strokeColor="#43BA9A"
          style={{ color: '#43BA9A' }}
          width={48}
          type="circle"
          percent={Math.trunc(
            props.item.finishCount / props.item.storyCount * 100,
          )}
          format={percent => percent === 100 ? '100%' : `${percent}%`}
          strokeWidth={13}
        />
        <InfoContent>
          <TitleWrap>{props.item.name}</TitleWrap>
          <TimeWrap>
            {props.item.createdTime}-{props.item.endTime}
          </TimeWrap>
          <StatusTag isOpen={props.item.status === 1}>
            {props.item.status === 1 ? t('common.opening') : t('common.Closed')}
          </StatusTag>
        </InfoContent>
      </div>
      <DetailWrap onClick={props.onClickInfo}>
        <span>{t('common.info')}</span>
        <IconFont type="right" />
      </DetailWrap>
      {hasDel && hasEdit && hasChangeStatus
        ? null
        : (
            <Dropdown
              key={isVisible.toString()}
              visible={isVisible}
              overlay={props.menu}
              placement="bottomRight"
              trigger={['hover']}
              getPopupContainer={node => node}
              onVisibleChange={onVisibleChange}
            >
              <MoreWrap type="more" />
            </Dropdown>
          )}
    </CardWrap>
  )
}

export default IterationCard
