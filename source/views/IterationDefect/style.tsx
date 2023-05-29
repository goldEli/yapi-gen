import styled from '@emotion/styled'

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
