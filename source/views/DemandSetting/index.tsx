import styled from '@emotion/styled'
import Header from './components/Header'
import Main from './components/Main'
import CreateField from './components/CreateField'
import CommonButton from '@/components/CommonButton'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'

const Wrap = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 24px;
  overflow-x: hidden;
`
const ButtonStyle = styled.div`
  width: 100%;
  height: 48px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 24px;
`

const DemandSetting = () => {
  const [t] = useTranslation()
  const [isOperate, setIsOperate] = useState<boolean>(false)
  // const onClose = () => {

  // }
  // const onConfirm = () => {

  // }
  return (
    <>
      <Header />
      {isOperate && (
        <ButtonStyle>
          <CommonButton type="secondary" onClick={() => 456}>
            {t('common.cancel')}
          </CommonButton>
          <CommonButton
            style={{ marginLeft: '16px' }}
            type="primary"
            onClick={() => 123}
          >
            {t('common.confirm')}
          </CommonButton>
        </ButtonStyle>
      )}

      <Wrap>
        <Main onIsOperate={() => setIsOperate(true)} />
        <CreateField />
      </Wrap>
    </>
  )
}
export default DemandSetting
