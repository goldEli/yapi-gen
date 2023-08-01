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
import { css } from '@emotion/css'
import { useTranslation } from 'react-i18next'

const myCss = css`
  :hover {
    background-color: #f6f7f9;
  }
`

const KeyBoardDrawer = () => {
  const [t] = useTranslation()
  const textList = [
    {
      text: t('create_transaction_or_requirement_or_defect'),
      board: ['C'],
    },
    {
      text: t('send_comment'),
      board: [t('ctrl_enter')],
    },
    {
      text: t('comment_input'),
      board: ['M'],
    },
    {
      text: t('page_search'),
      board: ['F'],
    },
    {
      text: t('toggle_details_preview'),
      board: ['↑', '↓'],
    },
    {
      text: t('toggle_left_menu'),
      board: ['['],
    },
    {
      text: t('switch_project_menu_to_sprint_or_iteration'),
      board: ['1'],
    },
    {
      text: t('switch_project_menu_to_kanban'),
      board: ['2'],
    },
    {
      text: t('switch_project_menu_to_reports'),
      board: ['3'],
    },
    {
      text: t('switch_project_menu_to_requirements'),
      board: ['5'],
    },
  ]
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
            padding: '0px 16px',
          }}
        >
          <TabsWrap>{t('shortcut_key')}</TabsWrap>
          <CloseWrap onClick={onClose} width={32} height={32}>
            <IconFont
              style={{ fontSize: 20, color: 'var(--neutral-n2)' }}
              type="close"
            />
          </CloseWrap>
        </div>
        <div
          style={{
            margin: '16px',
          }}
        >
          {textList.map((i: any) => (
            <div
              className={myCss}
              key={i.text}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                height: '40px',
                padding: '0 12px',
                alignItems: 'center',
                borderRadius: '6px',
              }}
            >
              <span
                style={{
                  height: '22px',
                  fontSize: '14px',

                  color: '#646566',
                  lineHeight: '22px',
                }}
              >
                {i.text}
              </span>
              <div
                style={{
                  display: 'flex',
                  gap: '4px',
                }}
              >
                {i.board.map((k: any) => (
                  <span
                    key={k}
                    style={{
                      fontFamily: 'SiYuanMedium',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '24px',
                      color: '#323233',
                      background: '#FFFFFF',
                      borderRadius: '4px 4px 4px 4px',
                      padding: '6px',
                      border: '1px solid #ECEDEF',
                    }}
                  >
                    {k}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Wrap>
    </Drawer>
  )
}

export default KeyBoardDrawer
