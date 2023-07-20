import styled from '@emotion/styled'
import { Button, Drawer } from 'antd'

export const DrawerWrap = styled(Drawer)({
  '.ant-drawer-title': {
    width: '100%',
  },
  '.ant-drawer-close': {
    margin: 0,
  },
  '.ant-drawer-header': {
    borderBottom: 'none!important',
  },
  '.ant-drawer-header-title': {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  },
})

export const ButtonWrap = styled(Button)({
  height: 32,
  marginLeft: 16,
})

export const ListWrap = styled.div`
  margin-top: 16;
  & .ant-popover-inner {
    position: relative !important;
    top: -3px !important;
  }
  .ant-dropdown-menu-item,
  .ant-dropdown-menu-submenu-title {
    padding: 0 !important;
  }
`

export const ListItem = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: 56,
  padding: '0 16px',
  '.avatarBox': {
    display: 'flex',
    alignItems: 'center',
    '.info': {
      display: 'flex',
      flexDirection: 'column',
      marginLeft: 8,
      'span:first-child': {
        color: 'var(--neutral-n1-d2)',
        fontSize: 14,
        width: '240px',
        display: 'inline-block',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },
      'span:last-child': {
        color: 'var(--neutral-n4)',
        fontSize: 12,
      },
    },
  },
  '.job': {
    color: 'black',
    fontSize: 12,
  },
  '&:hover': {
    backgroundColor: 'var(--hover-d3)',
  },
})

export const MoreWrap = styled.div<{ type?: any }>(
  {
    display: 'flex',
    alignItems: 'center',
    height: 32,
    borderRadius: 6,
    padding: '0 16px',
    fontSize: 14,
    fontWeight: 400,
    cursor: 'pointer',
  },
  ({ type }) => ({
    background: type ? 'var(--primary-d1)' : 'var(--neutral-n6-d1)',
    color: type ? 'white' : 'var(--primary-d1)',
    '&: hover': {
      background: type ? 'var(--primary-d2)' : 'var(--neutral-n6-d2)',
    },
    '&: active': {
      background: type ? 'var(--primary-d2)' : 'var(--neutral-n6-d2)',
    },
  }),
)

export const MoreWrap2 = styled(MoreWrap)`
  padding: 0;
  background-color: transparent;
  font-size: 12px;
  .job1,
  .job {
    color: var(--neutral-n1-d1);
  }
  &:hover {
    background-color: var(--hover-d3) !important;
    .job {
      color: var(--primary-d2);
    }
    .job1 {
      color: var(--primary-d2);
      transform: rotate(180deg);
    }
  }
`
export const WaiWrap = styled.div``

export const HeaderWrap = styled.div({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  fontFamily: 'SiYuanMedium',
})

export const Myd = styled.div<{ active: boolean }>`
  text-align: left;
  padding: 5px 16px !important;
  color: var(--neutral-n2);
  &:hover {
    color: var(--neutral-n1-d1);
    // background-color: var(--neutral-n6-d1);
  }
  color: ${({ active }) => (active ? 'var(--primary-d2) !important' : '')};
`
