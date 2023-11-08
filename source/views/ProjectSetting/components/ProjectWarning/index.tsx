import { useEffect } from 'react'
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

const ProjectWarning = () => {
  const { projectWarning } = useSelector(store => store.project)
  const dispatch = useDispatch()
  const [t] = useTranslation()
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
  return (
    <ProjectWarningWrap>
      <Title>
        <span className="label">{t('riskWarningPushSettings')}</span>
        <Space size={16}>
          <CommonButton type="light">取消</CommonButton>
          <CommonButton type="primary" onClick={save}>
            保存
          </CommonButton>
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
