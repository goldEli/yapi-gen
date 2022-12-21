import styled from '@emotion/styled'
import kong from '/kong.png'
import { useTranslation } from 'react-i18next'

const KongWrap = styled.div`
  width: 100%;
  height: 100%;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`
const Kong = () => {
  const [t] = useTranslation()

  return (
    <KongWrap>
      <img
        style={{
          width: '240px',
          height: '144px',
          marginBottom: '24px',
        }}
        src={kong}
        alt=""
      />
      <span
        style={{
          height: '22px',
          fontSize: '14px',

          fontWeight: 400,
          color: '#969799',
          lineHeight: '22px',
        }}
      >
        {t('new_p1.kongT')}
      </span>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0px 16px',
          color: '#2877FF',
          height: '32px',
          background: '#F0F4FA',
          borderRadius: '6px 6px 6px 6px',
          marginTop: '24px',
          cursor: 'pointer',
        }}
      >
        {t('new_p1.kongP')}
      </div>
    </KongWrap>
  )
}

export default Kong
