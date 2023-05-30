import styled from '@emotion/styled'

export const IssuesGroupBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

export const DropAreaList = styled.div<{ hidden: boolean }>`
  display: ${props => (props.hidden ? 'none' : 'flex')};
  width: 100%;
  gap: 16px;
  /* min-height: 80vh; */
`
export const GroupTitleArea = styled.div`
  height: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
`
export const Title = styled.div`
  font-size: 14px;
  color: var(--neutral-n1-d1);
  font-family: SiYuanMedium;
  flex-shrink: 0;
`
export const TitleBtn = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`

export const Text = styled.div`
  font-size: 12px;
  color: var(--neutral-n3);
`
export const ImgIcon = styled.img`
  width: 20px;
  height: 20px;
`
