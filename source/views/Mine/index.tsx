// 我的模块主页

/* eslint-disable @typescript-eslint/naming-convention */
import { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { useNavigate, Outlet, useLocation } from 'react-router-dom'
import IconFont from '@/components/IconFont'
import EditDemand from '@/components/EditDemandNew'
import { getIsPermission } from '@/tools/index'
import { useModel } from '@/models'
import { useTranslation } from 'react-i18next'
import { getStaffList } from '@/services/staff'
import { useSelector } from '@store/index'

const AddButton = styled.button({
  border: 'none',
  height: 32,
  padding: '0 16px',
  borderRadius: 6,
  background: '#2877FF',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: 'white',
  ':hover': {
    background: '#669FFF',
  },
  ':focus': {
    background: '#1763e5',
    color: 'white',
  },
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
  border-right: 1px solid #ecedef;
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
      backgroundColor: '#F4F5F5',
    },
  },
  ({ active }) => ({
    borderRight: active ? '3px solid #2877ff' : '3px solid transparent',
    color: active ? '#2877ff' : '#323233',
    background: active ? '#F0F4FA !important' : 'white',
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
  const { userInfo, loginInfo } = useSelector(
    (store: { user: any }) => store.user,
  )
  const { setSelectAllStaffData } = useModel('project')

  const changeActive = (value: MenuList) => {
    navigate(value.path)
  }
  const controlquickCreateVisible = () => {
    setQuickCreateVisible(true)
  }

  // 获取公司员工 -- 用于创建需求抄送人
  const getStaffData = async () => {
    const options = await getStaffList({ all: 1 })
    setSelectAllStaffData(options)
  }

  useEffect(() => {
    getStaffData()
  }, [])

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

      <EditDemand
        visible={quickCreateVisible}
        onChangeVisible={() => setQuickCreateVisible(false)}
        isQuickCreate
        notGetPath
      />
    </Wrap>
  )
}

export default MineBox
