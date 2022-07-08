/* eslint-disable react/jsx-no-literals */
/* eslint-disable @typescript-eslint/naming-convention */
import React from 'react'
import styled from '@emotion/styled'
import { Dropdown, Progress, Menu } from 'antd'
import IconFont from './IconFont'

const MoreWrap = styled(IconFont)({
  display: 'none',
  position: 'absolute',
  top: 16,
  right: 16
})

const CardWrap = styled.div({
  padding: '0 4px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: 320,
  height: 100,
  borderRadius: 4,
  background: 'white',
  marginBottom: 8,
  position: 'relative',
  border: '1px solid #ccc',
  cursor: 'pointer',
  '&: hover': {
    background: '#f2f2f4',
    [MoreWrap.toString()]: {
      display: 'block'
    }
  }
})

const InfoContent = styled.div({
  display: 'flex',
  flexDirection: 'column',
  marginLeft: 12
})

const TitleWrap = styled.div({
  fontSize: 14,
  fontWeight: 'bold',
})

const TimeWrap = styled.div({
  fontSize: 12,
  margin: '4px 0 8px 0'
})

const StatusTag = styled.div({
  height: 20,
  borderRadius: 8,
  padding: '0 8px',
  color: 'white',
  background: '#ccc',
  width: 'fit-content',
  fontSize: 12
})

const DetailWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  color: '#ccc',
})

interface Props {
  item: object
  onChangeEdit?(): void
  onChangeDelete?(): void
  onChangeEnd?(): void
}


export default (props: Props) => {
  const menu = (
    <Menu
      items={[
        {
          key: '1',
          label: (
            <div onClick={props.onChangeEdit}> 编辑 </div>
          ),
        },
        {
          key: '2',
          label: (
            <div onClick={props.onChangeEnd}> 结束 </div>
          ),
        },
        {
          key: '3',
          label: (
            <div onClick={props.onChangeDelete}> 删除 </div>
          ),
        },
      ]}
    />
  )
  return (
    <CardWrap>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Progress width={60} type="circle" percent={75} />
        <InfoContent>
          <TitleWrap>敏捷版本V1.0</TitleWrap>
          <TimeWrap>2022-6-17 -- 2022-6-17</TimeWrap>
          <StatusTag>开启中</StatusTag>
        </InfoContent>
      </div>
      <DetailWrap>
        <span>详情</span>
        <IconFont type="lineright" />
      </DetailWrap>
      <Dropdown overlay={menu} placement="bottomCenter" trigger={['hover']}>
        <MoreWrap type="lineelse" />
      </Dropdown>
    </CardWrap>
  )
}
