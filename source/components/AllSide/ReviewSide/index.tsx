/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import IconFont from '@/components/IconFont'
import { CloseWrap } from '@/components/StyleCommon'
import useSetTitle from '@/hooks/useSetTitle'
import styled from '@emotion/styled'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from '@store/index'
import { setWriteReportModal } from '@store/workReport'

const Menu = styled.div`
  width: 100%;
`

export const MenuItem = styled.div<{ isActive?: boolean }>`
  height: 44px;
  font-family: SiYuanRegular;
  display: flex;
  align-items: center;
  padding: 0 24px;
  font-size: 14px;
  color: ${props =>
    props.isActive ? 'var(--primary-d2)' : 'var(--neutral-n1-d2)'};
  cursor: pointer;
  white-space: nowrap;
  div {
    margin-left: 12px;
  }
  svg {
    color: ${props =>
      props.isActive ? 'var(--primary-d2)' : 'var(--neutral-n3)'};
  }
  background: ${props =>
    props.isActive ? 'var(--gradient-left)' : 'transparent'};
  &:hover {
    svg {
      color: var(--primary-d2) !important;
    }
    color: var(--primary-d2) !important;
  }
`

const ReviewSide = () => {
  const asyncSetTtile = useSetTitle()
  const [t] = useTranslation()
  asyncSetTtile(t('title.c8'))
  const { pathname } = useLocation()
  const nowPath2 = Number(pathname.split('/')[4]) || ''
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const menuList = [
    {
      id: 1,
      name: t('report.list.review'),
      path: '/Report/Review/List/1',
      state: 1,
    },
    {
      id: 2,
      name: t('report.list.reviewMe'),
      path: '/Report/Review/List/2',
      state: 2,
    },
    {
      id: 3,
      name: t('report.list.openReview'),
      path: '/Report/Review/List/3',
      state: 3,
    },
  ]

  const changeActive = (value: any) => {
    navigate(value.path)
  }
  const handleReport = () => {
    dispatch(setWriteReportModal({ visible: true }))
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
          {t('report.list.workReport')}
        </span>

        <CloseWrap onClick={handleReport} width={24} height={24}>
          <IconFont
            style={{
              fontSize: 18,
            }}
            type="plus"
          />
        </CloseWrap>
      </div>

      <Menu>
        {menuList.map((item: any) => (
          <MenuItem
            style={{
              fontSize: 14,
            }}
            isActive={nowPath2 === item.id}
            onClick={() => changeActive(item)}
            key={item.id}
            hidden={item.isPermission}
          >
            {item.state === 1 && (
              <IconFont
                type="send"
                style={{
                  fontSize: 20,
                  marginRight: item.state ? '6px' : '',
                }}
              />
            )}
            {item.state === 2 && (
              <IconFont
                type="container"
                style={{
                  fontSize: 20,
                  marginRight: item.state ? '6px' : '',
                }}
              />
            )}
            {item.state === 3 && (
              <IconFont
                type="inbox-02"
                style={{
                  fontSize: 20,
                  marginRight: item.state ? '6px' : '',
                }}
              />
            )}
            {item.name}
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}

export default ReviewSide
