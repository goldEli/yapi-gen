import React, { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import { css } from '@emotion/react'
import { Radio } from 'antd'
import { useSelector, useDispatch } from '@store/index'
import { updateHomeSetting } from '@/services/sprint'
import { getMessage } from '@/components/Message'
import { setProjectInfo } from '@store/project/index'
import { useTranslation } from 'react-i18next'
const Wrap = styled.div`
  padding-left: 24px;
`
const Title = styled.div`
  color: var(--neutral-n1-d1);
  font-size: var(--font14);
`
const SubTitle = styled.div`
  color: var(--neutral-n3);
  font-size: var(--font12);
  margin-top: 4px;
`
const RadioWrap = styled.div`
  margin-top: 16px;
  .ant-radio-wrapper {
    color: var(--neutral-n1-d1) !important;
    font-size: var(--font14) !important;
  }
`
interface IProps {}
const HomeSetting: React.FC<IProps> = props => {
  const [value, setValue] = useState('')
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const { projectInfo } = useSelector(state => state.project)
  const urls = [
    { url: '/ProjectManagement/Demand', name: t('sprintProject.need') },
    { url: '/ProjectManagement/Iteration', name: t('sprintProject.iteration') },
    { url: '/ProjectManagement/KanBan', name: t('sprintProject.kanban') },
    { url: '/Report/PerformanceInsight', name: t('sprintProject.report') },
    { url: '/ProjectManagement/Defect', name: t('sprintProject.defect') },
  ]
  // console.log(projectInfo)
  const onChange = async (e: any) => {
    setValue(e.target.value)
    try {
      await updateHomeSetting({
        id: projectInfo.id,
        default_home_menu: e.target.value,
      })
      dispatch(
        setProjectInfo({ ...projectInfo, defaultHomeMenu: e.target.value }),
      )
      getMessage({ msg: '配置成功', type: 'success' })
    } catch (error) {
      //
    }
  }
  useEffect(() => {
    // console.log(projectInfo.defaultHomeMenu)
    if (!projectInfo.defaultHomeMenu) {
      setValue('/ProjectManagement/Demand')
      return
    }
    setValue(projectInfo.defaultHomeMenu)
  }, [])
  return (
    <Wrap>
      <Title>{t('sprintProject.projectHomeConfiguration')}</Title>
      <SubTitle>{t('sprintProject.defineProjectDefaultHomeLocation')}</SubTitle>
      <RadioWrap>
        <Radio.Group onChange={onChange} value={value}>
          {urls.map(item => (
            <Radio key={item.url} value={item.url}>
              {item.name}
            </Radio>
          ))}
        </Radio.Group>
      </RadioWrap>
    </Wrap>
  )
}
export default HomeSetting
