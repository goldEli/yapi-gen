/* eslint-disable react/jsx-no-literals */
/* eslint-disable @typescript-eslint/naming-convention */
import React from 'react'
import styled from '@emotion/styled'
import IconFont from './IconFont'
import { Menu, Dropdown, Avatar } from 'antd'

interface Props {
  item: object
  onChangeEdit?(): void
  onChangeDelete?(): void
}

const MoreWrap = styled(IconFont)({
  display: 'none',
  position: 'absolute',
  top: 8,
  right: 8
})

const Wrap = styled.div({
  width: 240,
  height: 100,
  background: 'white',
  borderRadius: 4,
  border: '1px solid #ccc',
  overflow: 'hidden',
  position: 'relative',
  '&: hover': {
    [MoreWrap.toString()]: {
      display: 'block'
    }
  }
})

const WrapBorder = styled.div({
  position: 'absolute',
  left: 0,
  height: '100%',
  width: 4,
  background: '#ccc'
})

const MainWrap = styled.div({
  display: 'flex',
  flexDirection: 'column',
  padding: '8px 16px 8px 24px'
})

const AvatarWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  marginTop: 16
})


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
          key: '3',
          label: (
            <div onClick={props.onChangeDelete}> 删除 </div>
          ),
        },
      ]}
    />
  )
  return (
    <Wrap>
      <WrapBorder />
      <MainWrap>
        <div>需求名称</div>
        <AvatarWrap>
          <Avatar />
        </AvatarWrap>
      </MainWrap>
      <Dropdown overlay={menu} placement="bottomCenter" trigger={['hover']}>
        <MoreWrap type="lineelse" />
      </Dropdown>
    </Wrap>
  )
}
