/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'

const Side = styled.div`
  align-self: stretch;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  flex-shrink: 0;
  width: 220px;
  border-right: 1px solid var(--neutral-n6-d1);
  padding: 20px 16px 0;
`

const BackBox = styled.div`
  height: 22px;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  span {
    color: var(--neutral-n3);
  }
  .label {
    font-size: 14px;
  }
`

const InfoWrap = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 0 16px 0px;
  border-bottom: 1px solid var(--neutral-n6-d1);
`

const InfoItem = styled.div({
  marginLeft: '8px',
  display: 'flex',
  flexDirection: 'column',
  div: {
    color: 'var(--neutral-n1-d1)',
    fontSize: 12,
  },
  span: {
    color: 'var(--neutral-n3)',
    fontSize: 12,
  },
})

const NameWrap = styled.div({
  width: 24,
  height: 24,
  borderRadius: 16,
  background: '#A4ACF5',
  color: 'white',
  fontSize: 12,
  fontWeight: 400,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 4,
  overflow: 'hidden',
})

export const MyDiv = styled.div`
  color: var(--neutral-n3);
  :hover {
    color: var(--primary-d2);
  }
`

const Menu = styled.div`
  width: 100%;
  margin-top: 16px;
`

const MenuItem = styled.div<{ active?: boolean }>(
  {
    boxSizing: 'border-box',
    whiteSpace: 'nowrap',
    height: 44,
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    paddingLeft: '12px',
    borderRadius: 4,
    '&: hover': {
      color: 'var( --primary-d1)',
      background: 'var(--hover-d2)',
    },
  },
  ({ active }) => ({
    color: active ? 'var( --primary-d1)' : 'var(--neutral-n1-d2)',
    background: active ? 'var(--selected)' : 'transparent',
    fontFamily: active ? 'SiYuanMedium' : '',
  }),
)

export { Side, InfoWrap, NameWrap, InfoItem, Menu, MenuItem, BackBox }
