import React, { useEffect, useRef } from 'react'
import styles from './style.module.css'
import COSDocPreviewSDK from '@jihe/cos-doc-preview-sdk'

interface Props {
  url?: string
  authorization?: string
  onFail?(): void
}

const ViewDocument = (props: Props) => {
  const wrapRef = useRef<HTMLDivElement>(null)

  const init = async () => {
    if (!props.url) {
      props.onFail?.()
      return
    }
    if (!wrapRef.current) {
      return
    }
    try {
      const url = await COSDocPreviewSDK.getPreviewUrl({
        objectUrl: props.url,
        credentials: {
          authorization: props.authorization,
        },
      })

      if (!url) {
        props.onFail?.()
      }

      COSDocPreviewSDK.config({
        url,
        mount: wrapRef.current,
        mode: 'normal',
        commonOptions: {
          isShowHeader: false,
          isShowTopArea: false,
        },
      })
    } catch (error) {
      props.onFail?.()
    }
  }

  useEffect(() => {
    init()
  }, [props.url, props.authorization])

  return (
    <div className={styles.view_document}>
      <div className={styles.document_box} ref={wrapRef} />
    </div>
  )
}

export default ViewDocument
