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
const Main = styled.div({
  width: 'calc(100% - 220px)',
  overflow: 'auto',
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

type MenuList = {
  id: number
  name: string
  path: string
}

const MineBox = () => {
  const [t] = useTranslation()
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
      name: t('mine.mineSurvey'),
      path: '',
      isPermission: getIsPermission(
        userInfo?.company_permissions,
        'b/user/overview',
      ),
    },
    {
      id: 2,
      name: t('mine.mineNeedDeal'),
      path: 'carbon',
      isPermission: getIsPermission(
        userInfo?.company_permissions,
        'b/user/abeyance/story',
      ),
    },
    {
      id: 3,
      name: t('mine.mineCreate'),
      path: 'create',
      isPermission: getIsPermission(
        userInfo?.company_permissions,
        'b/user/create/story',
      ),
    },
    {
      id: 4,
      name: t('mine.mineFinish'),
      path: 'finished',
      isPermission: getIsPermission(
        userInfo?.company_permissions,
        'b/user/finish/story',
      ),
    },
    {
      id: 5,
      name: t('mine.copyMine'),
      path: 'agenda',
      isPermission: getIsPermission(
        userInfo?.company_permissions,
        'b/user/copysend/story',
      ),
    },
    {
      id: 6,
      name: t('newlyAdd.mineExamine'),
      path: 'examine',
      isPermission: false,
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
              <span>{t('mine.quickCreate')}</span>
            </AddButton>
          )}
        <Menu>
          {menuList.map(item => (
            <MenuItem
              active={nowPath === item.path}
              onClick={() => changeActive(item)}
              key={item.id}
              hidden={item.isPermission}
            >
              {item.name}
            </MenuItem>
          ))}
        </Menu>
      </Side>
      <Main>
        <Outlet />
      </Main>
      {quickCreateVisible ? (
        <EditDemand
          visible={quickCreateVisible}
          onChangeVisible={() => setQuickCreateVisible(false)}
          isQuickCreate
          notGetPath
        />
      ) : null}
    </Wrap>
  )
}

export default MineBox
