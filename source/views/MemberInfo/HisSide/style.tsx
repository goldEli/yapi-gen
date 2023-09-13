/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'

const Side = styled.div`
  align-self: stretch;
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  box-sizing: border-box;
  padding-top: 24px;
  flex-shrink: 0;
`
const InfoWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  paddingLeft: '16px',
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

const InfoItem = styled.div({
  marginLeft: '8px',
  display: 'flex',
  flexDirection: 'column',
  div: {
    color: 'var(--neutral-n1-d1)',
    fontSize: 16,
    fontWeight: 400,
  },
  span: {
    color: 'var(--neutral-n3)',
    fontSize: 14,
  },
})

const Menu = styled.div`
  width: 100%;
  margin-top: 24px;
`

const MenuItem = styled.div<{ active?: boolean }>(
  {
    boxSizing: 'border-box',
    // justifyContent: 'center',
    whiteSpace: 'nowrap',
    height: 44,
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    paddingLeft: '20px',
    '&: hover': {
      color: 'var( --primary-d1)',
    },
  },
  ({ active }) => ({
    // borderRight: active ? '3px solid var(--primary-d2)' : '3px solid transparent',
    color: active ? 'var( --primary-d1)' : 'var(--neutral-n1-d1)',
    background: active
      ? 'linear-gradient(90deg, #EBEFFF 0%, rgba(243,246,255,0) 100%)'
      : 'transparent',
  }),
)

export { Side, InfoWrap, NameWrap, InfoItem, Menu, MenuItem }
