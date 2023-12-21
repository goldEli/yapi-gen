/**
 * 通用文件上传工具，结合了 COS 的 API
 *
 */

import React, {
  useState,
  useContext,
  useEffect,
  type CSSProperties,
  type PropsWithChildren,
} from 'react'
import type COS from 'cos-js-sdk-v5'
import { Button, Modal, Tooltip } from 'antd'
import Icon from '../../assets/icons'
import type { BaseProps } from '../../common'
import { Context } from '../../business/files-transfer-provider'
import formatFileSize from '../../functions/format-file-size'
import styles from './index.module.css'
import { useTranslation } from '../..'
import getFileType from '../../functions/get-file-type'
import styled from '@emotion/styled'
import { showWarningModal } from '../../utils/showWarningModal'

const CloseIcon = styled(Icon)`
  width: 32px;
  height: 32px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background: #f7f8fa;
  }
`

export type FilesTransferPopupProps = PropsWithChildren<BaseProps>

const FilesTransferPopup = (props: FilesTransferPopupProps) => {
  const [t] = useTranslation()
  const [isExpand, setIsExpand] = useState(false)
  const context = useContext(Context)
  const [list, setList] = useState<COS.TaskList>(
    context?.cos
      .getTaskList()
      .filter(i => i.state !== 'canceled')
      .reverse() || [],
  )

  const onTasksChange = (params: { list: COS.TaskList }) =>
    setList(oldList => {
      if (params.list.length > oldList.length) {
        setIsExpand(true)
      }
      return params.list.filter(i => i.state !== 'canceled').reverse()
    })

  useEffect(() => {
    if (context) {
      context?.cos.on('list-update', onTasksChange)
    }
    return () => context?.cos.off('list-update', onTasksChange)
  }, [context])

  const onRemove = async (task: COS.Task, passConfirm?: boolean) => {
    if (!context) {
      return
    }
    if (passConfirm) {
      context.cos.cancelTask(task.id)
      if (task.state === 'success') {
        context.removeTaskIds.push(task.id)
      }
    } else {
      showWarningModal({
        title: t('transfer.cancelUpload'),
        content: t('transfer.confirmCancelUpload'),
        onOk: () => context?.cos.cancelTask(task.id),
      })
    }
  }
  const onPause = (task: COS.Task) => context?.cos.pauseTask(task.id)
  const onRestart = (task: COS.Task) => context?.cos.restartTask(task.id)
  const onRemoveAll = () => {
    if (
      list.some((i: COS.Task) =>
        ['uploading', 'waiting', 'checking', 'paused', 'error'].includes(
          i.state,
        ),
      )
    ) {
      showWarningModal({
        title: t('transfer.cancelUpload'),
        content: t('transfer.confirmCancelUpload'),
        onOk: () => list.forEach(i => onRemove(i, true)),
      })
      return
    }
    list.forEach(i => onRemove(i, true))
  }

  const onPauseAll = () =>
    list
      .filter(i => ['uploading', 'waiting', 'checking'].includes(i.state))
      .forEach(i => onPause(i))
  const onRestartAll = () =>
    list
      .filter(i => ['paused', 'error'].includes(i.state))
      .forEach(i => onRestart(i))

  const status = ['uploading', 'paused', 'error', 'success'].find(state =>
    list.some(i =>
      state === 'uploading'
        ? ['uploading', 'waiting', 'checking'].includes(i.state)
        : state === i.state,
    ),
  )

  const statusList = list.filter(i =>
    status === 'uploading'
      ? ['uploading', 'waiting', 'checking'].includes(i.state)
      : status === i.state,
  )
  const spareCount = list.filter(i => i.state !== 'success').length
  const speed = statusList.reduce((total, i) => total + i.speed || 0, 0)

  if (!list.length) {
    return null
  }

  return (
    <div
      className={[styles.wrap, props.className].join(' ')}
      style={props.style}
      data-expand={isExpand}
    >
      <div className={styles.head}>
        <div
          className={styles.head_background}
          onClick={() => setIsExpand(true)}
        />
        <div className={styles.head_detail} onClick={() => setIsExpand(true)}>
          {!!status && (
            <div className={styles.head_detail_title} data-status={status}>
              <Icon
                className={styles.status_icon}
                type={`file-transfer-${
                  {
                    uploading: 'upload',
                    paused: 'warning',
                  }[status] || status
                }`}
              />
              <span className={styles.head_detail_status}>
                {t(`transfer.full_${status}`)}
              </span>
              <span style={{ color: '#BBBDBF', marginRight: 16 }}>
                (<span style={{ color: '#646566' }}>{statusList.length}</span>/
                {list.length})
              </span>
              <span style={{ fontSize: 14, color: '#646566' }}>
                {t('transfer.spare')} {spareCount} {t('transfer.item')}
              </span>
            </div>
          )}
          {status === 'uploading' && <div>{formatFileSize(speed)}/s</div>}
        </div>
        {status === 'uploading' && (
          <Button onClick={onPauseAll}>{t('transfer.pausedAll')}</Button>
        )}
        {status === 'paused' && (
          <Button onClick={onRestartAll}>{t('transfer.continueAll')}</Button>
        )}
        {status === 'error' && (
          <Button onClick={onRestartAll}>{t('transfer.restartAll')}</Button>
        )}
        <CloseIcon
          className={styles.remove}
          onClick={onRemoveAll}
          type="close"
        />
      </div>
      <div className={styles.list}>
        {list.map(i => (
          <div className={styles.item} key={i.id}>
            <Icon
              className={styles.file_icon}
              type={`file-${getFileType(context?.taskNameMap[i.id])}`}
            />
            <div className={styles.detail}>
              <div className={styles.title}>{context?.taskNameMap[i.id]}</div>
              <div className={styles.description}>
                {formatFileSize(i.loaded)} / {formatFileSize(i.size)} ·{' '}
                {context?.taskStatusMap[i.id] ||
                  t(`transfer.${i.state}`, t('transfer.checking'))}
              </div>
            </div>
            {i.state === 'uploading' && (
              <Icon
                className={styles.item_action}
                onClick={() => onPause(i)}
                type="pause"
              />
            )}
            {i.state === 'paused' && (
              <Tooltip title="继续">
                <Icon
                  className={styles.item_action}
                  onClick={() => onRestart(i)}
                  type="start"
                />
              </Tooltip>
            )}
            {i.state === 'error' && (
              <Icon
                className={styles.item_action}
                onClick={() => onRestart(i)}
                type="flush"
              />
            )}
            {['waiting', 'checking'].includes(i.state) && (
              <Icon className={styles.item_loading} type="flush" />
            )}
            {i.state !== 'success' && (
              <CloseIcon
                className={styles.item_action}
                onClick={() => onRemove(i)}
                type="close"
              />
            )}
            <div
              className={styles.item_progress}
              data-status={i.state}
              style={
                {
                  // eslint-disable-next-line @typescript-eslint/naming-convention
                  '--progress_percent': `${i.percent * 100}%`,
                } as unknown as CSSProperties
              }
            />
          </div>
        ))}
      </div>
      <div className={styles.pack} onClick={() => setIsExpand(false)}>
        {t('fold')}
      </div>
    </div>
  )
}

export default FilesTransferPopup
