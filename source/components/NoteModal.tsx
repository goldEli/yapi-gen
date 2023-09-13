import React, { useState } from 'react'
import CommonModal from './CommonModal'
import styled from '@emotion/styled'
import { Checkbox } from 'antd'
import CommonButton from './CommonButton'
import { Editor } from 'ifunuikit'
import { useTranslation } from 'react-i18next'
import { noSysNotice } from '@/services/sysNotice'
import { setReadApi } from '@/services/SiteNotifications'

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
  background-image: url('https://mj-system-1308485183.cos.accelerate.myqcloud.com/public/note.jpg');

  border-radius: 4px 4px 0px 0px;
  padding: 38px 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
`
const Content = styled.div`
  padding: 24px;
  box-sizing: border-box;

  overflow-y: scroll;
  height: calc(100vh - 600px);
`

const NoteModal = (props: any) => {
  const [checked, setChecked] = useState(false)
  const [t] = useTranslation()
  const getLabelName = (num: string) => {
    switch (num) {
      case '1':
        return t('system_notification')
      case '2':
        return t('daily_notification')
      case '3':
        return t('important_notification')
      case '4':
        return t('activity_notification')
      case '5':
        return t('holiday_notification')
    }
  }
  return (
    <CommonModal
      isVisible={props.isVisible}
      isHeader
      width={640}
      hasFooter={
        <Footer>
          <span></span>

          <CommonButton
            type="primary"
            onClick={() => {
              props.onClose()
              setReadApi(props.data.id)
              if (checked) {
                noSysNotice(props.data.customData.id)
              }
            }}
          >
            {t('other.iKnown')}
          </CommonButton>
        </Footer>
      }
    >
      <Header>
        <div
          style={{
            height: '50px',
            fontSize: '32px',
            fontFamily: 'SiYuanMedium',
            color: 'var(--neutral-white-d1)',
            lineHeight: '52px',
          }}
        >
          {getLabelName(props.data?.customData?.type)}
        </div>
        <div
          style={{
            height: '20px',
            fontSize: '12px',
            color: 'var(--neutral-white-d1)',
            lineHeight: '20px',
          }}
        >
          {t('other.release')}
          {props.data?.customData?.sendTime}
        </div>
      </Header>
      <Content>
        <div
          style={{
            height: '26px',
            fontSize: '18px',
            fontFamily: 'SiYuanMedium',
            color: 'var(--neutral-n1-d1)',
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
