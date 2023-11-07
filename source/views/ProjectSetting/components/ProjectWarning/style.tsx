import styled from '@emotion/styled'

export const ProjectWarningWrap = styled.div`
  display: flex;
`
export const SubTitleBox = styled.div`
  position: relative;
  padding-left: 12px;
  display: flex;
  align-items: center;
  height: 22px;
  color: var(--neutral-n1-d1);
  font-size: var(--font14);
  font-family: SiYuanMedium;
  margin: 32px 0px 16px 0px;
  &::before {
    position: absolute;
    content: '';
    left: 0px;
    top: 2px;
    width: 3px;
    height: 16px;
    background: var(--primary-d1);
    display: flex;
    align-items: center;
  }
`
export const PushDateBox = styled.div``
export const PushDateContent = styled.div`
  border: 1px solid var(--neutral-n6-d1);
  height: 102px;
  border-radius: 6px;
`
