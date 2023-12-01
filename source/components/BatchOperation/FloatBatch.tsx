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
  height: 52px;
  border-radius: 8px;
  background: rgba(4, 4, 4, 0.6);
  width: fit-content;
`

const boxItem = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 4px 12px;
  cursor: pointer;
  color: white;
  border-radius: 4px;
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
  // 1-需求，2-缺陷，3-事务
  type: number
}

const FloatBatch = (props: Props) => {
  const [t] = useTranslation()
  const [isVisible, setIsVisible] = useState(false)
  const [currentType, setCurrentType] = useState<'edit' | 'delete'>('edit')
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id

  // 点击每项操作
  const onClickItem = (type: 'edit' | 'delete') => {
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
      let params: any = {
        id: projectId,
        detailId: element.id,
        isOpenScreenDetail: true,
      }
      let url = ''
      if (props.type === 3) {
        params.specialType = 1
        const resultParams = encryptPhp(JSON.stringify(params))
        url = `ProjectDetail/Affair?data=${resultParams}`
      } else if (props.type === 2) {
        params.specialType = 2
        const resultParams = encryptPhp(JSON.stringify(params))
        url = `ProjectDetail/Defect?data=${resultParams}`
      } else if (props.type === 1) {
        params.specialType = 3
        const resultParams = encryptPhp(JSON.stringify(params))
        url = `ProjectDetail/Demand?data=${resultParams}`
      }

      text += `【${element.storyPrefixKey}-${element.name}】 ${beforeUrl}${url} \n`
    })
    copyLink(text, t('common.copySuccess'), t('common.copyFail'))
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
          modelType={props.type}
        />
      )}
      {props.isVisible && (
        <div className={batchAllBox}>
          <div className={batchBox}>
            <Space size={8}>
              <div className={boxItem} onClick={() => onClickItem('edit')}>
                {t('common.edit')}
              </div>
              <div className={boxItem} onClick={() => onClickItem('delete')}>
                {t('common.del')}
              </div>
              <div className={boxItem} onClick={onCopy}>
                {t('other.copy')}
              </div>
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
