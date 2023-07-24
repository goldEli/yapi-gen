/* eslint-disable no-promise-executor-return */
/* eslint-disable require-atomic-updates */
/* eslint-disable no-undefined */
/* eslint-disable camelcase */
/* eslint-disable complexity */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-duplicate-imports */
/* eslint-disable react/jsx-no-undef */
import IconFont from '@/components/IconFont'
import { useDispatch, useSelector } from '@store/index'
import { changeKeyBoardVisible } from '@store/SiteNotifications'
import { Drawer } from 'antd'
import { CloseWrap, Wrap, messageDrawer, TabsWrap } from './style'

const KeyBoardDrawer = () => {
  const dispatch = useDispatch()
  const { isVisible2 } = useSelector(store => store.siteNotifications)

  const onClose = () => {
    dispatch(changeKeyBoardVisible(false))
  }

  return (
    <Drawer
      className={messageDrawer}
      forceRender
      bodyStyle={{
        padding: '16px 0px 0px',
        boxSizing: 'border-box',
      }}
      width={400}
      zIndex={100}
      closable={false}
      placement="right"
      onClose={onClose}
      open={isVisible2}
    >
      <Wrap>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0px 12px',
          }}
        >
          <TabsWrap>快捷键</TabsWrap>
          <CloseWrap onClick={onClose} width={32} height={32}>
            <IconFont
              style={{ fontSize: 20, color: 'var(--neutral-n2)' }}
              type="close"
            />
          </CloseWrap>
        </div>
      </Wrap>
    </Drawer>
  )
}

export default KeyBoardDrawer
