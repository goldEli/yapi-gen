import { css } from '@emotion/css'
import styled from '@emotion/styled'

export const Wrap = styled.div`
  height: 100%;
`

export const First = styled.div`
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const MainWrap = styled.div`
  height: calc(100% - 76px);
  overflow-y: auto;
`

export const FooterWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 56px;
  gap: 16px;
  padding-top: 24px;
`

export const CheckboxWrap = styled.div({})

export const OperationWrap = styled.div({
  whiteSpace: 'nowrap',
})

export const GroupWrap = styled.div({
  display: 'flex',
  alignItems: 'center',

  '.ant-checkbox-group-item': {
    margin: '6px 24px 6px 0',
  },
})

export const TitleGroup = styled.div<{ isZh?: boolean }>(
  {
    display: 'flex',
    alignItems: 'center',
    color: 'var(--neutral-n3)',
    fontSize: 12,
    fontFamily: 'SiYuanMedium',
  },
  ({ isZh }) => ({
    [CheckboxWrap.toString()]: {
      width: isZh ? 80 : 100,
    },
    [OperationWrap.toString()]: { width: isZh ? 100 : 180 },
    [GroupWrap.toString()]: {
      width: isZh ? 'calc(100% - 160x)' : 'calc(100% - 280px)',
    },
  }),
)
