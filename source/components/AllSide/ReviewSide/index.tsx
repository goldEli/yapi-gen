/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import IconFont from '@/components/IconFont'
import { CloseWrap } from '@/components/StyleCommon'
import useSetTitle from '@/hooks/useSetTitle'
import styled from '@emotion/styled'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from '@store/index'
import WriteReportModal from '../FormWorkSide/WriteReport'
import { setWriteReportModal } from '@store/workReport'

const Menu = styled.div`
  width: 100%;
`

export const MySpan = styled.div`
  cursor: pointer;
  width: 24px;
  height: 24px;
  color: var(--neutral-n2);
  border-radius: 6px 6px 6px 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    /* background: var(--hover-d1); */
    color: var(--primary-d2);
  }
`

const MenuItem = styled.div<{ active?: any }>(
  ({ active }) => ({
    background: active ? 'var(--gradient-left)' : '',
    color: active ? 'var(--primary-d2) !important' : '',
  }),
  {
    boxSizing: 'border-box',
    height: 44,
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    paddingLeft: 52,
    '&: hover': {
      color: 'var(--primary-d2)',
    },
  },
)

const ReviewSide = () => {
  const asyncSetTtile = useSetTitle()
  const [t] = useTranslation()
  asyncSetTtile(t('title.c8'))
  const { pathname } = useLocation()
  const nowPath2 = Number(pathname.split('/')[4]) || ''
  const navigate = useNavigate()
  const { visible: visibleEdit } = useSelector(
    state => state.workReport.writeReportModal,
  )
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

        <CloseWrap onClick={handleReport} width={32} height={32}>
          <IconFont
            style={{
              fontSize: '16px',
            }}
            type="plus"
          />
        </CloseWrap>
      </div>

      <Menu>
        {menuList.map((item: any) => (
          <MenuItem
            style={{
              fontSize: item.state ? '16px' : '',
              fontFamily: item.state ? 'SiYuanMedium' : '',
              position: 'relative',
            }}
            active={nowPath2 === item.id}
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
                  position: 'absolute',
                  left: '24px',
                }}
              />
            )}
            {item.state === 2 && (
              <IconFont
                type="container"
                style={{
                  fontSize: 20,
                  marginRight: item.state ? '6px' : '',
                  position: 'absolute',
                  left: '24px',
                }}
              />
            )}
            {item.state === 3 && (
              <IconFont
                type="inbox-02"
                style={{
                  fontSize: 20,
                  marginRight: item.state ? '6px' : '',
                  position: 'absolute',
                  left: '24px',
                }}
              />
            )}
            {item.name}
          </MenuItem>
        ))}
      </Menu>
      <WriteReportModal
        isVisible={visibleEdit}
        onClose={() => dispatch(setWriteReportModal({ visible: false }))}
        onConfirm={function (): void {
          throw new Error('Function not implemented.')
        }}
        title={t('report.list.writeReport')}
      />
    </div>
  )
}

export default ReviewSide
