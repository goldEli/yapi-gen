/* eslint-disable camelcase */
/* eslint-disable no-duplicate-imports */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react/no-danger */
import { Drawer, Space } from 'antd'
import { Editor } from '@xyfe/uikit'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import CommonIconFont from '@/components/CommonIconFont'
import { DragLine, MouseDom } from '@/components/StyleCommon'
import CommonUserAvatar from '@/components/CommonUserAvatar'
import {
  Header,
  BackIcon,
  ChangeIconGroup,
  UpWrap,
  DownWrap,
} from '@/views/WorkReport/Review/components/style'

import { Content, Title, Text } from './style'
import {
  Col,
  DefalutIcon,
  NameText,
} from '@/views/WorkReport/Formwork/Addperson'
import { getMyAllSysNoticeDetail } from '@/services/sysNotice'

// 已读未读

const NoteDetailDrawer = (props: any) => {
  const { reportIds } = props

  const [t] = useTranslation()

  const [focus, setFocus] = useState(false)

  const [currentIndex, setCurrentIndex] = useState(0)

  const [arr, setArr] = useState<any>(null)
  const leftWidth = 640

  // 拖动线条
  const onDragLine = () => {
    const drawer: HTMLElement = document.querySelector(
      '.drawerRoot .ant-drawer-content-wrapper',
    )!
    const drawerBody: HTMLElement = document.querySelector(
      '.drawerRoot .ant-drawer-body',
    )!
    const moveHandler = (ev: React.MouseEvent) => {
      setFocus(true)
      drawerBody.style.minWidth = '100%'
      drawerBody.style.right = '0px'
      const nextWidth = innerWidth - ev.clientX
      if (nextWidth <= leftWidth) {
        return
      }
      drawer!.style.width = `${innerWidth - ev.clientX}px`
    }
    drawer.style.transition = '0s'
    // const debounceWrap: any = throttle(moveHandler, 60, {})
    const debounceWrap: any = moveHandler
    document.addEventListener('mousemove', debounceWrap)
    document.addEventListener('mouseup', () => {
      drawer.style.transition = 'all 0.3s'
      setFocus(false)
      document.removeEventListener('mousemove', debounceWrap)
    })
  }

  // 关闭弹窗
  const onCancel = () => {
    props.onCancel()
    // 更新List页面
  }
  const changeData = async (id: any) => {
    const res = await getMyAllSysNoticeDetail(id)

    setArr(res)
  }

  // 向上查找需求
  const onUpDemand = () => {
    const newIndex = reportIds[currentIndex - 1]
    changeData(newIndex)
    setCurrentIndex(reportIds.findIndex((i: any) => i === newIndex))
  }

  // 向下查找需求
  const onDownDemand = () => {
    const newIndex = reportIds[currentIndex + 1]
    changeData(newIndex)
    setCurrentIndex(reportIds.findIndex((i: any) => i === newIndex))
  }

  const init = async () => {
    const res = await getMyAllSysNoticeDetail(props?.detailInner.id)

    setArr(res)
  }
  useEffect(() => {
    props.isVisible && init()
  }, [props.isVisible])

  useEffect(() => {
    setCurrentIndex(
      reportIds.findIndex((i: any) => i === props?.detailInner?.id),
    )
  }, [reportIds])

  if (props.isVisible) {
    return (
      <Drawer
        closable={false}
        placement="right"
        bodyStyle={{ padding: 0, position: 'relative' }}
        width={leftWidth}
        open={props.isVisible}
        onClose={onCancel}
        destroyOnClose
        maskClosable={false}
        mask={false}
        getContainer={false}
        className="drawerRoot"
      >
        <MouseDom active={focus} onMouseDown={onDragLine} style={{ left: 0 }}>
          <DragLine active={focus} className="line" style={{ marginLeft: 0 }} />
        </MouseDom>
        <Header>
          <Space size={16}>
            <BackIcon onClick={onCancel}>
              <CommonIconFont
                type="right-02"
                size={20}
                color="var(--neutral-n2)"
              />
            </BackIcon>
          </Space>
          <Space size={16}>
            <ChangeIconGroup>
              {currentIndex === 0 ? null : (
                <UpWrap
                  onClick={onUpDemand}
                  id="upIcon"
                  isOnly={currentIndex === 0}
                >
                  <CommonIconFont
                    type="up"
                    size={20}
                    color="var(--neutral-n1-d1)"
                  />
                </UpWrap>
              )}
              {reportIds.length - 1 === currentIndex ? null : (
                <DownWrap
                  onClick={onDownDemand}
                  id="downIcon"
                  isOnly={currentIndex <= 0}
                >
                  <CommonIconFont
                    type="down"
                    size={20}
                    color="var(--neutral-n1-d1)"
                  />
                </DownWrap>
              )}
            </ChangeIconGroup>
          </Space>
        </Header>
        <Content>
          <div
            style={{
              height: '24px',
              fontSize: '16px',
              color: 'var(--neutral-n1-d1)',
              lineHeight: '24px',
              fontFamily: 'SiYuanMedium',
            }}
          >
            {arr?.title}
          </div>
          <Title> {t('content')}</Title>
          <Editor
            value={arr?.content ?? '--'}
            getSuggestions={() => []}
            readonly
          />
          <Title>{t('author')}</Title>
          {/* <Text> {arr.user.name}</Text> */}
          <Title>{t('sent_at')}</Title>
          <Text>{arr?.send_time ? arr?.send_time : arr?.created_at}</Text>
          <Title>{t('receiver')}</Title>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
            }}
          >
            {arr?.recipient.all ? (
              <Col
                style={{
                  whiteSpace: 'nowrap',
                }}
              >
                <DefalutIcon bgc="rgba(125, 189, 225, 1)">
                  <CommonIconFont
                    type="userAll"
                    size={16}
                    color="var(--neutral-white-d7)"
                  />
                </DefalutIcon>
                <NameText>{t('all')}</NameText>
              </Col>
            ) : (
              arr?.recipient_users.map((i: any) => (
                <Col
                  style={{
                    whiteSpace: 'nowrap',
                  }}
                  key={i.id}
                >
                  <CommonUserAvatar avatar={i.avatar} />
                  <NameText>{i.name}</NameText>
                </Col>
              ))
            )}
          </div>
        </Content>
      </Drawer>
    )
  }
  return null
}

export default NoteDetailDrawer
