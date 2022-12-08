// 待开发的界面

import styled from '@emotion/styled'
import { useTranslation } from 'react-i18next'
import planing from '/planing.png'

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
      <img src={planing} style={{ width: 240 }} alt="" />
      <div style={{ marginTop: 24 }}>{t('version2.waitingPlan')}</div>
    </Wrap>
  )
}

export default WaitingDeveloped
