/* eslint-disable react/jsx-no-literals */
/* eslint-disable @typescript-eslint/naming-convention */
import React from 'react'
import styled from '@emotion/styled'
import logoWithNameImage from '@/assets/logo_with_name.png'
import IconFont from './IconFont'
import { Dropdown, Menu } from 'antd'

const IconFontWrap = styled(Dropdown)({
  display: 'none',
  cursor: 'pointer'
})
const Warp = styled.div({
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 8,
  height: 120,
  width: 180,
  '&: hover': {
    boxShadow: '0 0 6px 2px rgba(0,0,0,0.1)',
    [IconFontWrap.toString()]: {
      display: 'block',
    },
  }
})

const ImgWrap = styled.div({
  height: 90,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  img: {
    maxWidth: '100%',
    maxHeight: '100%'
  }
})

const NameWrap = styled.div({
  width: '90%',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden'
})

const TextWarp = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 8px',
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
    <Warp>
      <ImgWrap>
        <img src={logoWithNameImage} alt="" />
      </ImgWrap>
      <TextWarp>
        <NameWrap>公司名称公司名称公司名称</NameWrap>
        <Dropdown overlay={menu} trigger={['hover']} placement="bottomRight">
          <IconFont type="linedown" />
        </Dropdown>
      </TextWarp>
    </Warp>
  )
}
