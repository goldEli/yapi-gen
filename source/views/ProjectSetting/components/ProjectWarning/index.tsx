import React from 'react'
import PreviewImageModal from './components/PreviewImageModal'
import PushDate from './components/PushDate'
import PushObject from './components/PushObject'
import PushConditions from './components/PushConditions'
import { ProjectWarningWrap, Title } from './style'
import { Space } from 'antd'
import CommonButton from '@/components/CommonButton'
import { useTranslation } from 'react-i18next'
import PushChannel from './components/PushChannel'

const ProjectWarning = () => {
  const [t] = useTranslation()
  return (
    <ProjectWarningWrap>
      <Title>
        <span className="label">{t('riskWarningPushSettings')}</span>
        <Space size={16}>
          <CommonButton type="light">取消</CommonButton>
          <CommonButton type="primary">保存</CommonButton>
        </Space>
      </Title>
      <PushConditions />
      <PushChannel />
      <PushDate></PushDate>
      <PushObject></PushObject>
    </ProjectWarningWrap>
  )
}

export default ProjectWarning
