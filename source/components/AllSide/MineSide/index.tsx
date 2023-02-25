import CommonButton from '@/components/CommonButton'
import { getIsPermission } from '@/tools'
import styled from '@emotion/styled'
import { useSelector } from '@store/index'
import { useTranslation } from 'react-i18next'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

const MenuItem = styled.div<{ isActive?: boolean }>`
  height: 44px;
  line-height: 44px;
  padding-left: 24px;
  cursor: pointer;
  background: ${props =>
    props.isActive ? 'var(--gradient-left)' : 'transparent'};
  color: var(--neutral-n1-d2);
  &:hover {
    color: var(--primary-d2);
  }
`
const Menu = styled.div`
  width: 100%;
  margin-top: 24px;
`

const MineSide = () => {
  const [t] = useTranslation()
  const { pathname } = useLocation()
  const nowPath = pathname.split('/')[2] || ''
  const navigate = useNavigate()
  const { userInfo } = useSelector(store => store.user)

  const changeActive = (value: any) => {
    navigate(value.path)
  }

  const menuList = [
    {
      id: 1,
      name: t('mine.mineSurvey'),
      path: '/Mine/Profile',
      isPermission: getIsPermission(
        userInfo?.company_permissions,
        'b/user/overview',
      ),
    },
    {
      id: 2,
      name: t('mine.mineNeedDeal'),
      path: '/Mine/Carbon',
      isPermission: getIsPermission(
        userInfo?.company_permissions,
        'b/user/abeyance/story',
      ),
    },
    {
      id: 3,
      name: t('mine.mineCreate'),
      path: '/Mine/Create',
      isPermission: getIsPermission(
        userInfo?.company_permissions,
        'b/user/create/story',
      ),
    },
    {
      id: 4,
      name: t('mine.mineFinish'),
      path: '/Mine/Finished',
      isPermission: getIsPermission(
        userInfo?.company_permissions,
        'b/user/finish/story',
      ),
    },
    {
      id: 5,
      name: t('mine.copyMine'),
      path: '/Mine/Agenda',
      isPermission: getIsPermission(
        userInfo?.company_permissions,
        'b/user/copysend/story',
      ),
    },
    {
      id: 6,
      name: t('newlyAdd.mineExamine'),
      path: '/Mine/Examine',
      isPermission: false,
    },
  ]
  return (
    <div>
      {/* {getIsPermission(
          userInfo?.company_permissions,
          'b/user/fast/create',
        ) ? null : ( */}
      <CommonButton icon="plus" iconPlacement="left" type="primary">
        {t('mine.quickCreate')}
      </CommonButton>
      {/* )} */}
      <Menu>
        {menuList.map(item => (
          <MenuItem
            isActive={nowPath === item.path}
            onClick={() => changeActive(item)}
            key={item.id}
            // hidden={item.isPermission}
          >
            {item.name}
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}

export default MineSide
