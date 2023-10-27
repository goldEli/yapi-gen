/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
import IconFont from '@/components/IconFont'
import { CloseWrap } from '@/components/StyleCommon'
import styled from '@emotion/styled'
import { useDispatch } from '@store/index'
import { setAddWorkItemModal } from '@store/project'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

const MenuItem = styled.div<{ isActive?: boolean }>`
  height: 44px;
  line-height: 44px;
  padding-left: 24px;
  cursor: pointer;
  background: ${props =>
    props.isActive ? 'var(--gradient-left)' : 'transparent'};
  color: ${props =>
    props.isActive ? 'var(--primary-d2)' : 'var(--neutral-n1-d2)'};
  &:hover {
    color: var(--primary-d2);
  }
`
const Menu = styled.div`
  width: 100%;
`
const IconFontStyle = styled(IconFont)({
  color: 'var(--neutral-n2)',
  fontSize: '18px',
  borderRadius: '6px',
  padding: '5px',
  '&: hover': {
    background: 'var(--hover-d1)',
    cursor: 'pointer',
  },
})
const MineSide = () => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const { pathname } = useLocation()
  const nowPath = pathname || ''
  const navigate = useNavigate()

  const changeActive = (value: any) => {
    navigate(value.path)
  }

  const menuList = [
    {
      id: 1,
      name: t('mine.mineSurvey'),
      path: '/ProjectManagement/Mine/Profile',
    },
    {
      id: 2,
      name: t('mine.mineNeedDeal'),
      path: '/ProjectManagement/Mine/Carbon',
    },
    {
      id: 3,
      name: t('mine.mineCreate'),
      path: '/ProjectManagement/Mine/Create',
    },
    {
      id: 4,
      name: t('mine.mineFinish'),
      path: '/ProjectManagement/Mine/Finished',
    },
    {
      id: 5,
      name: t('mine.copyMine'),
      path: '/ProjectManagement/Mine/Agenda',
    },
    {
      id: 6,
      name: t('newlyAdd.mineExamine'),
      path: '/ProjectManagement/Mine/Examine',
    },
  ]

  const onCreateDemand = () => {
    dispatch(
      setAddWorkItemModal({
        visible: true,
        params: { isQuickCreate: true },
      }),
    )
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '24px',
          padding: '24px',
          margin: '10px 0',
          cursor: 'pointer',
        }}
      >
        <span
          style={{
            height: '22px',
            fontSize: '14px',
            fontFamily: 'SiYuanMedium',
            color: 'var(--neutral-n1-d1)',
            lineHeight: '22px',
          }}
        >
          {t('container.mine')}
        </span>
        <CloseWrap width={24} height={24}>
          <IconFont
            style={{ fontSize: 18 }}
            type="plus"
            onClick={onCreateDemand}
          />
        </CloseWrap>
      </div>
      <Menu>
        {menuList.map(item => (
          <MenuItem
            isActive={nowPath === item.path}
            onClick={() => changeActive(item)}
            key={item.id}
          >
            {item.name}
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}

export default MineSide
