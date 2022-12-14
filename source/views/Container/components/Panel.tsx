// 个人信息弹窗

import { useState } from 'react'
import styled from '@emotion/styled'
import { css } from '@emotion/css'
import IconFont from '@/components/IconFont'
import CompanyModal from '@/components/CompanyModal'
import { Tooltip, Popover, message } from 'antd'
import { Personal } from './Personal'
import { useModel } from '@/models'
import { getTicket } from '@/services/user'
import { useTranslation } from 'react-i18next'
import { changeLanguage, type LocaleKeys } from '@/locals'
import { OmitText } from '@star-yun/ui'
import DeleteConfirm from '@/components/DeleteConfirm'
import { HiddenText } from '@/components/StyleCommon'

const imgCss = css`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
`
const buttonCss = css`
  width: 24px;
  border-radius: 50%;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover {
    width: 24px;
    border-radius: 50%;
    height: 24px;
    background: rgba(240, 244, 250, 1);
    background-blend-mode: normal;
    color: #2774f8;
  }
`
const lineText = css`
  color: #646566;
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
  width: 32px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  border-radius: 50%;
  font-size: 14px;
  background: #a4acf5;
  background-blend-mode: normal;
  border: 1px solid #f0f2fd;
  color: white;
`
const PanelHeader = styled.div`
  padding: 16px 16px 10px 16px;
  box-sizing: border-box;

  /* margin-bottom: 8px; */
`
const PanelHeaderFirst = styled.div`
  display: flex;
  align-items: center;
`
const PanelHeaderSecond = styled.div`
  height: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  display: flex;
  padding: 0px 16px 0px 16px;
  border-bottom: 1px solid rgba(235, 237, 240, 1);
  cursor: pointer;
  &:hover {
    background-color: #f4f5f5;
  }
`
const NameAndPhone = styled.div`
  font-size: 12px;
  display: flex;
  flex-direction: column;
  margin-left: 8px;
  width: calc(100% - 48px);
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
  cursor: pointer;
  &:hover {
    background-color: #f4f5f5;
  }
`
const LanguageLine = styled.div`
  color: #646566;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 120px;
  height: 32px;
  box-sizing: border-box;
  padding: 0 16px;
  cursor: pointer;
  &:hover {
    background-color: #f0f4fa;
  }
`

interface Props {
  onChange?(): void
}

export const Panel = (props: Props) => {
  const { loginOut, userInfo, setIsRefresh } = useModel('user')
  const [t] = useTranslation()
  const [personalModalVisible, setPersonalModalVisible] =
    useState<boolean>(false)
  const [companyModalVisible, setCompanyModalVisible] = useState<boolean>(false)
  const [languageModeVisible, setLanguageModeVisible] = useState<boolean>(false)
  const [isConfirmLogout, setIsConfirmLogout] = useState(false)
  const [languageMode, setLanguageMode] = useState(
    localStorage.getItem('language') === 'zh' ? 1 : 2,
  )

  const changeLanguageMode = async (value: number, key: any) => {
    try {
      await changeLanguage(key as LocaleKeys)
      localStorage.setItem('language', key)
    } catch (error) {
      //
    }
    message.success(t('common.localsSwitching'))
    setLanguageMode(value)
    setLanguageModeVisible(false)
    props.onChange?.()
    setTimeout(() => {
      setIsRefresh(true)
    }, 100)
  }

  const content = (
    <div style={{ borderRadius: 6, overflow: 'hidden' }}>
      <LanguageLine onClick={() => changeLanguageMode(1, 'zh')}>
        <span
          style={{
            color: languageMode === 1 ? '#4186fe' : '#646566',
          }}
        >
          中文
        </span>
        {languageMode === 1 && (
          <IconFont type="check" style={{ fontSize: 15, color: '#4186fe' }} />
        )}
      </LanguageLine>
      <LanguageLine onClick={() => changeLanguageMode(2, 'en')}>
        <span
          style={{
            color: languageMode === 2 ? '#4186fe' : '#646566',
          }}
        >
          English
        </span>
        {languageMode === 2 && (
          <IconFont type="check" style={{ fontSize: 15, color: '#4186fe' }} />
        )}
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
        localStorage.removeItem('quickCreateData')
        getTicket()
      }, 100)
    } catch (error) {
      //
    }
  }

  const onConfirm = () => {
    toLoginOut()
  }

  const onSetVisible = (type: any) => {
    if (type === 1) {
      setPersonalModalVisible(true)
    } else if (type === 2) {
      setIsConfirmLogout(true)
    } else if (type === 3) {
      setCompanyModalVisible(true)
    }
    props.onChange?.()
  }

  return (
    <Box>
      <DeleteConfirm
        title={t('common.confirmToast')}
        text={t('common.isConfirmLogout')}
        isVisible={isConfirmLogout}
        onChangeVisible={() => setIsConfirmLogout(!isConfirmLogout)}
        onConfirm={onConfirm}
      />
      <PanelHeader>
        <PanelHeaderFirst>
          {userInfo.avatar ? (
            <img className={imgCss} src={userInfo.avatar} />
          ) : (
            <SetHead>
              {String(userInfo?.name?.trim().slice(0, 1)).toLocaleUpperCase()}
            </SetHead>
          )}

          <NameAndPhone>
            <HiddenText>
              <OmitText
                width={120}
                tipProps={{
                  getPopupContainer: node => node,
                }}
              >
                <span
                  style={{
                    fontSize: '14px',
                    color: '#323233',
                  }}
                >
                  {' '}
                  {userInfo?.name}
                </span>
              </OmitText>
            </HiddenText>
            <span
              style={{
                fontSize: '14px',
                color: '#969799',
              }}
            >
              {userInfo?.phone}
            </span>
          </NameAndPhone>
        </PanelHeaderFirst>
      </PanelHeader>
      <PanelHeaderSecond onClick={() => onSetVisible(3)}>
        <div
          style={{
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#323233',
          }}
        >
          {userInfo?.company_name}
        </div>
        <Tooltip placement="top" title={t('container.changeCompany')}>
          <div className={buttonCss}>
            <IconFont type="swap" style={{ fontSize: 20 }} />
          </div>
        </Tooltip>
      </PanelHeaderSecond>
      <PanelFooter>
        <Popover
          visible={languageModeVisible}
          onVisibleChange={handleVisibleChange}
          content={content}
          trigger="click"
          placement="rightTop"
          getPopupContainer={node => node}
        >
          <Line>
            <div>
              <IconFont
                type="earth"
                style={{ fontSize: 15, color: '#969799' }}
              />
              <span className={lineText}>{t('container.language')}</span>
            </div>
            <div>
              <span className={languageText}>
                {languageMode === 1 ? '中文' : 'English'}
              </span>

              <IconFont
                type="right"
                style={{ fontSize: 12, color: '#969799' }}
              />
            </div>
          </Line>
        </Popover>

        <Line onClick={() => onSetVisible(1)}>
          <div>
            <IconFont
              type="container"
              style={{ fontSize: 15, color: '#969799' }}
            />
            <span className={lineText}>{t('container.personInfo')}</span>
          </div>
          <div>
            <IconFont type="right" style={{ fontSize: 12, color: '#969799' }} />
          </div>
        </Line>
        <Line>
          <div onClick={() => onSetVisible(2)}>
            <IconFont type="login" style={{ fontSize: 15, color: '#969799' }} />
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
