/**
 * 文件预览 支持 'image' | 'video' | 'audio' | 'document'
 */
import React, { useEffect, useState, type ReactNode } from 'react'
import Icon from '../../assets/icons'
import ViewImage from '../../components/view-image'
import ViewVideo from '../../components/view-video'
import ViewAudio from '../../components/view-audio'
import ViewDocument from '../../components/view-document'
import ViewFail from '../../components/view-fail'
import styles from './index.module.css'
import styled from '@emotion/styled'

type ViewType = 'image' | 'video' | 'audio' | 'document' | 'unknown'

const getViewComponent = (type: ViewType = 'unknown') => {
  const components = {
    image: ViewImage,
    video: ViewVideo,
    audio: ViewAudio,
    document: ViewDocument,
    unknown: ViewFail,
  } as Record<
    ViewType,
    (props: { url?: string; onFail?(): void; authorization?: string }) => any
  >
  return components[type] || ViewFail
}

interface FileViewProps {
  title?: string
  actions?: ReactNode
  side?: ReactNode
  type?: ViewType
  url?: string
  authorization?: string
  onClose?(): void
}

const FileView = (props: FileViewProps) => {
  const [isViewFail, setIsViewFail] = useState(false)
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const Component = getViewComponent(isViewFail ? 'unknown' : props.type)
  const onFail = () => setIsViewFail(true)

  useEffect(() => setIsViewFail(false), [props.type, props.url])

  return (
    <div className={styles.wrap}>
      <div className={styles.head}>
        <div className={styles.head_title}>{props.title}</div>
        <div className={styles.head_actions}>{props.actions}</div>
        <div className={styles.head_close_box}>
          <Icon
            className={styles.head_close}
            onClick={props.onClose}
            type="close"
          />
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.view_area}>
          <Component
            url={props.url}
            onFail={onFail}
            authorization={props.authorization}
          />
        </div>
        <div className={styles.side}>{props.side}</div>
      </div>
    </div>
  )
}

export default FileView
