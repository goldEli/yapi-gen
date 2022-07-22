import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { useNavigate, Outlet } from 'react-router-dom'
import { css } from '@emotion/css'
import IconFont from '@/components/IconFont'
import { type } from 'os'
import QuicklyCreate from './components/QuicklyCreate'

const buttonCss = css``

const AddButton = styled.div({
  width: 112,
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
const Main = styled.div`
  flex: 1;
`
const Menu = styled.div`
  width: 100%;
  margin-top: 24px;
`
const menuItem = css`
  box-sizing: border-box;
  justify-content: center;
  height: 44px;
  display: flex;
  align-items: center;
`
const menuItemColor = css`
  box-sizing: border-box;
  background: rgba(240, 244, 250, 1);
  color: rgba(40, 119, 255, 1);
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 3px solid rgba(40, 119, 255, 1);
`
type MenuList = {
  id: number
  name: string
  path: string
}
const menuList = [
  {
    id: 1,
    name: '我的概况',
    path: '',
  },
  {
    id: 2,
    name: '我的待办',
    path: 'carbon',
  },
  {
    id: 3,
    name: '我创建的',
    path: 'create',
  },
  {
    id: 4,
    name: '我的已办',
    path: 'finished',
  },
  {
    id: 5,
    name: '抄送我的',
    path: 'agenda',
  },
]

const MineBox = () => {
  const urlParams = new URL(window.location.href)
  const pathname = urlParams?.pathname
  const nowPath = pathname.split('/')[2] || ''
  const [quickCreateVisible, setQuickCreateVisible] = useState(false)
  const navigate = useNavigate()

  const changeActive = (value: MenuList) => {
    navigate(value.path)
  }
  const controlquickCreateVisible = () => {
    setQuickCreateVisible(true)
  }
  return (
    <Wrap>
      <Side>
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
          <span>快速创建</span>
        </AddButton>
        <Menu>
          {menuList.map(item => (
            <div
              onClick={() => changeActive(item)}
              key={item.id}
              className={nowPath === item.path ? menuItemColor : menuItem}
            >
              {item.name}
            </div>
          ))}
        </Menu>
      </Side>
      <Main>
        <Outlet />
      </Main>
      <QuicklyCreate
        visible={quickCreateVisible}
        onChangeVisible={() => setQuickCreateVisible(false)}
      />
    </Wrap>
  )
}

export default MineBox
