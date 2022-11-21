import styled from '@emotion/styled'
import { useTranslation } from 'react-i18next'
import IconFont from './IconFont'

const Wrap = styled.div({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'white',
  height: '100%',
  width: '100%',
  borderRadius: 6,
  padding: 16,
  div: {
    color: '#323233',
    fontSize: 18,
    fontWeight: '500',
  },
})

const NoData = (props?: any) => {
  const [t] = useTranslation()
  return (
    <Wrap>
      <IconFont type="noData" style={{ fontSize: 200 }} />
      <div>{t('components.noData')}</div>
      {props?.subText ? (
        <span style={{ color: '#969799', fontSize: 14, marginTop: 8 }}>
          {props?.subText}
        </span>
      ) : null}
    </Wrap>
  )
}

export default NoData
