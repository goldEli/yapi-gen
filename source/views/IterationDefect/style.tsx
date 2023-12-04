import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
export const Wrap = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  padding: 20px 16px 0 0px;
  flex-direction: column;
`

export const ContentWrap = styled.div`
  display: flex;
  height: calc(100% - 32px);
  overflow-y: auto;
`

export const ContentLeft = styled.div`
  margin-top: 20px;
`

export const ContentRight = styled.div`
  width: 100%;
  height: 100%;
  padding-left: 24px;
`

export const ContentMain = styled.div`
  width: 100%;
  height: calc(100% - 72px);
`

export const OperationWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 32px;
  margin-bottom: 20px;
  background: var(--neutral-white-d6);
  margin: 20px 0;
`
export const StatusGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`

export const StatusItems = styled.div<{ isActive?: boolean }>`
  height: 32px;
  line-height: 32px;
  border-radius: 4px;
  padding: 0 8px;
  border: ${props =>
    props.isActive
      ? '1px solid var(--neutral-n2)!important'
      : '1px solid var(--neutral-n5)'};
  font-size: 14px;
  color: ${props =>
    props.isActive ? 'var(--neutral-white-d1)!important' : 'var(--neutral-n2)'};
  background: ${props =>
    props.isActive ? 'var(--neutral-n2)!important' : 'transparent'};
  cursor: pointer;
  &:hover {
    background-color: #ebedf0;
    border: 1px solid #ebedf0;
    color: var(--neutral-n1-d1);
  }
`
export const MoreItem = styled.div({
  display: 'flex',
  alignItems: 'center',
  height: 32,
  color: 'var(--neutral-n2)',
  fontSize: 14,
  fontWeight: 400,
  cursor: 'pointer',
  padding: '0 16px',
  svg: {
    color: 'var(--neutral-n3)',
  },
  '&: hover': {
    color: 'var(--neutral-n1-d1)!important',
    background: 'var(--hover-d3)',
    svg: {
      color: 'var(--neutral-n1-d1)!important',
    },
  },
})
export const LiWrap = styled.div({
  cursor: 'pointer',
  padding: '0 16px',
  width: '100%',
  height: 32,
  display: 'flex',
  alignItems: 'center',
  background: 'var(--neutral-white-d3)',
  '&: hover': {
    background: 'var(--hover-d3)',
  },
})

export const IconWrap = styled(IconFont)({
  fontSize: 20,
  cursor: 'pointer',
  padding: 6,
  borderRadius: 6,
  color: 'var(--neutral-n3)',
  '&: hover': {
    color: 'var(--neutral-n1-d1)',
    background: 'var(--hover-d3)',
  },
  '&: active': {
    color: 'var(--neutral-n1-d1)',
    background: 'var(--neutral-n6-d1)',
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
    background: type ? 'var(--primary-d1)' : 'var(--auxiliary-b4)',
    color: type ? 'var(--neutral-white-d7)' : 'var(--primary-d2)',
    '&: hover': {
      background: type ? 'var(--primary-d1)' : 'var(--auxiliary-b5)',
    },
  }),
)
