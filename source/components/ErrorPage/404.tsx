import styled from '@emotion/styled'
import CommonButton from '../CommonButton'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

const NotFoundWrap = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .img {
    width: 240px;
    height: 144px;
    margin-bottom: 24px;
  }
  .text {
    font-size: 14px;
    color: var(--neutral-n3);
    margin-bottom: 24px;
  }
`

const NotFound = () => {
  const [t] = useTranslation()
  const navigate = useNavigate()

  //   点击回到首页
  const onToHome = () => {
    navigate('/Project')
  }

  return (
    <NotFoundWrap>
      <img
        className="img"
        src="https://mj-system-1308485183.cos.accelerate.myqcloud.com/public/404.svg"
        alt=""
      />
      <div className="text">{t('ohMyYourPageHasBeenLost')}</div>
      <CommonButton type="light" onClick={onToHome}>
        {t('goBackToTheHomepage')}
      </CommonButton>
    </NotFoundWrap>
  )
}

export default NotFound
