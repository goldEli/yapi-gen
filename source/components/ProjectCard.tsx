// 项目卡片

/* eslint-disable react/jsx-no-literals */
/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import { useState } from 'react'
import { getIsPermission } from '@/tools/index'
import { useTranslation } from 'react-i18next'
import MoreDropdown from './MoreDropdown'
import { Menu } from 'antd'
import { useSelector } from '@store/index'

const ImgWrap = styled.div({
  height: 104,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  position: 'relative',
  cursor: 'pointer',
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
    width: '100%',
    height: '100%',
  },
})

const Warp = styled.div({
  margin: '0px 0 8px 8px ',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 4,
  height: 144,
  width: 220,
  overflow: 'hidden',
  '&: hover': {
    boxShadow: '0px 2px 8px rgba(170, 193, 227, 1)',
    '.dropdownIcon': {
      visibility: 'visible',
      svg: {
        color: '#2877ff',
      },
    },
    [ImgWrap.toString()]: {
      div: {
        display: 'block',
      },
    },
  },
})

const NameWrap = styled.div({
  maxWidth: '90%',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  fontSize: 14,
  fontWeight: 400,
  cursor: 'pointer',
  color: 'black',
  '&: hover': {
    color: '#2877ff',
  },
})

const TextWarp = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 6px 0 16px',
  height: 40,
  background: 'white',
})

interface Props {
  item: any
  onChangeOperation?(type: string, item: any): void
  onToDetail(): void
}

const ProjectCard = (props: Props) => {
  const [t] = useTranslation()
  const [isMoreVisible, setIsMoreVisible] = useState(false)
  const { userInfo } = useSelector(store => store.user)

  const hasEdit = getIsPermission(
    userInfo?.company_permissions,
    'b/project/update',
  )
  const hasDelete = getIsPermission(
    userInfo?.company_permissions,
    'b/project/delete',
  )
  const hasStop = getIsPermission(
    userInfo?.company_permissions,
    'b/project/stop',
  )
  const hasStart = getIsPermission(
    userInfo?.company_permissions,
    'b/project/start',
  )

  const onClickMenu = (type: string, item: any) => {
    setIsMoreVisible(false)
    props.onChangeOperation?.(type, item)
  }

  const menu = (item: any) => {
    let menuItems = [
      {
        key: '1',
        label: (
          <div onClick={() => onClickMenu('edit', item)}>
            {t('common.edit')}
          </div>
        ),
      },
      {
        key: '2',
        label: (
          <div onClick={() => onClickMenu('end', item)}>
            {item.status === 1 ? t('common.stop') : t('common.open')}
          </div>
        ),
      },
      {
        key: '3',
        label: (
          <div onClick={() => onClickMenu('delete', item)}>
            {t('common.del')}
          </div>
        ),
      },
    ]

    if (hasEdit) {
      menuItems = menuItems.filter((i: any) => i.key !== '1')
    }

    if (hasDelete) {
      menuItems = menuItems.filter((i: any) => i.key !== '3')
    }

    if (item.status === 1) {
      if (hasStop) {
        menuItems = menuItems.filter((i: any) => i.key !== '2')
      }
    }

    if (hasStart) {
      menuItems = menuItems.filter((i: any) => i.key !== '2')
    }

    return (
      <Menu
        items={menuItems}
        style={{ minWidth: 60, textAlign: 'center', width: 'max-content' }}
      />
    )
  }

  return (
    <Warp>
      <ImgWrap onClick={props.onToDetail}>
        <div />
        <img src={props.item.cover} alt="" />
      </ImgWrap>
      <TextWarp>
        <NameWrap onClick={props.onToDetail}>{props.item.name}</NameWrap>
        {!hasEdit && !hasDelete && !hasStart && !hasStop && (
          <MoreDropdown
            isMoreVisible={isMoreVisible}
            menu={() => menu(props.item)}
            onChangeVisible={setIsMoreVisible}
          />
        )}
      </TextWarp>
    </Warp>
  )
}

export default ProjectCard
