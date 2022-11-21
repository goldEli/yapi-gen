import styled from '@emotion/styled'
import { useTranslation } from 'react-i18next'
import IconFont from './IconFont'

const Wrap = styled.div({
  height: 'calc(100% - 64px)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'white',
  div: {
    fontSize: 14,
    color: '#969799',
    fontWeight: 400,
  },
})

const WaitingDeveloped = () => {
  const [t] = useTranslation()
  return (
    <Wrap>
      <IconFont type="planning" style={{ fontSize: 220 }} />
      <div>{t('version2.2.1.waitingPlan')}</div>
    </Wrap>
  )
}

export default WaitingDeveloped
