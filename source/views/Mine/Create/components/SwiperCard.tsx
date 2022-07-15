/* eslint-disable react/jsx-no-literals */
/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import projectImg from '@/assets/projectImg.png'
import { Dropdown, Menu } from 'antd'

const DropdownWrap = styled(Dropdown)({
  display: 'none',
  cursor: 'pointer',
})

const Warp = styled.div({
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 4,
  height: 104,
  width: 160,
  overflow: 'hidden',
  cursor: 'pointer',
  '&: hover': {
    boxShadow: '0px 2px 8px rgba(170, 193, 227, 1)',
    [DropdownWrap.toString()]: {
      display: 'block',
    },
  },
})

const ImgWrap = styled.div({
  height: 104,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  img: {
    maxWidth: '100%',
    maxHeight: '100%',
  },
})

const NameWrap = styled.div({
  width: '90%',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  fontSize: 14,
  fontWeight: 400,
  color: 'black',
})

const TextWarp = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 16px',
  height: 40,
  background: 'white',
})

export default () => {
  return (
    <Warp>
      <ImgWrap>
        <img src={projectImg} alt="" />
      </ImgWrap>
      <TextWarp>
        <NameWrap>公司名称公司名称公公司名称公司名称公司名称司名称</NameWrap>
      </TextWarp>
    </Warp>
  )
}
