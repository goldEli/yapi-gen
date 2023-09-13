import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'

export const IconWrap = styled(IconFont)`
  color: var(--neutral-n2);
  font-size: 20px;
`
export const CreateColumnBtnBox = styled.div<{ showBg: boolean }>`
  width: 302px;
  flex-shrink: 0;
  height: 100%;
  background-color: ${props => (props.showBg ? 'var(--neutral-n9)' : 'none')};
  box-sizing: border-box;
`
export const BtnBox = styled.div<{ show: boolean }>`
  width: 52px;
  height: 48px;
  background: var(--neutral-n9);
  display: ${props => (props.show ? 'flex' : 'none')};
  cursor: pointer;
  align-items: center;
  justify-content: center;
  &:hover ${IconWrap} {
    color: var(--primary-d2);
  }
`

export const EditArea = styled.div<{ show: boolean }>`
  display: ${props => (props.show ? 'flex' : 'none')};
  gap: 16px;
  align-items: center;
  padding: 8px 16px;
  box-sizing: border-box;
  width: 100%;
`

export const TextBtn = styled.div<{ active?: boolean }>`
  font-size: 14px;
  font-family: SiYuanRegular;
  font-weight: 400;
  color: ${props =>
    props.active
      ? 'var(--auxiliary-text-t2-d2)'
      : 'var(--auxiliary-text-t2-d1)'};
  cursor: pointer;
`
