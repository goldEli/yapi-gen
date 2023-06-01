import React from 'react'
import CommonModal from './CommonModal'
import styled from '@emotion/styled'
import { Checkbox } from 'antd'
import CommonButton from './CommonButton'
import { Editor } from '@xyfe/uikit'
import { useTranslation } from 'react-i18next'

const Footer = styled.div`
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
`
const Header = styled.div`
  height: 148px;
  background-size: contain;
  background-image: url('/note.png');

  border-radius: 4px 4px 0px 0px;
  padding: 38px 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
`
const Content = styled.div`
  padding: 24px;
  box-sizing: border-box;
  min-height: 412px;
`

const NoteModal = (props: any) => {
  const [t] = useTranslation()
  const getLabelName = (num: string) => {
    switch (num) {
      case '1':
        return t(`system_notification`)
      case '2':
        return t(`daily_notification`)
      case '3':
        return t(`important_notification`)
      case '4':
        return t(`activity_notification`)
      case '5':
        return t(`holiday_notification`)
    }
  }
  const onChange = (e: any) => {
    console.log(`checked = ${e.target.checked}`)
  }
  return (
    <CommonModal
      isVisible={props.isVisible}
      isHeader
      width={640}
      hasFooter={
        <Footer>
          <Checkbox onChange={onChange}>
            <span
              style={{
                height: '22px',
                fontSize: '14px',
                color: '#969799',
                lineHeight: '22px',
              }}
            >
              不在提醒
            </span>
          </Checkbox>
          <CommonButton type="primary" onClick={() => props.onClose()}>
            我知道了
          </CommonButton>
        </Footer>
      }
    >
      <Header>
        <div
          style={{
            height: '50px',
            fontSize: '44px',
            fontFamily: 'SiYuanMedium',
            color: '#FFFFFF',
            lineHeight: '52px',
          }}
        >
          {getLabelName(props.data?.customData?.type)}
        </div>
        <div
          style={{
            height: '20px',
            fontSize: '12px',
            color: '#FFFFFF',
            lineHeight: '20px',
          }}
        >
          发布于{props.data?.customData?.expireTime}
        </div>
      </Header>
      <Content>
        <div
          style={{
            height: '26px',
            fontSize: '18px',
            fontFamily: 'SiYuanMedium',
            color: '#323233',
            lineHeight: '26px',
            textAlign: 'center',
          }}
        >
          {props.data.msgBody?.title}
        </div>

        <Editor
          value={props.data.msgBody?.content}
          getSuggestions={() => []}
          readonly
        />
      </Content>
    </CommonModal>
  )
}

export default NoteModal
