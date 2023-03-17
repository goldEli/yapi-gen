import styled from '@emotion/styled'

export const Wrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  justify-content: center;
`
export const Content = styled.div<{ isGrid: boolean }>(
  {
    width: '100%',
    height: 'calc(100% - 64px)',
  },
  ({ isGrid }) => ({
    padding: isGrid ? '0px 24px 24px 16px' : '16px 16px 0 16px',
  }),
)
