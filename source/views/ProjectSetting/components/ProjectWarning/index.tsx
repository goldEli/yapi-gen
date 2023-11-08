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
import useProjectId from './hooks/useProjectId'
import { saveWarningConfig } from '@/services/project'
import { getWarningConfigInfo } from '@store/project/project.thunk'
import { getMessage } from '@/components/Message'
const ProjectWarning = () => {
  const dispatch = useDispatch()
  const [t] = useTranslation()
  const { projectWarning, projectInfo } = useSelector(store => store.project)
  const { project_warring_info } = projectInfo ?? {}
  const { projectId } = useProjectId()
  // 从卡片跳转到配置页面
  const [isSetting, setIsSetting] = useState(false)
  const [notSetting, setNotSetting] = useState(true)

  // 保存
  const save = async () => {
    // debugger
    const { push_condition, push_date, push_obj = [] } = projectWarning
    const { day = [], time = {} } = push_date ?? {}
    if (push_condition.some((item: any) => item.is_enable === 2)) {
      getMessage({ type: 'error', msg: '推送条件至少启用一条' })
      return
    }

    if (
      day.filter((item: any) => item !== -1).length === 0 ||
      Object.values(time).filter(item => item).length === 0
    ) {
      getMessage({
        type: 'error',
        msg: '推送时间 周期至少选择一天，且时间必须选择',
      })
      return
    }
    let res = await saveWarningConfig({
      ...projectWarning,
      project_id: projectId,
      push_obj: push_obj?.map((item: any) => item.id),
    })
    console.log(111, projectWarning, { ...projectWarning, projectId })
  }

  useEffect(() => {
    dispatch(getWarningConfigInfo({ project_id: projectId }))
    return () => {
      dispatch(setProjectWarning(null))
    }
  }, [])
  useEffect(() => {
    setNotSetting(() => !project_warring_info)
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
