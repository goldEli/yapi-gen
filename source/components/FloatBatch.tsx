// 批量操作浮窗

/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/jsx-no-leaked-render */
import { css } from '@emotion/css'
import { Space } from 'antd'
import { useTranslation } from 'react-i18next'
import IconFont from './IconFont'

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
}

const FloatBatch = (props: Props) => {
  const [t] = useTranslation()
  return (
    <>
      {props.isVisible && (
        <div className={batchAllBox}>
          <div className={batchBox}>
            <Space size={8}>
              <div className={boxItem}>
                <IconFont type="edit-square" />
                <div>{t('common.edit')}</div>
              </div>
              <div className={boxItem}>
                <IconFont type="delete" />
                <div>{t('common.del')}</div>
              </div>
              <div className={boxItem}>
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
