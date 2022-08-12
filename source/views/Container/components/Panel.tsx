/* eslint-disable complexity */
/* eslint-disable multiline-ternary */
import { useState } from 'react'
import styled from '@emotion/styled'
import { css } from '@emotion/css'
import IconFont from '@/components/IconFont'
import CompanyModal from '@/components/CompanyModal'
import { Tooltip, Popover, message } from 'antd'
import { Personal } from './Personal'
import { useModel } from '@/models'
import { getTicket } from '@/services/user'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { changeLanguage, languages, type LocaleKeys } from '@/locals'

const imgCss = css`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`
const buttonCss = css`
  width: 24px;
  /* display: block; */
  border-radius: 50%;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
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
  width: 220px;
  height: 230px;
  background: rgba(255, 255, 255, 1);
  background-blend-mode: normal;
  box-shadow: 0px 6px 16px rgba(0, 0, 0, 0.08), 0px 9px 28px rgba(0, 0, 0, 0.05),
    0px 12px 48px 16px rgba(0, 0, 0, 0.03);
  border-radius: 6px;
`
const SetHead = styled.div`
  width: 40px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border-radius: 50%;
  font-size: 12px;
  background: #a4acf5;
  background-blend-mode: normal;
  /* border: 2px solid rgba(40, 119, 255, 0.16); */
  border: 1px solid #f0f2fd;
  color: white;
  margin-right: 8px;
`
const PanelHeader = styled.div`
  padding: 16px 16px 22px 16px;
  box-sizing: border-box;
  padding-bottom: 18px;
  border-bottom: 1px solid rgba(235, 237, 240, 1);
  margin-bottom: 8px;
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
  margin-left: 8px;
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
  padding: 0 16px;
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
  box-sizing: border-box;
  padding: 0 16px;
  &:hover {
    background-color: #f0f4fa;
  }
`

export const Panel = () => {
  const { loginOut, userInfo, setIsRefresh } = useModel('user')
  const navigate = useNavigate()
  const [t, i18n] = useTranslation()
  const [personalModalVisible, setPersonalModalVisible]
    = useState<boolean>(false)
  const [companyModalVisible, setCompanyModalVisible] = useState<boolean>(false)
  const [languageModeVisible, setLanguageModeVisible] = useState<boolean>(false)
  const [languageMode, setLanguageMode] = useState(
    localStorage.getItem('language') === 'zh' ? 1 : 2,
  )

  const changeLanguageMode = async (value: number, key: any) => {
    const clear = message.loading(t('common.localsSwitching'), 0)
    try {
      await changeLanguage(key as LocaleKeys)

      // await getAllConfig()
      localStorage.setItem('language', key)

      // setVisibleState(false)
    } catch (error) {

      //
    }
    setLanguageMode(value)
    setLanguageModeVisible(false)
    clear()
    setTimeout(() => {
      setIsRefresh(true)
    }, 100)
  }

  const content = (
    <div>
      <LanguageLine onClick={() => changeLanguageMode(1, 'zh')}>
        <span>中文</span>
        {languageMode === 1
          && <IconFont type="check" style={{ fontSize: 15, color: '#4186fe' }} />
        }
      </LanguageLine>
      <LanguageLine onClick={() => changeLanguageMode(2, 'en')}>
        <span> English </span>
        {languageMode === 2
          && <IconFont type="check" style={{ fontSize: 15, color: '#4186fe' }} />
        }
      </LanguageLine>
    </div>
  )

  const handleVisibleChange = (newVisible: boolean) => {
    setLanguageModeVisible(newVisible)
  }
  const toLoginOut = async () => {
    sessionStorage.removeItem('saveRouter')
    try {
      await loginOut()
      setTimeout(() => {
        localStorage.removeItem('agileToken')

        getTicket()
      }, 100)
    } catch (error) {

      //
    }
  }

  return (
    <Box>
      <PanelHeader>
        <PanelHeaderFirst>
          {userInfo.avatar
            ? <img className={imgCss} src={userInfo.avatar} />
            : (
                <SetHead>
                  {String(userInfo?.name?.substring(0, 1)).toLocaleUpperCase()}
                </SetHead>
              )}

          <NanmeAndPhone>
            <span>{userInfo?.name}</span>
            <span>{userInfo?.phone}</span>
          </NanmeAndPhone>
        </PanelHeaderFirst>
        <PanelHeaderSecond>
          <div>{userInfo?.company_name}</div>
          <Tooltip placement="top" title={t('container.changeCompany')}>
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
              <span className={lineText}>{t('container.language')}</span>
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
            <span className={lineText}>{t('container.personInfo')}</span>
          </div>
          <div>
            <IconFont type="right" style={{ fontSize: 12 }} />
          </div>
        </Line>
        <Line>
          <div onClick={toLoginOut}>
            <IconFont type="login" style={{ fontSize: 15 }} />
            <span className={lineText}>{t('container.logout')}</span>
          </div>
        </Line>
      </PanelFooter>
      <Personal
        visible={personalModalVisible}
        close={() => setPersonalModalVisible(!personalModalVisible)}
      />
      <CompanyModal
        visible={companyModalVisible}
        onChangeState={() => setCompanyModalVisible(!companyModalVisible)}
      />
    </Box>
  )
}
