import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { useNavigate } from 'react-router-dom'
import { css } from '@emotion/css'
import IconFont from '@/components/IconFont'
import CompanyModal from '@/components/CompanyModal'
import { Tooltip, Popover } from 'antd'
import { Personal } from './Personal'
import { useModel } from '@/models'

const buttonCss = css`
  width: 24px;
  /* display: block; */
  border-radius: 50%;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    width: 24px;
    /* display: block; */
    border-radius: 50%;
    height: 24px;
    background: rgba(240, 244, 250, 1);
    background-blend-mode: normal;
    color: #2774f8;
  }
`
const lineText = css`
  margin-left: 8px;
`
const languageText = css`
  color: rgba(150, 151, 153, 1);
  font-size: 12px;
  margin-right: 8px;
`
const Box = styled.div`
  z-index: 2;
  position: fixed;
  bottom: 5px;
  left: 90px;
  width: 220px;
  height: 230px;
  background: rgba(255, 255, 255, 1);
  background-blend-mode: normal;
  box-shadow: 0px 6px 16px rgba(0, 0, 0, 0.08), 0px 9px 28px rgba(0, 0, 0, 0.05),
    0px 12px 48px 16px rgba(0, 0, 0, 0.03);
  border-radius: 6px;
  box-sizing: border-box;
  padding: 16px 16px 22px 16px;
`
const SetHead = styled.div`
  width: 40px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border-radius: 50%;
  font-size: 12px;
  background: rgba(40, 119, 255, 1);
  background-blend-mode: normal;
  border: 2px solid rgba(40, 119, 255, 0.16);
  border: 1px solid rgba(40, 119, 255, 1);
  color: white;
  margin-right: 8px;
`
const PanelHeader = styled.div`
  padding-bottom: 18px;
  border-bottom: 1px solid rgba(235, 237, 240, 1);
`
const PanelHeaderFirst = styled.div`
  display: flex;
`
const PanelHeaderSecond = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  display: flex;
`
const NanmeAndPhone = styled.div`
  font-size: 12px;
  display: flex;
  flex-direction: column;
`
const PanelFooter = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const Line = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 32px;
  &:hover {
    background-color: #f0f4fa;
  }
`
const LanguageLine = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 120px;
  height: 32px;
  &:hover {
    background-color: #f0f4fa;
  }
`
export const Panel = (props: { visible: boolean }) => {
  const { loginOut } = useModel('user')
  const navigate = useNavigate()
  const [personalModalVisible, setPersonalModalVisible] =
    useState<boolean>(false)
  const [companyModalVisible, setCompanyModalVisible] = useState<boolean>(false)
  const [languageModeVisible, setlanguageModeVisible] = useState<boolean>(false)
  const [languageMode, setLanguageMode] = useState(1)
  useEffect(() => {}, [])

  const content = (
    <div>
      <LanguageLine onClick={() => changeLanguageMode(1)}>
        <span> 中文 </span>
        {languageMode === 1 && (
          <IconFont type="check" style={{ fontSize: 15, color: '#4186fe' }} />
        )}
      </LanguageLine>
      <LanguageLine onClick={() => changeLanguageMode(2)}>
        <span> English </span>
        {languageMode === 2 && (
          <IconFont type="check" style={{ fontSize: 15, color: '#4186fe' }} />
        )}
      </LanguageLine>
    </div>
  )
  const changeLanguageMode = (value: number) => {
    setLanguageMode(value)
    setlanguageModeVisible(false)
  }
  const handleVisibleChange = (newVisible: boolean) => {
    setlanguageModeVisible(newVisible)
  }
  const toLoginOut = ()=>{
    console.log('注销');
    
    loginOut()
  }
  if (!props.visible) {
    return null
  }
  return (
    <Box>
      <PanelHeader>
        <PanelHeaderFirst>
          <SetHead>何飞</SetHead>
          <NanmeAndPhone>
            <span>何飞（何飞）</span>
            <span>188****8688</span>
          </NanmeAndPhone>
        </PanelHeaderFirst>
        <PanelHeaderSecond>
          <div>成都定星科技有限公司</div>
          <Tooltip placement="top" title="切换企业">
            <div
              onClick={() => setCompanyModalVisible(true)}
              className={buttonCss}
            >
              <IconFont type="swap" style={{ fontSize: 20 }} />
            </div>
          </Tooltip>
        </PanelHeaderSecond>
      </PanelHeader>
      <PanelFooter>
        <Popover
          visible={languageModeVisible}
          onVisibleChange={handleVisibleChange}
          content={content}
          trigger="click"
          placement="rightTop"
        >
          <Line>
            <div>
              <IconFont type="earth" style={{ fontSize: 15 }} />
              <span className={lineText}>语言</span>
            </div>
            <div>
              <span className={languageText}>
                {languageMode === 1 ? '中文' : 'English'}
              </span>

              <IconFont type="right" style={{ fontSize: 12 }} />
            </div>
          </Line>
        </Popover>

        <Line onClick={() => setPersonalModalVisible(true)}>
          <div>
            <IconFont type="container" style={{ fontSize: 15 }} />
            <span className={lineText}>个人资料</span>
          </div>
          <div>
            <IconFont type="right" style={{ fontSize: 12 }} />
          </div>
        </Line>
        <Line>
          <div onClick={toLoginOut}>
            <IconFont type="login" style={{ fontSize: 15 }} />
            <span className={lineText}>退出登录</span>
          </div>
        </Line>
      </PanelFooter>
      <Personal
        visible={personalModalVisible}
        close={() => setPersonalModalVisible(!personalModalVisible)}
      ></Personal>
      <CompanyModal
        visible={companyModalVisible}
        onChangeState={() => setCompanyModalVisible(!companyModalVisible)}
      />
    </Box>
  )
}
