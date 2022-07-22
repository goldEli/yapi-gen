/* eslint-disable react/jsx-no-literals */
/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import projectImg from '@/assets/projectImg.png'
import IconFont from './IconFont'
import { Dropdown, Menu } from 'antd'

const DropdownWrap = styled(Dropdown)({
  display: 'none',
  cursor: 'pointer',
})

const ImgWrap = styled.div({
  height: 104,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  position: 'relative',
  div: {
    width: '100%',
    height: '100%',
    background: 'black',
    opacity: '0.2',
    zIndex: 2,
    position: 'absolute',
    display: 'none',
  },
  img: {
    maxWidth: '100%',
    maxHeight: '100%',
  },
})

const Warp = styled.div({
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 4,
  height: 144,
  width: 220,
  overflow: 'hidden',
  cursor: 'pointer',
  '&: hover': {
    boxShadow: '0px 2px 8px rgba(170, 193, 227, 1)',
    [DropdownWrap.toString()]: {
      display: 'block',
    },
    [ImgWrap.toString()]: {
      div: {
        display: 'block',
      },
    },
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

interface Props {
  item: object
  onChangeOperation?(type: string, id: number): void
}

const ProjectCard = (props: Props) => {
  const onClickMenu = (e: any, type: string) => {
    e.stopPropagation()
    props.onChangeOperation?.(type, 0)
  }
  const menu = (
    <Menu
      items={[
        {
          key: '1',
          label: <div onClick={e => onClickMenu(e, 'edit')}>编辑</div>,
        },
        {
          key: '2',
          label: <div onClick={e => onClickMenu(e, 'end')}>结束</div>,
        },
        {
          key: '3',
          label: <div onClick={e => onClickMenu(e, 'delete')}>删除</div>,
        },
      ]}
    />
  )
  return (
    <Warp>
      <ImgWrap>
        <div />
        <img src={projectImg} alt="" />
      </ImgWrap>
      <TextWarp>
        <NameWrap>公司名称公司名称公公司名称公司名称公司名称司名称</NameWrap>
        <DropdownWrap
          overlay={menu}
          trigger={['hover']}
          placement="bottomRight"
          getPopupContainer={node => node}
        >
          <IconFont style={{ fontSize: 16, color: '#BBBDBF' }} type="more" />
        </DropdownWrap>
      </TextWarp>
    </Warp>
  )
}

export default ProjectCard
