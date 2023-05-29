/* eslint-disable camelcase */
/* eslint-disable no-duplicate-imports */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react/no-danger */
import { useDispatch, useSelector } from '@store/index'
import { Drawer, Form, Space } from 'antd'
import { Editor } from '@xyfe/uikit'
import { useEffect, useRef, useState } from 'react'
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
  TargetUserItem,
  TargetUserContent,
  ContactDemandBox,
  ContactDemandItem,
} from '@/views/WorkReport/Review/components/style'

import { Content, Title, Text } from './style'
import { Col, NameText } from '@/views/WorkReport/Formwork/Addperson'
import { getMyAllSysNoticeDetail } from '@/services/sysNotice'

interface TargetTabsProps {
  list: any
}

// 已读未读

const NoteDetailDrawer = (props: any) => {
  const [t] = useTranslation()
  const { viewReportModal } = useSelector(store => store.workReport)
  const [skeletonLoading, setSkeletonLoading] = useState(false)
  const [focus, setFocus] = useState(false)
  const [drawerInfo, setDrawerInfo] = useState<any>({})
  const [currentIndex, setCurrentIndex] = useState(0)
  const [reportIds, setReportIds] = useState<any>([])
  const [isReview, setIsReview] = useState(false)
  const [commentList, setCommentList] = useState([])
  const [form] = Form.useForm()
  const [arr, setArr] = useState<any>(null)
  const reviewRef = useRef<any>()
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

  // 向上查找需求
  const onUpDemand = () => {}

  // 向下查找需求
  const onDownDemand = () => {}

  const init = async () => {
    const res = await getMyAllSysNoticeDetail(props.detailInner.id)
    console.log(res, '详情')
  }
  useEffect(() => {
    props.isVisible && init()
  }, [props.isVisible])

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
              <UpWrap
                onClick={onUpDemand}
                id="upIcon"
                isOnly={
                  reportIds?.length === 0 ||
                  currentIndex === reportIds?.length - 1
                }
              >
                <CommonIconFont
                  type="up"
                  size={20}
                  color="var(--neutral-n1-d1)"
                />
              </UpWrap>

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
            </ChangeIconGroup>
          </Space>
        </Header>
        <Content>
          <div
            style={{
              height: '24px',
              fontSize: '16px',
              color: '#323233',
              lineHeight: '24px',
              fontFamily: 'SiYuanMedium',
            }}
          >
            {props.detailInner.title}
          </div>
          <Title> 内容</Title>
          <Editor
            value={props.detailInner.content ?? '--'}
            getSuggestions={() => []}
            readonly
          />
          <Title>作者</Title>
          <Text> {props.detailInner.user.name}</Text>
          <Title>发送于</Title>
          <Text>{props.detailInner.send_time}</Text>
          <Title>接收人</Title>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
            }}
          >
            {props.detailInner.recipient.map((i: any) => (
              <Col
                style={{
                  whiteSpace: 'nowrap',
                }}
                key={i.id}
              >
                <NameText>
                  {i.name}({i.user_ids.length})
                </NameText>
              </Col>
            ))}
          </div>
        </Content>
      </Drawer>
    )
  }
  return null
}

export default NoteDetailDrawer
