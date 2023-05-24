// 批量操作浮窗

/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/jsx-no-leaked-render */
import { css } from '@emotion/css'
import { Space, Tooltip } from 'antd'
import { useTranslation } from 'react-i18next'
import BatchModal from './BatchModal'
import { useImperativeHandle, useState } from 'react'
import { copyLink, getParamsData } from '@/tools'
import { encryptPhp } from '@/tools/cryptoPhp'
import { useSearchParams } from 'react-router-dom'
import IconFont from '../IconFont'

const batchAllBox = css`
  display: flex;
  justify-content: center;
  position: absolute;
  bottom: 56px;
  z-index: 22;
  left: calc(50% - 150px);
`

const batchBox = css`
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  padding: 0 32px;
  height: 64px;
  border-radius: 16px;
  background: rgba(4, 4, 4, 0.6);
  width: fit-content;
`

const boxItem = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 12px;
  width: 52px;
  height: 52px;
  cursor: pointer;
  color: white;
  border-radius: 12px;
  div {
    font-size: 12px;
    font-weight: 400;
  }
  svg {
    font-size: 24px;
  }
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`

interface Props {
  isVisible: boolean
  onClose(): void
  selectRows?: any
  onUpdate(): void
  onRef: any
}

const FloatBatch = (props: Props) => {
  const [t] = useTranslation()
  const [isVisible, setIsVisible] = useState(false)
  const [currentType, setCurrentType] = useState('')
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id

  // 点击每项操作
  const onClickItem = (type: string) => {
    setCurrentType(type)
    setIsVisible(true)
  }

  // 操作成功后，清空勾选
  const onClose = () => {
    setIsVisible(false)
    props.onClose()
    props.onUpdate()
  }

  //  点击复制链接
  const onCopy = () => {
    let text: any = ''
    let beforeUrl: any
    beforeUrl = `${window.origin}${import.meta.env.__URL_HASH__}`
    props.selectRows?.forEach((element: any) => {
      const params = encryptPhp(
        JSON.stringify({ type: 'info', id: projectId, demandId: element.id }),
      )
      const url = `ProjectManagement/Demand?data=${params}`
      text += `【${element.name}】 ${beforeUrl}${url} \n`
    })
    copyLink(text, t('version2.copyLinkSuccess'), t('version2.copyLinkError'))
  }

  useImperativeHandle(props.onRef, () => {
    return {
      clickMenu: onClickItem,
      copy: onCopy,
    }
  })

  return (
    <>
      {isVisible && (
        <BatchModal
          isVisible={isVisible}
          onChangeVisible={() => setIsVisible(!isVisible)}
          type={currentType}
          selectRows={props.selectRows}
          onClose={onClose}
        />
      )}
      {props.isVisible && (
        <div className={batchAllBox}>
          <div className={batchBox}>
            <Space size={8}>
              <Tooltip
                placement="top"
                getPopupContainer={node => node}
                title={t('common.edit')}
              >
                <div className={boxItem} onClick={() => onClickItem('edit')}>
                  <IconFont type="edit-square" />
                </div>
              </Tooltip>
              <Tooltip
                placement="top"
                getPopupContainer={node => node}
                title={t('common.del')}
              >
                <div className={boxItem} onClick={() => onClickItem('delete')}>
                  <IconFont type="delete" />
                </div>
              </Tooltip>
              <Tooltip
                placement="top"
                getPopupContainer={node => node}
                title={t('version2.link')}
              >
                <div className={boxItem} onClick={onCopy}>
                  <IconFont type="attachment" />
                </div>
              </Tooltip>
            </Space>
            <IconFont
              onClick={props.onClose}
              style={{
                fontSize: 24,
                color: 'white',
                marginLeft: 50,
                cursor: 'pointer',
              }}
              type="close-circle-fill"
            />
          </div>
        </div>
      )}
    </>
  )
}

export default FloatBatch