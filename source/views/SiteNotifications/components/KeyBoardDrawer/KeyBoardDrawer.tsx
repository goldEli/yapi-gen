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

const myCss = css`
  :hover {
    background-color: #f6f7f9;
  }
`

const KeyBoardDrawer = () => {
  const textList = [
    {
      text: '创建事务/需求/缺陷',
      board: ['C'],
    },
    {
      text: '发送评论',
      board: ['Ctrl+回车'],
    },
    {
      text: '评论输入',
      board: ['M'],
    },
    {
      text: '页面搜索',
      board: ['F'],
    },
    {
      text: '详情预览切换',
      board: ['↑', '↓'],
    },
    {
      text: '左侧菜单显示/隐藏',
      board: ['['],
    },
    {
      text: '项目菜单切换至冲刺/迭代',
      board: ['1'],
    },
    {
      text: '项目菜单切换至Kanban',
      board: ['2'],
    },
    {
      text: '项目菜单切换至报表',
      board: ['3'],
    },
    {
      text: '项目菜单切换至需求',
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
          <TabsWrap>快捷键</TabsWrap>
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
