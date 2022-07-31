/* eslint-disable complexity */
/* eslint-disable react/jsx-no-literals */
/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import projectImg from '@/assets/projectImg.png'
import IconFont from './IconFont'
import { Dropdown, Menu } from 'antd'
import { useState } from 'react'
import { getIsPermission } from '@/tools/index'
import { useModel } from '@/models'

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
  item: any
  onChangeOperation?(type: string, item: any): void
}

const ProjectCard = (props: Props) => {
  const [isVisible, setIsVisible] = useState(false)
  const { userInfo } = useModel('user')

  const onClickMenu = (e: any, type: string, item: any) => {
    e.stopPropagation()
    props.onChangeOperation?.(type, item)
  }

  const menu = (item: any) => {
    let menuItems = [
      {
        key: '1',
        label: <div onClick={e => onClickMenu(e, 'edit', item)}>编辑</div>,
      },
      {
        key: '2',
        label: (
          <div onClick={e => onClickMenu(e, 'end', item)}>
            {item.status === 1 ? '结束' : '开启'}
          </div>
        ),
      },
      {
        key: '3',
        label: <div onClick={e => onClickMenu(e, 'delete', item)}>删除</div>,
      },
    ]

    if (getIsPermission(userInfo?.company_permissions, 'b/project/update')) {
      menuItems = menuItems.filter((i: any) => i.key !== '1')
    }

    if (getIsPermission(userInfo?.company_permissions, 'b/project/delete')) {
      menuItems = menuItems.filter((i: any) => i.key !== '3')
    }

    if (item.status === 1) {
      if (getIsPermission(userInfo?.company_permissions, 'b/project/stop')) {
        menuItems = menuItems.filter((i: any) => i.key !== '2')
      }
    }

    if (getIsPermission(userInfo?.company_permissions, 'b/project/start')) {
      menuItems = menuItems.filter((i: any) => i.key !== '2')
    }

    return <Menu items={menuItems} />
  }

  const onMoreClick = (e: any) => {
    e.stopPropagation()
    setIsVisible(!isVisible)
  }

  return (
    <Warp>
      <ImgWrap>
        <div />
        <img src={props.item.cover} alt="" />
      </ImgWrap>
      <TextWarp>
        <NameWrap>{props.item.name}</NameWrap>
        <DropdownWrap
          overlay={() => menu(props.item)}
          trigger={['click']}
          placement="bottomRight"
          getPopupContainer={node => node}
        >
          <IconFont
            onClick={e => onMoreClick(e)}
            style={{ fontSize: 16, color: '#BBBDBF' }}
            type="more"
          />
        </DropdownWrap>
      </TextWarp>
    </Warp>
  )
}

export default ProjectCard
