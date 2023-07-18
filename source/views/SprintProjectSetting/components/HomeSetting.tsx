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
  const dispatch = useDispatch()
  const [t] = useTranslation()
  const { projectInfo } = useSelector(state => state.project)
  const urls = [
    {
      url: '/SprintProjectManagement/Affair',
      name: t('sprintProject.transactionList'),
    },
    { url: '/SprintProjectManagement/Sprint', name: t('sprintProject.sprint') },
    { url: '/SprintProjectManagement/KanBan', name: t('sprintProject.kanban') },
    { url: '/Report/PerformanceInsight', name: t('sprintProject.report') },
  ]

  const onChange = async (e: any) => {
    setValue(e.target.value)
    try {
      await updateHomeSetting({
        id: projectInfo.id,
        default_home_menu: e.target.value,
      })
      getMessage({ msg: t('other.configSuccess'), type: 'success' })
      dispatch(
        setProjectInfo({ ...projectInfo, defaultHomeMenu: e.target.value }),
      )
    } catch (error) {
      //
    }
  }
  useEffect(() => {
    // console.log(111, projectInfo)
    if (!projectInfo.defaultHomeMenu) {
      setValue('/SprintProjectManagement/Affair')
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
