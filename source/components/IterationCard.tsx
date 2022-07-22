/* eslint-disable react/jsx-no-literals */
/* eslint-disable @typescript-eslint/naming-convention */
import type React from 'react'
import styled from '@emotion/styled'
import { Dropdown, Progress } from 'antd'
import IconFont from './IconFont'
import { useNavigate } from 'react-router-dom'

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
  item: object
  menu: React.ReactElement
}

export default (props: Props) => {
  const navigate = useNavigate()
  return (
    <CardWrap>
      <div style={{ display: 'flex',
        alignItems: 'center' }}>
        <Progress
          strokeColor="#43BA9A"
          width={48}
          type="circle"
          percent={75}
          strokeWidth={8}
        />
        <InfoContent>
          <TitleWrap>敏捷版本V1.0</TitleWrap>
          <TimeWrap>2022-6-17-2022-6-17</TimeWrap>
          <StatusTag>开启中</StatusTag>
        </InfoContent>
      </div>
      <DetailWrap onClick={() => navigate('/Detail/Iteration?type=info')}>
        <span>详情</span>
        <IconFont type="right" />
      </DetailWrap>
      <Dropdown
        overlay={props.menu}
        placement="bottomRight"
        trigger={['hover']}
        getPopupContainer={node => node}
      >
        <MoreWrap type="more" />
      </Dropdown>
    </CardWrap>
  )
}
