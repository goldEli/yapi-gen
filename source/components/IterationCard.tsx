/* eslint-disable react/jsx-no-literals */
/* eslint-disable @typescript-eslint/naming-convention */
import { useState } from 'react'
import styled from '@emotion/styled'
import { Dropdown, Progress } from 'antd'
import IconFont from './IconFont'

const MoreWrap = styled(IconFont)({
  display: 'none',
  position: 'absolute',
  top: 16,
  right: 16,
  color: '#969799',
})

const CardWrap = styled.div({
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
    [MoreWrap.toString()]: {
      display: 'block',
    },
  },
})

const InfoContent = styled.div({
  display: 'flex',
  flexDirection: 'column',
  marginLeft: 8,
})

const TitleWrap = styled.div({
  fontSize: 14,
  fontWeight: 'bold',
  color: 'black',
})

const TimeWrap = styled.div({
  fontSize: 12,
  color: '#BBBDBF',
  height: 20,
  lineHeight: '20px',
})

const StatusTag = styled.div({
  height: 20,
  borderRadius: 6,
  padding: '0 8px',
  color: '#43BA9A',
  background: '#EDF7F4',
  width: 'fit-content',
  fontSize: 12,
})

const DetailWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  color: '#BBBDBF',
})

interface Props {
  item: any
  menu: React.ReactElement
  onClickInfo(): void
  onClickItem?(): void
}

const IterationCard = (props: Props) => {
  const [isVisible, setIsVisible] = useState(false)

  const onClick = (e: any) => {
    e.stopPropagation()
    setIsVisible(!isVisible)
  }

  return (
    <CardWrap onClick={props.onClickItem}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Progress
          strokeColor="#43BA9A"
          width={48}
          type="circle"
          percent={props.item.finishCount / props.item.storyCount * 100}
          strokeWidth={8}
        />
        <InfoContent>
          <TitleWrap>{props.item.name}</TitleWrap>
          <TimeWrap>
            {props.item.createdTime}-{props.item.endTime}
          </TimeWrap>
          <StatusTag>{props.item.status === 1 ? '开启中' : '已关闭'}</StatusTag>
        </InfoContent>
      </div>
      <DetailWrap onClick={props.onClickInfo}>
        <span>详情</span>
        <IconFont type="right" />
      </DetailWrap>
      <Dropdown
        visible={isVisible}
        overlay={props.menu}
        placement="bottomRight"
        trigger={['click']}
        getPopupContainer={node => node}
      >
        <MoreWrap onClick={onClick} type="more" />
      </Dropdown>
    </CardWrap>
  )
}

export default IterationCard
