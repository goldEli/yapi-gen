/* eslint-disable react/boolean-prop-naming */
import { useMemo } from 'react'
import { PreviewImageModalWrap } from '../style'
import IconFont from '@/components/IconFont'

type PreviewImageProps = {
  visible: boolean
  type: 'ding' | 'email' | 'sms' | 'sys'
  onClose(): void
}
const PreviewImageModal = (props: PreviewImageProps) => {
  const { type, visible, onClose } = props
  const imageHtml = useMemo(() => {
    switch (type) {
      case 'ding':
        return (
          <img
            src="https://mj-system-1308485183.cos.accelerate.myqcloud.com/public/warning/dingtalkMessage.png"
            width={852}
            alt=""
          />
        )
      case 'email':
        return (
          <img
            src="https://mj-system-1308485183.cos.accelerate.myqcloud.com/public/warning/emailMessage.png"
            width={928}
            alt=""
          />
        )
      case 'sms':
        return (
          <img
            src="https://mj-system-1308485183.cos.accelerate.myqcloud.com/public/warning/phoneMessage.png"
            width={312}
            alt=""
          />
        )
      case 'sys':
        return (
          <img
            src="https://mj-system-1308485183.cos.accelerate.myqcloud.com/public/warning/system.jpg"
            width={784}
            alt=""
          />
        )
      default:
        return null
    }
  }, [type])

  return visible ? (
    <PreviewImageModalWrap>
      <div className="imgBox" onClick={onClose}>
        {imageHtml}
        <IconFont
          style={{
            fontSize: 40,
            color: 'var(--neutral-white-d1)',
            marginLeft: 20,
            position: 'relative',
            top: -22,
          }}
          type="close-solid2"
        />
      </div>
    </PreviewImageModalWrap>
  ) : null
}

export default PreviewImageModal
