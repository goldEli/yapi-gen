import styled from '@emotion/styled'
import empty from '/empty.svg'
import { useTranslation } from 'react-i18next'

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
  img: {
    width: 240,
    marginBottom: 35,
  },
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
      <img src={empty} alt="" />
      <div>{t('components.noData')}</div>
      {props?.subText
        ? <span style={{ color: '#969799', fontSize: 14, marginTop: 8 }}>
            {props?.subText}
          </span>
        : null}
    </Wrap>
  )
}

export default NoData
