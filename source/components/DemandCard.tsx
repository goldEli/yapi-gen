/* eslint-disable react/jsx-no-literals */
/* eslint-disable @typescript-eslint/naming-convention */
import React from 'react'
import styled from '@emotion/styled'
import IconFont from './IconFont'
import { Dropdown, Avatar } from 'antd'
import { OmitText } from '@star-yun/ui'

interface Item {
  name: string
  person: number
  demand: number
}

interface Props {
  item: Item
  onChangeEdit?(): void
  onChangeDelete?(): void
  menu: React.ReactElement
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
  width: 268,
  height: 90,
  background: 'white',
  borderRadius: 6,
  border: '1px solid #EBEDF0',
  overflow: 'hidden',
  position: 'relative',
  marginTop: 16,
  '&: hover': {
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

export default (props: Props) => {
  return (
    <Wrap>
      <WrapBorder />
      <MainWrap>
        <OmitText width={200}>{props.item.name}</OmitText>
        <AvatarWrap>
          <Avatar />
          <div
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          >
            <IconFont
              type="apartment"
              style={{ color: '#969799', fontSize: 16, marginRight: 8 }}
            />
            <span style={{ color: '#323233', fontSize: 16 }}>
              {props.item.demand}
            </span>
          </div>
        </AvatarWrap>
      </MainWrap>
      <Dropdown
        overlay={props.menu}
        placement="bottomCenter"
        trigger={['hover']}
      >
        <MoreWrap type="more" />
      </Dropdown>
    </Wrap>
  )
}
