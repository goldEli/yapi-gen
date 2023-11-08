/* eslint-disable react/jsx-no-leaked-render */
import React, { useEffect, useState } from 'react'
import PreviewImageModal from './components/PreviewImageModal'
import PushDate from './components/PushDate'
import PushObject from './components/PushObject'
import PushConditions from './components/PushConditions'
import { ProjectWarningWrap, Title } from './style'
import { Space } from 'antd'
import CommonButton from '@/components/CommonButton'
import { useTranslation } from 'react-i18next'
import PushChannel from './components/PushChannel'
import { useDispatch, useSelector } from '@store/index'
import { setProjectWarning } from '@store/project'
import WaringCard from './components/WaringCard'
import NoSettingPage from './components/NoSettingPage'

const ProjectWarning = () => {
  const dispatch = useDispatch()
  const [t] = useTranslation()
  const { projectWarning } = useSelector(store => store.project)
  // 从卡片跳转到配置页面
  const [isSetting, setIsSetting] = useState(false)
  const [notSetting, setNotSetting] = useState(true)

  // 保存
  const save = () => {
    console.log(111, projectWarning)
  }

  useEffect(() => {
    dispatch(setProjectWarning({}))
    return () => {
      dispatch(setProjectWarning(null))
    }
  }, [])

  return notSetting ? (
    <NoSettingPage onClose={() => setNotSetting(false)} />
  ) : (
    <ProjectWarningWrap>
      {!isSetting && (
        <WaringCard onChangeSetting={() => setIsSetting(!isSetting)} />
      )}
      {isSetting && (
        <>
          <Title>
            <span className="label">{t('riskWarningPushSettings')}</span>
            <Space size={16}>
              <CommonButton
                type="light"
                onClick={() => setIsSetting(!isSetting)}
              >
                取消
              </CommonButton>
              <CommonButton type="primary" onClick={save}>
                保存
              </CommonButton>
            </Space>
          </Title>
          <PushConditions />
          <PushChannel />
          <PushDate></PushDate>
          <PushObject></PushObject>
        </>
      )}
    </ProjectWarningWrap>
  )
}

export default ProjectWarning
