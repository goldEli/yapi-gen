/* eslint-disable multiline-ternary */
import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { useNavigate, Outlet, useLocation } from 'react-router-dom'
import { css } from '@emotion/css'
import IconFont from '@/components/IconFont'
import { type } from 'os'
import QuicklyCreate from './components/QuicklyCreate'
import { getIsPermission } from '@/tools/index'
import { useModel } from '@/models'

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

const MineBox = () => {
  const { pathname } = useLocation()
  const nowPath = pathname.split('/')[2] || ''
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
      name: '我的概况',
      path: '',
      isPermission: getIsPermission(
        userInfo?.company_permissions,
        'b/user/overview',
      ),
    },
    {
      id: 2,
      name: '我的待办',
      path: 'carbon',
      isPermission: getIsPermission(
        userInfo?.company_permissions,
        'b/user/abeyance/story',
      ),
    },
    {
      id: 3,
      name: '我创建的',
      path: 'create',
      isPermission: getIsPermission(
        userInfo?.company_permissions,
        'b/user/finish/story',
      ),
    },
    {
      id: 4,
      name: '我的已办',
      path: 'finished',
      isPermission: getIsPermission(
        userInfo?.company_permissions,
        'b/user/finish/story',
      ),
    },
    {
      id: 5,
      name: '抄送我的',
      path: 'agenda',
      isPermission: getIsPermission(
        userInfo?.company_permissions,
        'b/user/copysend/story',
      ),
    },
  ]

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
              <span>快速创建</span>
            </AddButton>
          )}
        <Menu>
          {menuList.map(item => (
            <div
              onClick={() => changeActive(item)}
              key={item.id}
              className={nowPath === item.path ? menuItemColor : menuItem}
              hidden={item.isPermission}
            >
              {item.name}
            </div>
          ))}
        </Menu>
      </Side>
      <Main>
        <Outlet />
      </Main>
      {quickCreateVisible ? (
        <QuicklyCreate
          visible={quickCreateVisible}
          onChangeVisible={() => setQuickCreateVisible(false)}
        />
      ) : null}
    </Wrap>
  )
}

export default MineBox
