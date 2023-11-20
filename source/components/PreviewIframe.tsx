/* eslint-disable no-negated-condition */
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import ReactDOM from 'react-dom'
import { Modal } from 'antd'
import CommonIconFont from './CommonIconFont'

const StyleIframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`
const IframeContainer = styled.div`
  height: 100%;
`

const ErrorRender = styled.div`
  text-align: center;
  margin-top: 200px;
`

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  display: flex;
  justify-content: center;
  line-height: 50px;
  height: 50px;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  border: none;
  & .dot {
    height: 20px;
    width: 20px;
    margin-right: 20px;
    border-radius: 10px;
    background-color: #b3d4fc;
    animation: pulse 1.5s infinite ease-in-out;
    & .dot:last-child {
      margin-right: 0;
    }
    &.dot:nth-child(1) {
      animation-delay: -0.3s;
    }

    &.dot:nth-child(2) {
      animation-delay: -0.1s;
    }

    &.dot:nth-child(3) {
      animation-delay: 0.1s;
    }
    @keyframes pulse {
      0% {
        transform: scale(0.8);
        background-color: #b3d4fc;
        box-shadow: 0 0 0 0 rgba(178, 212, 252, 0.7);
      }

      50% {
        transform: scale(1.2);
        background-color: #6793fb;
        box-shadow: 0 0 0 10px rgba(178, 212, 252, 0);
      }

      100% {
        transform: scale(0.8);
        background-color: #b3d4fc;
        box-shadow: 0 0 0 0 rgba(178, 212, 252, 0.7);
      }
    }
  }
`

const ModalWrap = styled(Modal)`
  width: 80vw;
  .ant-modal-body {
    background-color: var(--neutral-white-d5);
    border-radius: 6px;
    box-shadow: 0px 0px 15px 6px rgba(0, 0, 0, 0.12);
    padding: 0px;
  }
`

const ModelClose = styled.div`
  position: absolute;
  right: -54px;
  top: -21px;
  cursor: pointer;
`

const PreviewIframe = (props: any) => {
  const [isLoading, setIsLoading] = useState(true)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [error, setError] = useState(false)
  const [t] = useTranslation()

  // 用textEncoder解决包含非 Latin1 字符的字符串过长的问题
  const encoder = new TextEncoder()
  const data: any = encoder.encode(props?.url)
  const base64 = btoa(String.fromCharCode.apply(null, data))
  const url = import.meta.env.__JAVA_PREVIEW_URL__ + base64

  useEffect(() => {
    const handleLoad = () => {
      setIsLoading(false)
    }
    const handleError = () => {
      setIsLoading(false)
      setError(true)
    }

    if (iframeRef.current) {
      iframeRef.current.addEventListener('load', handleLoad)
      iframeRef.current.addEventListener('error', handleError)
    }

    return () => {
      if (iframeRef.current) {
        iframeRef.current.removeEventListener('load', handleLoad)
        iframeRef.current.removeEventListener('error', handleError)
      }
    }
  }, [])
  return ReactDOM.createPortal(
    <ModalWrap
      wrapClassName="vertical-center-modal"
      open={props.flag}
      footer={false}
      closable={false}
      title={false}
      bodyStyle={{
        height: '80vh',
      }}
      width="80vw"
      onCancel={props?.onClose}
      maskStyle={{
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
      }}
    >
      <ModelClose onClick={props?.onClose}>
        <CommonIconFont
          type="close-solid2"
          size={40}
          color="var(--neutral-white-d1)"
        />
      </ModelClose>
      <IframeContainer>
        {isLoading ? (
          <LoadingOverlay className="loading-overlay">
            <div className="dot" />
            <div className="dot" />
            <div className="dot" />
            <div className="dot" />
            <div className="dot" />
          </LoadingOverlay>
        ) : null}
        {/* <CloseBtn>
          <IconFont
            onClick={() => {
              props?.onClose()
            }}
            type="close"
            style={{
              fontSize: '25px',
              color: '#F9FAFC',
              cursor: 'pointer',
              margin: '5px 0px 0 10px',
            }}
          />
        </CloseBtn> */}
        {!error ? (
          <StyleIframe ref={iframeRef} src={url} />
        ) : (
          <ErrorRender>
            <IconFont
              type="yulanshibai"
              style={{
                fontSize: '300px',
                color: '#F9FAFC',
                cursor: 'pointer',
                margin: '10px 10px 0 0',
              }}
            />
            {/* <Text>{t('file.erro3')}</Text> */}
          </ErrorRender>
        )}
      </IframeContainer>
    </ModalWrap>,
    document.body,
  )
}

export default PreviewIframe
