import { forwardRef, ReactNode } from 'react'
// eslint-disable-next-line no-duplicate-imports
import IconFont from '@/components/IconFont'
import { Space } from 'antd'
import { css } from '@emotion/css'

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

export const boxItem = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 52px;
  height: 32px;
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

interface BatchActionProps {
  open: boolean
  onCancel(): void
  children: ReactNode
}

const BatchAction = ({ open, children, onCancel }: BatchActionProps) => {
  const onClose = () => {
    onCancel()
  }
  return (
    <div>
      {open ? (
        <div className={batchAllBox}>
          <div className={batchBox}>
            <Space size={8}>{children}</Space>
            <IconFont
              onClick={onClose}
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
      ) : null}
    </div>
  )
}

export default BatchAction
