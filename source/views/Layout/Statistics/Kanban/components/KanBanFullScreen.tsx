import { useEffect, useState } from 'react'
import { ScreenFullModal, Toast } from '../style'
import { message } from 'antd'
import { useTranslation } from 'react-i18next'

interface KanBanFullScreenProps {
  children?: any
  // 全屏是否开启
  isVisible: boolean
  onClose(): void
}

const KanBanFullScreen = (props: KanBanFullScreenProps) => {
  const [t] = useTranslation()
  const { isVisible, onClose } = props
  const [toastHeight, setToastHeight] = useState(-50)

  useEffect(() => {
    if (isVisible) {
      setTimeout(() => {
        setToastHeight(24)
      }, 500)
      setTimeout(() => {
        setToastHeight(-40)
      }, 3000)
      const onCloseScreen = (event: any) => {
        if (event.key === 'Escape') {
          onClose()
        }
      }
      window.addEventListener('keydown', onCloseScreen)
      return () => {
        window.removeEventListener('keydown', onCloseScreen)
      }
    }
  }, [isVisible])

  return (
    <ScreenFullModal
      footer={false}
      open={isVisible}
      closable={false}
      title={false}
      maskClosable={false}
      destroyOnClose
      keyboard={false}
      wrapClassName="vertical-center-modal"
      focusTriggerAfterClose={false}
      bodyStyle={{
        height: '100vh',
      }}
      width="100vw"
      zIndex={500}
    >
      <Toast style={{ top: toastHeight, opacity: toastHeight > 0 ? 1 : 0 }}>
        <div>{t('youHaveEnteredTheBoardPleasePressTheKeyToExit')}</div>
      </Toast>
      {props?.children}
    </ScreenFullModal>
  )
}

export default KanBanFullScreen
