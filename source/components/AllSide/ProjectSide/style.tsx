/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'

export const AllWrap = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
`

export const WrapDetail = styled.div`
  height: 100%;
  width: 100%;
  overflow: hidden;
  transition: 0.2s;
  position: relative;
`

export const WrapSet = styled.div`
  height: 100%;
  width: 100%;
  overflow: hidden;
  transition: 0.2s;
  display: none;
`

export const SideTop = styled.div`
  display: flex;
  align-items: center;
  padding: 24px 24px 16px;
  img {
    width: 32px;
    height: 32px;
    border-radius: 4px;
    margin-right: 8px;
  }
`

export const SideInfo = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 12px;
  width: calc(100% - 40px);
  div {
    color: var(--neutral-n1-d1);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  span {
    color: var(--neutral-n3);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

export const MenuBox = styled.div`
  overflow-y: scroll;
  overflow-x: hidden;
  margin-top: 24px;
  margin-bottom: 16px;
`

export const MenuItem = styled.div<{ idx: boolean }>`
  height: 44px;
  display: flex;
  align-items: center;
  padding: 0 24px;
  color: var(--neutral-n1-d2);
  cursor: pointer;
  white-space: nowrap;
  div {
    margin-left: 12px;
  }

  & {
    svg {
      color: ${props => (props.idx ? 'var(--primary-d2) !important' : '')};
    }
    background: ${props => (props.idx ? 'var(--gradient-left)' : '')};
    color: ${props => (props.idx ? 'var(--primary-d2) !important' : '')};
  }
  &:hover {
    svg {
      color: var(--primary-d2);
    }
    color: var(--primary-d2);
  }
`

export const Provider = styled.div`
  height: 1px;
  width: 88%;
  margin-left: 6%;
  background: var(--neutral-n6-d2);
  margin-bottom: 16px;
`

export const SideFooter = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 44px;
  cursor: pointer;
  background: var(--neutral-n9);
  position: absolute;
  bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  div {
    display: flex;
    align-items: center;
    div {
      margin-left: 12px;
      font-size: 14px;
      color: var(--neutral-n1-d2);
    }
  }
  &:hover {
    div,
    svg {
      color: var(--primary-d2) !important;
    }
  }
`

export const GroupBox = styled.div`
  height: 40px;
  margin-top: 20px;
  padding: 0 20px 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  div {
    font-size: 12;
    color: var(--neutral-n3);
  }
`

export const CloseWrap = styled.div<{ width?: any; height?: any }>(
  {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    borderRadius: 6,
    '.anticon': {
      color: 'var(--neutral-n2)',
    },
    '&: hover': {
      background: 'var(--neutral-n6-d1)',
      svg: {
        color: 'var(--neutral-n1-d1)',
      },
    },
    '&: active ': {
      background: 'var(--neutral-n6-d1)',
      svg: {
        color: 'var(--neutral-n1-d1)',
      },
    },
  },
  ({ width, height }) => ({
    width,
    height,
  }),
)

export const GroupItems = styled.div<{ isPermission?: boolean }>(
  {
    width: '100%',
    // overflow: 'auto',
  },
  ({ isPermission }) => ({
    height: `calc(100% - ${isPermission ? 172 : 228}px)`,
  }),
)

export const TitleBox = styled.div<{ idx?: boolean; isSpace?: any }>(
  {
    height: 44,
    lineHeight: '44px',
    color: 'var(--neutral-n1-d2)',
    fontWeight: 400,
    fontSize: 14,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    boxSizing: 'border-box',
    whiteSpace: 'nowrap',
  },
  ({ idx, isSpace }) => ({
    '&:hover': {
      color: 'var(--primary-d2)',
      // background: '#F4F5F5',
      '.dropdownIcon': {
        visibility: 'visible',
      },
    },
    background: idx ? 'var(--gradient-left)' : '',
    color: idx ? 'var(--primary-d2) !important' : '',
    justifyContent: isSpace ? 'space-between' : 'inherit',
    padding: isSpace ? '0 14px 0 24px' : '0 0 0 24px',
  }),
)

export const NoDataCreateWrap = styled.div({
  marginTop: 8,
  minHeight: 68,
  borderRadius: 6,
  padding: '8px 12px',
  '.top': {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: 12,
    svg: {
      color: '#FA9746',
      fontSize: 16,
      marginTop: 2,
    },
    div: {
      color: 'var(--neutral-n2)',
      fontSize: 12,
      marginLeft: 8,
      flexWrap: 'wrap',
    },
  },
  '.bottom': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    color: 'var(--primary-d1)',
    svg: {
      fontSize: 10,
    },
    div: {
      fontSize: 12,
      marginLeft: 6,
    },
  },
})
