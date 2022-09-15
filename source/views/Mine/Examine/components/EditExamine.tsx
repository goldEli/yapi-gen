/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable multiline-ternary */
import { Input, Space, Timeline } from 'antd'
import { CategoryWrap, ViewWrap, NameWrap } from '@/components/StyleCommon'
import { AsyncButton as Button } from '@staryuntech/ant-pro'
import CommonModal from '@/components/CommonModal'
import styled from '@emotion/styled'
import { useState } from 'react'
import { useModel } from '@/models'

const TimelineWrap = styled(Timeline)({
  '.ant-timeline-item-last > .ant-timeline-item-content': {
    minHeight: 'auto',
  },
  '.ant-timeline-item-last': {
    paddingBottom: '0!important',
  },
})

const FooterWrap = styled(Space)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  height: 80,
})

const ItemWrap = styled.div({
  display: 'flex',
  alignItems: 'flex-start',
  marginBottom: 16,
})

const LabelWrap = styled.div({
  color: '#646566',
  fontSize: 14,
  fontWeight: 400,
  width: 100,
})

interface Props {
  isVisible: boolean
  onClose(): void
  item?: any
  isEdit?: boolean
}

const EditExamine = (props: Props) => {
  const { colorList } = useModel('project')
  const [value, setValue] = useState('')

  const onClose = () => {
    props?.onClose()
    setTimeout(() => {
      setValue('')
    }, 100)
  }

  const onConfirm = () => {

    // onConfirm
  }

  const onRefuse = () => {

    //
  }

  return (
    <CommonModal
      isVisible={props.isVisible}
      title="审核"
      onClose={onClose}
      hasFooter={
        <FooterWrap size={16}>
          <Button onClick={onClose}>取消</Button>
          <Button onClick={onRefuse}>拒绝</Button>
          <Button type="primary" onClick={onConfirm}>
            通过
          </Button>
        </FooterWrap>
      }
    >
      <div style={{ maxHeight: 464, overflowY: 'auto' }}>
        <ItemWrap>
          <div>{props?.item.id}</div>
          <CategoryWrap
            color={props?.item?.category?.color}
            bgColor={
              colorList?.filter(i => i.key === props?.item?.category?.color)[0]
                ?.bgColor
            }
          >
            {props?.item?.category?.name}
          </CategoryWrap>
          <div>{props?.item.name}</div>
        </ItemWrap>
        <ItemWrap>
          <LabelWrap>流转状态</LabelWrap>
          <div>{props?.item.status}</div>
        </ItemWrap>
        <ItemWrap>
          <LabelWrap>处理人</LabelWrap>
          <div>{props?.item.dealName}</div>
        </ItemWrap>
        <ItemWrap>
          <LabelWrap>提交人</LabelWrap>
          <div>{props?.item.createName}</div>
        </ItemWrap>
        <ItemWrap>
          <LabelWrap>审核意见</LabelWrap>
          {props?.isEdit ? (
            <Input.TextArea
              style={{ width: 292 }}
              autoSize={{ minRows: 3, maxRows: 5 }}
              placeholder="请输入审核意见"
            />
          )
            : <div>{props?.item.reason}</div>
          }
        </ItemWrap>
        <div style={{ color: '#323233', fontSize: 14, marginBottom: 16 }}>
          审核流程
        </div>
        <TimelineWrap>
          <Timeline.Item>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ fontSize: 16, marginRight: 16, color: '#323233' }}>
                审核人
              </span>
              <span style={{ fontSize: 12, color: '#969799' }}>依次审核</span>
            </div>
            <div
              style={{ marginTop: 8, display: 'flex', alignItems: 'center' }}
            >
              <NameWrap>张</NameWrap>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  marginLeft: 8,
                }}
              >
                <div
                  style={{
                    fontSize: 14,
                    color: '#323233',
                  }}
                >
                  张三
                </div>
                <div style={{ fontSize: 12 }}>
                  <span style={{ color: '#43BA9A' }}>已通过</span>
                  <span style={{ color: '#969799', marginLeft: 16 }}>
                    2022-08-09 16:09:00
                  </span>
                </div>
              </div>
            </div>
            <div style={{ fontSize: 12, color: '#969799', marginTop: 4 }}>
              审核意见内容审核意见内容审核意见内容审核意见内容审核意见内容
            </div>
          </Timeline.Item>
          <Timeline.Item>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ fontSize: 16, marginRight: 8, color: '#323233' }}>
                流转至
              </span>
              <ViewWrap color="#43BA9A">已实现</ViewWrap>
            </div>
          </Timeline.Item>
        </TimelineWrap>
      </div>
    </CommonModal>
  )
}

export default EditExamine
