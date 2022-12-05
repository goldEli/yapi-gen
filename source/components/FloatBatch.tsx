// 批量操作浮窗

/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/jsx-no-leaked-render */
import { css } from '@emotion/css'
import { Space } from 'antd'
import { useTranslation } from 'react-i18next'
import IconFont from './IconFont'
import BatchModal from './BatchModal'
import { useState } from 'react'
import { copyLink } from '@/tools'

const batchAllBox = css`
  width: 100%;
  display: flex;
  justify-content: center;
  position: absolute;
  bottom: 56px;
  z-index: 22;
`

const batchBox = css`
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
  height: 50px;
  cursor: pointer;
  color: white;
  border-radius: 12px;
  div {
    font-size: 12px;
    font-weight: 400;
  }
  svg {
    font-size: 20px;
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
}

const FloatBatch = (props: Props) => {
  const [t] = useTranslation()
  // 底部悬浮显示
  const [isVisible, setIsVisible] = useState(false)
  const [currentType, setCurrentType] = useState('')

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
    copyLink(props.selectRows)
  }

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
              <div className={boxItem} onClick={() => onClickItem('edit')}>
                <IconFont type="edit-square" />
                <div>{t('common.edit')}</div>
              </div>
              <div className={boxItem} onClick={() => onClickItem('delete')}>
                <IconFont type="delete" />
                <div>{t('common.del')}</div>
              </div>
              <div className={boxItem} onClick={onCopy}>
                <IconFont type="attachment" />
                <div>{t('version2.link')}</div>
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
