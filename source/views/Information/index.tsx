/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable multiline-ternary */
import { useState } from 'react'
import styled from '@emotion/styled'
import { useNavigate, Outlet, useLocation } from 'react-router-dom'
import IconFont from '@/components/IconFont'
import EditDemand from '@/components/EditDemand'
import { getIsPermission } from '@/tools/index'
import { useModel } from '@/models'
import { useTranslation } from 'react-i18next'

const Wrap = styled.div`
  height: 100%;
  display: flex;
`
const Side = styled.div`
  align-self: stretch;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  padding-top: 24px;
  width: 220px;
  background: rgba(255, 255, 255, 1);
  flex-shrink: 0;
`
const AddButton = styled.div({
  height: 32,
  padding: '0 16px',
  borderRadius: 6,
  background: '#2877FF',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: 'white',
})

const Menu = styled.div`
  width: 100%;
  margin-top: 24px;
`
const MenuItem = styled.div<{ active?: boolean }>(
  {
    boxSizing: 'border-box',
    justifyContent: 'center',
    height: 44,
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    '&: hover': {
      color: '#2877ff!important',
    },
  },
  ({ active }) => ({
    borderRight: active ? '3px solid #2877ff' : '3px solid white',
    color: active ? '#2877ff' : '#323233',
    background: active ? '#F0F4FA' : 'white',
  }),
)
const Main = styled.div({
  width: 'calc(100% - 220px)',
  overflow: 'auto',
})

type MenuList = {
  id: number
  name: string
  path: string
}

const Information = () => {
  const [t] = useTranslation()
  const { pathname } = useLocation()
  const nowPath2 = Number(pathname.split('/')[3]) || ''
  const [quickCreateVisible, setQuickCreateVisible] = useState(false)
  const navigate = useNavigate()
  const { userInfo } = useModel('user')

  const changeActive = (value: MenuList) => {
    navigate(value.path)
  }
  const controlquickCreateVisible = () => {
    setQuickCreateVisible(true)
  }

  const menuList = [
    {
      id: 1,
      name: '我发出的',
      path: 'send/1',
      state: 1,
    },
    {
      id: 2,
      name: '发出日报',
      path: 'send/2',
    },
    {
      id: 3,
      name: '发出周报',
      path: 'send/3',
    },
    {
      id: 4,
      name: '发出月报',
      path: 'send/4',
    },
    {
      id: 5,
      name: '我收到的',
      path: 'get/5',
      state: 2,
    },
    {
      id: 6,
      name: '接收日报',
      path: 'get/6',
      isPermission: false,
    },
    {
      id: 7,
      name: '接收周报',
      path: 'get/7',
      isPermission: false,
    },
    {
      id: 8,
      name: '接收月报',
      path: 'get/8',
      isPermission: false,
    },
  ]
  const title = menuList[(nowPath2 as number) - 1].name
  return (
    <Wrap>
      <Side>
        {getIsPermission(
          userInfo?.company_permissions,
          'b/user/fast/create',
        ) ? null : (
            <AddButton onClick={controlquickCreateVisible}>
              <IconFont
                style={{
                  marginRight: 8,
                  fontSize: 14,
                  fontWeight: 400,
                  color: 'white',
                }}
                type="plus"
              />
              <span>写日志</span>
            </AddButton>
          )}
        <Menu>
          {menuList.map(item => (
            <MenuItem
              style={{
                fontSize: item.state ? '16px' : '',
                fontWeight: item.state ? 'bold' : '',
                position: 'relative',
              }}
              active={nowPath2 === item.id}
              onClick={() => changeActive(item)}
              key={item.id}
              hidden={item.isPermission}
            >
              {item.state === 1 && (
                <IconFont
                  type="project"
                  style={{
                    fontSize: 20,
                    marginRight: item.state ? '6px' : '',
                    position: 'absolute',
                    left: '45px',
                  }}
                />
              )}
              {item.state === 2 && (
                <IconFont
                  type="project"
                  style={{
                    fontSize: 20,
                    marginRight: item.state ? '6px' : '',
                    position: 'absolute',
                    left: '45px',
                  }}
                />
              )}
              {item.name}
            </MenuItem>
          ))}
        </Menu>
      </Side>
      <Main>
        <div
          style={{
            height: '64px',
            background: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            paddingLeft: '24px',
            fontSize: '16px',
            fontWeight: 'bold',
          }}
        >
          {title}
        </div>
        <Outlet />
      </Main>
    </Wrap>
  )
}

export default Information
