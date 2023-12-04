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
import { setProjectInfo, setProjectWarning } from '@store/project'
import WaringCard from './components/WaringCard'
import NoSettingPage from './components/NoSettingPage'
import useProjectId from './hooks/useProjectId'
import { getProjectInfo, saveWarningConfig } from '@/services/project'
import { getWarningConfigInfo } from '@store/project/project.thunk'
import { getMessage } from '@/components/Message'
import PermissionWrap from '@/components/PermissionWrap'
const ProjectWarning = () => {
  const dispatch = useDispatch()

  const [t] = useTranslation()
  const { projectWarning, projectInfo } = useSelector(store => store.project)
  const { is_init, push_obj } = projectWarning ?? {}
  const { projectId } = useProjectId()
  // 从卡片跳转到配置页面
  const [isSetting, setIsSetting] = useState(false)
  const [notSetting, setNotSetting] = useState(true)
  // 保存
  const save = async () => {
    const { push_condition, push_date, push_obj = [] } = projectWarning
    let { day = [], time = {} } = push_date ?? {}
    day = day.filter((item: number) => item !== -1)
    if (push_condition.every((item: any) => item.is_enable === 2)) {
      getMessage({ type: 'error', msg: t('atLeastOnePushConditionIsEnabled') })
      return
    }

    if (
      day.filter((item: any) => item !== -1).length === 0 ||
      Object.values(time).filter(item => item).length === 0
    ) {
      getMessage({
        type: 'error',
        msg: t(
          'thePushTimePeriodMustBeSelectedAtLeastOneAndTheTimeMustBeSelected',
        ),
      })
      return
    }
    if (push_obj.length === 0) {
      getMessage({
        type: 'error',
        msg: t('selectAtLeastOnePusher'),
      })
      return
    }
    let res = await saveWarningConfig({
      ...projectWarning,
      push_date: {
        ...push_date,
        day,
      },
      project_id: projectId,
      push_obj: push_obj?.map((item: any) => item.id),
    })
    dispatch(
      setProjectWarning({
        ...projectWarning,
        is_init: 2,
      }),
    )
    getMessage({ type: 'success', msg: t('savedSuccessfully') })
    setIsSetting(!isSetting)
  }

  useEffect(() => {
    dispatch(getWarningConfigInfo({ project_id: projectId }))
    return () => {
      dispatch(setProjectWarning(null))
    }
  }, [])

  useEffect(() => {
    if (!isSetting) {
      setNotSetting(is_init === 1)
    }
  }, [projectWarning])
  const isLength =
    projectInfo?.id && projectInfo?.projectPermissions?.length <= 0
  if (is_init === void 0) {
    return <div></div>
  }
  return (
    <PermissionWrap
      auth="b/project/warning_config"
      permission={
        isLength
          ? ['0']
          : projectInfo?.projectPermissions?.map((i: any) => i.identity)
      }
    >
      {notSetting ? (
        <NoSettingPage
          onClose={() => {
            setNotSetting(false)
            setIsSetting(true)
          }}
        />
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
                    onClick={() => {
                      if (is_init === 1) {
                        setNotSetting(true)
                      } else {
                        setIsSetting(!isSetting)
                      }
                    }}
                  >
                    {t('cancel')}
                  </CommonButton>
                  <CommonButton type="primary" onClick={save}>
                    {t('common.save')}
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
      )}
    </PermissionWrap>
  )
}

export default ProjectWarning
