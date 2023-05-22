import styled from '@emotion/styled'

export const ContentWrap = styled.div<{ notHover?: any }>(
  {
    color: 'var(--neutral-n1-d1)',
    fontSize: 14,
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '98%',
    wordBreak: 'break-all',
    width: '100%',
  },
  ({ notHover }) => ({
    paddingLeft: notHover ? 8 : 0,
  }),
)

export const LabelItem = styled.div`
  font-size: var(--font14);
  color: var(--neutral-n3);
`

export const ShowLabel = styled.div({
  cursor: 'pointer',
  fontSize: 14,
  fontWeight: 400,
  color: 'var(--primary-d2)',
})

export const MaxLabel = styled.div<{ width: number }>`
  width: ${props => props.width}px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

export const InfoItem = styled.div({
  display: 'flex',
  alignItems: 'center',
  marginTop: 14,
  position: 'relative',
})

export const Label = styled.div`
  font-size: var(--font14);
  color: var(--neutral-n1-d1);
  font-family: SiYuanMedium;
`
