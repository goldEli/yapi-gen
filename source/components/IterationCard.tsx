// 迭代主页对应左侧迭代卡片

/* eslint-disable react/jsx-no-literals */
/* eslint-disable @typescript-eslint/naming-convention */
import { useState } from 'react'
import styled from '@emotion/styled'
import { Menu, Progress } from 'antd'
import IconFont from './IconFont'
import { getIsPermission } from '@/tools'
import { useSelector } from '@store/index'
import { useTranslation } from 'react-i18next'
import IterationStatus from '@/views/Project/Detail/Iteration/components/IterationStatus'
import MoreDropdown from './MoreDropdown'

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
    '.dropdownIcon': {
      position: 'absolute',
      top: 10,
      right: 6,
    },
    '&: hover': {
      border: '1px solid #2877ff',
      '.dropdownIcon': {
        visibility: 'visible',
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

interface Props {
  item: any
  onClickInfo(): void
  onClickItem?(): void
  isActive?: boolean
  onChangeEdit(e: any, item: any): void
  onChangeDelete(e: any, item: any): void
  onChangeStatus(value: any, e: any): void
}

const IterationCard = (props: Props) => {
  const [t] = useTranslation()
  const [isVisible, setIsVisible] = useState(false)
  const { projectInfo } = useSelector(store => store.project)

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

  const onClickMenu = (e: any, type: any) => {
    setIsVisible(false)
    if (type === 'edit') {
      props?.onChangeEdit(e, props?.item)
    } else if (type === 'del') {
      props?.onChangeDelete(e, props?.item)
    }
  }

  const menu = () => {
    let menuItems = [
      {
        key: '1',
        label: (
          <div onClick={e => onClickMenu(e, 'edit')}>{t('common.edit')}</div>
        ),
      },
      {
        key: '2',
        label: (
          <div onClick={e => onClickMenu(e, 'del')}>{t('common.del')} </div>
        ),
      },
    ]
    if (hasEdit) {
      menuItems = menuItems.filter((i: any) => i.key !== '1')
    }

    if (hasDel) {
      menuItems = menuItems.filter((i: any) => i.key !== '2')
    }

    return <Menu items={menuItems} />
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
            (props.item.finishCount / props.item.storyCount) * 100,
          )}
          format={percent => (percent === 100 ? '100%' : `${percent}%`)}
          strokeWidth={8}
        />
        <InfoContent>
          <TitleWrap>{props.item.name}</TitleWrap>
          <TimeWrap>
            {props.item.createdTime}-{props.item.endTime}
          </TimeWrap>
          <IterationStatus
            iterateInfo={props.item}
            hasChangeStatus={hasChangeStatus}
            onChangeStatus={props.onChangeStatus}
          />
        </InfoContent>
      </div>
      <DetailWrap onClick={props.onClickInfo}>
        <span>{t('common.info')}</span>
        <IconFont type="right" />
      </DetailWrap>
      {!(hasDel && hasEdit && hasChangeStatus) && (
        <MoreDropdown
          isMoreVisible={isVisible}
          menu={menu()}
          onChangeVisible={setIsVisible}
        />
      )}
    </CardWrap>
  )
}

export default IterationCard
