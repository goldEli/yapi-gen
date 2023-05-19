import React from 'react'
import CommonModal from './CommonModal'
import styled from '@emotion/styled'
import { Checkbox } from 'antd'
import CommonButton from './CommonButton'
import { Editor } from '@xyfe/uikit'

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

const NoteModal = () => {
  const onChange = (e: any) => {
    console.log(`checked = ${e.target.checked}`)
  }
  return (
    <CommonModal
      isVisible={false}
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
          <CommonButton type="primary">我知道了</CommonButton>
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
          系统通知
        </div>
        <div
          style={{
            height: '20px',
            fontSize: '12px',
            color: '#FFFFFF',
            lineHeight: '20px',
          }}
        >
          发布于2023-08-08 11:08:08
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
          焕然一新！知识库2.0升级详解
        </div>

        <Editor
          value={
            '强化安全性：我们加强了平台的安全性措施，采取了更严格的数据加密和访问控制措施，以保护您的个人信息和数据安全。您可以放心使用平台，直到您的隐私受到了最大程度的保护。'
          }
          getSuggestions={() => []}
          readonly
        />
      </Content>
    </CommonModal>
  )
}

export default NoteModal
